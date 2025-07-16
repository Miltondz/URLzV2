import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to generate a unique short code
const generateShortCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const length = Math.floor(Math.random() * 3) + 6 // 6-8 characters
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // --- CORRECT AUTHENTICATION PATTERN ---
    // Create a client scoped to the user's request, which handles auth automatically.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the user from the request's token
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    // Get request body
    const { long_url, custom_slug } = await req.json()

    // Validate URL
    if (!long_url || !/^https?:\/\//.test(long_url)) {
      throw new Error('A valid URL is required')
    }

    let short_code = custom_slug

    // --- Business Logic for Custom Slugs (Pro Feature) ---
    if (custom_slug) {
      // 1. Check user subscription status
      const { data: profile } = await supabase.from('profiles').select('subscription_tier').single()
      if (profile?.subscription_tier === 'free') {
        return new Response(JSON.stringify({ error: 'Custom slugs are a Pro feature.' }), { status: 402, headers: corsHeaders })
      }

      // 2. Validate slug format
      if (!/^[a-zA-Z0-9_-]+$/.test(custom_slug)) {
        throw new Error('Custom slug contains invalid characters.')
      }

      // 3. --- CORRECT UNIQUENESS CHECK ---
      // Check if the slug exists in EITHER column
      const { data: existing } = await supabase
        .from('urls')
        .select('id')
        .or(`short_code.eq.${custom_slug},custom_slug.eq.${custom_slug}`)
        .single()
      
      if (existing) {
        throw new Error('This custom slug is already taken.')
      }
    } else {
      // --- Logic for Generating a Random Short Code ---
      let attempts = 0
      const maxAttempts = 10
      while (attempts < maxAttempts) {
        short_code = generateShortCode()
        const { data: existing } = await supabase.from('urls').select('id').eq('short_code', short_code).single()
        if (!existing) break // Found a unique code
        attempts++
      }
      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate a unique short code. Please try again.')
      }
    }

    // Insert the new URL record
    const { data: newUrl, error: insertError } = await supabase
      .from('urls')
      .insert({
        user_id: user.id,
        long_url,
        short_code: short_code === custom_slug ? null : short_code, // Store random codes only
        custom_slug: custom_slug, // Always store the custom slug
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // --- CORRECT DYNAMIC URL ---
    // Use the environment variable for the app's URL
    const appUrl = Deno.env.get('VITE_APP_URL') || 'https://urlz.lat'
    const finalShortCode = newUrl.custom_slug || newUrl.short_code;

    return new Response(
      JSON.stringify({ short_url: `${appUrl}/${finalShortCode}` }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})