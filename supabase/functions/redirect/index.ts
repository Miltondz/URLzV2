// --- CÓDIGO FINAL Y VERIFICADO PARA LA FUNCIÓN "redirect" ---
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const url = new URL(req.url);
    const code = url.pathname.split('/').filter((part)=>part).pop();
    if (!code) {
      return new Response('Short code is missing', {
        status: 400
      });
    }
    // Busca el código en AMBAS columnas: short_code O custom_slug
    const { data: urlRecord, error } = await supabaseAdmin.from('urls').select('id, long_url').or(`short_code.eq.${code},custom_slug.eq.${code}`).single();
    if (error) {
      console.error(`Database error for code [${code}]:`, error);
      return new Response('URL not not not  found', {
        status: 404
      });
    }
    await supabaseAdmin.rpc('increment_clicks', {
      url_id: urlRecord.id
    }).catch(console.error);
    return new Response(null, {
      status: 301,
      headers: {
        'Location': urlRecord.long_url
      }
    });
  } catch (error) {
    console.error('Redirect function error:', error);
    return new Response('Internal server error', {
      status: 500
    });
  }
});
