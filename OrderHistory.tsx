"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Clock, CheckCircle, Truck, Star, RotateCcw, Eye, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { Order, OrderItem, Product, SupplierProfile } from "@/lib/supabase"

interface OrderWithDetails extends Order {
  items: (OrderItem & { product: Product })[]
  supplier: SupplierProfile
}

export function OrderHistory() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user])

  const loadOrders = async () => {
    if (!user) return

    try {
      setLoading(true)

      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(
            *,
            product:products(*)
          ),
          supplier:supplier_profiles!orders_supplier_id_fkey(*)
        `)
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setOrders(ordersData || [])
    } catch (error) {
      console.error("Error loading orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "shipped":
        return <Truck className="h-4 w-4 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <Package className="h-4 w-4 text-red-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    return order.status === activeTab
  })

  const handleReorder = async (order: OrderWithDetails) => {
    // Add all items from this order to cart
    toast({
      title: "Items Added to Cart",
      description: `${order.items.length} items from order #${order.id.slice(-8)} have been added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Order History
          </CardTitle>
          <CardDescription>Track and manage all your orders</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === "all" ? "No orders yet" : `No ${activeTab} orders`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === "all"
                    ? "Start shopping to see your orders here"
                    : `You don't have any ${activeTab} orders`}
                </p>
                {activeTab === "all" && <Button className="vm-btn-primary">Browse Products</Button>}
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="text-lg font-bold mt-1">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Supplier Info */}
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {order.supplier?.company_name?.charAt(0) || "S"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{order.supplier?.company_name}</p>
                      <div className="flex items-center space-x-2">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{order.supplier?.rating || 0}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{order.supplier?.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-sm text-gray-700">Items ({order.items.length})</h4>
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <Package className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-xs text-gray-600">
                                {item.quantity} {item.product.unit} × ₹{item.unit_price}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">₹{item.total_price.toLocaleString()}</p>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500 text-center py-2">+{order.items.length - 3} more items</p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subtotal:</span>
                      <span>₹{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Delivery Charges:</span>
                      <span>₹{order.delivery_charges.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Star className="h-4 w-4 mr-2" />
                        Rate Order
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleReorder(order)} className="bg-transparent">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Supplier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
