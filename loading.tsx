import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading VendorMitra
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare your experience...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
