"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/contexts/CartContext"
import { supabase, type Product } from "@/lib/supabase"
import { Search, Plus, Minus, Star, MapPin, Loader2, ShoppingCart, Package } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

const categories = [
  "All Categories",
  "Vegetables & Fruits",
  "Spices & Condiments",
  "Dairy Products",
  "Grains & Pulses",
  "Oil & Ghee",
  "Packaging Materials",
  "Kitchen Equipment",
  "Beverages",
]

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("name")
  const { items: cartItems, addItem, removeItem, updateQuantity } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      let query = supabase.from("products").select(`
          *,
          supplier_profiles!products_supplier_id_fkey(
            company_name,
            city,
            state,
            rating
          )
        `)

      // Apply category filter
      if (selectedCategory !== "All Categories") {
        query = query.eq("category", selectedCategory)
      }

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.ilike("name", `%${searchQuery}%`)
      }

      // Apply sorting
      const ascending = sortBy === "name"
      query = query.order(sortBy, { ascending })

      const { data, error } = await query.limit(50)

      if (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products")
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const getCartQuantity = (productId: string) => {
    const cartItem = cartItems.find((item) => item.product.id === productId)
    return cartItem?.quantity || 0
  }

  const handleAddToCart = (product: Product) => {
    try {
      addItem(product, 1)
      toast.success(`${product.name} added to cart`)
    } catch (error) {
      toast.error("Failed to add item to cart")
    }
  }

  const handleUpdateQuantity = (product: Product, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        removeItem(product.id)
        toast.success(`${product.name} removed from cart`)
      } else {
        updateQuantity(product.id, newQuantity)
        toast.success("Cart updated")
      }
    } catch (error) {
      toast.error("Failed to update cart")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Browse Products</CardTitle>
          <CardDescription>Find the best supplies for your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="created_at">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory !== "All Categories"
                ? "Try adjusting your search or filters"
                : "No products available at the moment"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const cartQuantity = getCartQuantity(product.id)
            const supplierInfo = product.supplier_profiles as any

            return (
              <Card key={product.id} className="card-hover overflow-hidden">
                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(product.name)}`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}

                  {/* Stock Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.stock > 0 ? "default" : "destructive"} className="text-xs">
                      {product.stock > 0 ? `${product.stock} ${product.unit}` : "Out of Stock"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <span className="truncate">{supplierInfo?.company_name || "Unknown Supplier"}</span>
                        {supplierInfo?.rating && (
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs ml-1">{supplierInfo.rating}</span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Location */}
                  {supplierInfo?.city && supplierInfo?.state && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">
                        {supplierInfo.city}, {supplierInfo.state}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(product.price)}
                        <span className="text-sm text-gray-500 font-normal">/{product.unit}</span>
                      </div>
                      {product.bulk_price && product.bulk_price < product.price && (
                        <div className="text-sm text-gray-600">
                          Bulk: {formatCurrency(product.bulk_price)}/{product.unit}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  )}

                  {/* Add to Cart Controls */}
                  <div className="flex items-center justify-between">
                    {cartQuantity > 0 ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateQuantity(product, cartQuantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{cartQuantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateQuantity(product, cartQuantity + 1)}
                          disabled={product.stock <= cartQuantity}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
