import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode } from 'lucide-react'

interface QRCodeGeneratorProps {
  url: string
  size?: number
  className?: string
}

export function QRCodeGenerator({ url, size = 200, className = '' }: QRCodeGeneratorProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="bg-white p-6 rounded-lg shadow-inner border border-gray-200 dark:border-gray-600">
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
    </div>
  )
}