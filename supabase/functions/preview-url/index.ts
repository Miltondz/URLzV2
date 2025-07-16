import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

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

    // Fetch the HTML content
    const response = await fetch(long_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; urlz.lat-preview/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`)
    }

    const html = await response.text()
    
    // Parse HTML using DOMParser
    const doc = new DOMParser().parseFromString(html, 'text/html')
    
    if (!doc) {
      throw new Error('Failed to parse HTML')
    }

    // Extract metadata
    const title = doc.title || doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || 'No title found'
    
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                       doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                       'No description available'
    
    let favicon = doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
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

    return new Response(
      JSON.stringify({
        title: title.substring(0, 100), // Limit title length
        description: description.substring(0, 200), // Limit description length
        favicon
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Preview URL error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch URL preview',
        title: 'Preview unavailable',
        description: 'Unable to load preview for this URL',
        favicon: null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})