"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Product } from "@/lib/supabase"
import { Plus, Edit, Trash2, Package, Search, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { formatCurrency, getStatusColor } from "@/lib/utils"
import { toast } from "sonner"

const categories = [
  "Vegetables & Fruits",
  "Spices & Condiments",
  "Dairy Products",
  "Meat & Poultry",
  "Grains & Pulses",
  "Oil & Ghee",
  "Packaging Materials",
  "Kitchen Equipment",
  "Beverages",
  "Other",
]

const units = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "l", label: "Liter (l)" },
  { value: "ml", label: "Milliliter (ml)" },
  { value: "piece", label: "Piece" },
  { value: "dozen", label: "Dozen" },
  { value: "packet", label: "Packet" },
  { value: "box", label: "Box" },
]

interface ProductFormData {
  name: string
  category: string
  subcategory: string
  price: string
  bulk_price: string
  stock: string
  unit: string
  description: string
  image_url: string
}

const initialFormData: ProductFormData = {
  name: "",
  category: "",
  subcategory: "",
  price: "",
  bulk_price: "",
  stock: "",
  unit: "kg",
  description: "",
  image_url: "",
}

export default function InventoryManager() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    if (!user) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("supplier_id", user.id)
        .order("created_at", { ascending: false })

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

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Product name is required")
      return false
    }
    if (!formData.category) {
      toast.error("Category is required")
      return false
    }
    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required")
      return false
    }
    if (!formData.stock || Number.parseInt(formData.stock) < 0) {
      toast.error("Valid stock quantity is required")
      return false
    }
    return true
  }

  const handleAddProduct = async () => {
    if (!validateForm() || !user) return

    try {
      setSubmitting(true)

      const productData = {
        supplier_id: user.id,
        name: formData.name.trim(),
        category: formData.category,
        subcategory: formData.subcategory.trim() || null,
        price: Number.parseFloat(formData.price),
        bulk_price: formData.bulk_price ? Number.parseFloat(formData.bulk_price) : null,
        stock: Number.parseInt(formData.stock),
        unit: formData.unit,
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null,
      }

      const { error } = await supabase.from("products").insert(productData)

      if (error) {
        console.error("Error adding product:", error)
        toast.error("Failed to add product")
        return
      }

      toast.success("Product added successfully")
      setIsAddDialogOpen(false)
      setFormData(initialFormData)
      fetchProducts()
    } catch (error) {
      console.error("Error adding product:", error)
      toast.error("Failed to add product")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditProduct = async () => {
    if (!validateForm() || !editingProduct) return

    try {
      setSubmitting(true)

      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        subcategory: formData.subcategory.trim() || null,
        price: Number.parseFloat(formData.price),
        bulk_price: formData.bulk_price ? Number.parseFloat(formData.bulk_price) : null,
        stock: Number.parseInt(formData.stock),
        unit: formData.unit,
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id)

      if (error) {
        console.error("Error updating product:", error)
        toast.error("Failed to update product")
        return
      }

      toast.success("Product updated successfully")
      setIsEditDialogOpen(false)
      setEditingProduct(null)
      setFormData(initialFormData)
      fetchProducts()
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return

    try {
      const { error } = await supabase.from("products").delete().eq("id", product.id)

      if (error) {
        console.error("Error deleting product:", error)
        toast.error("Failed to delete product")
        return
      }

      toast.success("Product deleted successfully")
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || "",
      price: product.price.toString(),
      bulk_price: product.bulk_price?.toString() || "",
      stock: product.stock.toString(),
      unit: product.unit,
      description: product.description || "",
      image_url: product.image_url || "",
    })
    setIsEditDialogOpen(true)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getProductStatus = (product: Product) => {
    if (product.stock === 0) return "out_of_stock"
    if (product.stock < 10) return "low_stock"
    return "in_stock"
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "out_of_stock":
        return "Out of Stock"
      case "low_stock":
        return "Low Stock"
      case "in_stock":
        return "In Stock"
      default:
        return "Unknown"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your inventory...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-gray-600">Manage your product catalog and stock levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Fill in the details for your new product</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => handleInputChange("subcategory", e.target.value)}
                  placeholder="Enter subcategory (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Unit *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk_price">Bulk Price (Optional)</Label>
                <Input
                  id="bulk_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.bulk_price}
                  onChange={(e) => handleInputChange("bulk_price", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your product..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setFormData(initialFormData)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {products.length === 0
                ? "Start by adding your first product to the inventory"
                : "Try adjusting your search or filters"}
            </p>
            {products.length === 0 && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const status = getProductStatus(product)

            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative bg-gray-100">
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

                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(status)}>
                      {status === "out_of_stock" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {status === "low_stock" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {status === "in_stock" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {getStatusText(status)}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {product.category}
                        {product.subcategory && ` • ${product.subcategory}`}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
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
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Stock</div>
                        <div className="font-semibold">
                          {product.stock} {product.unit}
                        </div>
                      </div>
                    </div>

                    {product.description && <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>}

                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(product)} className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the details for {editingProduct?.name}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Product Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-subcategory">Subcategory</Label>
              <Input
                id="edit-subcategory"
                value={formData.subcategory}
                onChange={(e) => handleInputChange("subcategory", e.target.value)}
                placeholder="Enter subcategory (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price per Unit *</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bulk-price">Bulk Price (Optional)</Label>
              <Input
                id="edit-bulk-price"
                type="number"
                step="0.01"
                min="0"
                value={formData.bulk_price}
                onChange={(e) => handleInputChange("bulk_price", e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock Quantity *</Label>
              <Input
                id="edit-stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image-url">Image URL</Label>
              <Input
                id="edit-image-url"
                type="url"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your product..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingProduct(null)
                setFormData(initialFormData)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditProduct} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
