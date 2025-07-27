"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Upload, Users, Package } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  type: "login" | "register"
  userType: "vendor" | "supplier"
  onTypeChange: (type: "login" | "register") => void
  onUserTypeChange: (type: "vendor" | "supplier") => void
}

export function AuthModal({ isOpen, onClose, type, userType, onTypeChange, onUserTypeChange }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    businessName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    foodType: "",
  })
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (type === "login") {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          toast.error(error)
        } else {
          toast.success("Welcome back! You have been successfully logged in.")
          onClose()
          router.push("/dashboard")
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          role: userType,
          businessName: formData.businessName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          gstNumber: formData.gstNumber,
          foodType: formData.foodType,
        })

        if (error) {
          toast.error(error)
        } else {
          toast.success("Registration Successful! Please check your email to verify your account.")
          onClose()
          router.push("/dashboard")
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {type === "login" ? "Welcome Back to VendorMitra" : "Join VendorMitra Today"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={type} onValueChange={(value) => onTypeChange(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Join Now</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="vm-form-input"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className="vm-form-input"
                  required
                />
              </div>

              <Button type="submit" className="w-full vm-btn-primary" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-sm text-blue-600">
                  Forgot your password?
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <div className="mb-4">
              <Label className="vm-form-label">I want to join as:</Label>
              <Tabs value={userType} onValueChange={(value) => onUserTypeChange(value as "vendor" | "supplier")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="vendor" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Vendor
                  </TabsTrigger>
                  <TabsTrigger value="supplier" className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    Supplier
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className="vm-form-input"
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
                    className="vm-form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create a strong password"
                  className="vm-form-input"
                  required
                />
              </div>

              <div>
                <Label htmlFor="businessName">{userType === "vendor" ? "Business Name" : "Company Name"}</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder={userType === "vendor" ? "Kumar Chaat Corner" : "Fresh Vegetables Supply Co."}
                  className="vm-form-input"
                  required
                />
              </div>

              {userType === "vendor" && (
                <div>
                  <Label htmlFor="foodType">Food Specialization</Label>
                  <Select onValueChange={(value) => handleInputChange("foodType", value)}>
                    <SelectTrigger className="vm-form-input">
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

              {userType === "supplier" && (
                <div>
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                    className="vm-form-input"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Shop/Warehouse address"
                  className="vm-form-input"
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
                    className="vm-form-input"
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
                    className="vm-form-input"
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
                    className="vm-form-input"
                    required
                  />
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upload Business Documents</p>
                <p className="text-xs text-gray-500">
                  {userType === "vendor" ? "Business license, ID proof" : "GST certificate, Trade license"}
                </p>
              </div>

              <Button type="submit" className="w-full vm-btn-primary" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
