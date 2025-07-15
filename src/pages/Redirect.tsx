import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ExternalLink, AlertCircle } from 'lucide-react'

export function Redirect() {
  const { shortCode } = useParams<{ shortCode: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [longUrl, setLongUrl] = useState<string | null>(null)

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        setError('Invalid short code')
        setLoading(false)
        return
      }

      try {
        // Call the redirect Edge Function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redirect/${shortCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.status === 301 || response.status === 302) {
          // Get the redirect location from headers
          const location = response.headers.get('Location')
          if (location) {
            setLongUrl(location)
            // Redirect after a short delay to show the redirect page
            setTimeout(() => {
              window.location.href = location
            }, 2000)
          } else {
            setError('Redirect location not found')
          }
        } else if (response.status === 404) {
          setError('Short URL not found')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to redirect')
        }
      } catch (error) {
        console.error('Redirect error:', error)
        setError('Failed to process redirect')
      } finally {
        setLoading(false)
      }
    }

    handleRedirect()
  }, [shortCode])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Redirecting...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we redirect you to your destination.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 sm:px-6">
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Link Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  if (longUrl) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 sm:px-6">
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ExternalLink className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Redirecting to destination...
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            You will be redirected automatically in a moment.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">Destination:</p>
            <a
              href={longUrl}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-all text-xs sm:text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {longUrl}
            </a>
          </div>
          <a
            href={longUrl}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors space-x-2"
          >
            <span>Continue Now</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    )
  }

  return null
}