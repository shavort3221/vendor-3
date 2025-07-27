"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { ChefHat, Truck, ShoppingCart, Bell, User, Settings, LogOut, Menu, X } from "lucide-react"

export default function DashboardHeader() {
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()
  const { unreadCount } = useNotifications()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const userType = user?.profile?.user_type
  const businessName = user?.profile?.business_name || user?.email

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {userType === "vendor" ? (
                <ChefHat className="h-8 w-8 text-orange-600" />
              ) : (
                <Truck className="h-8 w-8 text-blue-600" />
              )}
              <span className="text-2xl font-bold gradient-text">VendorMitra</span>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {userType === "vendor" ? "Vendor" : "Supplier"}
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart (Vendors only) */}
            {userType === "vendor" && (
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            )}

            {/* Notifications */}
            <Button variant="outline" size="sm" className="relative bg-transparent">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline-block max-w-32 truncate">{businessName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-900">{businessName}</p>
                <p className="text-xs text-gray-500">{userType === "vendor" ? "Vendor Account" : "Supplier Account"}</p>
              </div>

              <div className="flex items-center justify-around py-2 border-t border-gray-100">
                {userType === "vendor" && (
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {totalItems > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                )}

                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>

              <div className="border-t border-gray-100 pt-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-red-600" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
