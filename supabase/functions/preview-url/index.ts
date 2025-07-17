import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      })
    }

    const { long_url } = await req.json()

    if (!long_url || !long_url.startsWith('http')) {
      return new Response(
        JSON.stringify({ error: 'Valid URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    try {
      // Fetch the HTML content with realistic User-Agent
      const response = await fetch(long_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0'
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      
      // Parse HTML using DOMParser
      const doc = new DOMParser().parseFromString(html, 'text/html')
      
      if (!doc) {
        throw new Error('Failed to parse HTML content')
      }

      // Extract metadata with graceful fallbacks
      let title = null
      try {
        title = doc.title || 
                doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
                'No title found'
      } catch (e) {
        title = 'No title found'
      }
      
      let description = null
      try {
        description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                     doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                     doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
                     'No description available'
      } catch (e) {
        description = 'No description available'
      }
      
      let favicon = null
      try {
        favicon = doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
                  doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
                  doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href')
        
        // Handle relative favicon URLs
        if (favicon && !favicon.startsWith('http')) {
          const baseUrl = new URL(long_url)
          if (favicon.startsWith('/')) {
            favicon = `${baseUrl.protocol}//${baseUrl.host}${favicon}`
          } else {
            favicon = `${baseUrl.protocol}//${baseUrl.host}/${favicon}`
          }
        }
        
        // Fallback to default favicon if none found
        if (!favicon) {
          const baseUrl = new URL(long_url)
          favicon = `${baseUrl.protocol}//${baseUrl.host}/favicon.ico`
        }
      } catch (e) {
        favicon = null
      }

      return new Response(
        JSON.stringify({
          title: title ? title.substring(0, 100) : 'No title found', // Limit title length
          description: description ? description.substring(0, 200) : 'No description available', // Limit description length
          favicon
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } catch (fetchError) {
      console.error('Fetch or parsing error:', fetchError)
      
      // Return structured error response
      return new Response(
        JSON.stringify({ 
          error: 'Could not fetch or parse the URL.',
          details: fetchError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Return 200 so frontend can handle gracefully
        }
      )
    }

  } catch (error) {
    console.error('Preview URL error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Could not fetch or parse the URL.',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 so frontend can handle gracefully
      }
    )
  }
})