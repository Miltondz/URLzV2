// Alternative approach - search each column separately
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '', 
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

Deno.serve(async (req) => {
  console.log('=== REDIRECT FUNCTION CALLED ===');
  console.log('Full URL:', req.url);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.pathname.split('/').filter((part) => part).pop();
    console.log('Extracted code:', code);
    
    if (!code) {
      return new Response('Short code is missing', { status: 400 });
    }

    // Search in short_code first
    let { data: urlRecord, error } = await supabaseAdmin
      .from('urls')
      .select('id, long_url')
      .eq('short_code', code)
      .single();

    console.log('Short code search result:', { urlRecord, error });

    // If not found in short_code, search in custom_slug
    if (error && error.code === 'PGRST116') {
      console.log('Not found in short_code, searching custom_slug...');
      const result = await supabaseAdmin
        .from('urls')
        .select('id, long_url')
        .eq('custom_slug', code)
        .single();
      
      urlRecord = result.data;
      error = result.error;
      console.log('Custom slug search result:', { urlRecord, error });
    }

    if (error || !urlRecord) {
      console.error(`Database error for code [${code}]:`, error);
      return new Response('URL not found', { status: 404 });
    }

    console.log('Found URL record, redirecting to:', urlRecord.long_url);

    // Update click count
    try {
      await supabaseAdmin.rpc('increment_clicks', { url_id: urlRecord.id });
    } catch (rpcError) {
      console.error('RPC error for increment_clicks:', rpcError);
    }

    // Perform redirect
    return new Response(null, {
      status: 301,
      headers: { 'Location': urlRecord.long_url }
    });

  } catch (error) {
    console.error('Redirect function error:', error);
    return new Response('Internal server error', { status: 500 });
  }
});