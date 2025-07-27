import { NextRequest, NextResponse } from 'next/server'
import { instamojoService } from '@/lib/instamojo'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentRequestId = searchParams.get('payment_request_id')
    const orderId = searchParams.get('order_id')

    if (!paymentRequestId && !orderId) {
      return NextResponse.json(
        { error: 'Missing payment_request_id or order_id parameter' },
        { status: 400 }
      )
    }

    let transaction

    if (paymentRequestId) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('payment_request_id', paymentRequestId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        )
      }
      transaction = data
    } else if (orderId) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('order_id', orderId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        )
      }
      transaction = data
    }

    // Get order details
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', transaction.order_id)
      .single()

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        fees: transaction.fees,
        commission_amount: transaction.commission_amount,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at
      },
      order: order ? {
        id: order.id,
        status: order.status,
        payment_status: order.payment_status,
        total: order.total,
        created_at: order.created_at
      } : null
    })

  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
