import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { GlobeDemo } from '../components/ui/globe-demo'
import { QRCodeGenerator } from '../components/QRCodeGenerator'
import { Link2, Zap, Shield, BarChart3, ArrowRight, Copy, Check, X, Crown, Eye, Smartphone, QrCode } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { QRCodeSVG } from 'qrcode.react'

export function Home() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [longUrl, setLongUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newLink, setNewLink] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [qrUrl, setQrUrl] = useState('')
  const [pasteLoading, setPasteLoading] = useState(false)

  const handleAnonymousShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!longUrl.trim()) return

    setIsLoading(true)
    setError(null)
    setNewLink('')
    setIsVerified(null)
    
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

      // Set the state with the actual URL string from the response
      setNewLink(data.short_url)
      setIsVerified(data.is_verified)
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
      await navigator.clipboard.writeText(newLink || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handlePaste = async () => {
    setPasteLoading(true)
    try {
      const text = await navigator.clipboard.readText()
      setLongUrl(text)
    } catch (error) {
      console.error('Failed to paste:', error)
    } finally {
      setPasteLoading(false)
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
              {t('hero.title')}
              <br />
              <span className="text-blue-600">{t('hero.title_highlight')}</span>
            </h1>
          
            <p className="text-xl sm:text-2xl text-gray-200 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Anonymous URL Shortening Form */}
            {!user && (
              <div className="max-w-4xl mx-auto mb-16">
                {/* Top Row - Full Width Form */}
                <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-white/20 dark:border-gray-700/20 mb-8">
                  <form onSubmit={handleAnonymousShorten} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="url"
                          value={longUrl}
                          onChange={(e) => setLongUrl(e.target.value)}
                          placeholder={t('shortener.url_placeholder')}
                          className="w-full px-6 py-4 pr-16 text-lg text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={handlePaste}
                          disabled={pasteLoading}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                          title="Paste from clipboard"
                        >
                          {pasteLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading || !longUrl.trim()}
                        className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold text-lg rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Link2 className="h-5 w-5" />
                            <span>{t('shortener.shorten_url')}</span>
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

                  {newLink && (
                    <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-3">
                        {t('shortener.your_shortened_url')}
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <input
                          type="text"
                          readOnly
                          value={newLink || ''} // Binds the input's value to the state
                          className="flex-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-4 py-3 text-gray-900 dark:text-white font-mono"
                        />
                        {isVerified && (
                          <div className="flex items-center space-x-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded text-green-700 dark:text-green-300 text-sm font-medium whitespace-nowrap">
                            <Shield className="h-4 w-4" />
                            <span>✔️ {t('shortener.url_verified_safe')}</span>
                          </div>
                        )}
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200 bg-white dark:bg-gray-700 border border-green-200 dark:border-green-600 rounded transition-colors whitespace-nowrap"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span>{copied ? t('shortener.copied') : t('shortener.copy')}</span>
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-xs text-green-700 dark:text-green-300 mb-2">
                          ⏰ {t('shortener.anonymous_links_expire')}
                        </p>
                        <Link
                          to="/login"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          {t('shortener.create_account_arrow')}
                        </Link>
                      </div>
                    </div>
                  )}

                  <p className="mt-6 text-sm text-gray-300 dark:text-gray-400 text-center">
                    {t('shortener.anonymous_links_expire')}
                  </p>
                </div>

                {/* Bottom Row - QR Code Section */}
                <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-white/20 dark:border-gray-700/20">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {t('qr.title')}
                    </h3>
                    <p className="text-blue-100 text-lg">
                      {t('qr.subtitle')}
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <QRCodeGenerator 
                      url={longUrl} 
                      size={200}
                      showDownloadShare={true}
                      className="w-full max-w-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-colors space-x-2"
                >
                  <span>{t('hero.go_to_dashboard')}</span>
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
              {t('home.why_sign_up')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('home.why_sign_up_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Track Everything */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mb-6">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('home.track_everything')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('home.track_everything_desc')}
              </p>
            </div>

            {/* Brand Your Links */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full mb-6">
                <Eye className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('home.brand_your_links')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('home.brand_your_links_desc')}
              </p>
            </div>

            {/* Manage with Ease */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full mb-6">
                <Smartphone className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('home.manage_with_ease')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('home.manage_with_ease_desc')}
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-colors space-x-2"
            >
              <span>{t('hero.create_free_account')}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Section 3: Go Pro Upsell */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            {t('home.go_pro_title')}
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <Crown className="h-8 w-8 text-yellow-300 mb-4 mx-auto" />
               <h3 className="text-xl font-semibold text-white mb-2">{t('home.custom_domains')}</h3>
               <p className="text-blue-100">{t('home.custom_domains_desc')}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <QrCode className="h-8 w-8 text-yellow-300 mb-4 mx-auto" />
               <h3 className="text-xl font-semibold text-white mb-2">{t('home.qr_with_logo')}</h3>
               <p className="text-blue-100">{t('home.qr_with_logo_desc')}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 md:col-span-2 lg:col-span-1">
                <BarChart3 className="h-8 w-8 text-yellow-300 mb-4 mx-auto" />
               <h3 className="text-xl font-semibold text-white mb-2">{t('home.advanced_analytics')}</h3>
               <p className="text-blue-100">{t('home.advanced_analytics_desc')}</p>
              </div>
            </div>

            <Link
              to="/features"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-lg hover:bg-gray-50 transition-colors space-x-2"
            >
              <span>{t('features.view_pro_plans')}</span>
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
              {t('home.qr_generator_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('home.qr_generator_subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <label htmlFor="qr-url" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                    {t('home.enter_url_qr')}
                  </label>
                  <input
                    type="url"
                    id="qr-url"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    placeholder={t('shortener.url_placeholder')}
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {t('home.qr_updates_automatically')}
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-inner">
                    {qrUrl ? (
                      <QRCodeSVG
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
                            {t('qr.will_appear_here')}
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
                    {t('home.save_qr_track')}
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors space-x-2"
                  >
                    <span>{t('hero.create_free_account')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
              
              {qrUrl && (
                <div className="flex justify-center mt-8">
                  <QRCodeGenerator 
                    url={qrUrl} 
                    size={200}
                    className="w-full max-w-xs"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}