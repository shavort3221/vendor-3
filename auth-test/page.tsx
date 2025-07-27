"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { 
  Users, 
  Package, 
  LogIn, 
  UserPlus, 
  CheckCircle, 
  XCircle,
  Loader2,
  ArrowRight,
  Home
} from "lucide-react"
import Link from "next/link"

export default function AuthTestPage() {
  const { user, signIn, signUp, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [userType, setUserType] = useState<"vendor" | "supplier">("vendor")
  const [loading, setLoading] = useState(false)
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (activeTab === "login") {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          toast.error(error)
        } else {
          toast.success("Login successful! Redirecting to dashboard...")
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
          toast.success("Registration successful! Please check your email to verify your account.")
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

  const quickLogin = async (email: string, password: string) => {
    setFormData({ ...formData, email, password })
    setLoading(true)
    
    try {
      const { error } = await signIn(email, password)
      if (error) {
        toast.error(error)
      } else {
        toast.success("Quick login successful!")
      }
    } catch (error) {
      toast.error("Quick login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    toast.success("Logged out successfully")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl flex items-center justify-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              VendorMitra Authentication Test
            </CardTitle>
            <p className="text-gray-600">
              Test login and signup functionality for vendors and suppliers
            </p>
          </CardHeader>
        </Card>

        {/* Current User Status */}
        {user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Currently Logged In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Email: {user.email}</p>
                  <p className="text-gray-600">Role: {user.role}</p>
                  {user.profile && (
                    <p className="text-gray-600">
                      Business: {user.profile.company_name || user.profile.business_name}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                  <Button asChild>
                    <Link href="/dashboard">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Authentication Forms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeTab === "login" ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                {activeTab === "login" ? "Login" : "Sign Up"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Login
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-4">
                  <div className="mb-4">
                    <Label>User Type</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant={userType === "vendor" ? "default" : "outline"}
                        onClick={() => setUserType("vendor")}
                        className="flex-1"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Vendor
                      </Button>
                      <Button
                        type="button"
                        variant={userType === "supplier" ? "default" : "outline"}
                        onClick={() => setUserType("supplier")}
                        className="flex-1"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Supplier
                      </Button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="business-name">
                        {userType === "vendor" ? "Business Name" : "Company Name"}
                      </Label>
                      <Input
                        id="business-name"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        placeholder={userType === "vendor" ? "e.g., Raj's Chaat Corner" : "e.g., Mumbai Fresh Vegetables Ltd"}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter address"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          placeholder="State"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        placeholder="Enter pincode"
                        required
                      />
                    </div>
                    {userType === "vendor" && (
                      <div>
                        <Label htmlFor="food-type">Food Type</Label>
                        <Input
                          id="food-type"
                          value={formData.foodType}
                          onChange={(e) => handleInputChange("foodType", e.target.value)}
                          placeholder="e.g., Chaat, South Indian, Street Food"
                          required
                        />
                      </div>
                    )}
                    {userType === "supplier" && (
                      <div>
                        <Label htmlFor="gst">GST Number</Label>
                        <Input
                          id="gst"
                          value={formData.gstNumber}
                          onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                          placeholder="e.g., 27ABCDE1234F1Z5"
                          required
                        />
                      </div>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Sign Up as {userType === "vendor" ? "Vendor" : "Supplier"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Quick Test Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Quick Test Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Vendor Accounts</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded border">
                    <div className="font-medium">Raj's Chaat Corner</div>
                    <div className="text-sm text-gray-600">vendor1@test.com</div>
                    <div className="text-sm text-gray-500">Password: Test123!</div>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => quickLogin("vendor1@test.com", "Test123!")}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                      Quick Login
                    </Button>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border">
                    <div className="font-medium">Delhi Dosa Point</div>
                    <div className="text-sm text-gray-600">vendor2@test.com</div>
                    <div className="text-sm text-gray-500">Password: Test123!</div>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => quickLogin("vendor2@test.com", "Test123!")}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                      Quick Login
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Supplier Accounts</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 rounded border">
                    <div className="font-medium">Mumbai Fresh Vegetables Ltd</div>
                    <div className="text-sm text-gray-600">supplier1@test.com</div>
                    <div className="text-sm text-gray-500">Password: Test123!</div>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => quickLogin("supplier1@test.com", "Test123!")}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                      Quick Login
                    </Button>
                  </div>
                  <div className="p-3 bg-green-50 rounded border">
                    <div className="font-medium">Delhi Spice Traders</div>
                    <div className="text-sm text-gray-600">supplier2@test.com</div>
                    <div className="text-sm text-gray-500">Password: Test123!</div>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => quickLogin("supplier2@test.com", "Test123!")}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                      Quick Login
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Homepage
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/demo">
                  <Users className="h-4 w-4 mr-2" />
                  Demo Guide
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/test-setup">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Setup Demo Accounts
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
