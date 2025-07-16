// Copia y pega este código completo en el editor de Supabase

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a client scoped to the user's request to handle auth automatically.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the user from the request's token.
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    // Call the database function 'get_user_stats' via RPC.
    // This is much more performant than fetching all rows.
    const { data: stats, error: rpcError } = await supabase.rpc('get_user_stats', { p_user_id: user.id });

    if (rpcError) {
      console.error('RPC Error:', rpcError);
      throw rpcError;
    }
    
    // The RPC function returns an array with one object.
    // If no stats are found (e.g., new user), provide default zero values.
    const userStats = stats[0] || { total_links: 0, total_clicks: 0, avg_clicks: 0 };

    return new Response(JSON.stringify(userStats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  } 
})