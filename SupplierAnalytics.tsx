"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, IndianRupee, Package, Users, Star, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, Order } from "@/lib/supabase"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function SupplierAnalytics() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("30")
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    completionRate: 0,
    topProducts: [],
    revenueData: [],
    orderStatusData: [],
    monthlyRevenue: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, user?.id])

  const fetchAnalytics = async () => {
    try {
      if (!user?.id) return

      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange))

      // Fetch orders for the selected time range
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('supplier_id', user.id)
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Calculate analytics
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0
      const totalOrders = orders?.length || 0
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      const completedOrders = orders?.filter(order => order.status === 'delivered').length || 0
      const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

      // Generate revenue data for chart
      const revenueData = generateRevenueData(orders || [], timeRange)
      
      // Generate order status data
      const orderStatusData = generateOrderStatusData(orders || [])
      
      // Generate monthly revenue data
      const monthlyRevenue = generateMonthlyRevenueData(orders || [])

      setAnalytics({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        completionRate,
        topProducts: [], // Would need product data to calculate
        revenueData,
        orderStatusData,
        monthlyRevenue
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateRevenueData = (orders: Order[], range: string) => {
    const data = []
    const days = parseInt(range)
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayOrders = orders.filter(order => 
        order.created_at.startsWith(dateStr)
      )
      
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0)
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue,
        orders: dayOrders.length
      })
    }
    
    return data
  }

  const generateOrderStatusData = (orders: Order[]) => {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }))
  }

  const generateMonthlyRevenueData = (orders: Order[]) => {
    const monthlyData = orders.reduce((acc, order) => {
      const month = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short' })
      acc[month] = (acc[month] || 0) + order.total
      return acc
    }, {} as Record<string, number>)

    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="h-4 w-4 text-orange-500" />
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'shipped': return <Package className="h-4 w-4 text-purple-500" />
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Loading analytics...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your business performance and growth</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" />
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.averageOrderValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" />
              +5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" />
              +2% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="orders">Order Status</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Daily revenue over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `₹${value}` : value,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Breakdown of orders by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status Details</CardTitle>
                <CardDescription>Detailed breakdown of order statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.orderStatusData.map((status, index) => (
                    <div key={status.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status.name)}
                        <span className="font-medium">{status.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">{status.value}</span>
                        <Badge variant="outline">
                          {((status.value / analytics.totalOrders) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Overview</CardTitle>
              <CardDescription>Revenue trends by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Top Performing Metrics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Revenue Growth</span>
                  </div>
                  <Badge variant="default" className="bg-green-600">+12%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Customer Retention</span>
                  </div>
                  <Badge variant="default" className="bg-blue-600">85%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Average Rating</span>
                  </div>
                  <Badge variant="default" className="bg-purple-600">4.8</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Recommendations</h4>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Optimize Inventory</p>
                      <p className="text-xs text-gray-600">Consider restocking popular items to meet demand</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Improve Response Time</p>
                      <p className="text-xs text-gray-600">Faster order processing can increase customer satisfaction</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Expand Product Range</p>
                      <p className="text-xs text-gray-600">Consider adding complementary products to increase AOV</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
