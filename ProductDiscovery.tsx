"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Star, MapPin, ShoppingCart, Package, TrendingUp, Users, Clock, Truck } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useCart } from "@/contexts/CartContext"
import { useToast } from "@/hooks/use-toast"
import type { Product, SupplierProfile } from "@/lib/supabase"

interface ProductWithSupplier extends Product {
  supplier: SupplierProfile
}

export function ProductDiscovery() {
  const [products, setProducts] = useState<ProductWithSupplier[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithSupplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("name")
  const { addItem } = useCart()
  const { toast } = useToast()

  const categories = ["all", "Vegetables", "Dairy", "Spices", "Oils", "Grains", "Snacks"]

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory, priceRange, sortBy])

  const loadProducts = async () => {
    try {
      setLoading(true)

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          supplier:supplier_profiles!products_supplier_id_fkey(*)
        `)
        .gt("stock", 0)

      if (productsError) throw productsError

      setProducts(productsData || [])
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.supplier?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Price filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.supplier?.rating || 0) - (a.supplier?.rating || 0)
        case "stock":
          return b.stock - a.stock
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (product: Product, quantity = 1) => {
    addItem(product, quantity)
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Product Discovery
          </CardTitle>
          <CardDescription>Find the best suppliers and products for your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products, suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="stock">Most Stock</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-900">AI Recommendations</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium text-blue-900">🔥 Trending Now</p>
              <p className="text-xs text-blue-700">Onions are in high demand. Order now before prices rise!</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium text-green-900">💰 Best Deal</p>
              <p className="text-xs text-green-700">Save 15% on bulk spice orders this week</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium text-orange-900">⚡ Quick Reorder</p>
              <p className="text-xs text-orange-700">Based on your history, you'll need tomatoes in 2 days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {/* Product Image Placeholder */}
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <Badge variant="secondary">
                    {product.stock} {product.unit}
                  </Badge>
                </div>

                {/* Supplier Info */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {product.supplier?.company_name?.charAt(0) || "S"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.supplier?.company_name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{product.supplier?.rating || 0}</span>
                      <MapPin className="h-3 w-3 text-gray-400 ml-2" />
                      <span className="text-xs text-gray-600">{product.supplier?.city}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                      <span className="text-sm text-gray-600">/{product.unit}</span>
                    </div>
                    {product.bulk_price && (
                      <div className="text-right">
                        <p className="text-sm text-blue-600 font-medium">
                          Bulk: ₹{product.bulk_price}/{product.unit}
                        </p>
                        <p className="text-xs text-gray-500">Min 50 {product.unit}</p>
                      </div>
                    )}
                  </div>

                  {product.bulk_price && (
                    <div className="p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-700 font-medium">
                        💰 Save ₹{((product.price - product.bulk_price) * 50).toFixed(0)} on bulk orders!
                      </p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Fresh Stock</span>
                  </div>
                  {product.supplier?.verification_status && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {product.description && <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button onClick={() => handleAddToCart(product, 1)} className="flex-1 vm-btn-primary" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Group Buy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse different categories</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setPriceRange([0, 1000])
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
