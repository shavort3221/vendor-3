"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { supabase, type Notification } from "@/lib/supabase"
import { Bell, Package, ShoppingCart, AlertCircle, CheckCircle, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

const notificationIcons = {
  order: Package,
  payment: ShoppingCart,
  system: AlertCircle,
  success: CheckCircle,
  info: Bell,
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { unreadCount, markAsRead, markAllAsRead } = useNotifications()

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching notifications:", error)
        toast.error("Failed to load notifications")
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } catch (error) {
      toast.error("Failed to mark notification as read")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      toast.success("All notifications marked as read")
    } catch (error) {
      toast.error("Failed to mark all notifications as read")
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").delete().eq("id", notificationId).eq("user_id", user?.id)

      if (error) {
        console.error("Error deleting notification:", error)
        toast.error("Failed to delete notification")
        return
      }

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      toast.success("Notification deleted")
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Failed to delete notification")
    }
  }

  const getNotificationIcon = (type: string) => {
    return notificationIcons[type as keyof typeof notificationIcons] || Bell
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "high") return "text-red-600 bg-red-100"
    if (priority === "medium") return "text-yellow-600 bg-yellow-100"

    switch (type) {
      case "order":
        return "text-blue-600 bg-blue-100"
      case "payment":
        return "text-green-600 bg-green-100"
      case "success":
        return "text-green-600 bg-green-100"
      case "system":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              Mark All Read
            </Button>
          )}
        </div>
        <CardDescription>Stay updated with your orders and account activity</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const colorClasses = getNotificationColor(notification.type, notification.priority)

                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${colorClasses}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                              {notification.priority === "high" && (
                                <Badge variant="destructive" className="text-xs">
                                  High Priority
                                </Badge>
                              )}
                              {notification.priority === "medium" && (
                                <Badge variant="secondary" className="text-xs">
                                  Medium Priority
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
