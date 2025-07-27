# VendorMitra Authentication System Guide

## 🎯 Overview

VendorMitra implements a complete role-based authentication system that supports both **vendors** and **suppliers** with separate signup and login flows.

## 🚀 How to Access Authentication

### 1. **Main Homepage** (`/`)
- Click **"Sign In"** button → Opens login modal
- Click **"Join Now"** button → Opens registration modal
- Automatic role selection (Vendor/Supplier) during signup

### 2. **Dedicated Auth Test Page** (`/auth-test`)
- Complete authentication testing interface
- Quick login buttons for demo accounts
- Real-time user status display
- Form validation and error handling

### 3. **Demo Guide** (`/demo`)
- Comprehensive demo instructions
- Pre-configured test accounts
- Step-by-step authentication flow

## 🔐 Authentication Features

### ✅ **Login System**
- **Email/Password Authentication**: Secure login with Supabase Auth
- **Role-based Access**: Automatic redirection to appropriate dashboard
- **Session Management**: Persistent login across browser sessions
- **Error Handling**: Clear error messages for invalid credentials

### ✅ **Signup System**
- **Role Selection**: Choose between Vendor or Supplier during registration
- **Profile Creation**: Automatic creation of user profiles in database
- **Email Verification**: Complete signup flow with email verification
- **Business Details**: Collect role-specific information

### ✅ **User Types**

#### **Vendor Registration**
- **Business Name**: Street food business name
- **Phone Number**: Contact information
- **Address**: Complete business address
- **Food Type**: Type of food served (e.g., Chaat, South Indian)
- **Location**: City, State, Pincode

#### **Supplier Registration**
- **Company Name**: Business entity name
- **Phone Number**: Contact information
- **Address**: Complete business address
- **GST Number**: Business registration number
- **Location**: City, State, Pincode

## 🎮 Demo Accounts

### **Vendor Test Accounts**
\`\`\`
Account 1:
- Email: vendor1@test.com
- Password: Test123!
- Business: Raj's Chaat Corner
- Location: Mumbai

Account 2:
- Email: vendor2@test.com
- Password: Test123!
- Business: Delhi Dosa Point
- Location: Delhi
\`\`\`

### **Supplier Test Accounts**
\`\`\`
Account 1:
- Email: supplier1@test.com
- Password: Test123!
- Company: Mumbai Fresh Vegetables Ltd
- Location: Mumbai

Account 2:
- Email: supplier2@test.com
- Password: Test123!
- Company: Delhi Spice Traders
- Location: Delhi
\`\`\`

## 🔄 Authentication Flow

### **1. Login Process**
\`\`\`
1. User clicks "Sign In" on homepage
2. AuthModal opens with login form
3. User enters email and password
4. Supabase Auth validates credentials
5. User profile is loaded from database
6. User is redirected to role-specific dashboard:
   - Vendors → /dashboard/vendor
   - Suppliers → /dashboard/supplier
\`\`\`

### **2. Signup Process**
\`\`\`
1. User clicks "Join Now" on homepage
2. AuthModal opens with registration form
3. User selects role (Vendor/Supplier)
4. User fills in required business details
5. Supabase Auth creates user account
6. User profile is created in database
7. Email verification is sent
8. User completes profile setup
9. User is redirected to role-specific dashboard
\`\`\`

### **3. Profile Completion**
\`\`\`
1. New users without complete profiles see ProfileCompletion component
2. User fills in missing business details
3. Role-specific profile is created (vendor_profiles or supplier_profiles)
4. User is redirected to appropriate dashboard
\`\`\`

## 🛠️ Technical Implementation

### **Key Components**

#### **AuthModal** (`components/AuthModal.tsx`)
- Handles both login and signup forms
- Role selection interface
- Form validation and error handling
- Integration with AuthContext

#### **AuthContext** (`contexts/AuthContext.tsx`)
- Manages authentication state
- Provides signIn, signUp, signOut functions
- Handles user profile loading
- Session management

#### **Database Schema**
\`\`\`sql
-- Core user profiles
profiles (user_id, role, created_at)

-- Vendor-specific profiles
vendor_profiles (user_id, business_name, food_type, location, etc.)

-- Supplier-specific profiles
supplier_profiles (user_id, company_name, gst_number, location, etc.)
\`\`\`

### **Security Features**
- **Row Level Security (RLS)**: Database-level access control
- **Email Verification**: Required for new accounts
- **Password Validation**: Secure password requirements
- **Session Management**: Secure token handling
- **Error Handling**: Comprehensive error management

## 🎯 Testing the Authentication System

### **Quick Test Steps**
1. **Visit** `/auth-test` for comprehensive testing
2. **Use Quick Login** buttons for instant access
3. **Test Registration** with new email addresses
4. **Verify Role-based Routing** to appropriate dashboards

### **Manual Testing**
1. **Login Test**:
   - Use demo account credentials
   - Verify successful login
   - Check role-based redirection

2. **Signup Test**:
   - Create new account with different email
   - Select vendor or supplier role
   - Fill in business details
   - Verify profile creation

3. **Error Handling Test**:
   - Try invalid credentials
   - Test duplicate email registration
   - Verify error messages

## 🔧 Environment Setup

### **Required Environment Variables**
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### **Database Setup**
1. Run `scripts/setup-database.sql` in Supabase SQL Editor
2. Enable Row Level Security policies
3. Configure authentication settings in Supabase dashboard

## 🎉 Success Indicators

### **Login Success**
- ✅ User is authenticated
- ✅ Profile data is loaded
- ✅ Redirected to appropriate dashboard
- ✅ Session persists across page refresh

### **Signup Success**
- ✅ User account is created
- ✅ Profile is saved to database
- ✅ Email verification is sent
- ✅ User can complete profile setup

### **Role-based Access**
- ✅ Vendors access vendor dashboard
- ✅ Suppliers access supplier dashboard
- ✅ Proper navigation and features
- ✅ Data isolation between roles

## 🚀 Ready for Production

The authentication system is **production-ready** with:
- ✅ Complete user management
- ✅ Role-based access control
- ✅ Security best practices
- ✅ Error handling and validation
- ✅ Demo accounts for testing
- ✅ Comprehensive documentation

---

**VendorMitra Authentication System** - Secure, Role-based, and Production Ready! 🔐
