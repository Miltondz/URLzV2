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

// Helper function to parse User-Agent
const parseUserAgent = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  
  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // OS detection
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Device type detection
  let device = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) device = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';
  
  return { browser, os, device };
};

// Helper function to get geolocation from IP
const getGeolocation = async (ip: string) => {
  try {
    // Using a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country || 'Unknown',
        city: data.city || 'Unknown'
      };
    }
  } catch (error) {
    console.error('Geolocation error:', error);
  }
  return { country: 'Unknown', city: 'Unknown' };
};

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

    // Asynchronous analytics recording
    const recordAnalytics = async () => {
      try {
        // Extract IP address
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 
                   req.headers.get('x-real-ip') || 
                   'unknown';

        // Get geolocation data
        const { country, city } = await getGeolocation(ip);

        // Parse User-Agent
        const userAgent = req.headers.get('user-agent') || '';
        const { browser, os, device } = parseUserAgent(userAgent);

        // Insert analytics data
        const { error: analyticsError } = await supabaseAdmin
          .from('clicks_log')
          .insert({
            url_id: urlRecord.id,
            ip_address: ip,
            country,
            city,
            browser_name: browser,
            os_name: os,
            device_type: device,
            user_agent: userAgent
          });

        if (analyticsError) {
          console.error('Analytics recording error:', analyticsError);
        } else {
          console.log('Analytics recorded successfully for URL:', urlRecord.id);
        }
      } catch (analyticsError) {
        console.error('Analytics recording failed:', analyticsError);
      }
    };

    // Fire off analytics recording without waiting
    recordAnalytics();

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