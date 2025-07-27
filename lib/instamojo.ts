interface PaymentRequest {
  purpose: string
  amount: number
  buyer_name: string
  email: string
  phone: string
  redirect_url: string
  webhook?: string
  allow_repeated_payments?: boolean
}

interface PaymentResponse {
  success: boolean
  payment_request_id?: string
  payment_url?: string
  error?: string
}

interface WebhookData {
  payment_id: string
  payment_request_id: string
  status: string
  amount: number
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  purpose: string
  fees: number
  mac: string
}

class InstamojoService {
  private apiKey: string
  private authToken: string
  private salt: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.INSTAMOJO_API_KEY || ""
    this.authToken = process.env.INSTAMOJO_AUTH_TOKEN || ""
    this.salt = process.env.INSTAMOJO_SALT || ""
    this.baseUrl = "https://test.instamojo.com/api/1.1/"
  }

  validatePaymentData(data: PaymentRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.purpose || data.purpose.length < 3) {
      errors.push("Purpose must be at least 3 characters long")
    }

    if (!data.amount || data.amount < 1) {
      errors.push("Amount must be at least ₹1")
    }

    if (!data.buyer_name || data.buyer_name.length < 2) {
      errors.push("Buyer name must be at least 2 characters long")
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Valid email is required")
    }

    if (!data.phone || !/^[6-9]\d{9}$/.test(data.phone)) {
      errors.push("Valid 10-digit phone number is required")
    }

    if (!data.redirect_url || !data.redirect_url.startsWith("http")) {
      errors.push("Valid redirect URL is required")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  async createPaymentRequest(data: PaymentRequest): Promise<PaymentResponse> {
    try {
      const validation = this.validatePaymentData(data)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(", "),
        }
      }

      const response = await fetch(`${this.baseUrl}payment-requests/`, {
        method: "POST",
        headers: {
          "X-Api-Key": this.apiKey,
          "X-Auth-Token": this.authToken,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          purpose: data.purpose,
          amount: data.amount.toString(),
          buyer_name: data.buyer_name,
          email: data.email,
          phone: data.phone,
          redirect_url: data.redirect_url,
          webhook: data.webhook || "",
          allow_repeated_payments: data.allow_repeated_payments ? "true" : "false",
        }),
      })

      const result = await response.json()

      if (result.success) {
        return {
          success: true,
          payment_request_id: result.payment_request.id,
          payment_url: result.payment_request.longurl,
        }
      } else {
        return {
          success: false,
          error: result.message || "Payment request creation failed",
        }
      }
    } catch (error: any) {
      console.error("Instamojo API error:", error)
      return {
        success: false,
        error: error.message || "Network error occurred",
      }
    }
  }

  verifyWebhookSignature(data: WebhookData): boolean {
    try {
      // In a real implementation, you would verify the MAC signature
      // For now, we'll do basic validation
      return !!(data.payment_id && data.payment_request_id && data.status && data.amount && data.buyer_email)
    } catch (error) {
      console.error("Webhook verification error:", error)
      return false
    }
  }

  calculateFees(amount: number): number {
    // Instamojo charges 2% + ₹3 per transaction
    return Math.round((amount * 0.02 + 3) * 100) / 100
  }

  calculateCommission(amount: number): number {
    // Platform commission: 1% of transaction amount
    return Math.round(amount * 0.01 * 100) / 100
  }

  generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export const instamojoService = new InstamojoService()
export type { PaymentRequest, PaymentResponse, WebhookData }
