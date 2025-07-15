import React, { useState } from 'react'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ShortenerForm } from '../components/ShortenerForm'
import { LinkList } from '../components/LinkList'
import { BarChart3, Link2, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalLinks: number
  totalClicks: number
  avgClicks: number
}

export function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [stats, setStats] = useState<DashboardStats>({
    totalLinks: 0,
    totalClicks: 0,
    avgClicks: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    fetchStats() // Refresh stats when a new URL is created
  }

  const fetchStats = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.access_token) {
        throw new Error('No valid session')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-dashboard-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [refreshTrigger])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage your shortened URLs
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Link2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Links</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {isLoadingStats ? '-' : stats.totalLinks.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {isLoadingStats ? '-' : stats.totalClicks.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Clicks</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {isLoadingStats ? '-' : stats.avgClicks.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ShortenerForm onSuccess={handleSuccess} />
          </div>
          <div className="lg:col-span-2">
            <LinkList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  )
}