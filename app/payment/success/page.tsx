"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Loader2, AlertCircle, ArrowLeft, Download } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

interface PaymentStatus {
  success: boolean
  transaction?: {
    id: string
    status: string
    amount: number
    fees: number
    commission_amount: number
    created_at: string
    updated_at: string
  }
  order?: {
    id: string
    status: string
    payment_status: string
    total: number
    created_at: string
  }
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  const orderId = searchParams.get("order_id")
  const paymentId = searchParams.get("payment_id")
  const paymentRequestId = searchParams.get("payment_request_id")

  useEffect(() => {
    if (!orderId && !paymentId && !paymentRequestId) {
      setError("Missing payment information")
      setLoading(false)
      return
    }

    checkPaymentStatus()
  }, [orderId, paymentId, paymentRequestId])

  const checkPaymentStatus = async () => {
    try {
      const params = new URLSearchParams()
      if (paymentRequestId) params.append("payment_request_id", paymentRequestId)
      if (orderId) params.append("order_id", orderId)

      const response = await fetch(`/api/payment/status?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setPaymentStatus(data)
        if (data.transaction?.status === "success") {
          toast.success("Payment completed successfully!")
        }
      } else {
        setError(data.error || "Failed to fetch payment status")
      }
    } catch (error) {
      console.error("Error checking payment status:", error)
      setError("Failed to check payment status")
    } finally {
      setLoading(false)
    }
  }

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  const handleDownloadReceipt = () => {
    toast.success("Receipt download started")
    // Implement receipt download logic
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Payment Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/")} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
              <Button onClick={checkPaymentStatus} className="flex-1">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isSuccess = paymentStatus?.transaction?.status === "success"
  const isPending = paymentStatus?.transaction?.status === "pending"
  const isFailed = paymentStatus?.transaction?.status === "failed"

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            {isSuccess && (
              <>
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-green-600 mb-2">Payment Successful!</CardTitle>
                <p className="text-gray-600">Your order has been confirmed and payment processed successfully.</p>
              </>
            )}

            {isPending && (
              <>
                <Loader2 className="h-20 w-20 text-yellow-500 mx-auto mb-4 animate-spin" />
                <CardTitle className="text-2xl text-yellow-600 mb-2">Payment Processing</CardTitle>
                <p className="text-gray-600">Your payment is being processed. Please wait for confirmation.</p>
              </>
            )}

            {isFailed && (
              <>
                <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-red-600 mb-2">Payment Failed</CardTitle>
                <p className="text-gray-600">Unfortunately, your payment could not be processed.</p>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Transaction ID</p>
                  <p className="font-medium">{paymentStatus?.transaction?.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <Badge
                    className={
                      isSuccess
                        ? "bg-green-100 text-green-800"
                        : isPending
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {paymentStatus?.transaction?.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600">Amount Paid</p>
                  <p className="font-medium text-lg">₹{paymentStatus?.transaction?.amount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Date</p>
                  <p className="font-medium">
                    {paymentStatus?.transaction?.created_at &&
                      new Date(paymentStatus.transaction.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            {paymentStatus?.order && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Order Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-medium">{paymentStatus.order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Status</p>
                    <Badge variant="outline">{paymentStatus.order.status}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-medium">₹{paymentStatus.order.total}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {new Date(paymentStatus.order.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            {isSuccess && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2 text-blue-800">What's Next?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your order has been sent to the supplier for confirmation</li>
                  <li>• You'll receive updates via email and notifications</li>
                  <li>• Track your order status in the dashboard</li>
                  <li>• Contact support if you have any questions</li>
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleGoToDashboard} className="flex-1" variant={isSuccess ? "default" : "outline"}>
                Go to Dashboard
              </Button>

              {isSuccess && (
                <Button onClick={handleDownloadReceipt} variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              )}

              {isFailed && (
                <Button onClick={() => router.push("/dashboard")} className="flex-1">
                  Try Again
                </Button>
              )}
            </div>

            {/* Support Contact */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@vendormitra.com" className="text-blue-600 hover:underline">
                  support@vendormitra.com
                </a>{" "}
                or call{" "}
                <a href="tel:+911800123456" className="text-blue-600 hover:underline">
                  +91-1800-123-456
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
