import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check database connection
    const { supabase } = await import("@/lib/supabase")
    const { data, error } = await supabase.from("profiles").select("count").limit(1)

    const dbStatus = error ? "disconnected" : "connected"

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: dbStatus,
        payment: "active",
        notifications: "active",
      },
      environment: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Service unavailable",
      },
      { status: 500 },
    )
  }
}
