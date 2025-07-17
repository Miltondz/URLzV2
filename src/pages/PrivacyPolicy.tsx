import React from 'react'
import { Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Back Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            How we collect, use, and protect your personal information
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> January 15, 2025
            </p>

            <h2>1. Information We Collect</h2>
            
            <h3>1.1 Account Information</h3>
            <p>When you create an account, we collect:</p>
            <ul>
              <li>Email address (for authentication)</li>
              <li>Account preferences and settings</li>
              <li>Subscription status and billing information</li>
            </ul>

            <h3>1.2 Link Data</h3>
            <p>When you use our URL shortening service, we collect:</p>
            <ul>
              <li>Original URLs you want to shorten</li>
              <li>Custom slugs you create (Pro users)</li>
              <li>Creation timestamps and metadata</li>
            </ul>

            <h3>1.3 Analytics Data</h3>
            <p>To provide analytics, we collect anonymous data about link clicks:</p>
            <ul>
              <li>Geographic location (country and city)</li>
              <li>Browser type and version</li>
              <li>Operating system information</li>
              <li>Device type (desktop, mobile, tablet)</li>
              <li>Referrer information</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            
            <h3>2.1 Service Provision</h3>
            <ul>
              <li>Creating and managing shortened URLs</li>
              <li>Providing click tracking and analytics</li>
              <li>User authentication and account management</li>
              <li>Customer support and communication</li>
            </ul>

            <h3>2.2 Service Improvement</h3>
            <ul>
              <li>Analyzing usage patterns to improve performance</li>
              <li>Developing new features based on user needs</li>
              <li>Ensuring service reliability and security</li>
            </ul>

            <h2>3. Information Sharing</h2>
            
            <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in these limited circumstances:</p>
            
            <h3>3.1 Service Providers</h3>
            <p>We work with trusted third-party service providers:</p>
            <ul>
              <li><strong>Supabase:</strong> Database hosting and authentication</li>
              <li><strong>Google Safe Browsing:</strong> URL safety verification</li>
              <li><strong>Netlify:</strong> Website hosting and content delivery</li>
            </ul>

            <h3>3.2 Legal Requirements</h3>
            <p>We may disclose information when required by law or to:</p>
            <ul>
              <li>Comply with legal processes</li>
              <li>Protect our rights and property</li>
              <li>Ensure user safety and security</li>
            </ul>

            <h2>4. Data Security</h2>
            
            <p>We implement industry-standard security measures:</p>
            <ul>
              <li><strong>Encryption:</strong> All data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li><strong>Access Controls:</strong> Strict role-based access with authentication</li>
              <li><strong>Monitoring:</strong> 24/7 security monitoring and incident response</li>
              <li><strong>Regular Audits:</strong> Quarterly security assessments</li>
            </ul>

            <h2>5. Your Rights</h2>
            
            <p>You have the following rights regarding your data:</p>
            <ul>
              <li><strong>Access:</strong> View all your data through your dashboard</li>
              <li><strong>Correction:</strong> Update your account information</li>
              <li><strong>Deletion:</strong> Delete your account and all associated data</li>
              <li><strong>Portability:</strong> Export your data in a portable format</li>
              <li><strong>Objection:</strong> Opt out of non-essential data processing</li>
            </ul>

            <h2>6. Data Retention</h2>
            
            <ul>
              <li><strong>Active Accounts:</strong> Data retained while account is active</li>
              <li><strong>Deleted Accounts:</strong> 30-day grace period, then permanent deletion</li>
              <li><strong>Analytics Data:</strong> Retained for 2 years or until account deletion</li>
              <li><strong>Legal Requirements:</strong> May be retained longer if required by law</li>
            </ul>

            <h2>7. Cookies and Tracking</h2>
            
            <p>We use minimal cookies for:</p>
            <ul>
              <li>Authentication and session management</li>
              <li>User preferences and settings</li>
              <li>Basic analytics and performance monitoring</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            
            <p>Our service is not intended for users under 13. We do not knowingly collect personal information from children under 13. If we discover such information, we will delete it immediately.</p>

            <h2>9. International Data Transfers</h2>
            
            <p>Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place, including:</p>
            <ul>
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions where applicable</li>
              <li>Additional safeguards for sensitive data</li>
            </ul>

            <h2>10. Changes to This Policy</h2>
            
            <p>We may update this privacy policy from time to time. We will notify you of significant changes via email or through our service. Continued use of our service after changes constitutes acceptance of the updated policy.</p>

            <h2>11. Contact Us</h2>
            
            <p>If you have questions about this privacy policy or our data practices, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> privacy@urlz.lat</li>
              <li><strong>Support:</strong> support@urlz.lat</li>
              <li><strong>Address:</strong> DunaTech, Santiago, Región Metropolitana, Chile</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}