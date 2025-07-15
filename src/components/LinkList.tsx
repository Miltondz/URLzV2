import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ExternalLink, BarChart3, Calendar, Copy } from 'lucide-react'

interface Link {
  id: string
  long_url: string
  short_code: string
  clicks: number
  created_at: string
}

interface LinkListProps {
  refreshTrigger: number
}

export function LinkList({ refreshTrigger }: LinkListProps) {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('urls')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLinks(data || [])
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [refreshTrigger])

  const copyToClipboard = async (shortCode: string) => {
    try {
      const appUrl = import.meta.env.VITE_APP_URL || 'https://urlz.lat'
      await navigator.clipboard.writeText(`${appUrl}/${shortCode}`)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Your Links
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {links.length} {links.length === 1 ? 'link' : 'links'}
        </span>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No links yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Create your first shortened URL to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="hidden lg:block">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <a
                          href={link.long_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate max-w-xs"
                          title={link.long_url}
                        >
                          {link.long_url}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`${import.meta.env.VITE_APP_URL || 'https://urlz.lat'}/${link.short_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {(import.meta.env.VITE_APP_URL || 'https://urlz.lat').replace(/^https?:\/\//, '')}/{link.short_code}
                        </a>
                        <button
                          onClick={() => copyToClipboard(link.short_code)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {link.clicks}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(link.created_at)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="lg:hidden space-y-4">
            {links.map((link) => (
              <div key={link.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Original URL
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <a
                        href={link.long_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate"
                        title={link.long_url}
                      >
                        {link.long_url}
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Short URL
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      <a
                        href={`${import.meta.env.VITE_APP_URL || 'https://urlz.lat'}/${link.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1 font-mono hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {(import.meta.env.VITE_APP_URL || 'https://urlz.lat').replace(/^https?:\/\//, '')}/{link.short_code}
                      </a>
                      <button
                        onClick={() => copyToClipboard(link.short_code)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Clicks
                      </label>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {link.clicks}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created
                      </label>
                      <div className="flex items-center space-x-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(link.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}