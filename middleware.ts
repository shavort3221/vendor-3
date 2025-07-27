import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/payment',
    '/api/payment'
  ]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Skip middleware for API routes that don't need auth
  const publicApiRoutes = [
    '/api/status',
    '/api/payment/webhook'
  ]

  const isPublicApiRoute = publicApiRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (isPublicApiRoute) {
    return NextResponse.next()
  }

  // For protected routes, we'll let the client-side handle auth checks
  // This middleware can be extended for server-side auth validation
  if (isProtectedRoute) {
    // Add any server-side auth logic here if needed
    // For now, we'll let the client handle auth
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
