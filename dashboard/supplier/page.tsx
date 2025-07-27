"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings,
  Plus,
  Star,
  MapPin,
  Phone,
  Mail,
  Loader2,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: number
  bulk_price?: number
  stock: number
  unit: string
  description?: string
  image_url?: string
}

interface Order {
  id: string
  vendor_name: string
  vendor_phone: string
  total: number
  status: string
  created_at: string
  items_count: number
  delivery_address: string
}

interface Vendor {
  id: string
  business_name: string
  food_type: string
  location: string
  phone: string
  rating: number
  total_orders: number
  last_order_date: string
}

export default function SupplierDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("orders")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data for demo
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Fresh Tomatoes",
      category: "vegetables",
      price: 40,
      bulk_price: 35,
      stock: 500,
      unit: "kg",
      description: "Fresh red tomatoes from local farms"
    },
    {
      id: "2",
      name: "Onions",
      category: "vegetables",
      price: 25,
      bulk_price: 20,
      stock: 1000,
      unit: "kg",
      description: "Premium quality onions"
    },
    {
      id: "3",
      name: "Garam Masala",
      category: "spices",
      price: 120,
      bulk_price: 100,
      stock: 200,
      unit: "kg",
      description: "Authentic garam masala blend"
    },
    {
      id: "4",
      name: "Turmeric Powder",
      category: "spices",
      price: 80,
      bulk_price: 70,
      stock: 300,
      unit: "kg",
      description: "Pure turmeric powder"
    }
  ]

  const mockOrders: Order[] = [
    {
      id: "1",
      vendor_name: "Raj's Chaat Corner",
      vendor_phone: "9876543210",
      total: 2500,
      status: "pending",
      created_at: "2024-01-15",
      items_count: 5,
      delivery_address: "Andheri West, Mumbai"
    },
    {
      id: "2",
      vendor_name: "Delhi Dosa Point",
      vendor_phone: "9876543211",
      total: 1800,
      status: "confirmed",
      created_at: "2024-01-14",
      items_count: 3,
      delivery_address: "Connaught Place, Delhi"
    },
    {
      id: "3",
      vendor_name: "Mumbai Street Food",
      vendor_phone: "9876543212",
      total: 3200,
      status: "shipped",
      created_at: "2024-01-13",
      items_count: 7,
      delivery_address: "Bandra West, Mumbai"
    }
  ]

  const mockVendors: Vendor[] = [
    {
      id: "1",
      business_name: "Raj's Chaat Corner",
      food_type: "Chaat & Snacks",
      location: "Andheri West, Mumbai",
      phone: "9876543210",
      rating: 4.2,
      total_orders: 24,
      last_order_date: "2024-01-15"
    },
    {
      id: "2",
      business_name: "Delhi Dosa Point",
      food_type: "South Indian",
      location: "Connaught Place, Delhi",
      phone: "9876543211",
      rating: 4.5,
      total_orders: 18,
      last_order_date: "2024-01-14"
    },
    {
      id: "3",
      business_name: "Mumbai Street Food",
      food_type: "General Street Food",
      location: "Bandra West, Mumbai",
      phone: "9876543212",
      rating: 4.0,
      total_orders: 12,
      last_order_date: "2024-01-13"
    }
  ]

  const handleOrderAction = (orderId: string, action: 'accept' | 'reject' | 'ship' | 'deliver') => {
    const actionText = {
      accept: 'accepted',
      reject: 'rejected',
      ship: 'shipped',
      deliver: 'delivered'
    }
    toast.success(`Order #${orderId} ${actionText[action]}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusActions = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleOrderAction("1", "accept")}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleOrderAction("1", "reject")}>
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )
      case 'confirmed':
        return (
          <Button size="sm" onClick={() => handleOrderAction("2", "ship")}>
            <Package className="h-4 w-4 mr-1" />
            Ship
          </Button>
        )
      case 'shipped':
        return (
          <Button size="sm" onClick={() => handleOrderAction("3", "deliver")}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark Delivered
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.profile?.company_name || user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Verified Supplier
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Vendors
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Incoming Orders</h2>
              <div className="flex gap-2">
                <Badge variant="outline">Pending: 1</Badge>
                <Badge variant="outline">Confirmed: 1</Badge>
                <Badge variant="outline">Shipped: 1</Badge>
              </div>
            </div>

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">{order.vendor_name}</p>
                            <p className="text-gray-600">{order.vendor_phone}</p>
                            <p className="text-gray-500">{order.delivery_address}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">{order.items_count} items</p>
                            <p className="text-gray-500">{order.created_at}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">₹{order.total}</p>
                        {getStatusActions(order.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Product Catalog</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">₹{product.price}</span>
                        {product.bulk_price && (
                          <Badge variant="secondary">
                            Bulk: ₹{product.bulk_price}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Stock: {product.stock} {product.unit}</p>
                        <p className="truncate">{product.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">Update Stock</Button>
                        <Button size="sm" variant="outline">Edit Price</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold">Business Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹1,25,000</div>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders This Month</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-blue-600">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-purple-600">+3 new this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹2,450</div>
                  <p className="text-xs text-red-600">-2% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProducts.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{product.price}</p>
                          <p className="text-sm text-gray-600">{product.stock} {product.unit} sold</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-gray-600">Order #123 from Raj's Chaat Corner</p>
                      </div>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Product stock updated</p>
                        <p className="text-xs text-gray-600">Fresh Tomatoes stock increased</p>
                      </div>
                      <span className="text-xs text-gray-500">4h ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New vendor registered</p>
                        <p className="text-xs text-gray-600">Mumbai Street Food joined</p>
                      </div>
                      <span className="text-xs text-gray-500">1d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <h2 className="text-xl font-semibold">Vendor Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockVendors.map((vendor) => (
                <Card key={vendor.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{vendor.business_name}</CardTitle>
                        <p className="text-sm text-gray-600">{vendor.food_type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{vendor.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{vendor.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{vendor.phone}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Orders:</span>
                        <span className="font-medium">{vendor.total_orders}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last Order:</span>
                        <span className="font-medium">{vendor.last_order_date}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">View Orders</Button>
                        <Button size="sm" variant="outline">Contact</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
