"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  MapPin,
  Bell,
  Users,
  ShieldCheck,
  TrendingUp,
  Package,
  BarChart3,
  Truck,
  CreditCard,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Play,
} from "lucide-react"
import Link from "next/link"
import { AuthModal } from "@/components/AuthModal"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export function ProfessionalLandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "register">("login")
  const [userType, setUserType] = useState<"vendor" | "supplier">("vendor")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const stats = [
    {
      icon: Users,
      number: "5,000+",
      label: "Active Vendors",
      color: "text-blue-600",
    },
    {
      icon: ShieldCheck,
      number: "2,500+",
      label: "Verified Suppliers",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      number: "50,000+",
      label: "Monthly Orders",
      color: "text-purple-600",
    },
    {
      icon: Star,
      number: "99.2%",
      label: "Trust Score",
      color: "text-orange-600",
    },
  ]

  const vendorFeatures = [
    {
      icon: Search,
      title: "Smart Supplier Discovery",
      description: "Find verified suppliers within 5-10km radius with real-time availability and pricing",
      badge: "Location-based",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: BarChart3,
      title: "Inventory Dashboard",
      description: "Track stock levels, get low stock alerts, and predict demand based on your order history",
      badge: "AI-Powered",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Users,
      title: "Group Buying Power",
      description: "Join other vendors' orders to unlock bulk pricing and reduce procurement costs by 15-30%",
      badge: "Community",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      description: "Rate suppliers, view quality scores, and ensure consistent raw material standards",
      badge: "Trust System",
      color: "bg-orange-50 text-orange-600",
    },
  ]

  const supplierFeatures = [
    {
      icon: Package,
      title: "Order Management",
      description: "Receive, manage and track orders from multiple vendors in one centralized dashboard",
      badge: "Centralized",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "Understand vendor behavior, popular products, and optimize your inventory accordingly",
      badge: "Data-driven",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Truck,
      title: "Smart Delivery",
      description: "Optimize delivery routes, schedule multiple vendor deliveries, and track in real-time",
      badge: "Efficient",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: CreditCard,
      title: "Payment Tracking",
      description: "Monitor payments, outstanding amounts, and maintain healthy cash flow with automated reminders",
      badge: "Financial",
      color: "bg-orange-50 text-orange-600",
    },
  ]

  const platformBenefits = [
    {
      icon: ShieldCheck,
      title: "Verified Network",
      description:
        "All vendors and suppliers undergo thorough verification including business license and identity proof",
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Stay updated on order status, price changes, new suppliers, and important market updates",
    },
    {
      icon: MapPin,
      title: "Location Intelligence",
      description: "Smart location-based matching ensures you connect with suppliers in your delivery radius",
    },
    {
      icon: Clock,
      title: "Quick Reordering",
      description: "One-click reorder for frequently purchased items with saved preferences and quantities",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">VM</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">VendorMitra</div>
                <div className="text-xs text-gray-500">B2B Marketplace</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search suppliers, products..."
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setAuthType("login")
                  setShowAuthModal(true)
                }}
                className="text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Button>

              <Button
                onClick={() => {
                  setAuthType("register")
                  setShowAuthModal(true)
                }}
                className="vm-btn-primary"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Professional Gradient */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-bg.png')",
          }}
        >
          <div className="absolute inset-0 vm-gradient-hero opacity-90"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              {/* Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                <span className="text-sm font-medium">India's First B2B Food Marketplace</span>
              </div>

              {/* Main Heading */}
              <h1 className="vm-heading-xl text-white mb-6">
                Connect Street Food Vendors with <span className="text-green-400">Trusted</span> Suppliers
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                VendorMitra revolutionizes how street food vendors source quality raw materials. Get better prices,
                verified suppliers, and on-time delivery - all in one platform.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center text-white/90">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-sm">Verified Suppliers</span>
                </div>
                <div className="flex items-center text-white/90">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-sm">Best Prices</span>
                </div>
                <div className="flex items-center text-white/90">
                  <Truck className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-sm">Quick Delivery</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg shadow-lg"
                  onClick={() => {
                    setUserType("vendor")
                    setAuthType("register")
                    setShowAuthModal(true)
                  }}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Start as Vendor
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-lg bg-transparent"
                  onClick={() => {
                    setUserType("supplier")
                    setAuthType("register")
                    setShowAuthModal(true)
                  }}
                >
                  <Package className="mr-2 h-5 w-5" />
                  Become Supplier
                </Button>
              </div>

              {/* Success Message */}
              <p className="text-sm text-white/80 mt-4">
                Join thousands of vendors already saving 15-30% on procurement costs
              </p>
            </div>

            {/* Right Stats Card */}
            <div className="lg:justify-self-end">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-w-md">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${stat.color === "text-blue-600" ? "bg-blue-100" : stat.color === "text-green-600" ? "bg-green-100" : stat.color === "text-purple-600" ? "bg-purple-100" : "bg-orange-100"}`}
                        >
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600">
                      Join thousands of vendors already saving 15-30% on procurement costs
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Platform Features</Badge>
            <h2 className="vm-heading-lg text-gray-900 mb-4">
              Everything You Need to <span className="vm-text-primary">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed specifically for the Indian street food ecosystem
            </p>
          </div>

          {/* For Vendors */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="vm-heading-md vm-text-secondary mb-4">For Vendors</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {vendorFeatures.map((feature, index) => (
                <Card key={index} className="feature-card group">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${feature.color}`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {feature.badge}
                    </Badge>
                    <h4 className="font-semibold text-lg text-gray-900 mb-3">{feature.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* For Suppliers */}
          <div>
            <div className="text-center mb-12">
              <h3 className="vm-heading-md vm-text-primary mb-4">For Suppliers</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {supplierFeatures.map((feature, index) => (
                <Card key={index} className="feature-card group">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${feature.color}`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {feature.badge}
                    </Badge>
                    <h4 className="font-semibold text-lg text-gray-900 mb-3">{feature.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100">Platform Benefits</Badge>
            <h2 className="vm-heading-lg text-gray-900 mb-4">Why Choose VendorMitra?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-lg text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 vm-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="vm-heading-lg text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of vendors and suppliers who are already growing their business with VendorMitra
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4"
              onClick={() => {
                setAuthType("register")
                setShowAuthModal(true)
              }}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 bg-transparent"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">VM</span>
                </div>
                <div>
                  <div className="text-xl font-bold">VendorMitra</div>
                  <div className="text-sm text-gray-400">B2B Marketplace</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6">Connecting street food vendors with trusted suppliers across India</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Find Suppliers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Group Orders
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Inventory Management
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Quality Assurance
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Suppliers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Sell Products
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Order Management
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Payment Tracking
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 VendorMitra. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made in India 🇮🇳</span>
              <span className="text-gray-400 text-sm">GST Compliant</span>
              <span className="text-gray-400 text-sm">Secure Payments</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authType}
        userType={userType}
        onTypeChange={setAuthType}
        onUserTypeChange={setUserType}
      />
    </div>
  )
}
