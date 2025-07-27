"use client"

import { useAuth } from "@/contexts/AuthContext"
import { LandingPage } from "@/components/LandingPage"
import { VendorDashboard } from "@/components/VendorDashboard"
import { SupplierDashboard } from "@/components/SupplierDashboard"
import { ProfileCompletion } from "@/components/ProfileCompletion"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  // Check if profile is complete
  const profile = user.profile
  const isProfileComplete = profile && profile.business_name && profile.phone && profile.address && profile.user_type

  if (!isProfileComplete) {
    return <ProfileCompletion />
  }

  // Render appropriate dashboard based on user type
  if (profile.user_type === "vendor") {
    return <VendorDashboard />
  } else if (profile.user_type === "supplier") {
    return <SupplierDashboard />
  }

  return <LandingPage />
}
