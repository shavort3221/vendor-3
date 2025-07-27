"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, Users, Package, CheckCircle, XCircle } from "lucide-react"

const TEST_ACCOUNTS = [
  {
    email: "vendor1@test.com",
    password: "Test123!",
    role: "vendor" as const,
    businessName: "Raj's Chaat Corner",
    phone: "9876543210",
    address: "Andheri West, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400058",
    foodType: "chaat"
  },
  {
    email: "vendor2@test.com",
    password: "Test123!",
    role: "vendor" as const,
    businessName: "Delhi Dosa Point",
    phone: "9876543211",
    address: "Connaught Place, Delhi",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    foodType: "meals"
  },
  {
    email: "supplier1@test.com",
    password: "Test123!",
    role: "supplier" as const,
    businessName: "Mumbai Fresh Vegetables Ltd",
    phone: "9876543212",
    address: "Vashi Market, Navi Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400703",
    gstNumber: "27ABCDE1234F1Z5"
  },
  {
    email: "supplier2@test.com",
    password: "Test123!",
    role: "supplier" as const,
    businessName: "Delhi Spice Traders",
    phone: "9876543213",
    address: "Khari Baoli, Old Delhi",
    city: "Delhi",
    state: "Delhi",
    pincode: "110006",
    gstNumber: "07FGHIJ5678K2L9"
  }
]

export default function TestSetupPage() {
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<{[key: string]: string}>({})
  const { signIn, signUp, user, signOut } = useAuth()

  const createTestAccount = async (account: typeof TEST_ACCOUNTS[0]) => {
    setLoading(true)
    try {
      const result = await signUp(account.email, account.password, {
        role: account.role,
        businessName: account.businessName,
        phone: account.phone,
        address: account.address,
        city: account.city,
        state: account.state,
        pincode: account.pincode,
        gstNumber: account.gstNumber || "",
        foodType: account.foodType || ""
      })
      
      if (result.error) {
        setTestResults(prev => ({
          ...prev,
          [account.email]: `❌ ${result.error}`
        }))
        toast.error(`Failed to create ${account.email}: ${result.error}`)
      } else {
        setTestResults(prev => ({
          ...prev,
          [account.email]: `✅ Account created successfully`
        }))
        toast.success(`${account.email} created successfully!`)
      }
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [account.email]: `❌ ${error.message}`
      }))
      toast.error(`Error creating ${account.email}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async (account: typeof TEST_ACCOUNTS[0]) => {
    setLoading(true)
    try {
      const result = await signIn(account.email, account.password)
      
      if (result.error) {
        setTestResults(prev => ({
          ...prev,
          [`${account.email}_login`]: `❌ ${result.error}`
        }))
        toast.error(`Login failed for ${account.email}: ${result.error}`)
      } else {
        setTestResults(prev => ({
          ...prev,
          [`${account.email}_login`]: `✅ Login successful`
        }))
        toast.success(`Login successful for ${account.email}!`)
      }
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [`${account.email}_login`]: `❌ ${error.message}`
      }))
      toast.error(`Login error for ${account.email}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testSupabaseConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      if (error) {
        setTestResults(prev => ({
          ...prev,
          connection: `❌ ${error.message}`
        }))
        toast.error(`Supabase Error: ${error.message}`)
      } else {
        setTestResults(prev => ({
          ...prev,
          connection: `✅ Connected successfully`
        }))
        toast.success("Supabase Connected Successfully")
      }
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        connection: `❌ ${error.message}`
      }))
      toast.error(`Connection Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createAllTestAccounts = async () => {
    setLoading(true)
    for (const account of TEST_ACCOUNTS) {
      await createTestAccount(account)
      // Small delay between creations
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    setLoading(false)
  }

  const testAllLogins = async () => {
    setLoading(true)
    for (const account of TEST_ACCOUNTS) {
      await testLogin(account)
      await signOut()
      // Small delay between logins
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">VendorMitra Test Setup</CardTitle>
            <p className="text-center text-gray-600">
              Create demo accounts and test authentication functionality
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Setup Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Test Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testSupabaseConnection} 
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Test Supabase Connection
              </Button>

              <Button 
                onClick={createAllTestAccounts} 
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create All Test Accounts
              </Button>

              <Button 
                onClick={testAllLogins} 
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Test All Logins
              </Button>

              {testResults.connection && (
                <div className="p-3 bg-gray-100 rounded text-sm">
                  <strong>Connection Test:</strong> {testResults.connection}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current User Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Current User Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <div className="p-3 bg-green-100 rounded">
                    <strong>✅ Logged In</strong>
                    <div className="text-sm mt-1">
                      <div>Email: {user.email}</div>
                      <div>Role: {user.role || 'No role assigned'}</div>
                      <div>ID: {user.id}</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => signOut()} 
                    className="w-full"
                    variant="outline"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-gray-100 rounded">
                  <strong>❌ Not Logged In</strong>
                  <div className="text-sm mt-1">No user session active</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Accounts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Demo Test Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="vendors" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vendors" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Vendors
                </TabsTrigger>
                <TabsTrigger value="suppliers" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Suppliers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vendors" className="space-y-4">
                {TEST_ACCOUNTS.filter(acc => acc.role === 'vendor').map((account) => (
                  <Card key={account.email} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{account.businessName}</h3>
                        <p className="text-sm text-gray-600">{account.email}</p>
                        <p className="text-sm text-gray-500">{account.city}, {account.state}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => createTestAccount(account)}
                          disabled={loading}
                        >
                          Create
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testLogin(account)}
                          disabled={loading}
                        >
                          Test Login
                        </Button>
                      </div>
                    </div>
                    {testResults[account.email] && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        {testResults[account.email]}
                      </div>
                    )}
                    {testResults[`${account.email}_login`] && (
                      <div className="mt-1 p-2 bg-gray-100 rounded text-sm">
                        Login: {testResults[`${account.email}_login`]}
                      </div>
                    )}
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="suppliers" className="space-y-4">
                {TEST_ACCOUNTS.filter(acc => acc.role === 'supplier').map((account) => (
                  <Card key={account.email} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{account.businessName}</h3>
                        <p className="text-sm text-gray-600">{account.email}</p>
                        <p className="text-sm text-gray-500">{account.city}, {account.state}</p>
                        <p className="text-sm text-gray-500">GST: {account.gstNumber}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => createTestAccount(account)}
                          disabled={loading}
                        >
                          Create
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testLogin(account)}
                          disabled={loading}
                        >
                          Test Login
                        </Button>
                      </div>
                    </div>
                    {testResults[account.email] && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        {testResults[account.email]}
                      </div>
                    )}
                    {testResults[`${account.email}_login`] && (
                      <div className="mt-1 p-2 bg-gray-100 rounded text-sm">
                        Login: {testResults[`${account.email}_login`]}
                      </div>
                    )}
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Access Links */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="w-full">
                <a href="/">Home Page</a>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <a href="/test">Simple Test</a>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <a href="/dashboard">Dashboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
