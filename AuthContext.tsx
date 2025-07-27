"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import type { VendorProfile, SupplierProfile } from "@/lib/supabase"

interface AuthUser extends User {
  profile?: VendorProfile | SupplierProfile
  role?: "vendor" | "supplier"
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: string; success?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error?: string; success?: boolean }>
  signOut: () => Promise<void>
  updateProfile: (data: any) => Promise<{ error?: string; success?: boolean }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setLoading(false)
          return
        }

        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          setUser(null)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error in auth state change:", error)
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser: User) => {
    try {
      setLoading(true)

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error loading profile:", profileError)
        setUser(authUser)
        setLoading(false)
        return
      }

      if (profile) {
        // Get role-specific profile
        let roleProfile = null
        if (profile.role === "vendor") {
          const { data, error } = await supabase.from("vendor_profiles").select("*").eq("user_id", authUser.id).single()

          if (!error) roleProfile = data
        } else if (profile.role === "supplier") {
          const { data, error } = await supabase
            .from("supplier_profiles")
            .select("*")
            .eq("user_id", authUser.id)
            .single()

          if (!error) roleProfile = data
        }

        setUser({
          ...authUser,
          role: profile.role,
          profile: roleProfile,
        })
      } else {
        setUser(authUser)
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      setUser(authUser)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: data.user.id,
          role: userData.role,
        })

        if (profileError && profileError.code !== '23505') { // Ignore duplicate key errors
          console.error("Profile creation error:", profileError)
          return { error: "Failed to create profile" }
        }

        // Create role-specific profile
        if (userData.role === "vendor") {
          const { error: vendorError } = await supabase.from("vendor_profiles").insert({
            user_id: data.user.id,
            business_name: userData.businessName,
            food_type: userData.foodType || "",
            location: userData.address,
            phone: userData.phone,
            city: userData.city,
            state: userData.state,
            pincode: userData.pincode || "",
            verification_status: false,
            rating: 0,
          })

          if (vendorError && vendorError.code !== '23505') { // Ignore duplicate key errors
            console.error("Vendor profile creation error:", vendorError)
            return { error: "Failed to create vendor profile" }
          }
        } else if (userData.role === "supplier") {
          const { error: supplierError } = await supabase.from("supplier_profiles").insert({
            user_id: data.user.id,
            company_name: userData.businessName,
            gst_number: userData.gstNumber || "",
            address: userData.address,
            city: userData.city,
            state: userData.state,
            pincode: userData.pincode || "",
            phone: userData.phone,
            verification_status: false,
            rating: 0,
          })

          if (supplierError && supplierError.code !== '23505') { // Ignore duplicate key errors
            console.error("Supplier profile creation error:", supplierError)
            return { error: "Failed to create supplier profile" }
          }
        }

        return { success: true }
      }

      return { error: "Registration failed" }
    } catch (error: any) {
      console.error("SignUp error:", error)
      return { error: error.message || "Registration failed" }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        return { success: true }
      }

      return { error: "Login failed" }
    } catch (error: any) {
      console.error("SignIn error:", error)
      return { error: error.message || "Login failed" }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("SignOut error:", error)
      }
    } catch (error) {
      console.error("SignOut error:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: any) => {
    try {
      if (!user) return { error: "No user logged in" }

      const tableName = user.role === "vendor" ? "vendor_profiles" : "supplier_profiles"

      const { error } = await supabase.from(tableName).update(data).eq("user_id", user.id)

      if (error) {
        return { error: error.message }
      }

      // Reload profile
      await loadUserProfile(user)

      return { success: true }
    } catch (error: any) {
      console.error("UpdateProfile error:", error)
      return { error: error.message || "Profile update failed" }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
