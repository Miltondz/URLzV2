import React, { useState } from 'react'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link2, Copy, Check, X, Lock, Crown, Shield, AlertTriangle } from 'lucide-react'

interface ShortenerFormProps {
  onSuccess: () => void
  refetchStats: () => void
}

export function ShortenerForm({ onSuccess, refetchStats }: ShortenerFormProps) {
  const [longUrl, setLongUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)

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

  // Verify URL when user leaves the long URL input
  const handleUrlBlur = async () => {
    if (!longUrl.trim() || !longUrl.startsWith('http')) {
      setIsVerified(null)
      return
    }

    setIsVerifying(true)
    try {
      const { data, error } = await supabase.functions.invoke('verify-url', {
        body: { long_url: longUrl }
      })

      if (error) throw error
      setIsVerified(data.isSafe)
    } catch (error) {
      console.error('Error verifying URL:', error)
      setIsVerified(null) // Default to unverified if check fails
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!longUrl.trim()) return

    setIsLoading(true)
    setError(null)
    setShortUrl('') // Clear previous result
    
    try {
      const { data, error } = await supabase.functions.invoke('shorten-url', {
        body: {
          long_url: longUrl,
          custom_slug: customSlug.trim() || undefined,
          is_verified: isVerified || false
        }
      })

      if (error) {
        throw error
      }

      setShortUrl(data.short_url)
      setLongUrl('')
      setCustomSlug('')
      setIsVerified(null)
      onSuccess()
      refetchStats() // Update stats after successful URL creation
    } catch (error) {
      console.error('Error shortening URL:', error)
      setError(error.message || 'An unexpected error occurred.')
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Link2 className="h-6 w-6 text-blue-600" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          Shorten URL
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          <div className="lg:col-span-7">
            <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your long URL
            </label>
            <div className="relative">
              <input
                type="url"
                id="longUrl"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://example.com/very/long/url"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  isVerified === true ? 'border-green-300 dark:border-green-600' :
                  isVerified === false ? 'border-red-300 dark:border-red-600' :
                  'border-gray-300 dark:border-gray-600'
                }`}
                required
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {/* Verification Status */}
                {isVerifying ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : isVerified === true ? (
                  <div className="group relative">
                    <Shield className="h-4 w-4 text-green-600" />
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        URL verified as safe
                        <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                ) : isVerified === false ? (
                  <div className="group relative">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        URL flagged as potentially unsafe
                        <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                ) : null}
                
                {/* Paste Button */}
                <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText()
                    setLongUrl(text)
                    setIsVerified(null) // Reset verification when pasting
                  } catch (error) {
                    console.error('Failed to paste:', error)
                  }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Paste from clipboard"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
              </div>
            </div>
            
            {/* Verification Status Message */}
            {isVerified === false && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>This URL has been flagged as potentially unsafe</span>
              </p>
            )}
            {isVerified === true && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>URL verified as safe</span>
              </p>
            )}
          </div>

          <div className="lg:col-span-3">
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
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  !isPro 
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed pr-12' 
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-12'
                }`}
              />
              {isPro ? (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText()
                      setCustomSlug(text)
                    } catch (error) {
                      console.error('Failed to paste:', error)
                    }
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Paste from clipboard"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </button>
              ) : (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="group relative">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
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
        </div>

        <button
          type="submit"
          disabled={isLoading || !longUrl.trim() || isVerifying}
          className={`w-full font-medium py-2 sm:py-3 px-4 text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            isVerified === false 
              ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white'
              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white'
          }`}
        >
          {isLoading || isVerifying ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              <span>
                {isVerified === false ? 'Shorten Anyway' : 'Shorten URL'}
              </span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-md mt-4 flex justify-between items-start">
          <span className="text-sm">{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 transition-colors ml-2 flex-shrink-0 mt-0.5"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {shortUrl && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            Your shortened URL:
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <code className="flex-1 text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 sm:px-3 py-2 text-gray-900 dark:text-white break-all">
              {shortUrl}
            </code>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200 transition-colors whitespace-nowrap"
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