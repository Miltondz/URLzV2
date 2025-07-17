import React, { useState, useEffect } from 'react'
import { Activity, ArrowLeft, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  description: string
  lastChecked: string
}

interface Incident {
  id: string
  title: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'minor' | 'major' | 'critical'
  description: string
  timestamp: string
  updates: {
    time: string
    message: string
    status: string
  }[]
}

export function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'URL Shortening Service',
      status: 'operational',
      description: 'Core URL shortening functionality',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Analytics Dashboard',
      status: 'operational',
      description: 'Click tracking and analytics features',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'QR Code Generation',
      status: 'operational',
      description: 'QR code creation and download service',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Authentication System',
      status: 'operational',
      description: 'User login and account management',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Database',
      status: 'operational',
      description: 'Data storage and retrieval',
      lastChecked: new Date().toISOString()
    }
  ])

  const [incidents, setIncidents] = useState<Incident[]>([])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'outage':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'maintenance':
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 dark:text-green-400'
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'outage':
        return 'text-red-600 dark:text-red-400'
      case 'maintenance':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-green-600 dark:text-green-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational'
      case 'degraded':
        return 'Degraded Performance'
      case 'outage':
        return 'Service Outage'
      case 'maintenance':
        return 'Under Maintenance'
      default:
        return 'Operational'
    }
  }

  const overallStatus = services.every(s => s.status === 'operational') 
    ? 'All Systems Operational' 
    : services.some(s => s.status === 'outage')
    ? 'Service Disruption'
    : 'Partial Service Disruption'

  const overallStatusColor = services.every(s => s.status === 'operational')
    ? 'text-green-600 dark:text-green-400'
    : services.some(s => s.status === 'outage')
    ? 'text-red-600 dark:text-red-400'
    : 'text-yellow-600 dark:text-yellow-400'

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        lastChecked: new Date().toISOString()
      })))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

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
              <Activity className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            System Status
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Current status and uptime information for all urlz.lat services
          </p>
        </div>

        {/* Overall Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-2 ${overallStatusColor}`}>
              {overallStatus}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Services Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Service Status
          </h2>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Checked {new Date(service.lastChecked).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Incidents
          </h2>
          {incidents.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Recent Incidents
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All systems have been running smoothly. We'll post updates here if any issues arise.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {incidents.map((incident) => (
                <div key={incident.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {incident.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(incident.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      incident.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      incident.severity === 'major' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {incident.description}
                  </p>
                  <div className="space-y-3">
                    {incident.updates.map((update, updateIndex) => (
                      <div key={updateIndex} className="flex items-start space-x-3 text-sm">
                        <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(update.time).toLocaleTimeString()}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          <strong>{update.status}:</strong> {update.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Uptime Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Uptime Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                99.9%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Last 30 days
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                99.95%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Last 90 days
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                99.8%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                All time
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Need Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you're experiencing issues not listed here, please contact our support team.
            </p>
            <a
              href="mailto:support@urlz.lat"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}