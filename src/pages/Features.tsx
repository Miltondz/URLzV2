import React from 'react'
import { Link2, BarChart3, Shield, Zap, Globe, Crown, Smartphone, Clock } from 'lucide-react'

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
      title: 'Enterprise Security',
      description: 'Bank-level security with SSL encryption, fraud protection, and 99.9% uptime guarantee.',
      color: 'red'
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Lightning-fast redirects worldwide with our globally distributed content delivery network.',
      color: 'indigo'
    },
    {
      icon: Zap,
      title: 'Instant Generation',
      description: 'Generate shortened URLs in milliseconds with our optimized infrastructure and caching.',
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
      description: 'Organize, edit, and manage all your links from a centralized dashboard with bulk operations.',
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

        {/* Pricing Tiers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Start free and upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Free</h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">$0</div>
                <div className="text-gray-500 dark:text-gray-400">per month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Unlimited URL shortening
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Basic analytics
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Standard support
                </li>
              </ul>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-blue-500 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Pro</h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">$9</div>
                <div className="text-gray-500 dark:text-gray-400">per month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Everything in Free
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Custom branded links
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Upgrade to Pro
              </button>
            </div>

            {/* Business Plan */}
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Business</h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">$29</div>
                <div className="text-gray-500 dark:text-gray-400">per month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Everything in Pro
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Team collaboration
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  API access
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  24/7 support
                </li>
              </ul>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}