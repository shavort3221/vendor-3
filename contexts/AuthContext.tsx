"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  id: string
  user_id: string
  business_name: string | null
  phone: string | null
  address: string | null
  user_type: "vendor" | "supplier" | null
  created_at: string
  updated_at: string
}

interface AuthUser extends User {
  profile?: Profile
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", authUser.id).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      }

      setUser({ ...authUser, profile: profile || undefined })
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            user_id: data.user.id,
            business_name: null,
            phone: null,
            address: null,
            user_type: null,
          },
        ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }

        toast({
          title: "Account Created",
          description: "Please check your email to verify your account",
        })
      }

      return { error: null }
    } catch (error) {
      console.error("Sign up error:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in",
      })

      return { error: null }
    } catch (error) {
      console.error("Sign in error:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast({
          title: "Error",
          description: "Failed to sign out",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out",
        })
      }
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      // Update local user state
      setUser({ ...user, profile: data })

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      })

      return { error: null }
    } catch (error) {
      console.error("Update profile error:", error)
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
