import React from 'react'
import { FileText, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function TermsOfService() {
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
              <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The terms and conditions for using urlz.lat
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> January 15, 2025
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using urlz.lat ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.</p>

            <h2>2. Description of Service</h2>
            <p>urlz.lat is a URL shortening service that allows users to:</p>
            <ul>
              <li>Create shortened versions of long URLs</li>
              <li>Track click analytics and statistics</li>
              <li>Generate QR codes for links</li>
              <li>Create custom branded links (Pro feature)</li>
              <li>Manage and organize links through a dashboard</li>
            </ul>

            <h2>3. User Accounts</h2>
            
            <h3>3.1 Account Creation</h3>
            <p>To access certain features, you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h3>3.2 Account Termination</h3>
            <p>You may terminate your account at any time. We may terminate or suspend your account if you violate these Terms.</p>

            <h2>4. Acceptable Use</h2>
            
            <h3>4.1 Permitted Uses</h3>
            <p>You may use the Service for legitimate purposes, including:</p>
            <ul>
              <li>Shortening URLs for personal or business use</li>
              <li>Tracking link performance and analytics</li>
              <li>Creating QR codes for marketing materials</li>
              <li>Managing link campaigns</li>
            </ul>

            <h3>4.2 Prohibited Uses</h3>
            <p>You may not use the Service to:</p>
            <ul>
              <li>Shorten URLs that link to illegal, harmful, or malicious content</li>
              <li>Distribute spam, malware, or phishing links</li>
              <li>Violate intellectual property rights</li>
              <li>Harass, abuse, or harm others</li>
              <li>Circumvent security measures or access restrictions</li>
              <li>Use automated tools to create excessive links</li>
              <li>Resell or redistribute the Service without permission</li>
            </ul>

            <h2>5. Content and Conduct</h2>
            
            <h3>5.1 User Content</h3>
            <p>You retain ownership of URLs and content you submit. By using the Service, you grant us a license to:</p>
            <ul>
              <li>Store and process your URLs and associated data</li>
              <li>Provide analytics and reporting features</li>
              <li>Ensure service functionality and security</li>
            </ul>

            <h3>5.2 Content Monitoring</h3>
            <p>We reserve the right to:</p>
            <ul>
              <li>Monitor links for compliance with these Terms</li>
              <li>Remove or disable links that violate our policies</li>
              <li>Use automated systems to detect harmful content</li>
            </ul>

            <h2>6. Subscription Plans</h2>
            
            <h3>6.1 Free Plan</h3>
            <p>Our free plan includes basic URL shortening and analytics features with certain limitations.</p>

            <h3>6.2 Pro Plan</h3>
            <p>Pro subscribers receive additional features including:</p>
            <ul>
              <li>Custom branded links</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
              <li>Higher usage limits</li>
            </ul>

            <h3>6.3 Billing and Payments</h3>
            <ul>
              <li>Subscription fees are billed in advance</li>
              <li>All fees are non-refundable unless required by law</li>
              <li>We may change pricing with 30 days notice</li>
              <li>Failure to pay may result in service suspension</li>
            </ul>

            <h2>7. Privacy and Data Protection</h2>
            <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>

            <h2>8. Intellectual Property</h2>
            
            <h3>8.1 Our Rights</h3>
            <p>The Service, including its design, functionality, and content, is owned by DunaTech and protected by intellectual property laws.</p>

            <h3>8.2 Your Rights</h3>
            <p>You retain all rights to the URLs and content you submit, subject to the license granted to us for service provision.</p>

            <h2>9. Service Availability</h2>
            <p>We strive to maintain high availability but cannot guarantee uninterrupted service. We may:</p>
            <ul>
              <li>Perform maintenance that temporarily affects service</li>
              <li>Modify or discontinue features with notice</li>
              <li>Suspend service for security or legal reasons</li>
            </ul>

            <h2>10. Disclaimers</h2>
            <p>The Service is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including:</p>
            <ul>
              <li>Merchantability and fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
              <li>Accuracy or reliability of the Service</li>
              <li>Uninterrupted or error-free operation</li>
            </ul>

            <h2>11. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, DunaTech shall not be liable for:</p>
            <ul>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages exceeding the amount paid for the Service</li>
              <li>Third-party actions or content</li>
            </ul>

            <h2>12. Indemnification</h2>
            <p>You agree to indemnify and hold harmless DunaTech from claims arising from:</p>
            <ul>
              <li>Your use of the Service</li>
              <li>Violation of these Terms</li>
              <li>Infringement of third-party rights</li>
              <li>Your content or conduct</li>
            </ul>

            <h2>13. Governing Law</h2>
            <p>These Terms are governed by the laws of California, United States, without regard to conflict of law principles. Any disputes will be resolved in the courts of San Francisco, California.</p>

            <h2>14. Changes to Terms</h2>
            <p>We may modify these Terms at any time. We will notify users of significant changes via email or through the Service. Continued use after changes constitutes acceptance of the modified Terms.</p>

            <h2>15. Contact Information</h2>
            <p>For questions about these Terms, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> legal@urlz.lat</li>
              <li><strong>Support:</strong> support@urlz.lat</li>
              <li><strong>Address:</strong> DunaTech, Santiago, Región Metropolitana, Chile</li>
            </ul>

            <hr />
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By using urlz.lat, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}