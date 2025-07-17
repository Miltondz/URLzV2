import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Globe, Monitor, MapPin, Calendar, BarChart3 } from 'lucide-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

interface ClickData {
  id: string
  ip_address: string
  country: string
  city: string
  browser_name: string
  os_name: string
  device_type: string
  clicked_at: string
}

interface UrlData {
  id: string
  long_url: string
  short_code: string | null
  custom_slug: string | null
  clicks: number
}

export function AnalyticsDetailPage() {
  const { linkId } = useParams<{ linkId: string }>()
  const [urlData, setUrlData] = useState<UrlData | null>(null)
  const [clicksData, setClicksData] = useState<ClickData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!linkId) return

      try {
        // Fetch URL data
        const { data: urlInfo, error: urlError } = await supabase
          .from('urls')
          .select('id, long_url, short_code, custom_slug, clicks')
          .eq('id', linkId)
          .single()

        if (urlError) throw urlError
        setUrlData(urlInfo)

        // Fetch clicks analytics
        const { data: clicksInfo, error: clicksError } = await supabase
          .from('clicks_log')
          .select('*')
          .eq('url_id', linkId)
          .order('created_at', { ascending: false })

        if (clicksError) throw clicksError
        setClicksData(clicksInfo || [])

      } catch (error) {
        console.error('Error fetching analytics:', error)
        setError(error instanceof Error ? error.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [linkId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !urlData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'URL not found'}</p>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const browserData = clicksData.reduce((acc, click) => {
    const browser = click.browser_name || 'Unknown'
    acc[browser] = (acc[browser] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const countryData = clicksData.reduce((acc, click) => {
    const country = click.country || 'Unknown'
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const browserChartData = {
    labels: Object.keys(browserData),
    datasets: [{
      data: Object.values(browserData),
      backgroundColor: [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }

  const countryChartData = {
    labels: Object.keys(countryData),
    datasets: [{
      label: 'Clicks by Country',
      data: Object.values(countryData),
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1
    }]
  }

  // Prepare map data (group by country for markers)
  const mapData = Object.entries(countryData).map(([country, count]) => ({
    country,
    count,
    // Simple coordinate mapping for demo - in production, use proper geocoding
    lat: country === 'United States' ? 39.8283 : 
         country === 'United Kingdom' ? 55.3781 :
         country === 'Germany' ? 51.1657 :
         country === 'France' ? 46.2276 : 0,
    lng: country === 'United States' ? -98.5795 :
         country === 'United Kingdom' ? -3.4360 :
         country === 'Germany' ? 10.4515 :
         country === 'France' ? 2.2137 : 0
  })).filter(item => item.lat !== 0 && item.lng !== 0)

  const code = urlData.custom_slug || urlData.short_code
  const shortUrl = `${window.location.origin}/${code}`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* CSS Grid Container */}
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
        {/* Header */}
        <div className="col-span-1">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Link Analytics
            </h1>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Short URL:</strong> 
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 ml-2">
                  {shortUrl}
                </a>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Destination:</strong> 
                <a href={urlData.long_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 ml-2 break-all">
                  {urlData.long_url}
                </a>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Total Clicks:</strong> {urlData.clicks}
              </p>
            </div>
          </div>
        </div>

        {clicksData.length === 0 ? (
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full"></div>
                </div>
                <div className="relative flex items-center justify-center">
                  <BarChart3 className="h-20 w-20 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No Clicks to Analyze... Yet!
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Share your short link to start gathering insights about your audience and their behavior.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Your Link:
                </h4>
                <code className="text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-blue-600 dark:text-blue-400 break-all">
                  {shortUrl}
                </code>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <p className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Real-time click tracking</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Geographic insights</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Device & browser analytics</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Main Content Grid - Two Columns on Desktop */}
            <div className="col-span-1 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Left Column - Geographic Map (60% width) */}
              <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Geographic Distribution
                </h2>
              </div>
              <div className="h-80 lg:h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {mapData.map((location, index) => (
                    <Marker key={index} position={[location.lat, location.lng]}>
                      <Popup>
                        <div className="text-center">
                          <strong>{location.country}</strong>
                          <br />
                          {location.count} clicks
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

              {/* Right Column - Charts (40% width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Browser Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Monitor className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Browsers
                  </h2>
                </div>
                <div className="h-48 lg:h-56 flex items-center justify-center">
                  <Pie data={browserChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>

                {/* Country Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Countries
                  </h2>
                </div>
                <div className="h-48 lg:h-56">
                  <Bar 
                    data={countryChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { stepSize: 1 }
                        }
                      }
                    }} 
                  />
                </div>
              </div>
              </div>
            </div>

            {/* Bottom Row - Recent Clicks Table (Full Width) */}
            <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-5 w-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Clicks
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Browser
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Device
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {clicksData.slice(0, 10).map((click) => (
                      <tr key={click.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {new Date(click.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {(() => {
                            const location = [click.city, click.country].filter(Boolean).join(', ')
                            return location || 'Unknown'
                          })()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {(click.browser_name || 'Unknown')} on {(click.os_name || 'Unknown')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {click.device_type || 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  )
}