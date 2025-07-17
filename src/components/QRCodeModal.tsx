import React from 'react'
import { X, Download, Share2, QrCode } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  link: {
    id: string
    short_code: string | null
    custom_slug: string | null
    long_url: string
    qr_code_path?: string
  }
}

export function QRCodeModal({ isOpen, onClose, link }: QRCodeModalProps) {
  if (!isOpen) return null

  const code = link.custom_slug || link.short_code
  const shortUrl = `${window.location.origin}/r/${code}`

  const downloadQR = async () => {
    if (!link.qr_code_path) return

    try {
      // Get the QR code from Supabase storage
      const { data, error } = await supabase.storage
        .from('qrcodes')
        .download(link.qr_code_path)

      if (error) throw error

      // Create download link
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-code-${code}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download QR code:', error)
      alert('Failed to download QR code. Please try again.')
    }
  }

  const shareQR = async () => {
    if (!link.qr_code_path) return

    try {
      // Check if Web Share API is supported
      if (!navigator.share) {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(shortUrl)
        alert('Short URL copied to clipboard!')
        return
      }

      // Get the QR code from Supabase storage
      const { data, error } = await supabase.storage
        .from('qrcodes')
        .download(link.qr_code_path)

      if (error) throw error

      // Create file for sharing
      const file = new File([data], `qr-code-${code}.png`, { type: 'image/png' })

      try {
        await navigator.share({
          title: 'QR Code',
          text: `QR Code for: ${shortUrl}`,
          files: [file]
        })
      } catch (shareError) {
        // Fallback if file sharing fails
        await navigator.share({
          title: 'QR Code',
          text: `Check out this link: ${shortUrl}`,
          url: shortUrl
        })
      }
    } catch (error) {
      console.error('Failed to share QR code:', error)
      // Final fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shortUrl)
        alert('Short URL copied to clipboard!')
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError)
        alert('Failed to share QR code. Please try again.')
      }
    }
  }

  const getQRCodeUrl = () => {
    if (!link.qr_code_path) return null
    
    const { data } = supabase.storage
      .from('qrcodes')
      .getPublicUrl(link.qr_code_path)
    
    return data.publicUrl
  }

  const qrCodeUrl = getQRCodeUrl()

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
              <QrCode className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                QR Code
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
            <div className="text-center mb-6">
              <div className="bg-white p-4 rounded-lg shadow-inner border border-gray-200 dark:border-gray-600 inline-block">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                      const parent = (e.target as HTMLImageElement).parentElement
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                            <div class="text-center">
                              <svg class="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <p class="text-sm text-gray-500 dark:text-gray-400">QR code not available</p>
                            </div>
                          </div>
                        `
                      }
                    }}
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        QR code not available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Link Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Short URL:</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 break-all font-mono">
                {shortUrl}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 mt-2">Destination:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                {link.long_url}
              </p>
            </div>

            {/* Action Buttons */}
            {qrCodeUrl && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={downloadQR}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PNG</span>
                </button>
                
                <button
                  onClick={shareQR}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}