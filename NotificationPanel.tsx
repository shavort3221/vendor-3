"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/contexts/NotificationContext"
import { formatDistanceToNow } from "date-fns"
import { Bell, CheckCircle, AlertTriangle, Info, X, Trash2 } from "lucide-react"

interface NotificationPanelProps {
  onClose: () => void
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications()

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "payment":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "system":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="absolute right-0 top-12 w-96 z-50">
      <Card className="shadow-xl border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
              {notifications.filter((n) => !n.read).length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {notifications.filter((n) => !n.read).length}
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {notifications.length > 0 && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex-1 bg-transparent">
                Mark All Read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll} className="flex-1 bg-transparent">
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                          <div className="flex items-center space-x-2">
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="h-6 w-6 p-0 hover:bg-red-100"
                            >
                              <X className="h-3 w-3 text-gray-400 hover:text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
