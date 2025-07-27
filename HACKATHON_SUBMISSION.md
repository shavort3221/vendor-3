# VendorMitra - Hackathon Submission

## 🏆 Project Overview

**VendorMitra** is a comprehensive B2B marketplace platform designed specifically for the Indian street food ecosystem. It connects street food vendors with suppliers of raw materials, creating a seamless digital supply chain.

## 🎯 Problem Statement

Street food vendors in India face significant challenges:
- **Fragmented Supply Chain**: No centralized platform for sourcing raw materials
- **Price Inconsistency**: Lack of transparency in pricing and bulk purchasing options
- **Quality Issues**: Difficulty in finding reliable suppliers
- **Operational Inefficiency**: Manual ordering processes and poor inventory management
- **Limited Access**: Small vendors struggle to access wholesale markets

## 💡 Solution

VendorMitra provides a complete digital marketplace with:

### For Vendors:
- **Marketplace**: Browse and order raw materials from verified suppliers
- **Group Buying**: Join collective purchasing to get better prices
- **Order Management**: Track orders, manage inventory, and view history
- **Supplier Network**: Connect with reliable suppliers with ratings and reviews
- **Profile Management**: Complete business profile with verification

### For Suppliers:
- **Order Management**: Handle incoming orders with status tracking
- **Product Catalog**: Manage inventory and pricing
- **Analytics Dashboard**: Track revenue, orders, and performance metrics
- **Vendor Management**: Build relationships with street food vendors
- **Business Intelligence**: Insights into demand patterns and popular products

## 🚀 Key Features Implemented

### ✅ Authentication & User Management
- **Role-based Authentication**: Separate flows for vendors and suppliers
- **Profile Completion**: Guided onboarding for new users
- **Session Management**: Secure login/logout with persistent sessions
- **Email Verification**: Complete signup flow with verification

### ✅ Vendor Dashboard
- **Marketplace**: Product browsing with search and filtering
- **Shopping Cart**: Add products and manage quantities
- **Order History**: Track past orders and their status
- **Supplier Directory**: View and contact suppliers
- **Group Orders**: Join collective purchasing initiatives
- **Profile Management**: Business details and verification status

### ✅ Supplier Dashboard
- **Order Management**: Accept/reject orders, update status
- **Product Catalog**: CRUD operations for inventory
- **Analytics**: Revenue tracking, order metrics, performance insights
- **Vendor Relations**: Customer management and communication
- **Business Profile**: Company details and verification

### ✅ Technical Features
- **Real-time Updates**: Live order status and notifications
- **Responsive Design**: Mobile-first approach for street vendors
- **Data Security**: Row Level Security (RLS) policies
- **Error Handling**: Comprehensive error management and user feedback
- **Performance**: Optimized loading and caching

## 🛠️ Technical Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component library

### Backend
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Relational database
- **Row Level Security**: Data protection policies
- **Real-time Subscriptions**: Live updates

### Authentication
- **Supabase Auth**: Secure authentication system
- **Role-based Access**: Vendor/Supplier permissions
- **Session Management**: Persistent login states

### Development Tools
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Hot Reload**: Fast development

## 📊 Database Schema

### Core Tables
- **profiles**: User roles and basic info
- **vendor_profiles**: Street food vendor details
- **supplier_profiles**: Raw material supplier details
- **products**: Product catalog with pricing
- **orders**: Order management
- **order_items**: Order line items

### Security
- **Row Level Security (RLS)**: Data access control
- **Foreign Key Constraints**: Referential integrity
- **Indexing**: Performance optimization

## 🎮 Demo Instructions

### Quick Start
1. **Visit**: `/demo` - Complete demo guide
2. **Setup**: `/test-setup` - Create demo accounts
3. **Test**: `/test` - Authentication testing
4. **Live**: `/` - Main application

### Demo Accounts

#### Vendor Accounts
- **Raj's Chaat Corner**
  - Email: `vendor1@test.com`
  - Password: `Test123!`
- **Delhi Dosa Point**
  - Email: `vendor2@test.com`
  - Password: `Test123!`

#### Supplier Accounts
- **Mumbai Fresh Vegetables Ltd**
  - Email: `supplier1@test.com`
  - Password: `Test123!`
- **Delhi Spice Traders**
  - Email: `supplier2@test.com`
  - Password: `Test123!`

### Demo Scenarios

#### Vendor Experience
1. **Registration**: Sign up as vendor with business details
2. **Marketplace**: Browse products from suppliers
3. **Ordering**: Add items to cart and place orders
4. **Management**: Track orders and manage suppliers
5. **Group Buying**: Join collective purchasing

#### Supplier Experience
1. **Registration**: Sign up as supplier with company details
2. **Catalog**: Manage product inventory and pricing
3. **Orders**: Handle incoming orders from vendors
4. **Analytics**: View business performance metrics
5. **Relations**: Manage vendor relationships

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation
\`\`\`bash
# Clone repository
git clone <repository-url>
cd vendor-1

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Add your Supabase credentials

# Database setup
# Run scripts/setup-database.sql in Supabase SQL Editor

# Start development server
npm run dev
\`\`\`

### Environment Variables
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## 🎯 Impact & Innovation

### Social Impact
- **Empowering Street Vendors**: Digital access to wholesale markets
- **Reducing Food Waste**: Better inventory management
- **Price Transparency**: Fair pricing through competition
- **Quality Assurance**: Verified supplier network

### Economic Impact
- **Cost Reduction**: Bulk purchasing and group buying
- **Revenue Growth**: Better supplier relationships
- **Operational Efficiency**: Streamlined ordering process
- **Market Access**: Connecting small vendors to large suppliers

### Innovation
- **Role-based UX**: Tailored experience for different user types
- **Group Buying**: Collective purchasing for better prices
- **Real-time Analytics**: Business intelligence for vendors
- **Mobile-first**: Designed for street vendor accessibility

## 🚀 Future Roadmap

### Phase 2 Features
- **Payment Integration**: Instamojo payment gateway
- **Delivery Tracking**: Real-time delivery updates
- **Quality Ratings**: Product and supplier reviews
- **Inventory Alerts**: Low stock notifications
- **Financial Analytics**: Profit/loss tracking

### Phase 3 Features
- **AI Recommendations**: Product suggestions
- **Predictive Analytics**: Demand forecasting
- **Mobile App**: Native iOS/Android apps
- **Multi-language**: Regional language support
- **API Integration**: Third-party integrations

## 🏆 Hackathon Achievements

### ✅ Completed Features
- [x] Complete authentication system
- [x] Role-based dashboards
- [x] Product catalog management
- [x] Order management system
- [x] Analytics and reporting
- [x] Responsive design
- [x] Database schema and security
- [x] Demo accounts and testing
- [x] Error handling and validation
- [x] Documentation and guides

### 🎯 Technical Excellence
- **Modern Stack**: Latest Next.js and React versions
- **Type Safety**: Full TypeScript implementation
- **Security**: Row Level Security and proper authentication
- **Performance**: Optimized loading and caching
- **UX/UI**: Professional design with shadcn/ui
- **Testing**: Comprehensive demo and testing tools

### 🌟 Innovation Highlights
- **Role-based Architecture**: Separate experiences for vendors and suppliers
- **Group Buying**: Collective purchasing mechanism
- **Real-time Features**: Live updates and notifications
- **Mobile-first Design**: Optimized for street vendor accessibility
- **Comprehensive Analytics**: Business intelligence for both user types

## 📞 Contact & Support

### Team Information
- **Project**: VendorMitra
- **Category**: B2B Marketplace
- **Technology**: Next.js, Supabase, TypeScript
- **Status**: Hackathon Ready

### Demo Access
- **Live Demo**: Available at project URL
- **Test Accounts**: Pre-configured demo accounts
- **Documentation**: Complete setup and usage guides
- **Support**: Ready for hackathon presentation

---

**VendorMitra** - Empowering India's Street Food Ecosystem through Digital Innovation! 🚀
