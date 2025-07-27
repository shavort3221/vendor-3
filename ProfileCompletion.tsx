"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, Users, Package } from "lucide-react"

export function ProfileCompletion() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<"vendor" | "supplier">("vendor")
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    foodType: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    try {
      // First, create the profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: user.id,
        role: userType,
      })

      if (profileError && profileError.code !== '23505') {
        throw profileError
      }

      // Then create the role-specific profile
      if (userType === "vendor") {
        const { error } = await supabase.from("vendor_profiles").insert({
          user_id: user.id,
          business_name: formData.businessName,
          food_type: formData.foodType || "",
          location: formData.address,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          verification_status: false,
          rating: 0,
        })

        if (error && error.code !== '23505') {
          throw error
        }
      } else {
        const { error } = await supabase.from("supplier_profiles").insert({
          user_id: user.id,
          company_name: formData.businessName,
          gst_number: formData.gstNumber || "",
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
          verification_status: false,
          rating: 0,
        })

        if (error && error.code !== '23505') {
          throw error
        }
      }

      toast.success("Profile completed successfully!")
      window.location.reload() // Refresh to load the dashboard
    } catch (error: any) {
      console.error("Profile completion error:", error)
      toast.error(error.message || "Failed to complete profile")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Welcome to VendorMitra! Please complete your profile to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <Label className="text-base font-medium">I want to join as:</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Button
                  type="button"
                  variant={userType === "vendor" ? "default" : "outline"}
                  onClick={() => setUserType("vendor")}
                  className="h-16 flex flex-col items-center justify-center"
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span>Vendor</span>
                </Button>
                <Button
                  type="button"
                  variant={userType === "supplier" ? "default" : "outline"}
                  onClick={() => setUserType("supplier")}
                  className="h-16 flex flex-col items-center justify-center"
                >
                  <Package className="h-6 w-6 mb-2" />
                  <span>Supplier</span>
                </Button>
              </div>
            </div>

            {/* Business Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">
                  {userType === "vendor" ? "Business Name" : "Company Name"}
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder={userType === "vendor" ? "Kumar Chaat Corner" : "Fresh Vegetables Supply Co."}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            {/* Vendor-specific fields */}
            {userType === "vendor" && (
              <div>
                <Label htmlFor="foodType">Food Specialization</Label>
                <Select onValueChange={(value) => handleInputChange("foodType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chaat">Chaat & Snacks</SelectItem>
                    <SelectItem value="beverages">Beverages</SelectItem>
                    <SelectItem value="sweets">Sweets & Desserts</SelectItem>
                    <SelectItem value="meals">Full Meals</SelectItem>
                    <SelectItem value="street-food">General Street Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Supplier-specific fields */}
            {userType === "supplier" && (
              <div>
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
            )}

            {/* Address Information */}
            <div>
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Shop/Warehouse address"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Delhi"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Delhi"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  placeholder="110001"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
