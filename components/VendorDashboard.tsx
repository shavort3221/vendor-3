"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "./DashboardHeader"
import ProductCatalog from "./ProductCatalog"
import OrderHistory from "./OrderHistory"
import NotificationPanel from "./NotificationPanel"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { ShoppingCart, Package, TrendingUp, IndianRupee, Bell, BarChart3 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("products")
  const { getTotalItems, getTotalAmount } = useCart()
  const { profile } = useAuth()

  // Mock data for dashboard stats
  const stats = [
    {
      title: "Cart Items",
      value: getTotalItems(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Cart Total",
      value: formatCurrency(getTotalAmount()),
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: "12",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "This Month",
      value: formatCurrency(25000),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {profile?.full_name || "Vendor"}!</h1>
          <p className="text-gray-600">Manage your orders, browse products, and grow your business.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductCatalog />
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationPanel />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-500">Track your business performance and insights</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
