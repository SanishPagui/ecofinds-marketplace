"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"

export interface Notification {
  id: string
  type: "order" | "listing" | "favorite" | "follow" | "system" | "message"
  title: string
  message: string
  read: boolean
  timestamp: Date
  actionUrl?: string
  metadata?: Record<string, any>
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => Promise<void>
  refreshNotifications: () => Promise<void>
}

// Mock notification service - replace with actual API calls
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Order Confirmed",
    message: "Your order for Vintage Leather Jacket has been confirmed and will be shipped soon.",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    actionUrl: "/dashboard/history",
    metadata: { orderId: "order_123", productName: "Vintage Leather Jacket" }
  },
  {
    id: "2", 
    type: "listing",
    title: "New Listing Approved",
    message: "Your listing 'Antique Wooden Chair' has been approved and is now live on the marketplace.",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    actionUrl: "/dashboard/listings",
    metadata: { listingId: "listing_456", productName: "Antique Wooden Chair" }
  },
  {
    id: "3",
    type: "favorite",
    title: "Price Drop Alert",
    message: "Great news! An item in your favorites just dropped 20% in price. Don't miss out!",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    actionUrl: "/dashboard/favorites",
    metadata: { productId: "product_789", oldPrice: 100, newPrice: 80 }
  },
  {
    id: "4",
    type: "system",
    title: "Welcome to EcoFinds!",
    message: "Complete your profile to get personalized recommendations and connect with other eco-conscious shoppers.",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    actionUrl: "/dashboard/profile",
    metadata: { profileCompletion: 45 }
  },
  {
    id: "5",
    type: "follow",
    title: "New Follower",
    message: "EcoWarrior92 started following you! Check out their sustainable finds.",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    actionUrl: "/dashboard/profile",
    metadata: { followerId: "user_321", followerName: "EcoWarrior92" }
  }
]

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Simulate loading notifications from server
  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In a real app, this would be an API call
      // const userNotifications = await fetchNotifications(user.uid)
      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Failed to load notifications:", error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load notifications when user changes
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  // Refresh notifications periodically (every 5 minutes)
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      loadNotifications()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [user, loadNotifications])

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      )

      // In a real app, this would be an API call
      // await markNotificationAsRead(user.uid, id)
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      // Revert optimistic update on error
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: false }
            : notification
        )
      )
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
      
      // Optimistic update
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )

      // In a real app, this would be an API call
      // await markAllNotificationsAsRead(user.uid)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
      // Revert optimistic update on error
      loadNotifications()
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const notificationToDelete = notifications.find(n => n.id === id)
      
      // Optimistic update
      setNotifications(prev => prev.filter(n => n.id !== id))

      // In a real app, this would be an API call
      // await deleteNotification(user.uid, id)
    } catch (error) {
      console.error("Failed to delete notification:", error)
      // Revert optimistic update on error
      loadNotifications()
    }
  }

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    try {
      const newNotification: Notification = {
        ...notification,
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date()
      }

      // Optimistic update
      setNotifications(prev => [newNotification, ...prev])

      // In a real app, this would be an API call
      // await createNotification(user.uid, newNotification)
    } catch (error) {
      console.error("Failed to add notification:", error)
      // Revert optimistic update on error
      loadNotifications()
    }
  }

  const refreshNotifications = async () => {
    await loadNotifications()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    refreshNotifications
  }
}