"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Download, ArrowRight, Home } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { instamojoService } from "@/lib/instamojo"
import Link from "next/link"
import { toast } from "sonner"

interface OrderDetails {
  id: string
  vendor_id: string
  supplier_id: string
  subtotal: number
  delivery_charges: number
  total: number
  status: string
  payment_status: string
  payment_id: string
  created_at: string
  order_items: any[]
  vendor_profile?: any
  supplier_profile?: any
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const paymentId = searchParams.get("payment_id")
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*),
          vendor_profile:vendor_profiles!orders_vendor_id_fkey(*),
          supplier_profile:supplier_profiles!orders_supplier_id_fkey(*)
        `)
        .eq("id", orderId)
        .single()

      if (error) {
        console.error("Error fetching order:", error)
        toast.error("Failed to load order details")
      } else {
        setOrderDetails(order)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to load order details")
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = () => {
    if (!orderDetails) return

    const invoiceData = {
      invoiceNumber: `INV-${orderDetails.id.slice(-8)}`,
      date: new Date(orderDetails.created_at).toLocaleDateString(),
      vendor: orderDetails.vendor_profile?.business_name || "Vendor",
      supplier: orderDetails.supplier_profile?.company_name || "Supplier",
      items: orderDetails.order_items,
      subtotal: orderDetails.subtotal,
      deliveryCharges: orderDetails.delivery_charges,
      total: orderDetails.total,
      paymentId: orderDetails.payment_id
    }

    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], {
      type: "application/json"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${orderDetails.id.slice(-8)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Invoice downloaded successfully")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">The order details could not be loaded.</p>
            <Button asChild>
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600">Payment Successful!</CardTitle>
            <p className="text-gray-600 mt-2">
              Your order has been confirmed and payment has been processed successfully.
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">{orderDetails.id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-medium">{orderDetails.payment_id?.slice(-8) || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {new Date(orderDetails.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={orderDetails.status === "confirmed" ? "default" : "secondary"}>
                    {orderDetails.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Items Ordered</p>
                <div className="space-y-2">
                  {orderDetails.order_items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.product_name || "Product"}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{item.unit_price}
                        </p>
                      </div>
                      <p className="font-medium">₹{item.total_price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{orderDetails.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span>₹{orderDetails.delivery_charges}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{orderDetails.total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Vendor</h4>
                <p className="text-gray-600">
                  {orderDetails.vendor_profile?.business_name || "Vendor"}
                </p>
                <p className="text-sm text-gray-500">
                  {orderDetails.vendor_profile?.location || "Location not specified"}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Supplier</h4>
                <p className="text-gray-600">
                  {orderDetails.supplier_profile?.company_name || "Supplier"}
                </p>
                <p className="text-sm text-gray-500">
                  {orderDetails.supplier_profile?.address || "Address not specified"}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">What's Next?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Supplier will be notified of your order</li>
                  <li>• You'll receive updates on order processing</li>
                  <li>• Delivery will be arranged by the supplier</li>
                  <li>• You can track your order in the dashboard</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={downloadInvoice} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button asChild>
                <Link href="/dashboard">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
