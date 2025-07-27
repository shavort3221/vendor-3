"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function TestPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState("")
  const { signIn, signUp, user, signOut } = useAuth()

  const testSupabaseConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      if (error) {
        setTestResult(`❌ Supabase Error: ${error.message}`)
        toast.error(`Supabase Error: ${error.message}`)
      } else {
        setTestResult(`✅ Supabase Connected Successfully`)
        toast.success("Supabase Connected Successfully")
      }
    } catch (error) {
      setTestResult(`❌ Connection Error: ${error}`)
      toast.error(`Connection Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignUp = async () => {
    setLoading(true)
    try {
      const result = await signUp(email, password, {
        role: "vendor",
        businessName: "Test Business",
        phone: "1234567890",
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        pincode: "123456"
      })
      
      if (result.error) {
        setTestResult(`❌ Sign Up Error: ${result.error}`)
        toast.error(`Sign Up Error: ${result.error}`)
      } else {
        setTestResult(`✅ Sign Up Successful`)
        toast.success("Sign Up Successful")
      }
    } catch (error) {
      setTestResult(`❌ Sign Up Exception: ${error}`)
      toast.error(`Sign Up Exception: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignIn = async () => {
    setLoading(true)
    try {
      const result = await signIn(email, password)
      
      if (result.error) {
        setTestResult(`❌ Sign In Error: ${result.error}`)
        toast.error(`Sign In Error: ${result.error}`)
      } else {
        setTestResult(`✅ Sign In Successful`)
        toast.success("Sign In Successful")
      }
    } catch (error) {
      setTestResult(`❌ Sign In Exception: ${error}`)
      toast.error(`Sign In Exception: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setTestResult("✅ Signed Out Successfully")
      toast.success("Signed Out Successfully")
    } catch (error) {
      setTestResult(`❌ Sign Out Error: ${error}`)
      toast.error(`Sign Out Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>VendorMitra Test Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
            />
          </div>

          <div className="space-y-2">
            <Button 
              onClick={testSupabaseConnection} 
              disabled={loading}
              className="w-full"
            >
              Test Supabase Connection
            </Button>
            
            <Button 
              onClick={testSignUp} 
              disabled={loading}
              className="w-full"
            >
              Test Sign Up
            </Button>
            
            <Button 
              onClick={testSignIn} 
              disabled={loading}
              className="w-full"
            >
              Test Sign In
            </Button>

            {user && (
              <Button 
                onClick={handleSignOut} 
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                Sign Out
              </Button>
            )}
          </div>

          {testResult && (
            <div className="p-3 bg-gray-100 rounded text-sm">
              <strong>Test Result:</strong><br />
              {testResult}
            </div>
          )}

          {user && (
            <div className="p-3 bg-green-100 rounded text-sm">
              <strong>Current User:</strong><br />
              Email: {user.email}<br />
              Role: {user.role || 'No role assigned'}<br />
              ID: {user.id}
            </div>
          )}

          <div className="text-center">
            <a href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
