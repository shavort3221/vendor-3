"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, IndianRupee, Clock, AlertCircle, Users, Star, BarChart3, Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardHeader } from "@/components/DashboardHeader"
import { ProductCatalog } from "@/components/ProductCatalog"
import { SupplierOrderManager } from "@/components/SupplierOrderManager"
import { SupplierAnalytics } from "@/components/SupplierAnalytics"

// Mock data for supplier dashboard
const mockProducts = [
  { id: "1", name: "Fresh Onions", price: 30, unit: "kg", stock: 500, minOrder: 10, category: "Vegetables" },
  { id: "2", name: "Potatoes", price: 25, unit: "kg", stock: 300, minOrder: 15, category: "Vegetables" },
  { id: "3", name: "Tomatoes", price: 40, unit: "kg", stock: 200, minOrder: 10, category: "Vegetables" },
  { id: "4", name: "Sunflower Oil", price: 120, unit: "liter", stock: 100, minOrder: 5, category: "Oil" },
  { id: "5", name: "Garam Masala", price: 200, unit: "kg", stock: 50, minOrder: 2, category: "Spices" },
]

const mockIncomingOrders = [
  {
    id: "ORD001",
    vendor: "Kumar Chaat Corner",
    vendorLocation: "Connaught Place, Delhi",
    items: [
      { name: "Onions", quantity: 25, unit: "kg", price: 30 },
      { name: "Potatoes", quantity: 20, unit: "kg", price: 25 },
    ],
    total: 1250,
    status: "pending",
    orderDate: "2024-01-18",
    requestedDelivery: "2024-01-19",
    isGroupOrder: true,
    groupSize: 3,
    distance: "2.5 km",
  },
  {
    id: "ORD002",
    vendor: "Sharma Street Food",
    vendorLocation: "Karol Bagh, Delhi",
    items: [
      { name: "Tomatoes", quantity: 15, unit: "kg", price: 40 },
      { name: "Sunflower Oil", quantity: 5, unit: "liter", price: 120 },
    ],
    total: 1200,
    status: "accepted",
    orderDate: "2024-01-17",
    requestedDelivery: "2024-01-18",
    isGroupOrder: false,
    distance: "4.2 km",
  },
]

export function SupplierDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const totalProducts = mockProducts.length
  const lowStockProducts = mockProducts.filter((product) => product.stock < 50).length
  const pendingOrders = mockIncomingOrders.filter((order) => order.status === "pending").length
  const monthlyRevenue = 125000

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}! 📦</h1>
          <p className="text-gray-600">
            {user?.businessName} • {user?.location.city}
          </p>
          <div className="flex items-center mt-2">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{user?.rating}</span>
            <span className="text-sm text-gray-500 ml-1">supplier rating</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">In your catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">Need restocking</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Incoming Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Incoming Orders</span>
                  <Badge variant="secondary">{pendingOrders} pending</Badge>
                </CardTitle>
                <CardDescription>New orders from vendors in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockIncomingOrders.map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{order.id}</span>
                            {order.isGroupOrder && (
                              <Badge variant="secondary" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                Group ({order.groupSize} vendors)
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium">{order.vendor}</p>
                          <p className="text-xs text-gray-500">
                            {order.vendorLocation} • {order.distance}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">₹{order.total}</div>
                          <Badge variant={order.status === "pending" ? "outline" : "default"}>{order.status}</Badge>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {order.items.map((item, index) => (
                          <span key={index}>
                            {item.name} ({item.quantity} {item.unit}){index < order.items.length - 1 && ", "}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Delivery: {order.requestedDelivery}</span>
                        {order.status === "pending" && (
                          <div className="space-x-2">
                            <Button size="sm" variant="outline">
                              Decline
                            </Button>
                            <Button size="sm">Accept Order</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    Update Inventory
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Orders This Week</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Rating</span>
                      <span className="font-medium">4.8 ⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">On-time Delivery</span>
                      <span className="font-medium text-green-600">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Response Time</span>
                      <span className="font-medium">&lt; 2 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="catalog">
            <ProductCatalog products={mockProducts} />
          </TabsContent>

          <TabsContent value="orders">
            <SupplierOrderManager orders={mockIncomingOrders} />
          </TabsContent>

          <TabsContent value="analytics">
            <SupplierAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
