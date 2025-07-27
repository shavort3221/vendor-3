'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Something went wrong!</CardTitle>
          <p className="text-gray-600 mt-2">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
            <p className="font-medium">Error Details:</p>
            <p className="font-mono text-xs mt-1">{error.message}</p>
            {error.digest && (
              <p className="font-mono text-xs mt-1">Digest: {error.digest}</p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
