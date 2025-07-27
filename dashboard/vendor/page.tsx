"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { 
  Search, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  Star,
  MapPin,
  Phone,
  Mail,
  Loader2
} from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: number
  bulk_price?: number
  stock: number
  unit: string
  supplier_name: string
  supplier_rating: number
  image_url?: string
}

interface Order {
  id: string
  supplier_name: string
  total: number
  status: string
  created_at: string
  items_count: number
}

export default function VendorDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("marketplace")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

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
      supplier_name: "Mumbai Fresh Vegetables Ltd",
      supplier_rating: 4.5
    },
    {
      id: "2",
      name: "Onions",
      category: "vegetables",
      price: 25,
      bulk_price: 20,
      stock: 1000,
      unit: "kg",
      supplier_name: "Mumbai Fresh Vegetables Ltd",
      supplier_rating: 4.5
    },
    {
      id: "3",
      name: "Garam Masala",
      category: "spices",
      price: 120,
      bulk_price: 100,
      stock: 200,
      unit: "kg",
      supplier_name: "Delhi Spice Traders",
      supplier_rating: 4.8
    },
    {
      id: "4",
      name: "Turmeric Powder",
      category: "spices",
      price: 80,
      bulk_price: 70,
      stock: 300,
      unit: "kg",
      supplier_name: "Delhi Spice Traders",
      supplier_rating: 4.8
    }
  ]

  const mockOrders: Order[] = [
    {
      id: "1",
      supplier_name: "Mumbai Fresh Vegetables Ltd",
      total: 2500,
      status: "delivered",
      created_at: "2024-01-15",
      items_count: 5
    },
    {
      id: "2",
      supplier_name: "Delhi Spice Traders",
      total: 1800,
      status: "shipped",
      created_at: "2024-01-14",
      items_count: 3
    }
  ]

  const addToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.profile?.business_name || user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Verified Vendor
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              My Orders
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Suppliers
            </TabsTrigger>
            <TabsTrigger value="group-orders" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Group Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-48">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600">{product.supplier_name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{product.supplier_rating}</span>
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
                        <p>Category: {product.category}</p>
                      </div>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full"
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order History</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.supplier_name}</p>
                        <p className="text-sm text-gray-500">
                          {order.items_count} items • {order.created_at}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{order.total}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers" className="space-y-6">
            <h2 className="text-xl font-semibold">My Suppliers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Mumbai Fresh Vegetables Ltd</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">4.5 (120 reviews)</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>Vashi Market, Navi Mumbai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>9876543212</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>contact@mumbaifresh.com</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">View Products</Button>
                    <Button size="sm" variant="outline">Contact</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Delhi Spice Traders</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">4.8 (85 reviews)</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>Khari Baoli, Old Delhi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>9876543213</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>info@delhispice.com</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">View Products</Button>
                    <Button size="sm" variant="outline">Contact</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Group Orders Tab */}
          <TabsContent value="group-orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Group Orders</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group Order
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fresh Vegetables Group Buy</CardTitle>
                  <p className="text-sm text-gray-600">Mumbai Fresh Vegetables Ltd</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Participants:</span>
                      <span>8 vendors</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Value:</span>
                      <span>₹45,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Deadline:</span>
                      <span>Jan 20, 2024</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500">75% of target reached</p>
                    <Button className="w-full">Join Group Order</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spices Bulk Purchase</CardTitle>
                  <p className="text-sm text-gray-600">Delhi Spice Traders</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Participants:</span>
                      <span>12 vendors</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Value:</span>
                      <span>₹32,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Deadline:</span>
                      <span>Jan 18, 2024</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '90%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500">90% of target reached</p>
                    <Button className="w-full" variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-xl font-semibold">Business Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Business Name</Label>
                    <p className="text-sm text-gray-600">Raj's Chaat Corner</p>
                  </div>
                  <div>
                    <Label>Food Type</Label>
                    <p className="text-sm text-gray-600">Chaat & Snacks</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm text-gray-600">9876543210</p>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <p className="text-sm text-gray-600">Andheri West, Mumbai, Maharashtra - 400058</p>
                  </div>
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Verification Status</span>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>4.2</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Member Since</span>
                    <span className="text-sm text-gray-600">January 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Orders</span>
                    <span className="text-sm text-gray-600">24</span>
                  </div>
                  <Button variant="outline" className="w-full">View Documents</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
