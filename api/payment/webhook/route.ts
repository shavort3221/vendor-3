import { NextRequest, NextResponse } from 'next/server'
import { instamojoService, type WebhookData } from '@/lib/instamojo'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract webhook data
    const webhookData: WebhookData = {
      payment_id: body.payment_id,
      payment_request_id: body.payment_request_id,
      status: body.status,
      amount: parseFloat(body.amount),
      buyer_name: body.buyer_name,
      buyer_email: body.buyer_email,
      buyer_phone: body.buyer_phone,
      purpose: body.purpose,
      fees: parseFloat(body.fees || '0'),
      mac: body.mac
    }

    // Verify webhook signature
    if (!instamojoService.verifyWebhookSignature(webhookData)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('Webhook received:', webhookData)

    // Find the transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('payment_request_id', webhookData.payment_request_id)
      .single()

    if (transactionError || !transaction) {
      console.error('Transaction not found:', webhookData.payment_request_id)
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Update transaction status
    const { error: updateTransactionError } = await supabase
      .from('transactions')
      .update({
        status: webhookData.status,
        gateway_response: webhookData,
        updated_at: new Date().toISOString()
      })
      .eq('payment_request_id', webhookData.payment_request_id)

    if (updateTransactionError) {
      console.error('Error updating transaction:', updateTransactionError)
    }

    // Update order status based on payment status
    let orderStatus = 'pending'
    let paymentStatus = 'pending'

    switch (webhookData.status) {
      case 'success':
        orderStatus = 'confirmed'
        paymentStatus = 'success'
        break
      case 'failed':
        orderStatus = 'cancelled'
        paymentStatus = 'failed'
        break
      case 'refunded':
        orderStatus = 'cancelled'
        paymentStatus = 'refunded'
        break
      default:
        orderStatus = 'pending'
        paymentStatus = webhookData.status
    }

    // Update order
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.order_id)

    if (orderError) {
      console.error('Error updating order:', orderError)
    }

    // If payment is successful, notify supplier
    if (webhookData.status === 'success') {
      try {
        // Get order details
        const { data: order } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', transaction.order_id)
          .single()

        if (order) {
          // Create notification for supplier
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              user_id: order.supplier_id,
              type: 'payment_received',
              title: 'Payment Received',
              message: `Payment of ₹${webhookData.amount} received for order ${transaction.order_id}`,
              data: {
                order_id: transaction.order_id,
                amount: webhookData.amount,
                payment_id: webhookData.payment_id
              },
              created_at: new Date().toISOString()
            })

          if (notificationError) {
            console.error('Error creating notification:', notificationError)
          }
        }
      } catch (error) {
        console.error('Error processing successful payment:', error)
      }
    }

    // Handle group order payments
    if (webhookData.purpose.includes('Group Order')) {
      try {
        // Extract group order ID from purpose
        const groupOrderMatch = webhookData.purpose.match(/Group Order Payment - (.+)/)
        if (groupOrderMatch) {
          const groupOrderId = groupOrderMatch[1]
          
          // Update group order status
          const { error: groupOrderError } = await supabase
            .from('group_orders')
            .update({
              payment_status: paymentStatus,
              updated_at: new Date().toISOString()
            })
            .eq('id', groupOrderId)

          if (groupOrderError) {
            console.error('Error updating group order:', groupOrderError)
          }
        }
      } catch (error) {
        console.error('Error processing group order payment:', error)
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Instamojo webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
