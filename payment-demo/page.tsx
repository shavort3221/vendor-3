"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentCheckout } from "@/components/PaymentCheckout"
import { SupplierPaymentAnalytics } from "@/components/SupplierPaymentAnalytics"
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Play,
  Zap
} from "lucide-react"
import Link from "next/link"

// Mock data for demo
const mockCartItems = [
  {
    id: "prod_1",
    name: "Fresh Tomatoes",
    quantity: 10,
    unit_price: 40,
    total_price: 400,
    supplier_id: "supplier_1",
    supplier_name: "Mumbai Fresh Vegetables Ltd"
  },
  {
    id: "prod_2", 
    name: "Onions (Bulk)",
    quantity: 5,
    unit_price: 30,
    total_price: 150,
    supplier_id: "supplier_1",
    supplier_name: "Mumbai Fresh Vegetables Ltd"
  },
  {
    id: "prod_3",
    name: "Potatoes",
    quantity: 8,
    unit_price: 25,
    total_price: 200,
    supplier_id: "supplier_1", 
    supplier_name: "Mumbai Fresh Vegetables Ltd"
  }
]

const mockGroupOrderItems = [
  {
    id: "prod_4",
    name: "Premium Basmati Rice",
    quantity: 2,
    unit_price: 120,
    total_price: 240,
    supplier_id: "supplier_2",
    supplier_name: "Delhi Spice Traders"
  }
]

export default function PaymentDemoPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl flex items-center justify-center gap-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              VendorMitra Payment System Demo
            </CardTitle>
            <p className="text-gray-600">
              Complete Instamojo payment gateway integration with real-time processing
            </p>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendor-flow">Vendor Flow</TabsTrigger>
            <TabsTrigger value="supplier-analytics">Supplier Analytics</TabsTrigger>
            <TabsTrigger value="group-orders">Group Orders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Payment Gateway
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Instamojo Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Secure Payment Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Multiple Payment Methods</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Real-time Status Updates</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Revenue Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Commission Tracking (2.5%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Payment Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Transaction History</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Invoice Generation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Group Buying
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Bulk Discounts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Payment Splitting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Collective Purchasing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Cost Optimization</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Flow Diagram */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Flow Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium">1. Order Creation</p>
                    <p className="text-sm text-gray-600">Vendor creates order</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium">2. Payment Request</p>
                    <p className="text-sm text-gray-600">Instamojo payment link</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-medium">3. Payment Processing</p>
                    <p className="text-sm text-gray-600">Secure transaction</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-medium">4. Order Confirmation</p>
                    <p className="text-sm text-gray-600">Supplier notification</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Try the Payment System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => setActiveTab("vendor-flow")}
                    className="h-16 text-lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Test Vendor Payment Flow
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("supplier-analytics")}
                    variant="outline"
                    className="h-16 text-lg"
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    View Supplier Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendor Flow Tab */}
          <TabsContent value="vendor-flow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Vendor Payment Checkout Demo
                </CardTitle>
                <p className="text-gray-600">
                  Experience the complete payment flow from cart to confirmation
                </p>
              </CardHeader>
              <CardContent>
                <PaymentCheckout 
                  items={mockCartItems}
                  deliveryCharges={50}
                  onPaymentSuccess={(data) => {
                    console.log("Payment successful:", data)
                  }}
                  onPaymentFailure={(error) => {
                    console.log("Payment failed:", error)
                  }}
                />
              </CardContent>
            </Card>

            {/* Payment Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span>Instant payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span>Multiple payment methods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span>Secure transaction handling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span>Real-time status updates</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>SSL/TLS encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Webhook signature verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>PCI DSS compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Fraud detection</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Supplier Analytics Tab */}
          <TabsContent value="supplier-analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Supplier Payment Analytics
                </CardTitle>
                <p className="text-gray-600">
                  Track revenue, commissions, and payment performance
                </p>
              </CardHeader>
              <CardContent>
                <SupplierPaymentAnalytics />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Group Orders Tab */}
          <TabsContent value="group-orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Group Order Payment Demo
                </CardTitle>
                <p className="text-gray-600">
                  Experience collective purchasing with bulk discounts
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Group Order Benefits</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Bulk discounts up to 30%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Reduced delivery charges</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Individual payment processing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Automatic order fulfillment</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <PaymentCheckout 
                      items={mockGroupOrderItems}
                      deliveryCharges={25}
                      groupOrderId="GROUP_123"
                      onPaymentSuccess={(data) => {
                        console.log("Group order payment successful:", data)
                      }}
                      onPaymentFailure={(error) => {
                        console.log("Group order payment failed:", error)
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Group Order Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Splitting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Each participant pays their share individually while benefiting from bulk pricing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bulk Discounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Automatic discount application based on total order quantity
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Coordination</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Real-time updates on group order status and participant payments
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Demo Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button asChild variant="outline">
                <Link href="/auth-test">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Test Authentication
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/demo">
                  <Play className="h-4 w-4 mr-2" />
                  Complete Demo
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowRight className="h-4 w-4 mr-2" />
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
