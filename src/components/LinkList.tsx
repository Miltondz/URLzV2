import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ExternalLink, BarChart3, Calendar, Copy, Trash2 } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'

interface Link {
  id: string
  long_url: string
  short_code: string | null
  custom_slug: string | null
  clicks: number
  created_at: string
}

interface LinkListProps {
  refreshTrigger: number
  refetchStats: () => void
}

export function LinkList({ refreshTrigger, refetchStats }: LinkListProps) {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    linkId: string
    linkUrl: string
  }>({
    isOpen: false,
    linkId: '',
    linkUrl: ''
  })

  const fetchLinks = async () => {
    setError(null)
    try {
      const { data, error } = await supabase
        .from('urls')
        .select('id, long_url, short_code, custom_slug, clicks, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLinks(data || [])
    } catch (error) {
      console.error('Error fetching links:', error)
      setError(error instanceof Error ? error.message : 'Failed to load links')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [refreshTrigger])

  const copyToClipboard = async (shortCode: string) => {
    try {
      await navigator.clipboard.writeText(shortCode)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const openDeleteDialog = (id: string, longUrl: string) => {
    setDeleteDialog({
      isOpen: true,
      linkId: id,
      linkUrl: longUrl
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      linkId: '',
      linkUrl: ''
    })
  }

  const deleteLink = async () => {
    const { linkId } = deleteDialog
    setDeletingId(linkId)
    
    try {
      const { error } = await supabase
        .from('urls')
        .delete()
        .eq('id', linkId)

      if (error) throw error
      
      // Remove the link from the local state
      setLinks(links.filter(link => link.id !== linkId))
      closeDeleteDialog()
      refetchStats() // Update stats after successful deletion
    } catch (error) {
      console.error('Error deleting link:', error)
      alert('Failed to delete link. Please try again.')
    } finally {
      setDeletingId(null)
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
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
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Your Links
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-lg">
            <p className="font-medium">Error loading links</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={fetchLinks}
              className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}

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
            {/* Desktop view - Responsive table with horizontal scroll */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[200px]">
                        Original URL
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[180px]">
                        Short URL
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[80px]">
                        Clicks
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[100px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {links.map((link) => (
                      <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        {(() => {
                          const code = link.custom_slug || link.short_code
                          const fullShortUrl = `${window.location.origin}/r/${code}`
                          const displayText = fullShortUrl.replace('https://', '')
                          
                          return (
                            <>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <a
                              href={link.long_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate max-w-[300px]"
                              title={link.long_url}
                            >
                              {link.long_url}
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <a
                              href={fullShortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              {displayText}
                            </a>
                            <Link
                              to={`/dashboard/analytics/${link.id}`}
                              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                              title="View analytics"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => copyToClipboard(fullShortUrl)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              title="Copy to clipboard"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {link.clicks}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(link.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => openDeleteDialog(link.id, link.long_url)}
                            disabled={deletingId === link.id}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Delete link"
                          >
                            {deletingId === link.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                            </>
                          )
                        })()}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile view */}
            <div className="lg:hidden space-y-4">
              {links.map((link) => (
                <div key={link.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  {(() => {
                    const code = link.custom_slug || link.short_code
                    const fullShortUrl = `${window.location.origin}/r/${code}`
                    const displayText = fullShortUrl.replace('https://', '')
                    
                    return (
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
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate text-sm"
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
                          href={fullShortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1 font-mono hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors break-all"
                        >
                          {displayText}
                        </a>
                        <Link
                          to={`/dashboard/analytics/${link.id}`}
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1"
                          title="View analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => copyToClipboard(fullShortUrl)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
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

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => openDeleteDialog(link.id, link.long_url)}
                        disabled={deletingId === link.id}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        {deletingId === link.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span>{deletingId === link.id ? 'Deleting...' : 'Delete Link'}</span>
                      </button>
                    </div>
                  </div>
                    )
                  })()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Link"
        message={`Are you sure you want to delete this link? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteLink}
        onCancel={closeDeleteDialog}
        isLoading={deletingId === deleteDialog.linkId}
      />
    </>
  )
}