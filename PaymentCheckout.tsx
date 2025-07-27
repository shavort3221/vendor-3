"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Package,
  Truck,
  Calculator
} from "lucide-react"
import { instamojoService } from "@/lib/instamojo"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

interface CartItem {
  id: string
  name: string
  quantity: number
  unit_price: number
  total_price: number
  supplier_id: string
  supplier_name: string
}

interface PaymentCheckoutProps {
  items: CartItem[]
  deliveryCharges?: number
  onPaymentSuccess?: (paymentData: any) => void
  onPaymentFailure?: (error: string) => void
  groupOrderId?: string
}

export function PaymentCheckout({ 
  items, 
  deliveryCharges = 0, 
  onPaymentSuccess, 
  onPaymentFailure,
  groupOrderId 
}: PaymentCheckoutProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [buyerDetails, setBuyerDetails] = useState({
    name: user?.profile?.business_name || "",
    email: user?.email || "",
    phone: user?.profile?.phone || ""
  })

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0)
  const total = subtotal + deliveryCharges
  const fees = instamojoService.calculateFees(total)
  const commission = instamojoService.calculateCommission(total)
  const finalTotal = total + fees

  // Group items by supplier
  const itemsBySupplier = items.reduce((acc, item) => {
    if (!acc[item.supplier_id]) {
      acc[item.supplier_id] = {
        supplier_name: item.supplier_name,
        items: []
      }
    }
    acc[item.supplier_id].items.push(item)
    return acc
  }, {} as Record<string, { supplier_name: string; items: CartItem[] }>)

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to proceed with payment")
      return
    }

    // Validate buyer details
    if (!buyerDetails.name || !buyerDetails.email || !buyerDetails.phone) {
      toast.error("Please fill in all buyer details")
      return
    }

    setLoading(true)

    try {
      // Create order in database first
      const orderData = {
        vendor_id: user.id,
        supplier_id: Object.keys(itemsBySupplier)[0], // For now, handle single supplier
        subtotal,
        delivery_charges: deliveryCharges,
        total: finalTotal,
        status: "pending",
        payment_status: "pending",
        notes: groupOrderId ? `Group Order: ${groupOrderId}` : "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Create order items
      const orderItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        created_at: new Date().toISOString()
      }))

      // Create payment request
      const paymentData = {
        orderId: `ORDER_${Date.now()}`,
        items: orderItems,
        buyerDetails,
        deliveryCharges,
        groupOrderId
      }

      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create payment request")
      }

      if (result.success && result.payment_url) {
        // Redirect to Instamojo payment page
        window.location.href = result.payment_url
      } else {
        throw new Error("Payment URL not received")
      }

    } catch (error) {
      console.error("Payment error:", error)
      const errorMessage = error instanceof Error ? error.message : "Payment failed"
      toast.error(errorMessage)
      onPaymentFailure?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setBuyerDetails(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Checkout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-4">
              {Object.entries(itemsBySupplier).map(([supplierId, supplierData]) => (
                <div key={supplierId} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{supplierData.supplier_name}</span>
                  </div>
                  <div className="space-y-2">
                    {supplierData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ₹{item.unit_price}
                          </p>
                        </div>
                        <p className="font-medium">₹{item.total_price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span>₹{deliveryCharges}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Gateway Fees:</span>
                <span>₹{fees}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Platform Commission (2.5%):</span>
                <span>₹{commission}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Buyer Details */}
          <div>
            <h3 className="font-semibold mb-3">Buyer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyer-name">Business Name</Label>
                <Input
                  id="buyer-name"
                  value={buyerDetails.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <Label htmlFor="buyer-email">Email</Label>
                <Input
                  id="buyer-email"
                  type="email"
                  value={buyerDetails.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="buyer-phone">Phone Number</Label>
                <Input
                  id="buyer-phone"
                  value={buyerDetails.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div>
            <h3 className="font-semibold mb-3">Payment Method</h3>
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-blue-50">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Instamojo Payment Gateway</p>
                <p className="text-sm text-gray-600">
                  Secure payment via cards, UPI, net banking, and wallets
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button 
            onClick={handlePayment} 
            disabled={loading} 
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay ₹{finalTotal}
              </>
            )}
          </Button>

          {/* Payment Info */}
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p>Your payment is secured with bank-level encryption</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <p>You will be redirected to Instamojo for secure payment processing</p>
            </div>
            {groupOrderId && (
              <div className="flex items-start gap-2">
                <Calculator className="h-4 w-4 text-purple-600 mt-0.5" />
                <p>This is a group order payment - bulk discounts have been applied</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
