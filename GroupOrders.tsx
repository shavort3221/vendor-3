"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Users, Plus, Clock, TrendingDown, MapPin, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { GroupOrder, Product, VendorProfile } from "@/lib/supabase"

interface GroupOrderWithDetails extends GroupOrder {
  product?: Product
  creator?: VendorProfile
  participant_count: number
}

export function GroupOrders() {
  const [groupOrders, setGroupOrders] = useState<GroupOrderWithDetails[]>([])
  const [myGroupOrders, setMyGroupOrders] = useState<GroupOrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    min_quantity: 50,
    deadline: "",
  })
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadGroupOrders()
    }
  }, [user])

  const loadGroupOrders = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load active group orders
      const { data: activeOrders, error: activeError } = await supabase
        .from("group_orders")
        .select(`
          *,
          creator:vendor_profiles!group_orders_creator_id_fkey(*)
        `)
        .eq("status", "active")
        .gt("deadline", new Date().toISOString())
        .order("created_at", { ascending: false })

      if (activeError) throw activeError

      // Load user's group orders
      const { data: userOrders, error: userError } = await supabase
        .from("group_orders")
        .select(`
          *,
          creator:vendor_profiles!group_orders_creator_id_fkey(*)
        `)
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })

      if (userError) throw userError

      // Add participant count (mock for now)
      const processedActiveOrders = (activeOrders || []).map((order) => ({
        ...order,
        participant_count: Math.floor(Math.random() * 8) + 2, // Mock participant count
      }))

      const processedUserOrders = (userOrders || []).map((order) => ({
        ...order,
        participant_count: Math.floor(Math.random() * 8) + 2, // Mock participant count
      }))

      setGroupOrders(processedActiveOrders)
      setMyGroupOrders(processedUserOrders)
    } catch (error) {
      console.error("Error loading group orders:", error)
      toast({
        title: "Error",
        description: "Failed to load group orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroupOrder = async () => {
    if (!user) return

    try {
      const deadline = new Date(createForm.deadline)
      if (deadline <= new Date()) {
        toast({
          title: "Invalid Deadline",
          description: "Deadline must be in the future.",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase
        .from("group_orders")
        .insert({
          creator_id: user.id,
          title: createForm.title,
          description: createForm.description,
          min_quantity: createForm.min_quantity,
          deadline: deadline.toISOString(),
          status: "active",
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Group Order Created!",
        description: "Your group order has been created successfully.",
      })

      setShowCreateModal(false)
      setCreateForm({
        title: "",
        description: "",
        min_quantity: 50,
        deadline: "",
      })

      loadGroupOrders()
    } catch (error) {
      console.error("Error creating group order:", error)
      toast({
        title: "Error",
        description: "Failed to create group order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleJoinGroupOrder = async (groupOrderId: string) => {
    toast({
      title: "Joined Group Order!",
      description: "You have successfully joined this group order.",
    })
    // In a real implementation, this would update the participants array
    loadGroupOrders()
  }

  const calculateProgress = (current: number, minimum: number) => {
    return Math.min((current / minimum) * 100, 100)
  }

  const calculateSavings = (minQuantity: number) => {
    // Mock savings calculation based on quantity
    const savingsPercentage = Math.min(Math.floor(minQuantity / 10), 25)
    return savingsPercentage
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Group Orders
              </CardTitle>
              <CardDescription>Join bulk orders to get better prices and save money</CardDescription>
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="vm-btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group Order</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Order Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Bulk Vegetables Order"
                      value={createForm.title}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what you're ordering and any specific requirements..."
                      value={createForm.description}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="min_quantity">Minimum Quantity (kg)</Label>
                    <Input
                      id="min_quantity"
                      type="number"
                      value={createForm.min_quantity}
                      onChange={(e) =>
                        setCreateForm((prev) => ({ ...prev, min_quantity: Number.parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="datetime-local"
                      value={createForm.deadline}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleCreateGroupOrder} className="w-full vm-btn-primary">
                    Create Group Order
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Benefits Banner */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <TrendingDown className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-900">Group Buying Benefits</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium text-green-900">💰 Save 15-30%</p>
              <p className="text-xs text-green-700">Get bulk pricing by joining with other vendors</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium text-blue-900">🚚 Shared Delivery</p>
              <p className="text-xs text-blue-700">Split delivery costs among all participants</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium text-purple-900">🤝 Community</p>
              <p className="text-xs text-purple-700">Connect with other vendors in your area</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Group Orders */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Group Orders</h3>
        {groupOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active group orders</h3>
              <p className="text-gray-600 mb-4">Be the first to create a group order and save money!</p>
              <Button onClick={() => setShowCreateModal(true)} className="vm-btn-primary">
                Create Group Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {groupOrders.map((groupOrder) => {
              const progress = calculateProgress(groupOrder.current_quantity, groupOrder.min_quantity)
              const savings = calculateSavings(groupOrder.min_quantity)
              const timeLeft = new Date(groupOrder.deadline || "").getTime() - new Date().getTime()
              const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)))

              return (
                <Card key={groupOrder.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{groupOrder.title}</h4>
                          <p className="text-sm text-gray-600">{groupOrder.description}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Save {savings}%
                        </Badge>
                      </div>

                      {/* Creator Info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {groupOrder.creator?.business_name?.charAt(0) || "V"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{groupOrder.creator?.business_name}</p>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{groupOrder.creator?.city}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {groupOrder.current_quantity}/{groupOrder.min_quantity} kg
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{groupOrder.participant_count} vendors joined</span>
                          <span>{Math.round(progress)}% complete</span>
                        </div>
                      </div>

                      {/* Time Left */}
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-900">
                            {hoursLeft > 0 ? `${hoursLeft} hours left` : "Ending soon"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {new Date(groupOrder.deadline || "").toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <Button
                        onClick={() => handleJoinGroupOrder(groupOrder.id)}
                        className="w-full vm-btn-secondary"
                        disabled={progress >= 100}
                      >
                        {progress >= 100 ? "Order Complete" : "Join Group Order"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* My Group Orders */}
      {myGroupOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">My Group Orders</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {myGroupOrders.map((groupOrder) => {
              const progress = calculateProgress(groupOrder.current_quantity, groupOrder.min_quantity)
              const savings = calculateSavings(groupOrder.min_quantity)

              return (
                <Card key={groupOrder.id} className="border-blue-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{groupOrder.title}</h4>
                          <Badge variant="secondary" className="mt-1">
                            Created by you
                          </Badge>
                        </div>
                        <Badge
                          className={
                            groupOrder.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {groupOrder.status}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {groupOrder.current_quantity}/{groupOrder.min_quantity} kg
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-gray-600">
                          {groupOrder.participant_count} vendors joined • Save {savings}%
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
