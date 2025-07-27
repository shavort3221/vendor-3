"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AuthModal from "@/components/AuthModal"
import { ChefHat, Truck, ShoppingCart, Users, TrendingUp, Shield, Star, ArrowRight, CheckCircle } from "lucide-react"

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")

  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  const features = [
    {
      icon: <ShoppingCart className="h-8 w-8 text-orange-600" />,
      title: "Easy Ordering",
      description: "Browse products, add to cart, and place orders with just a few clicks",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Verified Suppliers",
      description: "Connect with trusted suppliers who understand your business needs",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Business Analytics",
      description: "Track your orders, expenses, and business growth with detailed insights",
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing with multiple payment options",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      business: "Kumar's Street Food",
      rating: 5,
      comment:
        "VendorMitra has transformed how I source ingredients. The quality is consistent and delivery is always on time.",
    },
    {
      name: "Priya Sharma",
      business: "Fresh Supplies Co.",
      rating: 5,
      comment: "As a supplier, this platform has helped me reach more vendors and grow my business significantly.",
    },
    {
      name: "Mohammed Ali",
      business: "Ali's Food Corner",
      rating: 5,
      comment: "The ordering process is so simple, and the customer support is excellent. Highly recommended!",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <ChefHat className="h-8 w-8 text-orange-600" />
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold gradient-text">VendorMitra</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => openAuthModal("signin")}>
                Sign In
              </Button>
              <Button onClick={() => openAuthModal("signup")}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Connecting Street Food Vendors with Suppliers
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your <span className="gradient-text">Business Partner</span>
            <br />
            for Street Food Success
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            VendorMitra is the ultimate B2B marketplace connecting street food vendors with reliable suppliers.
            Streamline your sourcing, manage orders, and grow your business with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => openAuthModal("signup")}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => openAuthModal("signin")}>
              I'm Already a Member
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for street food vendors and suppliers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Vendors Section */}
      <section className="py-20 px-4 gradient-bg">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <ChefHat className="h-8 w-8 text-orange-600 mr-3" />
                <Badge variant="secondary">For Vendors</Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Focus on Cooking,
                <br />
                We'll Handle the <span className="gradient-text">Sourcing</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Spend more time creating delicious food and less time worrying about ingredients. Our platform connects
                you with reliable suppliers who understand your needs.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Browse products from verified suppliers",
                  "Compare prices and quality ratings",
                  "Track orders and delivery status",
                  "Manage your business expenses",
                  "Get bulk discounts and special offers",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" onClick={() => openAuthModal("signup")}>
                Join as Vendor
              </Button>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Street food vendor"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* For Suppliers Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <img src="/placeholder.svg?height=400&width=500" alt="Food supplier" className="rounded-lg shadow-xl" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-blue-600 mr-3" />
                <Badge variant="secondary">For Suppliers</Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Expand Your Reach,
                <br />
                <span className="gradient-text">Grow Your Business</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Connect with hundreds of street food vendors looking for quality ingredients. Manage your inventory,
                process orders, and build lasting business relationships.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Reach more customers across your city",
                  "Manage inventory and product listings",
                  "Process orders efficiently",
                  "Track sales and business analytics",
                  "Build customer relationships",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" onClick={() => openAuthModal("signup")}>
                Join as Supplier
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 gradient-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="gradient-text">Community</span> Says
            </h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied vendors and suppliers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.business}</CardDescription>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join VendorMitra today and become part of India's fastest-growing food business community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => openAuthModal("signup")}>
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-6 w-6 text-orange-600" />
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="text-xl font-bold">VendorMitra</span>
              </div>
              <p className="text-gray-400">
                Connecting street food vendors with suppliers for seamless business operations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Browse Products</li>
                <li>Place Orders</li>
                <li>Track Deliveries</li>
                <li>Business Analytics</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Suppliers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>List Products</li>
                <li>Manage Orders</li>
                <li>Customer Management</li>
                <li>Sales Reports</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VendorMitra. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} mode={authMode} onModeChange={setAuthMode} />
    </div>
  )
}
