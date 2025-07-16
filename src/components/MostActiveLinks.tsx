import React from 'react'
import { TrendingUp, ExternalLink, BarChart3 } from 'lucide-react'

interface Link {
  id: string
  long_url: string
  short_code: string | null
  custom_slug: string | null
  clicks: number
}

interface MostActiveLinksProps {
  links: Link[]
}

export function MostActiveLinks({ links }: MostActiveLinksProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Most Active Links
        </h2>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No links with clicks yet. Create some links to see your top performers!
          </p>
        </div>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {links.map((link, index) => {
            const code = link.custom_slug || link.short_code
            const shortUrl = `urlz.lat/r/${code}`
            const fullShortUrl = `${window.location.origin}/r/${code}`
            
            return (
              <div key={link.id} className="flex-shrink-0 w-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                {/* Ranking Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
                    {index + 1}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {link.clicks} clicks
                  </span>
                </div>

                {/* Short URL */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <a
                      href={fullShortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-mono bg-white dark:bg-gray-600 px-2 py-1 rounded truncate flex-1 mr-2"
                      title={shortUrl}
                    >
                      {shortUrl}
                    </a>
                    <button
                      onClick={() => copyToClipboard(fullShortUrl)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Original URL */}
                <div className="mb-3">
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

                {/* Creation Date */}
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Created {new Date(link.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}