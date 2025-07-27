"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Star,
  CheckCircle,
  ArrowRight,
  Zap
} from "lucide-react"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-3xl">VendorMitra Demo Guide</CardTitle>
            </div>
            <p className="text-gray-600 text-lg">
              Complete B2B Marketplace for Indian Street Food Ecosystem
            </p>
            <Badge className="w-fit mx-auto mt-2" variant="outline">
              🏆 Hackathon Ready
            </Badge>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-green-600" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Test Setup</h4>
                <Button asChild className="w-full" size="sm">
                  <a href="/test-setup">Create Demo Accounts</a>
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">2. Authentication Test</h4>
                <Button asChild className="w-full" size="sm" variant="outline">
                  <a href="/test">Test Login/Signup</a>
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">3. Live Demo</h4>
                <Button asChild className="w-full" size="sm" variant="outline">
                  <a href="/">Go to Homepage</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Demo Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Vendor Accounts</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">Raj's Chaat Corner</div>
                    <div className="text-gray-600">vendor1@test.com</div>
                    <div className="text-gray-500">Password: Test123!</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">Delhi Dosa Point</div>
                    <div className="text-gray-600">vendor2@test.com</div>
                    <div className="text-gray-500">Password: Test123!</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Supplier Accounts</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">Mumbai Fresh Vegetables Ltd</div>
                    <div className="text-gray-600">supplier1@test.com</div>
                    <div className="text-gray-500">Password: Test123!</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">Delhi Spice Traders</div>
                    <div className="text-gray-600">supplier2@test.com</div>
                    <div className="text-gray-500">Password: Test123!</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Role-based Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-green-600" />
                <span className="text-sm">Product Catalog Management</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Order Management System</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Analytics Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Rating & Review System</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Profile Management</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Scenarios */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Demo Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="vendor" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vendor" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Vendor Experience
                </TabsTrigger>
                <TabsTrigger value="supplier" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Supplier Experience
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vendor" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">1. Vendor Registration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                          <span>Click "Join Now" on homepage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                          <span>Select "Vendor" role</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                          <span>Fill business details</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                          <span>Complete profile setup</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">2. Vendor Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span>Browse marketplace products</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span>Add items to cart</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span>View order history</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span>Manage suppliers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span>Join group orders</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="supplier" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">1. Supplier Registration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                          <span>Click "Join Now" on homepage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                          <span>Select "Supplier" role</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                          <span>Enter company details & GST</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                          <span>Complete verification</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">2. Supplier Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span>Manage incoming orders</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span>Update product catalog</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span>View analytics & revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span>Manage vendor relationships</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span>Track order status</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Technical Stack */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Technical Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="font-semibold text-blue-600">Frontend</div>
                <div className="text-sm text-gray-600">Next.js 15 + React 19</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="font-semibold text-green-600">Backend</div>
                <div className="text-sm text-gray-600">Supabase + PostgreSQL</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="font-semibold text-purple-600">UI</div>
                <div className="text-sm text-gray-600">Tailwind + shadcn/ui</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="font-semibold text-orange-600">Auth</div>
                <div className="text-sm text-gray-600">Supabase Auth</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="w-full" size="lg">
                <a href="/test-setup">
                  <Play className="h-4 w-4 mr-2" />
                  Setup Demo Accounts
                </a>
              </Button>
              <Button asChild className="w-full" size="lg" variant="outline">
                <a href="/">
                  <Users className="h-4 w-4 mr-2" />
                  Start Demo
                </a>
              </Button>
              <Button asChild className="w-full" size="lg" variant="outline">
                <a href="/test">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Test Authentication
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
