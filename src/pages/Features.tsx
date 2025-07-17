import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link2, BarChart3, Shield, Zap, Globe, Crown, Smartphone, Clock, Eye, QrCode } from 'lucide-react'

export function Features() {
  const { t } = useTranslation()
  
  const features = [
    {
      icon: Link2,
      title: t('features.smart_shortening.title'),
      description: t('features.smart_shortening.description'),
      color: 'blue'
    },
    {
      icon: BarChart3,
      title: t('features.real_time_analytics.title'),
      description: t('features.real_time_analytics.description'),
      color: 'green'
    },
    {
      icon: Crown,
      title: t('features.custom_branded_links.title'),
      description: t('features.custom_branded_links.description'),
      color: 'purple',
      isPro: true
    },
    {
      icon: Shield,
      title: t('features.url_safety.title'),
      description: t('features.url_safety.description'),
      color: 'red'
    },
    {
      icon: QrCode,
      title: t('features.qr_generation.title'),
      description: t('features.qr_generation.description'),
      color: 'indigo'
    },
    {
      icon: Eye,
      title: t('features.link_preview.title'),
      description: t('features.link_preview.description'),
      color: 'yellow'
    },
    {
      icon: Smartphone,
      title: t('features.mobile_optimized.title'),
      description: t('features.mobile_optimized.description'),
      color: 'pink'
    },
    {
      icon: Clock,
      title: t('features.link_management.title'),
      description: t('features.link_management.description'),
      color: 'teal'
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
      indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
      pink: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400',
      teal: 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('features.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${getColorClasses(feature.color)}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                {feature.isPro && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <Crown className="h-3 w-3 mr-1" />
                    {t('shortener.pro_feature')}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('features.ready_to_start')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('features.ready_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('hero.create_free_account')}
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg rounded-lg transition-colors"
            >
              {t('hero.go_to_dashboard')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}