import React, { useState } from 'react'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link2, Copy, Check, X, Lock, Crown } from 'lucide-react'

interface ShortenerFormProps {
  onSuccess: () => void
}

export function ShortenerForm({ onSuccess }: ShortenerFormProps) {
  const [longUrl, setLongUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)

  // Fetch user's subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .single()

        if (!error && profile) {
          setIsPro(profile.subscription_tier === 'pro' || profile.subscription_tier === 'business')
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error)
      } finally {
        setSubscriptionLoading(false)
      }
    }

    fetchSubscriptionStatus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!longUrl.trim()) return

    setIsLoading(true)
    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw new Error('Failed to get session')
      }
      
      if (!session?.access_token) {
        throw new Error('You must be logged in to shorten URLs')
      }

      // Call the shorten-url Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shorten-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          long_url: longUrl,
          custom_slug: customSlug.trim() || undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to shorten URL')
      }

      const data = await response.json()
      setShortUrl(data.short_url)
      setLongUrl('')
      setCustomSlug('')
      setError(null)
      onSuccess()
    } catch (error) {
      console.error('Error shortening URL:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Link2 className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Shorten URL
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter your long URL
          </label>
          <input
            type="url"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Slug (Optional)
            </label>
            {!isPro && (
              <div className="flex items-center space-x-1">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                  PRO
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              id="customSlug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="my-custom-link"
              disabled={!isPro || subscriptionLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                !isPro 
                  ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              }`}
            />
            {!isPro && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="group relative">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      Upgrade to Pro to use custom slugs!
                      <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {!isPro && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Create memorable, branded links with a Pro subscription
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !longUrl.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              <span>Shorten URL</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-md mt-4 flex justify-between items-center">
          <span className="text-sm">{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 transition-colors ml-2 flex-shrink-0"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {shortUrl && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            Your shortened URL:
          </p>
          <div className="flex items-center space-x-2">
            <code className="flex-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white">
              {shortUrl}
            </code>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200 transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}