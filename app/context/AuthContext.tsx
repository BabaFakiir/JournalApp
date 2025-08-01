import { AuthError, AuthResponse, User } from '@supabase/supabase-js'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface AuthContextType {
    user: User | null
    loading: boolean
    signUp: (email: string, password: string) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>
    signIn: (email: string, password: string) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>
    signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signIn: async () => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => ({ error: null }),
})

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setLoading(false)
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
            setUser(session?.user ?? null)
        }
        )

        return () => subscription?.unsubscribe()
    }, [])

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
        email,
        password,
        })
        return { data, error }
    }

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        })
        return { data, error }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    }

    const value = {
        user,
        signUp,
        signIn,
        signOut,
        loading,
    }

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    )
}