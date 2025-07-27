"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/AuthContext"
import { ChefHat, Truck, Loader2, Phone, MapPin, Building } from "lucide-react"

export default function ProfileCompletion() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    business_name: "",
    phone: "",
    address: "",
    user_type: "" as "vendor" | "supplier" | "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.user_type) return

    setLoading(true)

    try {
      await updateProfile(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold gradient-text">VendorMitra</span>
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>Help us set up your account to provide the best experience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">I am a:</Label>
              <RadioGroup
                value={formData.user_type}
                onValueChange={(value) => handleInputChange("user_type", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="vendor" id="vendor" />
                  <Label htmlFor="vendor" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <ChefHat className="h-6 w-6 text-orange-600" />
                    <div>
                      <div className="font-medium">Street Food Vendor</div>
                      <div className="text-sm text-gray-500">I sell food and need suppliers</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="supplier" id="supplier" />
                  <Label htmlFor="supplier" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <Truck className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-medium">Supplier</div>
                      <div className="text-sm text-gray-500">I supply ingredients to vendors</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business_name" className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>Business Name</span>
                </Label>
                <Input
                  id="business_name"
                  placeholder={
                    formData.user_type === "vendor" ? "e.g., Kumar's Street Food" : "e.g., Fresh Supplies Co."
                  }
                  value={formData.business_name}
                  onChange={(e) => handleInputChange("business_name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone Number</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Business Address</span>
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete business address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                loading || !formData.user_type || !formData.business_name || !formData.phone || !formData.address
              }
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
