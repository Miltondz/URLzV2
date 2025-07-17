import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import QRCode from 'https://esm.sh/qrcode@1.5.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: corsHeaders 
      })
    }

    const { url_id, short_url } = await req.json()

    if (!url_id || !short_url) {
      throw new Error('URL ID and short URL are required')
    }

    // Verify the URL belongs to the user
    const { data: urlData, error: urlError } = await supabase
      .from('urls')
      .select('id')
      .eq('id', url_id)
      .eq('user_id', user.id)
      .single()

    if (urlError || !urlData) {
      throw new Error('URL not found or access denied')
    }

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(short_url, { 
      width: 256, 
      margin: 2 
    })
    
    const base64Data = qrCodeDataUrl.split(',')[1]
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))
    
    const fileName = `${url_id}.png`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('qrcodes')
      .upload(fileName, binaryData, { 
        contentType: 'image/png', 
        upsert: true 
      })

    if (uploadError) {
      throw new Error(`Failed to upload QR code: ${uploadError.message}`)
    }

    // Update the URL record with QR code path
    const { error: updateError } = await supabase
      .from('urls')
      .update({ qr_code_path: uploadData.path })
      .eq('id', url_id)

    if (updateError) {
      throw new Error(`Failed to update URL record: ${updateError.message}`)
    }

    return new Response(JSON.stringify({
      qr_code_path: uploadData.path,
      message: 'QR code generated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('QR code generation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})