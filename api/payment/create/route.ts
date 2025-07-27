import { NextRequest, NextResponse } from 'next/server'
import { instamojoService, type PaymentRequest } from '@/lib/instamojo'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, items, buyerDetails, groupOrderId } = body

    // Validate required fields
    if (!orderId || !items || !buyerDetails) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, items, buyerDetails' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0)
    const deliveryCharges = body.deliveryCharges || 0
    const totalAmount = subtotal + deliveryCharges

    // Validate amount
    if (totalAmount < 1) {
      return NextResponse.json(
        { error: 'Total amount must be at least ₹1' },
        { status: 400 }
      )
    }

    // Create payment purpose
    const purpose = groupOrderId 
      ? `Group Order Payment - ${groupOrderId}`
      : `Order Payment - ${orderId}`

    // Prepare payment request data
    const paymentData: PaymentRequest = {
      purpose,
      amount: totalAmount,
      buyer_name: buyerDetails.name,
      email: buyerDetails.email,
      phone: buyerDetails.phone,
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?order_id=${orderId}`,
    }

    // Validate payment data
    const validation = instamojoService.validatePaymentData(paymentData)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: validation.errors },
        { status: 400 }
      )
    }

    // Create payment request with Instamojo
    const paymentResponse = await instamojoService.createPaymentRequest(paymentData)

    if (!paymentResponse.success) {
      return NextResponse.json(
        { error: paymentResponse.error || 'Failed to create payment request' },
        { status: 500 }
      )
    }

    // Calculate fees and commission
    const fees = instamojoService.calculateFees(totalAmount)
    const commissionAmount = instamojoService.calculateCommission(totalAmount)

    // Create transaction record in database
    const transactionData = {
      id: instamojoService.generateTransactionId(),
      order_id: orderId,
      payment_request_id: paymentResponse.payment_request_id,
      amount: totalAmount,
      fees,
      commission_amount: commissionAmount,
      status: 'pending',
      buyer_email: buyerDetails.email,
      buyer_name: buyerDetails.name,
      gateway_response: paymentResponse,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { error: transactionError } = await supabase
      .from('transactions')
      .insert(transactionData)

    if (transactionError) {
      console.error('Error creating transaction record:', transactionError)
      // Don't fail the payment request if transaction record fails
    }

    // Update order with payment information
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        payment_id: paymentResponse.payment_request_id,
        payment_status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (orderError) {
      console.error('Error updating order:', orderError)
    }

    return NextResponse.json({
      success: true,
      payment_request_id: paymentResponse.payment_request_id,
      payment_url: paymentResponse.payment_url,
      amount: totalAmount,
      fees,
      commission_amount: commissionAmount,
      message: 'Payment request created successfully'
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
