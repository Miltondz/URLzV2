// --- VERSIÓN FINAL Y COMPLETA: /functions/shorten-url/index.ts ---
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import QRCode from 'https://esm.sh/qrcode@1.5.3';
// Define CORS headers para la comunicación entre dominios
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
// Función de ayuda para generar un código corto aleatorio
const generateShortCode = ()=>{
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  // Genera un código de entre 6 y 8 caracteres para una buena aleatoriedad y longitud
  const length = Math.floor(Math.random() * 3) + 6;
  for(let i = 0; i < length; i++){
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
Deno.serve(async (req)=>{
  // Maneja la petición pre-vuelo (preflight) OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // Crea un cliente de Supabase con el contexto de autenticación del usuario que hace la llamada.
    // Esto es seguro y aplica automáticamente las políticas de RLS.
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    // Intenta obtener el usuario (puede ser null para usuarios anónimos)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    // Note: authError is expected for anonymous requests, so we don't throw here
    // Obtiene los datos del cuerpo de la petición
    const { long_url, custom_slug, is_verified } = await req.json();
    // Valida que la URL larga exista y tenga un formato válido
    if (!long_url || !/^https?:\/\//.test(long_url)) {
      throw new Error('A valid URL is required.');
    }
    let final_short_code = null;
    let final_custom_slug = null;
    // Lógica de negocio para los SLUGS PERSONALIZADOS (Función Pro)
    if (custom_slug) {
      // Custom slugs require authentication
      if (!user) {
        return new Response(JSON.stringify({
          error: 'You must be logged in to create custom slugs.'
        }), {
          status: 401,
          headers: corsHeaders
        });
      }
      final_custom_slug = custom_slug;
      // 1. Revisa el plan de suscripción del usuario
      const { data: profile } = await supabase.from('profiles').select('subscription_tier').single();
      if (profile?.subscription_tier === 'free') {
        return new Response(JSON.stringify({
          error: 'Custom slugs are a Pro feature.'
        }), {
          status: 402,
          headers: corsHeaders
        });
      }
      // 2. Valida el formato del slug
      if (!/^[a-zA-Z0-9_-]+$/.test(custom_slug)) {
        throw new Error('Custom slug contains invalid characters.');
      }
      // 3. Revisa si el slug ya está en uso en CUALQUIERA de las dos columnas
      const { data: existing } = await supabase.from('urls').select('id').or(`short_code.eq.${custom_slug},custom_slug.eq.${custom_slug}`).single();
      if (existing) {
        throw new Error('This custom slug is already taken.');
      }
    } else {
      // Lógica para generar un CÓDIGO CORTO ALEATORIO y único
      let attempts = 0;
      const maxAttempts = 10;
      while(attempts < maxAttempts){
        const tempCode = generateShortCode();
        const { data: existing } = await supabase.from('urls').select('id').eq('short_code', tempCode).single();
        if (!existing) {
          final_short_code = tempCode;
          break; // Encontramos un código único
        }
        attempts++;
      }
      if (!final_short_code) {
        throw new Error('Failed to generate a unique short code. Please try again.');
      }
    }
    // Inserta el nuevo registro en la base de datos
    const insertData = {
      user_id: user?.id || null,
      long_url,
      short_code: final_short_code,
      custom_slug: final_custom_slug,
      is_verified: is_verified || false
    };
    // Set expiration for anonymous users (7 days from now)
    if (!user) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      insertData.expires_at = expirationDate.toISOString();
    }
    const { data: newUrl, error: insertError } = await supabase.from('urls').insert(insertData).select().single();
    if (insertError) {
      // Si hay un error de inserción (ej: el slug ya fue tomado por otro usuario), lo lanzamos
      throw insertError;
    }
    // Construye la URL final usando la variable de entorno
    const appUrl = Deno.env.get('VITE_APP_URL') || 'https://urlz.lat';
    const displayCode = newUrl.custom_slug || newUrl.short_code;
    const shortUrl = `${appUrl}/${displayCode}`;
    // Generate QR code for logged-in users
    if (user) {
      try {
        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        // Convert data URL to blob
        const base64Data = qrCodeDataUrl.split(',')[1];
        const binaryData = Uint8Array.from(atob(base64Data), (c)=>c.charCodeAt(0));
        // Upload to Supabase Storage
        const fileName = `${newUrl.id}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('qrcodes').upload(fileName, binaryData, {
          contentType: 'image/png',
          upsert: true
        });
        if (!uploadError && uploadData) {
          // Update the URL record with QR code path
          await supabase.from('urls').update({
            qr_code_path: uploadData.path
          }).eq('id', newUrl.id);
        }
      } catch (qrError) {
        console.error('QR code generation failed:', qrError);
      // Don't fail the main request if QR generation fails
      }
    }
    // Devuelve una respuesta exitosa con la nueva URL corta
    return new Response(JSON.stringify({
      short_url: shortUrl
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    // Manejador de errores general
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
