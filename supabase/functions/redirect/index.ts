import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      urlValue: supabaseUrl,
      serviceKeyPrefix: supabaseServiceKey?.substring(0, 20) + '...'
    })
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return new Response('Server configuration error', { status: 500 })
    }

    // Create admin client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Extract the short code from the URL path
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const code = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2]

    if (!code) {
      return new Response('Short code is missing', {
        headers: corsHeaders,
        status: 400,
      })
    }

    console.log(`Looking for code: ${code}`)

    // Find the URL record by short_code
    const { data: urlRecord, error } = await supabaseAdmin
      .from('urls')
      .select('id, long_url, short_code, custom_slug')
      .or(`short_code.eq.${code},custom_slug.eq.${code}`)
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response('URL not found', {
        headers: corsHeaders,
        status: 404,
      })
    }

    if (!urlRecord) {
      return new Response('URL not found', {
        headers: corsHeaders,
        status: 404,
      })
    }

    console.log(`Found URL: ${urlRecord.long_url}`)

    // Increment click counter
    try {
      const { error: rpcError } = await supabaseAdmin.rpc('increment_clicks', { 
        url_id: urlRecord.id 
      })
      if (rpcError) {
        console.error('RPC error:', rpcError)
        // Don't fail the redirect if click tracking fails
      }
    } catch (rpcError) {
      console.error('Click tracking failed:', rpcError)
      // Continue with redirect even if click tracking fails
    }

    // Return 301 redirect
    return new Response(null, {
      status: 301,
      headers: {
        'Location': urlRecord.long_url,
        ...corsHeaders
      },
    })

  } catch (error) {
    console.error('Redirect function error:', error)
    return new Response('Internal server error', {
      headers: corsHeaders,
      status: 500,
    })
  }
})