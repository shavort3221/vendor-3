import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'VendorMitra API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      features: {
        authentication: true,
        payment: true,
        analytics: true,
        groupOrders: true
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Service unavailable'
      },
      { status: 500 }
    )
  }
}
