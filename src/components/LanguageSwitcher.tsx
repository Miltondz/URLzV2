import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <div className="flex items-center space-x-1">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            i18n.language === 'en'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          EN
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          onClick={() => changeLanguage('es')}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            i18n.language === 'es'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          ES
        </button>
      </div>
    </div>
  )
}