"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  user_id: string
  type: "order" | "payment" | "system" | "promotion"
  title: string
  message: string
  read: boolean
  created_at: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  clearAll: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  const unreadCount = notifications.filter((n) => !n.read).length

  // Load notifications
  useEffect(() => {
    if (user) {
      loadNotifications()
      subscribeToNotifications()
    }
  }, [user])

  const loadNotifications = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error loading notifications:", error)
      return
    }

    setNotifications(data || [])
  }

  const subscribeToNotifications = () => {
    if (!user) return

    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications((prev) => [newNotification, ...prev])

          // Show toast for new notifications
          toast({
            title: newNotification.title,
            description: newNotification.message,
            duration: 5000,
          })
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)

    if (!error) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false)

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }
  }

  const deleteNotification = async (id: string) => {
    const { error } = await supabase.from("notifications").delete().eq("id", id)

    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }
  }

  const clearAll = async () => {
    if (!user) return

    const { error } = await supabase.from("notifications").delete().eq("user_id", user.id)

    if (!error) {
      setNotifications([])
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
