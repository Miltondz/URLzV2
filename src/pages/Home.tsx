import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GlobeDemo } from '../components/ui/globe-demo'
import { Link2, Zap, Shield, BarChart3, ArrowRight, Copy, Check, X, Crown, Eye, Smartphone, QrCode } from 'lucide-react'
import { supabase } from '../lib/supabase'
import QRCodeReact from 'qrcode.react'

export function Home() {
  const { user } = useAuth()
  const [longUrl, setLongUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrUrl, setQrUrl] = useState('')

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
      {/* Section 1: Hero Form */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Full-width Globe Background */}
        <div className="absolute inset-0 w-full h-full">
          <GlobeDemo />
        </div>
        
        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8">
              Short links,
              <br />
              <span className="text-blue-600">big results.</span>
            </h1>
          
            <p className="text-xl sm:text-2xl text-gray-200 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Create powerful short links that drive engagement and deliver insights.
            </p>

            {/* Anonymous URL Shortening Form */}
            {!user && (
              <div className="max-w-2xl mx-auto mb-8">
                <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-white/20 dark:border-gray-700/20">
                  <form onSubmit={handleAnonymousShorten} className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={longUrl}
                          onChange={(e) => setLongUrl(e.target.value)}
                          placeholder="https://example.com/your-long-url"
                          className="w-full px-6 py-4 text-lg text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading || !longUrl.trim()}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold text-lg rounded-lg transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Link2 className="h-5 w-5" />
                            <span>Shorten URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {error && (
                    <div className="mt-6 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-lg flex justify-between items-start">
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
                    <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-3">
                        Your shortened URL:
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <code className="flex-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-4 py-3 text-gray-900 dark:text-white break-all">
                          {shortUrl}
                        </code>
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200 bg-white dark:bg-gray-700 border border-green-200 dark:border-green-600 rounded transition-colors whitespace-nowrap"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-xs text-green-700 dark:text-green-300 mb-2">
                          ⏰ Anonymous links expire in 7 days. Create a free account for permanent links.
                        </p>
                        <Link
                          to="/login"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Create Free Account →
                        </Link>
                      </div>
                    </div>
                  )}

                  <p className="mt-4 text-sm text-gray-300 dark:text-gray-400 text-center">
                    Anonymous links expire in 7 days. Create a free account for permanent links.
                  </p>
                </div>
              </div>
            )}

            {user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-colors space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Why Sign Up? Value Proposition */}
      <div className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Create an Account?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Unlock powerful features and insights with a free urlz.lat account
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Track Everything */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mb-6">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Track Everything
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Get detailed analytics on every click. See where your audience comes from, what devices they use, and when they're most active.
              </p>
            </div>

            {/* Brand Your Links */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full mb-6">
                <Eye className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Brand Your Links
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Create custom, memorable links that reflect your brand. Build trust and recognition with every share.
              </p>
            </div>

            {/* Manage with Ease */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full mb-6">
                <Smartphone className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Manage with Ease
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Organize all your links in one dashboard. Edit, delete, and monitor performance from anywhere.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-colors space-x-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Section 3: Go Pro Upsell */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Take Your Links to the Next Level with Pro
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <Crown className="h-8 w-8 text-yellow-300 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">Custom Domains</h3>
                <p className="text-blue-100">Use your own domain for maximum brand recognition</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <QrCode className="h-8 w-8 text-yellow-300 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">QR with Logo</h3>
                <p className="text-blue-100">Generate branded QR codes with your company logo</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 md:col-span-2 lg:col-span-1">
                <BarChart3 className="h-8 w-8 text-yellow-300 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
                <p className="text-blue-100">Deep insights with conversion tracking and A/B testing</p>
              </div>
            </div>

            <Link
              to="/features"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-lg hover:bg-gray-50 transition-colors space-x-2"
            >
              <span>View Pro Plans</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Section 4: Instant QR Code Generator */}
      <div className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Instant QR Code Generator
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Generate QR codes instantly for any URL. Perfect for print materials, presentations, and offline marketing.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <label htmlFor="qr-url" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Enter any URL to generate a QR code:
                  </label>
                  <input
                    type="url"
                    id="qr-url"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    The QR code updates automatically as you type
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-inner">
                    {qrUrl ? (
                      <QRCodeReact
                        value={qrUrl}
                        size={200}
                        level="M"
                        includeMargin={true}
                        className="border border-gray-200 rounded"
                      />
                    ) : (
                      <div className="w-[200px] h-[200px] bg-gray-100 dark:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <div className="text-center">
                          <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            QR code will appear here
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {qrUrl && (
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Want to save this QR code and track its performance?
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors space-x-2"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}