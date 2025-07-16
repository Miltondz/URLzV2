import React, { useState, useEffect } from 'react'
import { X, ExternalLink, Globe, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface LinkPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
}

interface PreviewData {
  title: string
  description: string
  favicon: string | null
}

export function LinkPreviewModal({ isOpen, onClose, url }: LinkPreviewModalProps) {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && url) {
      fetchPreview()
    }
  }, [isOpen, url])

  const fetchPreview = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('preview-url', {
        body: { long_url: url }
      })

      if (error) throw error
      
      setPreviewData(data)
    } catch (error) {
      console.error('Error fetching preview:', error)
      setError('Failed to load preview')
      // Set fallback data
      setPreviewData({
        title: 'Preview unavailable',
        description: 'Unable to load preview for this URL',
        favicon: null
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProceed = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Link Preview
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading preview...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600 dark:text-red-400 mb-2">
                  <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Preview Error</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
              </div>
            ) : previewData ? (
              <div className="space-y-4">
                {/* Favicon and Title */}
                <div className="flex items-start space-x-3">
                  {previewData.favicon ? (
                    <img
                      src={previewData.favicon}
                      alt="Favicon"
                      className="w-6 h-6 mt-1 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <Globe className="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {previewData.title}
                    </h4>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {previewData.description}
                </p>

                {/* URL */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Destination URL:</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 break-all font-mono">
                    {url}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>Proceed to URL</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}