import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    setLoading(true)
    try {
      // Clear local state immediately to prevent UI issues
      setUser(null)
      setSession(null)
      
      // Call Supabase signOut
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Supabase signOut error:', error)
        // Don't throw error - we've already cleared local state
      }
      
      // Clear any remaining local storage data
      try {
        localStorage.removeItem('supabase.auth.token')
        localStorage.removeItem('sb-' + Deno.env.get('VITE_SUPABASE_URL')?.split('//')[1]?.split('.')[0] + '-auth-token')
        sessionStorage.clear()
      } catch (storageError) {
        console.warn('Error clearing storage:', storageError)
      }
      
    } catch (error) {
      console.error('Error during sign out:', error)
      // State is already cleared, so logout is still effective
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}