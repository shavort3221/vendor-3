"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  is_read: boolean
  created_at: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  createNotification: (notification: Omit<Notification, "id" | "user_id" | "created_at" | "is_read">) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const unreadCount = notifications.filter((n) => !n.is_read).length

  useEffect(() => {
    if (user) {
      fetchNotifications()
      subscribeToNotifications()
    } else {
      setNotifications([])
      setLoading(false)
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching notifications:", error)
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error("Error in fetchNotifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToNotifications = () => {
    if (!user) return

    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newNotification = payload.new as Notification
            setNotifications((prev) => [newNotification, ...prev])

            // Show toast for new notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
              variant: newNotification.type === "error" ? "destructive" : "default",
            })
          } else if (payload.eventType === "UPDATE") {
            const updatedNotification = payload.new as Notification
            setNotifications((prev) => prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n)))
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id
            setNotifications((prev) => prev.filter((n) => n.id !== deletedId))
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id)

      if (error) {
        console.error("Error marking notification as read:", error)
        toast({
          title: "Error",
          description: "Failed to mark notification as read",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error in markAsRead:", error)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (error) {
        console.error("Error marking all notifications as read:", error)
        toast({
          title: "Error",
          description: "Failed to mark all notifications as read",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error in markAllAsRead:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase.from("notifications").delete().eq("id", id)

      if (error) {
        console.error("Error deleting notification:", error)
        toast({
          title: "Error",
          description: "Failed to delete notification",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error in deleteNotification:", error)
    }
  }

  const createNotification = async (notification: Omit<Notification, "id" | "user_id" | "created_at" | "is_read">) => {
    if (!user) return

    try {
      const { error } = await supabase.from("notifications").insert([
        {
          ...notification,
          user_id: user.id,
          is_read: false,
        },
      ])

      if (error) {
        console.error("Error creating notification:", error)
      }
    } catch (error) {
      console.error("Error in createNotification:", error)
    }
  }

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
