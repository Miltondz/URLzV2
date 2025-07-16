import React, { useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useTheme } from '../contexts/ThemeContext'
import { Link as LinkIcon } from 'lucide-react'

export function AuthComponent() {
  const { isDark } = useTheme()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LinkIcon className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Welcome to urlz.lat
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Smart URL shortening made simple
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow-xl rounded-lg">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                    inputBackground: isDark ? '#374151' : '#ffffff',
                    inputBorder: isDark ? '#4b5563' : '#d1d5db',
                    inputText: isDark ? '#f9fafb' : '#111827',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors',
                input: 'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              },
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}/dashboard`}
            onlyThirdPartyProviders={false}
          />
        </div>
      </div>
    </div>
  )
}