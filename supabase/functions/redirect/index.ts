// --- CÓDIGO FINAL Y COMPLETO: /functions/redirect/index.ts ---
// Incluye la recolección de datos de analítica de forma asíncrona.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { UAParser } from 'https://esm.sh/ua-parser-js@1.0.38'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Se crea un cliente ADMIN con la SERVICE_ROLE_KEY para que pueda saltarse
// las políticas de seguridad (RLS) y operar en nombre del sistema.
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const code = url.pathname.split('/').filter(part => part).pop();

    if (!code) {
      return new Response('Short code is missing', { status: 400 });
    }
    
    // Busca el enlace en la base de datos por short_code O custom_slug
    const { data: urlRecord, error } = await supabaseAdmin
      .from('urls')
      .select('id, long_url')
      .or(`short_code.eq.${code},custom_slug.eq.${code}`)
      .single();

    if (error) {
      console.error(`Database error for code [${code}]:`, error);
      return new Response('URL not found', { status: 404 });
    }

    // --- LÓGICA DE ANALÍTICA ASÍNCRONA ---
    // Se define una función para registrar los datos.
    const recordAnalytics = async () => {
      try {
        // Obtenemos los datos del visitante desde las cabeceras de la petición.
        // Supabase Edge Functions inyectan estas cabeceras automáticamente.
        const country = req.headers.get('x-supabase-country-code');
        const city = req.headers.get('x-supabase-city');
        const userAgent = req.headers.get('user-agent');
        
        // Usamos una librería para parsear el User-Agent y obtener datos limpios.
        const parser = new UAParser(userAgent);
        const uaResult = parser.getResult();
        
        const analyticsData = {
          url_id: urlRecord.id,
          country: country,
          city: city,
          browser_name: uaResult.browser.name,
          os_name: uaResult.os.name,
          device_type: uaResult.device.type || 'desktop', // 'desktop' por defecto
        };
        
        // Insertamos el registro en la tabla de logs.
        const { error: logError } = await supabaseAdmin.from('clicks_log').insert(analyticsData);
        if (logError) {
          console.error('Failed to log click analytics:', logError);
        }
      } catch (analyticsError) {
        console.error('Error in recordAnalytics function:', analyticsError);
      }
    };
    
    // ¡LA CLAVE! Se llama a la función de analítica sin 'await'.
    // Esto permite que la redirección ocurra inmediatamente.
    recordAnalytics();
    
    // También incrementamos el contador principal.
    // Lo envolvemos en try/catch para que no falle la redirección si esto da error.
    try {
      await supabaseAdmin.rpc('increment_clicks', { url_id: urlRecord.id });
    } catch (rpcError) {
      console.error('Failed to increment clicks:', rpcError);
    }

    // Realiza la redirección 301.
    return new Response(null, {
      status: 301,
      headers: { 'Location': urlRecord.long_url },
    });
  } catch (error) {
    console.error('Catastrophic redirect function error:', error);
    return new Response('Internal server error', { status: 500 });
  }
});