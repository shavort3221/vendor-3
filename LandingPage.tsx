"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Users, TrendingUp, Shield, MapPin, Star, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"
import { AuthModal } from "@/components/AuthModal"

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "register">("login")
  const [userType, setUserType] = useState<"vendor" | "supplier">("vendor")
  const [language, setLanguage] = useState<"en" | "hi">("en")

  const content = {
    en: {
      hero: {
        title: "Connect Street Food Vendors with Trusted Suppliers",
        subtitle:
          "VendorMitra bridges the gap between street food vendors and verified raw material suppliers across India",
        cta: "Get Started Today",
      },
      features: [
        {
          icon: ShoppingCart,
          title: "Smart Inventory Management",
          description: "Track stock levels, get low-stock alerts, and predict demand based on your order history",
        },
        {
          icon: Users,
          title: "Group Buying Power",
          description: "Join other vendors to place bulk orders and get better rates from suppliers",
        },
        {
          icon: MapPin,
          title: "Location-Based Discovery",
          description: "Find verified suppliers within 5-10km radius with real-time availability",
        },
        {
          icon: Shield,
          title: "Quality Assurance",
          description: "Photo-based quality verification and rating system ensures consistent quality",
        },
        {
          icon: TrendingUp,
          title: "AI-Powered Insights",
          description: "Get demand predictions and smart restocking alerts based on local events and weather",
        },
        {
          icon: Star,
          title: "Trust & Transparency",
          description: "Verified suppliers, transparent pricing, and community reviews build trust",
        },
      ],
      stats: [
        { number: "1000+", label: "Active Vendors" },
        { number: "500+", label: "Verified Suppliers" },
        { number: "₹50L+", label: "Monthly GMV" },
        { number: "4.8★", label: "Average Rating" },
      ],
    },
    hi: {
      hero: {
        title: "स्ट्रीट फूड विक्रेताओं को विश्वसनीय आपूर्तिकर्ताओं से जोड़ें",
        subtitle: "वेंडरमित्र भारत भर में स्ट्रीट फूड विक्रेताओं और सत्यापित कच्चे माल आपूर्तिकर्ताओं के बीच की खाई को पाटता है",
        cta: "आज ही शुरू करें",
      },
      features: [
        {
          icon: ShoppingCart,
          title: "स्मार्ट इन्वेंटरी प्रबंधन",
          description: "स्टॉक स्तर ट्रैक करें, कम स्टॉक अलर्ट प्राप्त करें, और अपने ऑर्डर इतिहास के आधार पर मांग की भविष्यवाणी करें",
        },
        {
          icon: Users,
          title: "समूहिक खरीदारी शक्ति",
          description: "बल्क ऑर्डर देने और आपूर्तिकर्ताओं से बेहतर दरें पाने के लिए अन्य विक्रेताओं के साथ जुड़ें",
        },
        {
          icon: MapPin,
          title: "स्थान-आधारित खोज",
          description: "5-10 किमी त्रिज्या के भीतर वास्तविक समय उपलब्धता के साथ सत्यापित आपूर्तिकर्ता खोजें",
        },
        {
          icon: Shield,
          title: "गुणवत्ता आश्वासन",
          description: "फोटो-आधारित गुणवत्ता सत्यापन और रेटिंग सिस्टम निरंतर गुणवत्ता सुनिश्चित करता है",
        },
        {
          icon: TrendingUp,
          title: "AI-संचालित अंतर्दृष्टि",
          description: "स्थानीय घटनाओं और मौसम के आधार पर मांग की भविष्यवाणी और स्मार्ट रीस्टॉकिंग अलर्ट प्राप्त करें",
        },
        {
          icon: Star,
          title: "विश्वास और पारदर्शिता",
          description: "सत्यापित आपूर्तिकर्ता, पारदर्शी मूल्य निर्धारण, और सामुदायिक समीक्षाएं विश्वास निर्माण करती हैं",
        },
      ],
      stats: [
        { number: "1000+", label: "सक्रिय विक्रेता" },
        { number: "500+", label: "सत्यापित आपूर्तिकर्ता" },
        { number: "₹50L+", label: "मासिक GMV" },
        { number: "4.8★", label: "औसत रेटिंग" },
      ],
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VendorMitra</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="flex items-center space-x-1"
              >
                <Globe className="w-4 h-4" />
                <span>{language === "en" ? "हिंदी" : "English"}</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setAuthType("login")
                  setShowAuthModal(true)
                }}
              >
                {language === "en" ? "Login" : "लॉगिन"}
              </Button>

              <Button
                onClick={() => {
                  setAuthType("register")
                  setShowAuthModal(true)
                }}
              >
                {language === "en" ? "Sign Up" : "साइन अप"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 mb-6 ${language === "hi" ? "hindi-text" : ""}`}>
            {currentContent.hero.title}
          </h1>
          <p className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto ${language === "hi" ? "hindi-text" : ""}`}>
            {currentContent.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                setUserType("vendor")
                setAuthType("register")
                setShowAuthModal(true)
              }}
            >
              {language === "en" ? "Join as Vendor" : "विक्रेता के रूप में जुड़ें"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              onClick={() => {
                setUserType("supplier")
                setAuthType("register")
                setShowAuthModal(true)
              }}
            >
              {language === "en" ? "Join as Supplier" : "आपूर्तिकर्ता के रूप में जुड़ें"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {currentContent.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className={`text-gray-600 ${language === "hi" ? "hindi-text" : ""}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${language === "hi" ? "hindi-text" : ""}`}
            >
              {language === "en" ? "Why Choose VendorMitra?" : "वेंडरमित्र क्यों चुनें?"}
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${language === "hi" ? "hindi-text" : ""}`}>
              {language === "en"
                ? "Empowering street food vendors with technology-driven solutions for better business outcomes"
                : "बेहतर व्यावसायिक परिणामों के लिए प्रौद्योगिकी-संचालित समाधानों के साथ स्ट्रीट फूड विक्रेताओं को सशक्त बनाना"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className={`text-xl mb-2 ${language === "hi" ? "hindi-text" : ""}`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`text-gray-600 ${language === "hi" ? "hindi-text" : ""}`}>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${language === "hi" ? "hindi-text" : ""}`}
            >
              {language === "en" ? "How It Works" : "यह कैसे काम करता है"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Vendor Flow */}
            <div>
              <h3 className={`text-2xl font-bold text-gray-900 mb-6 ${language === "hi" ? "hindi-text" : ""}`}>
                {language === "en" ? "For Vendors" : "विक्रेताओं के लिए"}
              </h3>
              <div className="space-y-4">
                {[
                  language === "en" ? "Register & verify your business" : "अपना व्यवसाय पंजीकृत और सत्यापित करें",
                  language === "en"
                    ? "Browse nearby suppliers & compare prices"
                    : "आस-पास के आपूर्तिकर्ताओं को ब्राउज़ करें और कीमतों की तुलना करें",
                  language === "en" ? "Join group orders for better rates" : "बेहतर दरों के लिए समूहिक ऑर्डर में शामिल हों",
                  language === "en" ? "Track delivery & rate quality" : "डिलीवरी ट्रैक करें और गुणवत्ता की रेटिंग दें",
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className={`text-gray-700 ${language === "hi" ? "hindi-text" : ""}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplier Flow */}
            <div>
              <h3 className={`text-2xl font-bold text-gray-900 mb-6 ${language === "hi" ? "hindi-text" : ""}`}>
                {language === "en" ? "For Suppliers" : "आपूर्तिकर्ताओं के लिए"}
              </h3>
              <div className="space-y-4">
                {[
                  language === "en" ? "Register with GST & trade license" : "GST और ट्रेड लाइसेंस के साथ पंजीकरण करें",
                  language === "en" ? "Set up product catalog with pricing" : "मूल्य निर्धारण के साथ उत्पाद कैटलॉग सेट करें",
                  language === "en" ? "Receive & manage orders" : "ऑर्डर प्राप्त करें और प्रबंधित करें",
                  language === "en" ? "Schedule delivery & get paid" : "डिलीवरी शेड्यूल करें और भुगतान प्राप्त करें",
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className={`text-gray-700 ${language === "hi" ? "hindi-text" : ""}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${language === "hi" ? "hindi-text" : ""}`}>
            {language === "en" ? "Ready to Transform Your Business?" : "अपने व्यवसाय को बदलने के लिए तैयार हैं?"}
          </h2>
          <p className={`text-xl text-blue-100 mb-8 max-w-2xl mx-auto ${language === "hi" ? "hindi-text" : ""}`}>
            {language === "en"
              ? "Join thousands of vendors and suppliers who are already growing their business with VendorMitra"
              : "हजारों विक्रेताओं और आपूर्तिकर्ताओं में शामिल हों जो पहले से ही वेंडरमित्र के साथ अपना व्यवसाय बढ़ा रहे हैं"}
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => {
              setAuthType("register")
              setShowAuthModal(true)
            }}
          >
            {currentContent.hero.cta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VM</span>
                </div>
                <span className="text-xl font-bold">VendorMitra</span>
              </div>
              <p className={`text-gray-400 ${language === "hi" ? "hindi-text" : ""}`}>
                {language === "en"
                  ? "Connecting street food vendors with trusted suppliers across India"
                  : "भारत भर में स्ट्रीट फूड विक्रेताओं को विश्वसनीय आपूर्तिकर्ताओं से जोड़ना"}
              </p>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 ${language === "hi" ? "hindi-text" : ""}`}>
                {language === "en" ? "For Vendors" : "विक्रेताओं के लिए"}
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className={`hover:text-white ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "en" ? "Find Suppliers" : "आपूर्तिकर्ता खोजें"}
                  </Link>
                </li>
                <li>
                  <Link href="#" className={`hover:text-white ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "en" ? "Group Orders" : "समूहिक ऑर्डर"}
                  </Link>
                </li>
                <li>
                  <Link href="#" className={`hover:text-white ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "en" ? "Inventory Management" : "इन्वेंटरी प्रबंधन"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 ${language === "hi" ? "hindi-text" : ""}`}>
                {language === "en" ? "For Suppliers" : "आपूर्तिकर्ताओं के लिए"}
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className={`hover:text-white ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "en" ? "Sell Products" : "उत्पाद बेचें"}
                  </Link>
                </li>
                <li>
                  <Link href="#" className={`hover:text-white ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "en" ? "Order Management" : "ऑर्डर प्रबंधन"}
                  </Link>
                </li>
                <li>
                  <Link href="#" className={`hover:text-white ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "en" ? "Analytics" : "एनालिटिक्स"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 ${language === "hi" ? "hindi-text" : ""}`}>
                {language === "en" ? "Support" : "सहायता"}
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className={`hover:text-white ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "en" ? "Help Center" : "सहायता केंद्र"}
                  </Link>
                </li>
                <li>
                  <Link href="#" className={`hover:text-white ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "en" ? "Contact Us" : "संपर्क करें"}
                  </Link>
                </li>
                <li>
                  <Link href="#" className={`hover:text-white ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "en" ? "Privacy Policy" : "गोपनीयता नीति"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VendorMitra. All rights reserved.</p>
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
