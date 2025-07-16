import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { TrendingUp, ExternalLink, BarChart3 } from 'lucide-react'

interface ActiveLink {
  id: string
  long_url: string
  short_code: string | null
  custom_slug: string | null
  clicks: number
}

export function MostActiveLinks() {
  const [activeLinks, setActiveLinks] = useState<ActiveLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActiveLinks = async () => {
    setError(null)
    try {
      const { data, error } = await supabase
        .from('urls')
        .select('id, long_url, short_code, custom_slug, clicks')
        .order('clicks', { ascending: false })
        .limit(5)

      if (error) throw error
      setActiveLinks(data || [])
    } catch (error) {
      console.error('Error fetching active links:', error)
      setError(error instanceof Error ? error.message : 'Failed to load active links')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveLinks()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Most Active Links
        </h2>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-lg">
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchActiveLinks}
            className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {activeLinks.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No links with clicks yet. Create some links to see your top performers!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeLinks.map((link, index) => {
            const code = link.custom_slug || link.short_code
            const fullShortUrl = `${window.location.origin}/r/${code}`
            const displayText = fullShortUrl.replace('https://', '')
            
            return (
              <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <a
                        href={fullShortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-mono bg-white dark:bg-gray-600 px-2 py-1 rounded"
                      >
                        {displayText}
                      </a>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <a
                        href={link.long_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 truncate"
                        title={link.long_url}
                      >
                        {link.long_url}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {link.clicks} clicks
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}