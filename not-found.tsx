import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Search className="h-16 w-16 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-gray-800">Page Not Found</CardTitle>
          <p className="text-gray-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-6xl font-bold text-gray-300 mb-4">404</p>
            <p className="text-gray-600">
              Don't worry! You can navigate back to our main pages.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact our support team</p>
            <p className="mt-1">
              <Link href="/demo" className="text-blue-600 hover:underline">
                View Demo Guide
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
