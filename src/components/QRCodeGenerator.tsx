import React, { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, Download, Share2 } from 'lucide-react'

interface QRCodeGeneratorProps {
  url: string
  size?: number
  className?: string
  showDownloadShare?: boolean
}

export function QRCodeGenerator({ url, size = 200, className = '', showDownloadShare = false }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQR = async () => {
    if (!url || !qrRef.current) return

    try {
      // Create a canvas to render the QR code
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size for high quality
      const scale = 4
      canvas.width = size * scale
      canvas.height = size * scale

      // Create SVG data URL
      const svgElement = qrRef.current.querySelector('svg')
      if (!svgElement) return

      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)

      // Create image and draw to canvas
      const img = new Image()
      img.onload = () => {
        // Fill white background
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw QR code
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'qr-code.png'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }
        }, 'image/png')
        
        URL.revokeObjectURL(svgUrl)
      }
      img.src = svgUrl
    } catch (error) {
      console.error('Failed to download QR code:', error)
    }
  }

  const shareQR = async () => {
    if (!url || !qrRef.current) return

    try {
      // Check if Web Share API is supported
      if (!navigator.share) {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(url)
        alert('URL copied to clipboard!')
        return
      }

      // Create a canvas to generate image data for sharing
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = size * 2
      canvas.height = size * 2

      const svgElement = qrRef.current.querySelector('svg')
      if (!svgElement) return

      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = async () => {
        // Fill white background
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw QR code
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Convert to blob
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const file = new File([blob], 'qr-code.png', { type: 'image/png' })
              await navigator.share({
                title: 'QR Code',
                text: `QR Code for: ${url}`,
                files: [file]
              })
            } catch (shareError) {
              // Fallback if file sharing fails
              await navigator.share({
                title: 'QR Code',
                text: `Check out this link: ${url}`,
                url: url
              })
            }
          }
        }, 'image/png')
        
        URL.revokeObjectURL(svgUrl)
      }
      img.src = svgUrl
    } catch (error) {
      console.error('Failed to share QR code:', error)
      // Final fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert('URL copied to clipboard!')
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError)
      }
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="bg-white p-6 rounded-lg shadow-inner border border-gray-200 dark:border-gray-600" ref={qrRef}>
        {url ? (
          <QRCodeSVG
            value={url}
            size={size}
            level="M"
            includeMargin
            className="border border-gray-100 rounded"
          />
        ) : (
          <div 
            className="bg-gray-100 dark:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <div className="text-center">
              <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                QR code will appear here
              </p>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
        {url ? 'Scan to visit URL' : 'Enter a URL to generate QR code'}
      </p>

      {/* Download and Share Buttons */}
      {showDownloadShare && url && (
        <div className="flex items-center space-x-3 mt-4">
          <button
            onClick={downloadQR}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download QR</span>
          </button>
          
          <button
            onClick={shareQR}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      )}
    </div>
  )
}