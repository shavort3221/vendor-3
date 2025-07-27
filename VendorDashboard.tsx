"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Star,
  Users,
  IndianRupee,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { DashboardHeader } from "@/components/DashboardHeader"
import { ProductDiscovery } from "@/components/ProductDiscovery"
import { OrderHistory } from "@/components/OrderHistory"
import { GroupOrders } from "@/components/GroupOrders"
import { supabase } from "@/lib/supabase"

export function VendorDashboard() {
  const { user } = useAuth()
  const { totalItems, totalAmount } = useCart()
  const { unreadCount } = useNotifications()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    monthlySpend: 0,
    savedAmount: 0,
  })

  useEffect(() => {
    if (user) {
      loadDashboardStats()
    }
  }, [user])

  const loadDashboardStats = async () => {
    if (!user) return

    try {
      // Load order statistics
      const { data: orders } = await supabase.from("orders").select("*").eq("vendor_id", user.id)

      if (orders) {
        const totalOrders = orders.length
        const pendingOrders = orders.filter((order) => order.status === "pending").length
        const monthlySpend = orders
          .filter((order) => {
            const orderDate = new Date(order.created_at)
            const now = new Date()
            return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
          })
          .reduce((sum, order) => sum + order.total, 0)

        setStats({
          totalOrders,
          pendingOrders,
          monthlySpend,
          savedAmount: monthlySpend * 0.2, // Assume 20% savings
        })
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.profile?.business_name || "Vendor"}! 👋
          </h1>
          <p className="text-gray-600">
            {user?.profile?.city}, {user?.profile?.state}
          </p>

          {user?.profile?.verification_status === "pending" && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">Your account verification is pending</span>
                <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                  Complete Verification
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <IndianRupee className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.monthlySpend.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Saved</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₹{stats.savedAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Through group orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Cart Summary */}
        {totalItems > 0 && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">{totalItems} items in your cart</h3>
                    <p className="text-blue-700">Total: ₹{totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Cart
                  </Button>
                  <Button size="sm" className="vm-btn-primary">
                    Checkout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="groups">Group Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Smart recommendations based on your business patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📈 Demand Forecast</h4>
                    <p className="text-blue-800 text-sm">
                      Onion prices expected to rise 15% next week. Consider bulk ordering now.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">💡 Smart Suggestion</h4>
                    <p className="text-green-800 text-sm">
                      Join the group order for spices closing in 4 hours to save ₹300.
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">⚠️ Stock Alert</h4>
                    <p className="text-orange-800 text-sm">Based on your usage, you'll need cooking oil in 3 days.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start vm-btn-primary">
                    <Package className="mr-2 h-4 w-4" />
                    Browse Products
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Join Group Order
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Star className="mr-2 h-4 w-4" />
                    Rate Recent Orders
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Order delivered successfully</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Joined group order for vegetables</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New supplier available in your area</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <ProductDiscovery />
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>

          <TabsContent value="groups">
            <GroupOrders />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your business profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="vm-form-label">Business Name</label>
                      <p className="text-gray-900">{user?.profile?.business_name}</p>
                    </div>
                    <div>
                      <label className="vm-form-label">Food Type</label>
                      <p className="text-gray-900">{user?.profile?.food_type}</p>
                    </div>
                  </div>
                  <div>
                    <label className="vm-form-label">Location</label>
                    <p className="text-gray-900">{user?.profile?.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-600">Email Verified</span>
                  </div>
                  <Button className="vm-btn-primary">Update Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
