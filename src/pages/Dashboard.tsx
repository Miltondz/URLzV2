import React, { useState } from 'react'
import { useEffect } from 'react'
import Papa from 'papaparse'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { ShortenerForm } from '../components/ShortenerForm'
import { LinkList } from '../components/LinkList'
import { MostActiveLinks } from '../components/MostActiveLinks'
import { BarChart3, Link2, TrendingUp, Download } from 'lucide-react'

interface DashboardStats {
  totalLinks: number
  totalClicks: number
  avgClicks: number
}

interface Link {
  id: string
  long_url: string
  short_code: string | null
  custom_slug: string | null
  clicks: number
  created_at: string
}

export function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [topLinks, setTopLinks] = useState<Link[]>([])
  const [allLinks, setAllLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch stats with proper authorization headers
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No active session')
      }

      const { data, error } = await supabase.functions.invoke('get-dashboard-stats', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })
      
      if (error) {
        console.error('Stats function error:', error)
        throw new Error(error.message || 'Failed to fetch stats')
      }
      
      // Ensure we have valid stats data
      if (data && typeof data === 'object') {
        setStats({
          totalLinks: data.total_links || 0,
          totalClicks: data.total_clicks || 0,
          avgClicks: data.avg_clicks || 0
        })
      } else {
        // Fallback: calculate stats from links data
        const { data: linksData, error: linksError } = await supabase
          .from('urls')
          .select('clicks')
        
        if (!linksError && linksData) {
          const totalLinks = linksData.length
          const totalClicks = linksData.reduce((sum, link) => sum + (link.clicks || 0), 0)
          const avgClicks = totalLinks > 0 ? totalClicks / totalLinks : 0
          
          setStats({
            totalLinks,
            totalClicks,
            avgClicks
          })
        } else {
          throw new Error('Failed to fetch stats data')
        }
      }

      // Fetch all links
      const { data: linksData, error: linksError } = await supabase
        .from('urls')
        .select('id, long_url, short_code, custom_slug, clicks, created_at, is_verified, qr_code_path')
        .order('created_at', { ascending: false })

      if (linksError) throw linksError
      setAllLinks(linksData || [])

      // Set top 5 links from the fetched data
      const sortedByClicks = [...(linksData || [])].sort((a, b) => b.clicks - a.clicks)
      setTopLinks(sortedByClicks.slice(0, 5))

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setError(error instanceof Error ? error.message : 'Failed to load dashboard stats')
      // Set fallback stats on error
      setStats({
        totalLinks: 0,
        totalClicks: 0,
        avgClicks: 0
      })
      setAllLinks([])
      setTopLinks([])
    } finally {
      setLoading(false)
    }
  }

  const refetchData = () => {
    fetchAllData()
  }

  // Handle new link creation
  const handleNewLink = (newLinkData?: any) => {
    // Always refetch all data to ensure stats are updated
    refetchData()
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Authentication required</p>
          <a href="/login" className="text-blue-600 hover:text-blue-800">Go to Login</a>
        </div>
      </div>
    )
  }

  // Stats loading state - return loading indicator
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage your shortened URLs
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-lg">
              <p className="font-medium">Error loading dashboard</p>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={() => {
                  setError(null)
                  fetchAllData()
                }}
                className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                <div className="animate-pulse flex items-center">
                  <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg w-12 h-12"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Form */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Most Active Links */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
                <div className="flex space-x-4 overflow-x-auto">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-64 h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading Link List */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage your shortened URLs
          </p>
        </div>

        {/* 1. Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Links Card - Blue */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-t-blue-500 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Link2 className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Links</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats?.totalLinks?.toLocaleString() ?? '0'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Total Clicks Card - Green */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-t-green-500 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats?.totalClicks?.toLocaleString() ?? '0'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Avg Clicks Card - Indigo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-t-indigo-500 sm:col-span-2 lg:col-span-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Clicks</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats?.avgClicks?.toFixed(1) ?? '0.0'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Shortener Form - Full Width */}
        <div className="mb-6 sm:mb-8">
          <ShortenerForm onSuccess={handleNewLink} refetchStats={refetchData} />
        </div>

        {/* 3. Most Active Links - Full Width */}
        <div className="mb-6 sm:mb-8">
          <MostActiveLinks links={topLinks} />
        </div>

        {/* 4. Link List - Full Width */}
        <div>
          <LinkList links={allLinks} refetchStats={refetchData} />
        </div>
      </div>
    </div>
  )
}