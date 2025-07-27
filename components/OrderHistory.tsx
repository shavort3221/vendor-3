"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Order } from "@/lib/supabase"
import { Package, Clock, CheckCircle, XCircle, Truck, Calendar, MapPin, Phone, Mail, Loader2 } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { toast } from "sonner"

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-100", label: "Confirmed" },
  processing: { icon: Package, color: "text-purple-600", bg: "bg-purple-100", label: "Processing" },
  shipped: { icon: Truck, color: "text-indigo-600", bg: "bg-indigo-100", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: "Cancelled" },
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user, activeTab])

  const fetchOrders = async () => {
    if (!user) return

    try {
      setLoading(true)

      let query = supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              image_url,
              unit
            )
          ),
          supplier_profiles!orders_supplier_id_fkey (
            company_name,
            contact_person,
            phone,
            email,
            city,
            state
          )
        `)
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false })

      // Apply status filter
      if (activeTab !== "all") {
        query = query.eq("status", activeTab)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching orders:", error)
        toast.error("Failed to load orders")
        return
      }

      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId)
        .eq("vendor_id", user?.id)

      if (error) {
        console.error("Error cancelling order:", error)
        toast.error("Failed to cancel order")
        return
      }

      toast.success("Order cancelled successfully")
      fetchOrders()
    } catch (error) {
      console.error("Error cancelling order:", error)
      toast.error("Failed to cancel order")
    }
  }

  const getOrderTotal = (order: Order) => {
    return order.order_items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0
  }

  const getOrderItemsCount = (order: Order) => {
    return order.order_items?.reduce((total, item) => total + item.quantity, 0) || 0
  }

  const canCancelOrder = (order: Order) => {
    return order.status === "pending" || order.status === "confirmed"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Track your orders and view purchase history</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {activeTab === "all" ? "You haven't placed any orders yet" : `No ${activeTab} orders found`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package
                const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
                const supplierInfo = order.supplier_profiles as any

                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                            <Badge variant="secondary" className={`${statusInfo?.color} ${statusInfo?.bg}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo?.label}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(order.created_at)}
                            </span>
                            <span className="flex items-center">
                              <Package className="h-4 w-4 mr-1" />
                              {getOrderItemsCount(order)} items
                            </span>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(getOrderTotal(order))}
                          </div>
                          {canCancelOrder(order) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              className="mt-2 text-red-600 hover:text-red-700"
                            >
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Supplier Information */}
                      {supplierInfo && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Supplier Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">{supplierInfo.company_name}</p>
                              <p className="text-gray-600">{supplierInfo.contact_person}</p>
                            </div>
                            <div className="space-y-1">
                              {supplierInfo.phone && (
                                <p className="flex items-center text-gray-600">
                                  <Phone className="h-3 w-3 mr-2" />
                                  {supplierInfo.phone}
                                </p>
                              )}
                              {supplierInfo.email && (
                                <p className="flex items-center text-gray-600">
                                  <Mail className="h-3 w-3 mr-2" />
                                  {supplierInfo.email}
                                </p>
                              )}
                              {supplierInfo.city && supplierInfo.state && (
                                <p className="flex items-center text-gray-600">
                                  <MapPin className="h-3 w-3 mr-2" />
                                  {supplierInfo.city}, {supplierInfo.state}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.order_items?.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 bg-white border rounded-lg">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {item.products?.image_url ? (
                                  <img
                                    src={item.products.image_url || "/placeholder.svg"}
                                    alt={item.products.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.products?.name || "Product")}`
                                    }}
                                  />
                                ) : (
                                  <Package className="h-8 w-8 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {item.products?.name || "Unknown Product"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity} {item.products?.unit || "units"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                                <p className="text-sm text-gray-600">
                                  Total: {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Information */}
                      {order.delivery_address && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                          <p className="text-sm text-gray-700">{order.delivery_address}</p>
                          {order.delivery_date && (
                            <p className="text-sm text-gray-600 mt-1">
                              Expected delivery: {formatDate(order.delivery_date)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Order Notes */}
                      {order.notes && (
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Order Notes</h4>
                          <p className="text-sm text-gray-700">{order.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
