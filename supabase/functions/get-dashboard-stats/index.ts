import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get user stats directly from the urls table
    const { data, error } = await supabaseClient
      .from('urls')
      .select('clicks')
      .eq('user_id', user.id);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Calculate stats from the data
    const totalLinks = data.length;
    const totalClicks = data.reduce((sum, url) => sum + (url.clicks || 0), 0);
    const avgClicks = totalLinks > 0 ? totalClicks / totalLinks : 0;

    const stats = {
      totalLinks,
      totalClicks,
      avgClicks: Math.round(avgClicks * 10) / 10 // Round to 1 decimal place
    };

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});