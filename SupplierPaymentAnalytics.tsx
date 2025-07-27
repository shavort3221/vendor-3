"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts"
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Users, 
  Package,
  Download,
  Calendar,
  Filter
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { instamojoService } from "@/lib/instamojo"
import { toast } from "sonner"

interface PaymentAnalytics {
  totalRevenue: number
  totalOrders: number
  successfulPayments: number
  pendingPayments: number
  failedPayments: number
  commissionEarned: number
  averageOrderValue: number
  monthlyRevenue: any[]
  paymentMethods: any[]
  orderStatusDistribution: any[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function SupplierPaymentAnalytics() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchPaymentAnalytics()
    }
  }, [user, timeRange])

  const fetchPaymentAnalytics = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Get orders for this supplier
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*),
          vendor_profile:vendor_profiles!orders_vendor_id_fkey(*)
        `)
        .eq("supplier_id", user.id)

      if (ordersError) {
        console.error("Error fetching orders:", ordersError)
        return
      }

      // Get transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("order_id", orders?.map(o => o.id) || [])

      if (transactionError) {
        console.error("Error fetching transactions:", transactionError)
      } else {
        setTransactions(transactionData || [])
      }

      // Calculate analytics
      const analyticsData = calculateAnalytics(orders || [], transactionData || [])
      setAnalytics(analyticsData)

    } catch (error) {
      console.error("Error fetching payment analytics:", error)
      toast.error("Failed to load payment analytics")
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = (orders: any[], transactions: any[]): PaymentAnalytics => {
    const now = new Date()
    const daysAgo = new Date(now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000)

    // Filter orders by time range
    const filteredOrders = orders.filter(order => 
      new Date(order.created_at) >= daysAgo
    )

    // Calculate totals
    const totalRevenue = filteredOrders
      .filter(order => order.payment_status === "success")
      .reduce((sum, order) => sum + order.total, 0)

    const totalOrders = filteredOrders.length
    const successfulPayments = filteredOrders.filter(order => order.payment_status === "success").length
    const pendingPayments = filteredOrders.filter(order => order.payment_status === "pending").length
    const failedPayments = filteredOrders.filter(order => order.payment_status === "failed").length

    const commissionEarned = transactions
      .filter(t => t.status === "success")
      .reduce((sum, t) => sum + t.commission_amount, 0)

    const averageOrderValue = totalOrders > 0 ? totalRevenue / successfulPayments : 0

    // Monthly revenue data
    const monthlyRevenue = generateMonthlyRevenueData(filteredOrders)

    // Payment methods distribution (mock data for now)
    const paymentMethods = [
      { name: "Credit Card", value: 45 },
      { name: "UPI", value: 30 },
      { name: "Net Banking", value: 15 },
      { name: "Wallets", value: 10 }
    ]

    // Order status distribution
    const orderStatusDistribution = [
      { name: "Confirmed", value: successfulPayments, color: "#00C49F" },
      { name: "Pending", value: pendingPayments, color: "#FFBB28" },
      { name: "Failed", value: failedPayments, color: "#FF8042" }
    ]

    return {
      totalRevenue,
      totalOrders,
      successfulPayments,
      pendingPayments,
      failedPayments,
      commissionEarned,
      averageOrderValue,
      monthlyRevenue,
      paymentMethods,
      orderStatusDistribution
    }
  }

  const generateMonthlyRevenueData = (orders: any[]) => {
    const monthlyData: { [key: string]: number } = {}
    
    orders.forEach(order => {
      if (order.payment_status === "success") {
        const month = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short' })
        monthlyData[month] = (monthlyData[month] || 0) + order.total
      }
    })

    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue: Math.round(revenue)
    }))
  }

  const downloadPaymentReport = () => {
    if (!analytics) return

    const reportData = {
      reportDate: new Date().toLocaleDateString(),
      supplier: user?.profile?.company_name || "Supplier",
      timeRange: `${timeRange} days`,
      analytics: {
        totalRevenue: analytics.totalRevenue,
        totalOrders: analytics.totalOrders,
        successfulPayments: analytics.successfulPayments,
        commissionEarned: analytics.commissionEarned,
        averageOrderValue: analytics.averageOrderValue
      },
      transactions: transactions.slice(0, 50) // Limit to recent 50 transactions
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payment-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Payment report downloaded successfully")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No payment data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payment Analytics</h2>
          <p className="text-gray-600">Track your revenue, commissions, and payment performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={downloadPaymentReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ₹{instamojoService.formatAmount(analytics.totalRevenue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{analytics.totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                <p className="text-2xl font-bold">
                  ₹{instamojoService.formatAmount(analytics.commissionEarned)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">
                  {analytics.totalOrders > 0 
                    ? Math.round((analytics.successfulPayments / analytics.totalOrders) * 100)
                    : 0}%
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.orderStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.orderStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods Used</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Order #{transaction.order_id?.slice(-8)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{transaction.amount}</p>
                  <Badge 
                    variant={
                      transaction.status === "success" ? "default" : 
                      transaction.status === "pending" ? "secondary" : "destructive"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
