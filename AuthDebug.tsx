"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export function AuthDebug() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState("")
  const { signIn, signUp, user } = useAuth()

  const testSupabaseConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      if (error) {
        setTestResult(`❌ Supabase Error: ${error.message}`)
      } else {
        setTestResult(`✅ Supabase Connected Successfully`)
      }
    } catch (error) {
      setTestResult(`❌ Connection Error: ${error}`)
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
        state: "Test State"
      })
      
      if (result.error) {
        setTestResult(`❌ Sign Up Error: ${result.error}`)
      } else {
        setTestResult(`✅ Sign Up Successful`)
      }
    } catch (error) {
      setTestResult(`❌ Sign Up Exception: ${error}`)
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
      } else {
        setTestResult(`✅ Sign In Successful`)
      }
    } catch (error) {
      setTestResult(`❌ Sign In Exception: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Auth Debug Panel</CardTitle>
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
            Role: {user.role}<br />
            ID: {user.id}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
