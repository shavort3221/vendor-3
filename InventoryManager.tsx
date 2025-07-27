"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, Package, Search, RefreshCw } from "lucide-react"
import { useNotifications } from "@/contexts/NotificationContext"

interface InventoryItem {
  id: string
  name: string
  currentStock: number
  minStock: number
  unit: string
  lastOrdered: string
  predictedDemand: number
}

interface InventoryManagerProps {
  inventory: InventoryItem[]
}

export function InventoryManager({ inventory }: InventoryManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "low-stock" | "normal">("all")
  const { addNotification } = useNotifications()

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "low-stock" && item.currentStock < item.minStock) ||
      (filter === "normal" && item.currentStock >= item.minStock)

    return matchesSearch && matchesFilter
  })

  const handleQuickReorder = (item: InventoryItem) => {
    addNotification({
      title: "Reorder Initiated",
      message: `Quick reorder for ${item.name} has been added to your cart`,
      type: "success",
    })
  }

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.minStock) * 100
    if (percentage < 50) return { status: "critical", color: "bg-red-500" }
    if (percentage < 100) return { status: "low", color: "bg-orange-500" }
    return { status: "good", color: "bg-green-500" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Smart Inventory Management
          </CardTitle>
          <CardDescription>Track stock levels, get AI-powered demand predictions, and manage reorders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search inventory items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All Items
              </Button>
              <Button
                variant={filter === "low-stock" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("low-stock")}
              >
                Low Stock
              </Button>
              <Button
                variant={filter === "normal" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("normal")}
              >
                Normal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📊 Demand Forecast</h4>
              <p className="text-blue-800 text-sm">
                Onions demand expected to increase by 25% next week due to festival season
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">💡 Smart Suggestion</h4>
              <p className="text-green-800 text-sm">Order cooking oil now - prices expected to rise by 8% next month</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">⚠️ Urgent Action</h4>
              <p className="text-orange-800 text-sm">3 items below minimum stock level - reorder immediately</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items */}
      <div className="grid gap-4">
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item)
          const stockPercentage = Math.min((item.currentStock / item.minStock) * 100, 100)

          return (
            <Card
              key={item.id}
              className={`${item.currentStock < item.minStock ? "border-orange-200 bg-orange-50" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Last ordered: {new Date(item.lastOrdered).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {item.currentStock} {item.unit}
                    </div>
                    <Badge
                      variant={
                        stockStatus.status === "critical"
                          ? "destructive"
                          : stockStatus.status === "low"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {stockStatus.status === "critical"
                        ? "Critical"
                        : stockStatus.status === "low"
                          ? "Low Stock"
                          : "Good"}
                    </Badge>
                  </div>
                </div>

                {/* Stock Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Stock Level</span>
                    <span>{Math.round(stockPercentage)}% of minimum</span>
                  </div>
                  <Progress value={stockPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      Min: {item.minStock} {item.unit}
                    </span>
                    <span>
                      Current: {item.currentStock} {item.unit}
                    </span>
                  </div>
                </div>

                {/* AI Prediction */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Predicted demand: {item.predictedDemand} {item.unit}
                      </p>
                      <p className="text-xs text-blue-700">Based on your order history and local trends</p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleQuickReorder(item)} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Quick Reorder
                  </Button>
                  <Button size="sm" variant="outline">
                    Find Suppliers
                  </Button>
                  {item.currentStock < item.minStock && (
                    <Button size="sm" variant="destructive">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Urgent
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "Add items to your inventory to get started"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
