// --- VERSIÓN FINAL Y ROBUSTA: /functions/shorten-url/index.ts ---
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import QRCode from 'https://esm.sh/qrcode@1.5.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const generateShortCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const length = Math.floor(Math.random() * 3) + 6
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    // 'is_verified' se recibe del frontend, donde ya se hizo la llamada a Google Safe Browsing
    const { long_url, custom_slug, is_verified } = await req.json()

    if (!long_url || !/^https?:\/\//.test(long_url)) {
      throw new Error('A valid URL is required.')
    }
    if (custom_slug && !user) {
      return new Response(JSON.stringify({ error: 'You must be logged in to create custom slugs.' }), { status: 401, headers: corsHeaders })
    }

    let final_short_code = null
    let final_custom_slug = custom_slug?.trim() || null

    if (final_custom_slug) {
      const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single()
      if (profile?.subscription_tier === 'free') {
        return new Response(JSON.stringify({ error: 'Custom slugs are a Pro feature.' }), { status: 402, headers: corsHeaders })
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(final_custom_slug)) {
        throw new Error('Custom slug contains invalid characters.')
      }

      // --- CORRECCIÓN DE LA COMPROBACIÓN DE UNICIDAD ---
      const { count: existingCount } = await supabase
        .from('urls')
        .select('id', { count: 'exact', head: true })
        .or(`short_code.eq.${final_custom_slug},custom_slug.eq.${final_custom_slug}`)
        
      if (existingCount && existingCount > 0) {
        throw new Error('This custom slug is already taken.')
      }
    } else {
      let attempts = 0
      const maxAttempts = 10
      while (attempts < maxAttempts) {
        const tempCode = generateShortCode()
        // --- CORRECCIÓN DE LA COMPROBACIÓN DE UNICIDAD ---
        const { count } = await supabase.from('urls').select('id', { count: 'exact', head: true }).eq('short_code', tempCode)
        if (count === 0) {
          final_short_code = tempCode
          break
        }
        attempts++
      }
      if (!final_short_code) {
        throw new Error('Failed to generate a unique short code.')
      }
    }

    const insertData = {
      user_id: user?.id,
      long_url,
      short_code: final_short_code,
      custom_slug: final_custom_slug,
      is_verified: is_verified === true, // Aseguramos que sea un booleano
    }
    if (!user) {
      insertData.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }

    const { data: newUrl, error: insertError } = await supabase.from('urls').insert(insertData).select().single()
    if (insertError) {
      throw new Error(`Failed to create link: ${insertError.message}`)
    }

    const appUrl = Deno.env.get('VITE_APP_URL') || 'https://urlz.lat'
    const displayCode = newUrl.custom_slug || newUrl.short_code
    const shortUrl = `${appUrl}/r/${displayCode}`

    if (user) {
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, { width: 256, margin: 2 })
        const base64Data = qrCodeDataUrl.split(',')[1]
        const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))
        const fileName = `${newUrl.id}.png`
        const { data: uploadData, error: uploadError } = await supabase.storage.from('qrcodes').upload(fileName, binaryData, { contentType: 'image/png', upsert: true })
        if (!uploadError) {
          await supabase.from('urls').update({ qr_code_path: uploadData.path }).eq('id', newUrl.id)
        }
      } catch (qrError) {
        console.error('QR code generation failed, but continuing:', qrError)
      }
    }

    // --- CORRECCIÓN DE LA RESPUESTA FINAL ---
    // Devolvemos el objeto completo del nuevo enlace, que el frontend necesita.
    return new Response(JSON.stringify(newUrl), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})