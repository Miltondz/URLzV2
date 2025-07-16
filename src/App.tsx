import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { AuthComponent } from './components/Auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Features } from './pages/Features'
import { Contact } from './pages/Contact'
import { Dashboard } from './pages/Dashboard'
import { ProfilePage } from './pages/ProfilePage'
import { AnalyticsDetailPage } from './pages/AnalyticsDetailPage'
import { AnalyticsDetailPage } from './pages/AnalyticsDetailPage'
import { Redirect } from './pages/Redirect'
import { useAuth } from './contexts/AuthContext'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <AuthComponent />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/analytics/:linkId" 
            element={
              <ProtectedRoute>
                <AnalyticsDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/analytics/:linkId" 
            element={
              <ProtectedRoute>
                <AnalyticsDetailPage />
              </ProtectedRoute>
            } 
          />
          {/* Catch-all route for short codes */}
          <Route path="/:shortCode" element={<Redirect />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App