import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, BarChart3, Calendar, Copy, Trash2, Eye, Shield, Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, QrCode } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'
import { LinkPreviewModal } from './LinkPreviewModal'
import { QRCodeModal } from './QRCodeModal'
import { supabase } from '../lib/supabase'

interface LinkData {
  id: string
  long_url: string
  short_code: string | null
  custom_slug: string | null
  clicks: number
  is_verified: boolean
  created_at: string
  qr_code_path?: string
}

interface LinkListProps {
  links: LinkData[]
  refetchStats: () => void
}

type SortField = 'clicks' | 'created_at' | null
type SortDirection = 'asc' | 'desc'

const ITEMS_PER_PAGE = 10

export function LinkList({ links, refetchStats }: LinkListProps) {
  const [localLinks, setLocalLinks] = useState<LinkData[]>(links)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean
    url: string
  }>({
    isOpen: false,
    url: ''
  })
  const [qrModal, setQrModal] = useState<{
    isOpen: boolean
    link: LinkData | null
  }>({
    isOpen: false,
    link: null
  })
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

  useEffect(() => {
    setLocalLinks(links)
    setIsLoading(false)
  }, [links])

  // Handle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If clicking the same field, reverse the direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // If clicking a new field, set it as the sort field with default direction
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Get sort icon for column headers
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-600" />
      : <ArrowDown className="h-4 w-4 text-blue-600" />
  }

  // Filter links based on search term
  const filteredLinks = useMemo(() => {
    let filtered = localLinks
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = localLinks.filter(link => 
        link.long_url.toLowerCase().includes(term) ||
        (link.short_code && link.short_code.toLowerCase().includes(term)) ||
        (link.custom_slug && link.custom_slug.toLowerCase().includes(term))
      )
    }
    
    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any
        let bValue: any
        
        if (sortField === 'clicks') {
          aValue = a.clicks
          bValue = b.clicks
        } else if (sortField === 'created_at') {
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
        }
        
        if (sortDirection === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      })
    }
    
    return filtered
  }, [localLinks, searchTerm, sortField, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(filteredLinks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedLinks = filteredLinks.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const copyToClipboard = async (shortCode: string) => {
    try {
      await navigator.clipboard.writeText(shortCode)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const openPreviewModal = (url: string) => {
    setPreviewModal({
      isOpen: true,
      url
    })
  }

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      url: ''
    })
  }

  const openQRModal = (link: LinkData) => {
    setQrModal({
      isOpen: true,
      link
    })
  }

  const closeQRModal = () => {
    setQrModal({
      isOpen: false,
      link: null
    })
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
    
    // Add fade-out animation
    setAnimatingItems(prev => new Set(prev).add(linkId))
    
    try {
      const { error } = await supabase
        .from('urls')
        .delete()
        .eq('id', linkId)

      if (error) throw error
      
      // Wait for animation to complete before removing
      setTimeout(() => {
        setLocalLinks(localLinks.filter(link => link.id !== linkId))
        setAnimatingItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(linkId)
          return newSet
        })
        closeDeleteDialog()
        refetchStats()
      }, 300)
      
    } catch (error) {
      console.error('Error deleting link:', error)
      alert('Failed to delete link. Please try again.')
      setAnimatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(linkId)
        return newSet
      })
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

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const showPages = 5
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    let endPage = Math.min(totalPages, startPage + showPages - 1)
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, filteredLinks.length)}</span> of{' '}
              <span className="font-medium">{filteredLinks.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    )
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
      <div className={showHeader ? "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6" : ""}>
        {showHeader && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Your Links
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
              {searchTerm && ` (filtered from ${localLinks.length})`}
            </span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search links by URL, short code, or custom slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-lg">
            <p className="font-medium">Error loading links</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={refetchStats}
              className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No links found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No links match your search for "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No links yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create your first shortened URL to get started.
                </p>
              </>
            )}
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">
                        Short Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[80px]">
                        <button
                          onClick={() => handleSort('clicks')}
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                        >
                          <span>Clicks</span>
                          {getSortIcon('clicks')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">
                        <button
                          onClick={() => handleSort('created_at')}
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                        >
                          <span>Created</span>
                          {getSortIcon('created_at')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedLinks.map((link) => (
                      <tr 
                        key={link.id} 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ${
                          animatingItems.has(link.id) ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                        }`}
                      >
                        {(() => {
                          const code = link.custom_slug || link.short_code
                          
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
                              href={`${import.meta.env.VITE_APP_URL || window.location.origin}/r/${code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
                            >
                              <span>urlz.lat/r/{code}</span>
                              {link.is_verified && (
                                <Shield className="h-3 w-3 text-green-600 dark:text-green-400" title="Verified safe" />
                              )}
                            </a>
                            <button
                              onClick={() => openPreviewModal(link.long_url)}
                              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                              title="Preview link"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <Link
                              to={`/dashboard/analytics/${link.id}`}
                              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                              title="View analytics"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => copyToClipboard(`${import.meta.env.VITE_APP_URL || window.location.origin}/r/${code}`)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              title="Copy to clipboard"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            to={`/dashboard/analytics/${link.id}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
                          >
                            {link.clicks}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(link.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openQRModal(link)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              title="View QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </button>
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
                          </div>
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
              {paginatedLinks.map((link) => (
                <div 
                  key={link.id} 
                  className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-300 ${
                    animatingItems.has(link.id) ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                  }`}
                >
                  {(() => {
                    const code = link.custom_slug || link.short_code
                    
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
                        Short Code
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <a
                          href={`${import.meta.env.VITE_APP_URL || window.location.origin}/r/${code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
                          title={`urlz.lat/r/${code}`}
                        >
                          <span>urlz.lat/r/{code}</span>
                          {link.is_verified && (
                            <Shield className="h-3 w-3 text-green-600 dark:text-green-400 flex-shrink-0" title="Verified safe" />
                          )}
                        </a>
                        <button
                          onClick={() => openPreviewModal(link.long_url)}
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1"
                          title="Preview link"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/dashboard/analytics/${link.id}`}
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1"
                          title="View analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => copyToClipboard(`${import.meta.env.VITE_APP_URL || window.location.origin}/r/${code}`)}
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
                          <Link
                            to={`/dashboard/analytics/${link.id}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
                          >
                            {link.clicks}
                          </Link>
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
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => openQRModal(link)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors text-sm"
                        >
                          <QrCode className="h-4 w-4" />
                          <span>View QR Code</span>
                        </button>
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
                  </div>
                    )
                  })()}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
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

      {/* Link Preview Modal */}
      <LinkPreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        url={previewModal.url}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModal.isOpen}
        onClose={closeQRModal}
        link={qrModal.link!}
      />
    </>
  )
}