"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, XCircle, Truck, Package, Users, MapPin, Calendar, IndianRupee } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, Order, OrderItem } from "@/lib/supabase"
import { toast } from "sonner"

interface SupplierOrderManagerProps {
  orders?: any[]
}

interface OrderWithItems extends Order {
  items: OrderItem[]
  vendor_profile?: {
    business_name: string
    location: string
    city: string
    phone: string
  }
}

export function SupplierOrderManager({ orders: initialOrders }: SupplierOrderManagerProps) {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders)
      setLoading(false)
    } else {
      fetchOrders()
    }
  }, [initialOrders])

  const fetchOrders = async () => {
    try {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          vendor_profile:vendor_profiles!orders_vendor_id_fkey(
            business_name,
            location,
            city,
            phone
          )
        `)
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', orderId)

      if (error) throw error
      toast.success('Order accepted successfully')
      fetchOrders()
    } catch (error) {
      console.error('Error accepting order:', error)
      toast.error('Failed to accept order')
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          notes: rejectionReason
        })
        .eq('id', orderId)

      if (error) throw error
      toast.success('Order rejected successfully')
      setRejectionReason("")
      setIsDialogOpen(false)
      fetchOrders()
    } catch (error) {
      console.error('Error rejecting order:', error)
      toast.error('Failed to reject order')
    }
  }

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
      toast.success(`Order status updated to ${status}`)
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "outline" as const, icon: Clock, color: "text-orange-600" },
      confirmed: { variant: "default" as const, icon: CheckCircle, color: "text-blue-600" },
      shipped: { variant: "default" as const, icon: Truck, color: "text-purple-600" },
      delivered: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      cancelled: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === "pending") return order.status === "pending"
    if (activeTab === "active") return ["confirmed", "shipped"].includes(order.status)
    if (activeTab === "completed") return order.status === "delivered"
    if (activeTab === "cancelled") return order.status === "cancelled"
    return true
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Loading orders...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>Manage incoming orders from vendors</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({orders.filter(o => o.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Active ({orders.filter(o => ["confirmed", "shipped"].includes(o.status)).length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({orders.filter(o => o.status === "delivered").length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Cancelled ({orders.filter(o => o.status === "cancelled").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === "pending" && "No pending orders to review"}
                  {activeTab === "active" && "No active orders"}
                  {activeTab === "completed" && "No completed orders"}
                  {activeTab === "cancelled" && "No cancelled orders"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <IndianRupee className="h-4 w-4" />
                              ₹{order.total.toLocaleString()}
                            </span>
                          </CardDescription>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Vendor Details</h4>
                          <div className="space-y-1 text-sm">
                            <p className="font-medium">{order.vendor_profile?.business_name || 'Unknown Vendor'}</p>
                            <p className="flex items-center gap-1 text-gray-600">
                              <MapPin className="h-3 w-3" />
                              {order.vendor_profile?.location}, {order.vendor_profile?.city}
                            </p>
                            {order.vendor_profile?.phone && (
                              <p className="text-gray-600">📞 {order.vendor_profile.phone}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Order Items</h4>
                          <div className="space-y-2">
                            {order.items?.map((item: OrderItem, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.product_id}</span>
                                <span className="text-gray-600">
                                  {item.quantity} × ₹{item.unit_price} = ₹{item.total_price}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span>Subtotal:</span>
                              <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Delivery:</span>
                              <span>₹{order.delivery_charges}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                              <span>Total:</span>
                              <span>₹{order.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {order.status === "pending" && (
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button
                            onClick={() => handleAcceptOrder(order.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept Order
                          </Button>
                          <Dialog open={isDialogOpen && selectedOrder?.id === order.id} onOpenChange={(open) => {
                            setIsDialogOpen(open)
                            if (!open) setSelectedOrder(null)
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedOrder(order)}
                                className="flex-1"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject Order
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Order</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting this order.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                                  <Textarea
                                    id="rejection-reason"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Enter reason for rejection..."
                                    rows={3}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsDialogOpen(false)
                                    setSelectedOrder(null)
                                    setRejectionReason("")
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleRejectOrder(order.id)}
                                  variant="destructive"
                                >
                                  Reject Order
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}

                      {order.status === "confirmed" && (
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button
                            onClick={() => handleUpdateStatus(order.id, "shipped")}
                            className="flex-1"
                          >
                            <Truck className="mr-2 h-4 w-4" />
                            Mark as Shipped
                          </Button>
                        </div>
                      )}

                      {order.status === "shipped" && (
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button
                            onClick={() => handleUpdateStatus(order.id, "delivered")}
                            className="flex-1"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Delivered
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
