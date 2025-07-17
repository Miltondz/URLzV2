import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GlobeDemo } from '../components/ui/globe-demo'
import { Link2, Zap, Shield, BarChart3, ArrowRight, Copy, Check, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function Home() {
  const { user } = useAuth()
  const [longUrl, setLongUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnonymousShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!longUrl.trim()) return

    setIsLoading(true)
    setError(null)
    setShortUrl('')
    
    try {
      const { data, error } = await supabase.functions.invoke('shorten-url', {
        body: {
          long_url: longUrl,
          // No custom_slug for anonymous users
          // No Authorization header - this will be an anonymous request
        }
      })

      if (error) {
        throw error
      }

      setShortUrl(data.short_url)
      setLongUrl('') // Clear the input
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Full-width Globe Background */}
        <div className="absolute inset-0 w-full h-full">
          <GlobeDemo />
        </div>
        
        {/* Text content on top of globe */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Link2 className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
              Smarter Link Management
              <br />
              <span className="text-blue-600">Starts Here</span>
            </h1>
          
            <p className="text-lg sm:text-xl text-gray-200 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Create short, branded links that boost your brand and improve performance effortlessly.
              Track clicks and get the insights you need to grow.
            </p>

            {/* Anonymous URL Shortening Form */}
            {!user && (
              <div className="max-w-2xl mx-auto mb-8">
                <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                  <h3 className="text-xl font-semibold text-white mb-4 text-center">
                    Try it now - No signup required!
                  </h3>
                  
                  <form onSubmit={handleAnonymousShorten} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={longUrl}
                          onChange={(e) => setLongUrl(e.target.value)}
                          placeholder="https://example.com/your-long-url"
                          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading || !longUrl.trim()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
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
                    </div>
                  </form>

                  {error && (
                    <div className="mt-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-lg flex justify-between items-start">
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
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                        Your shortened URL:
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <code className="flex-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white break-all">
                          {shortUrl}
                        </code>
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200 bg-white dark:bg-gray-700 border border-green-200 dark:border-green-600 rounded transition-colors whitespace-nowrap"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="mt-3 text-center">
                        <Link
                          to="/login"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Sign up for free to track clicks and create custom links →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors space-x-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 font-semibold rounded-lg transition-colors"
                  >
                    Try Free Trial
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tools That Make Every Click Count
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover how our features simplify link management and maximize performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mb-6">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Lightning Fast
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Generate short links instantly with our optimized infrastructure and global CDN.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full mb-6">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Real-Time Analytics
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Track click performance, analyze audience behavior and optimize your strategy.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Secure & Reliable
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Enterprise-grade security with 99.9% uptime guarantee and fraud protection.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Be First to Experience Smarter Link Management
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join the next evolution website and security analysis, quality and security solutions, and more.
            </p>
            {!user && (
              <Link
                to="/login"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}