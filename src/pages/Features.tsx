import React from 'react'
import { Link2, BarChart3, Shield, Zap, Globe, Crown, Smartphone, Clock, Eye, QrCode } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Link2,
      title: 'Smart URL Shortening',
      description: 'Create short, memorable links instantly with our advanced algorithm that generates unique codes.',
      color: 'blue'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track clicks, analyze audience behavior, and get detailed insights with interactive charts and maps.',
      color: 'green'
    },
    {
      icon: Crown,
      title: 'Custom Branded Links',
      description: 'Create custom slugs that reflect your brand and make your links more memorable and trustworthy.',
      color: 'purple',
      isPro: true
    },
    {
      icon: Shield,
      title: 'URL Safety Verification',
      description: 'Automatic URL safety checking using Google Safe Browsing API to protect users from malicious links.',
      color: 'red'
    },
    {
      icon: QrCode,
      title: 'QR Code Generation',
      description: 'Automatically generate QR codes for all your links with download and sharing capabilities.',
      color: 'indigo'
    },
    {
      icon: Eye,
      title: 'Link Preview',
      description: 'Safe preview of destination URLs before clicking, showing page title, description, and favicon.',
      color: 'yellow'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Fully responsive design that works perfectly on all devices, from desktop to mobile.',
      color: 'pink'
    },
    {
      icon: Clock,
      title: 'Link Management',
      description: 'Organize, edit, and manage all your links from a centralized dashboard with search and pagination.',
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
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover all the tools and capabilities that make urlz.lat the perfect choice for your link management needs.
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
                    PRO
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
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust urlz.lat for their link management needs. Start shortening and tracking your URLs today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Free Account
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg rounded-lg transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}