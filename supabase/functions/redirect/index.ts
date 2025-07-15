// Import the Supabase client
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Get Supabase credentials from environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create an admin Supabase client that can bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    
    // Extract the short code or custom slug from the URL path
    const url = new URL(req.url)
    const code = url.pathname.split('/').pop()

    if (!code) {
      return new Response(JSON.stringify({ error: 'Short code or slug is missing' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // --- THIS IS THE CORRECTED QUERY ---
    // Find the URL record by checking BOTH the short_code and custom_slug columns.
    const { data: urlRecord, error } = await supabaseAdmin
      .from('urls')
      .select('id, long_url')
      .or(`short_code.eq.${code},custom_slug.eq.${code}`) // The key change is here!
      .single()

    if (error || !urlRecord) {
      return new Response(JSON.stringify({ error: 'URL not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    // Atomically increment the click counter via RPC
    await supabaseAdmin.rpc('increment_clicks', { url_id: urlRecord.id })

    // Return the 301 redirect response
    return new Response(null, {
      status: 301,
      headers: {
        'Location': urlRecord.long_url,
      },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Use 500 for unexpected server errors
    })
  }
})