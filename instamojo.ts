import crypto from 'crypto'

// Instamojo API Configuration
const INSTAMOJO_CONFIG = {
  apiKey: process.env.INSTAMOJO_API_KEY || '12be9a96f3a0b8f5c441a53c27270486',
  authToken: process.env.INSTAMOJO_AUTH_TOKEN || 'a5b2ac01aa42fb31c51646b1931f470b',
  salt: process.env.INSTAMOJO_SALT || 'bd3918a0506e42bdb1d6c28ff238b3dc',
  baseUrl: 'https://test.instamojo.com/api/1.1', // Use test URL for development
  webhookUrl: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook` : 'http://localhost:3000/api/payment/webhook'
}

// Payment Status Types
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded' | 'cancelled'

// Payment Request Interface
export interface PaymentRequest {
  purpose: string
  amount: number
  buyer_name: string
  email: string
  phone: string
  redirect_url: string
  webhook_url?: string
  send_email?: boolean
  send_sms?: boolean
  allow_repeated_payments?: boolean
}

// Payment Response Interface
export interface PaymentResponse {
  success: boolean
  payment_request_id?: string
  payment_url?: string
  error?: string
  message?: string
}

// Webhook Data Interface
export interface WebhookData {
  payment_id: string
  payment_request_id: string
  status: PaymentStatus
  amount: number
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  purpose: string
  fees: number
  mac: string
}

// Transaction Record Interface
export interface TransactionRecord {
  id: string
  order_id: string
  payment_id: string
  payment_request_id: string
  amount: number
  fees: number
  commission_amount: number
  status: PaymentStatus
  buyer_email: string
  buyer_name: string
  gateway_response: any
  created_at: Date
  updated_at: Date
}

class InstamojoService {
  private apiKey: string
  private authToken: string
  private salt: string
  private baseUrl: string
  private webhookUrl: string

  constructor() {
    this.apiKey = INSTAMOJO_CONFIG.apiKey
    this.authToken = INSTAMOJO_CONFIG.authToken
    this.salt = INSTAMOJO_CONFIG.salt
    this.baseUrl = INSTAMOJO_CONFIG.baseUrl
    this.webhookUrl = INSTAMOJO_CONFIG.webhookUrl
  }

  // Generate MAC (Message Authentication Code) for webhook verification
  private generateMAC(data: any): string {
    const macData = [
      data.payment_id,
      data.payment_request_id,
      data.status,
      data.amount,
      data.buyer_name,
      data.buyer_email,
      data.buyer_phone,
      data.purpose,
      data.fees
    ].join('|')

    return crypto.createHmac('sha1', this.salt).update(macData).digest('hex')
  }

  // Verify webhook signature
  public verifyWebhookSignature(data: WebhookData): boolean {
    const expectedMAC = this.generateMAC(data)
    return expectedMAC === data.mac
  }

  // Create payment request
  public async createPaymentRequest(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-requests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.apiKey,
          'X-Auth-Token': this.authToken,
        },
        body: JSON.stringify({
          ...paymentData,
          webhook_url: this.webhookUrl,
          send_email: true,
          send_sms: true,
          allow_repeated_payments: false
        })
      })

      const data = await response.json()

      if (data.success) {
        return {
          success: true,
          payment_request_id: data.payment_request.id,
          payment_url: data.payment_request.longurl,
          message: 'Payment request created successfully'
        }
      } else {
        return {
          success: false,
          error: data.message || 'Failed to create payment request'
        }
      }
    } catch (error) {
      console.error('Instamojo API Error:', error)
      return {
        success: false,
        error: 'Network error while creating payment request'
      }
    }
  }

  // Get payment details
  public async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}/`, {
        method: 'GET',
        headers: {
          'X-Api-Key': this.apiKey,
          'X-Auth-Token': this.authToken,
        }
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching payment details:', error)
      throw error
    }
  }

  // Calculate commission (2.5% platform fee)
  public calculateCommission(amount: number): number {
    return Math.round(amount * 0.025 * 100) / 100 // 2.5% commission
  }

  // Calculate fees (Instamojo charges)
  public calculateFees(amount: number): number {
    // Instamojo charges: 2% + ₹3 for domestic cards
    return Math.round((amount * 0.02 + 3) * 100) / 100
  }

  // Generate unique transaction ID
  public generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Format amount for display
  public formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  // Validate payment data
  public validatePaymentData(paymentData: PaymentRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!paymentData.purpose || paymentData.purpose.length < 3) {
      errors.push('Purpose must be at least 3 characters long')
    }

    if (!paymentData.amount || paymentData.amount < 1) {
      errors.push('Amount must be at least ₹1')
    }

    if (!paymentData.buyer_name || paymentData.buyer_name.length < 2) {
      errors.push('Buyer name must be at least 2 characters long')
    }

    if (!paymentData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
      errors.push('Valid email address is required')
    }

    if (!paymentData.phone || !/^[6-9]\d{9}$/.test(paymentData.phone)) {
      errors.push('Valid 10-digit phone number is required')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Export singleton instance
export const instamojoService = new InstamojoService()

// Export types
export type { PaymentRequest, PaymentResponse, WebhookData, TransactionRecord }
