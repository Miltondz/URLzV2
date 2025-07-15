import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link2, Copy, Check, X } from 'lucide-react'

interface ShortenerFormProps {
  onSuccess: () => void
}

export function ShortenerForm({ onSuccess }: ShortenerFormProps) {
  const [longUrl, setLongUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        body: JSON.stringify({ long_url: longUrl })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to shorten URL')
      }

      const data = await response.json()
      setShortUrl(data.short_url)
      setLongUrl('')
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