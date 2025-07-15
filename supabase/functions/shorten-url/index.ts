import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { long_url } = await req.json()
    
    if (!long_url) {
      throw new Error('long_url is required')
    }

    // Validate URL format
    try {
      new URL(long_url)
    } catch {
      throw new Error('Invalid URL format')
    }

    // Generate short code (6-8 characters)
    const generateShortCode = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let result = ''
      const length = Math.floor(Math.random() * 3) + 6 // 6-8 characters
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    let shortCode = generateShortCode()
    let attempts = 0
    const maxAttempts = 10

    // Ensure short code is unique
    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from('urls')
        .select('id')
        .eq('short_code', shortCode)
        .single()

      if (!existing) break
      
      shortCode = generateShortCode()
      attempts++
    }

    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate unique short code')
    }

    // Insert the URL
    const { data, error } = await supabase
      .from('urls')
      .insert({
        user_id: user.id,
        long_url,
        short_code: shortCode,
        clicks: 0
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({
        short_url: `https://urlz.lat/${shortCode}`,
        short_code: shortCode,
        long_url
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

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