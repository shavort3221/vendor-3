"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "./DashboardHeader"
import InventoryManager from "./InventoryManager"
import OrderHistory from "./OrderHistory"
import NotificationPanel from "./NotificationPanel"
import { useAuth } from "@/contexts/AuthContext"
import {
  Package,
  TrendingUp,
  Users,
  IndianRupee,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell,
  BarChart3,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState("inventory")
  const { profile } = useAuth()

  // Mock data for supplier stats
  const stats = [
    {
      title: "Total Products",
      value: "24",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+2 this week",
    },
    {
      title: "Active Orders",
      value: "8",
      icon: ShoppingBag,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "3 pending",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(45000),
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+12% from last month",
    },
    {
      title: "Total Customers",
      value: "156",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+8 new this month",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Sharma Food Corner",
      items: 3,
      amount: 2500,
      status: "pending",
      time: "2 hours ago",
    },
    {
      id: "ORD-002",
      customer: "Delhi Street Foods",
      items: 5,
      amount: 4200,
      status: "confirmed",
      time: "4 hours ago",
    },
    {
      id: "ORD-003",
      customer: "Mumbai Vendors",
      items: 2,
      amount: 1800,
      status: "shipped",
      time: "1 day ago",
    },
    {
      id: "ORD-004",
      customer: "Bangalore Foods",
      items: 4,
      amount: 3600,
      status: "delivered",
      time: "2 days ago",
    },
  ]

  const lowStockProducts = [
    { name: "Premium Basmati Rice", stock: 5, unit: "bags" },
    { name: "Refined Oil", stock: 8, unit: "bottles" },
    { name: "Red Chili Powder", stock: 3, unit: "packets" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />
      case "confirmed":
        return <CheckCircle className="h-3 w-3" />
      case "shipped":
        return <Package className="h-3 w-3" />
      case "delivered":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.business_name || profile?.full_name || "Supplier"}!
          </h1>
          <p className="text-gray-600">Manage your inventory, fulfill orders, and grow your supplier business.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="inventory" className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Inventory</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4" />
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

              <TabsContent value="inventory">
                <InventoryManager />
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
                  <p className="text-gray-500">Track your sales performance and business insights</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from your customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{order.id}</p>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{order.customer}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {order.items} items • {formatCurrency(order.amount)}
                        </p>
                        <p className="text-xs text-gray-400">{order.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setActiveTab("orders")}>
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>Products running low on inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStockProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-600">
                        Only {product.stock} {product.unit} left
                      </p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      Low Stock
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setActiveTab("inventory")}>
                  Manage Inventory
                </Button>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Orders Fulfilled</span>
                  <span className="text-sm font-medium">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="text-sm font-medium">{formatCurrency(45000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Customers</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Order Value</span>
                  <span className="text-sm font-medium">{formatCurrency(1875)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
