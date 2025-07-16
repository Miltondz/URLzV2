import React, { useState, useEffect } from 'react'
import { Shield, FileText, Loader } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export function TransparencyPage() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransparencyPolicy = async () => {
      try {
        const response = await fetch('/transparency.md')
        if (!response.ok) {
          throw new Error('Failed to load transparency policy')
        }
        const text = await response.text()
        setContent(text)
      } catch (error) {
        console.error('Error loading transparency policy:', error)
        setError('Failed to load transparency policy')
        // Fallback content
        setContent(`
# Transparency Policy

## Our Commitment to Transparency

At urlz.lat, we believe in complete transparency about how we operate, collect data, and protect our users.

## Data Collection

We collect minimal data necessary to provide our URL shortening service:

- **Link Data**: Original URLs, shortened codes, and click statistics
- **Analytics Data**: Anonymous click data including geographic location, browser type, and device information
- **Account Data**: Email address for authentication purposes only

## Data Usage

Your data is used exclusively for:

- Providing URL shortening services
- Generating analytics and insights for your links
- Improving our service quality and performance

## Data Protection

We implement industry-standard security measures:

- All data is encrypted in transit and at rest
- Regular security audits and updates
- Strict access controls and monitoring

## Third-Party Services

We use the following third-party services:

- **Supabase**: Database and authentication services
- **Google Safe Browsing API**: URL safety verification
- **IP Geolocation Services**: Anonymous location data for analytics

## Your Rights

You have the right to:

- Access your data at any time through your dashboard
- Delete your account and all associated data
- Export your link data
- Contact us with any privacy concerns

## Contact Us

For any questions about our transparency policy or data practices, please contact us at privacy@urlz.lat.

---

*Last updated: ${new Date().toLocaleDateString()}*
        `)
      } finally {
        setLoading(false)
      }
    }

    fetchTransparencyPolicy()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading transparency policy...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Transparency Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our commitment to openness, data protection, and user privacy
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-8 sm:p-12">
            {error ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Unable to Load Policy
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900 dark:text-white">
                        {children}
                      </strong>
                    ),
                    hr: () => (
                      <hr className="border-gray-200 dark:border-gray-700 my-8" />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Questions About Our Transparency Policy?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We're here to help. Contact us if you have any questions or concerns.
            </p>
            <a
              href="mailto:privacy@urlz.lat"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Contact Privacy Team
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}