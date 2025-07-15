import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const url = new URL(req.url)
    const shortCode = url.pathname.split('/').pop()

    if (!shortCode) {
      throw new Error('Short code is required')
    }

    // Find the URL record and get its ID
    const { data: urlRecord, error } = await supabase
      .from('urls')
      .select('id, long_url')
      .eq('short_code', shortCode)
      .single()

    if (error || !urlRecord) {
      return new Response(
        JSON.stringify({ error: 'URL not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }

    // Increment click counter using RPC call with the URL ID
    await supabase.rpc('increment_clicks', { url_id: urlRecord.id })

    // Return redirect response
    return new Response(null, {
      status: 301,
      headers: {
        ...corsHeaders,
        'Location': urlRecord.long_url,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})