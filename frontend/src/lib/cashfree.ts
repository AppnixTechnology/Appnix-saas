import crypto from "crypto";
import { getStoredOrders } from "@/lib/transactions-store";

export interface CashfreeCustomerDetails {
  customer_id: string;
  customer_email?: string;
  customer_phone: string;
  customer_name?: string;
}

export interface CashfreeOrderMeta {
  return_url: string;
  notify_url?: string;
  payment_methods?: string;
}

export interface CreateCashfreeOrderParams {
  order_id: string;
  order_amount: number;
  order_currency?: string;
  customer_details: CashfreeCustomerDetails;
  order_meta: CashfreeOrderMeta;
  order_note?: string;
}

export interface CashfreeOrderResponse {
  cf_order_id: string | number;
  order_id: string;
  payment_session_id: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED";
  order_amount: number;
  order_currency: string;
  payment_link?: string;
  entity?: string;
}

export interface CashfreePaymentEntity {
  cf_payment_id: string | number;
  order_id: string;
  payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED" | "CANCELLED";
  payment_amount: number;
  payment_currency: string;
  payment_message?: string;
  payment_time?: string;
  payment_completion_time?: string;
  payment_group?: string;
  payment_method?: Record<string, any>;
}

export class CashfreeAPIError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly type?: string;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 500, code: string = "cashfree_api_error", details?: any) {
    super(message);
    this.name = "CashfreeAPIError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class CashfreeService {
  private readonly appId: string;
  private readonly secretKey: string;
  private readonly env: "TEST" | "PRODUCTION";
  private readonly apiVersion: string;
  private readonly baseUrl: string;

  constructor() {
    this.appId = process.env.CASHFREE_APP_ID || "";
    this.secretKey = process.env.CASHFREE_SECRET_KEY || "";
    this.env = (process.env.CASHFREE_ENV || (process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ? "PRODUCTION" : "TEST")).toUpperCase() as "TEST" | "PRODUCTION";
    this.apiVersion = process.env.CASHFREE_API_VERSION || "2023-08-01";
    this.baseUrl =
      this.env === "PRODUCTION"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";
  }

  public isLiveConfigured(): boolean {
    return (
      Boolean(this.appId) &&
      Boolean(this.secretKey) &&
      !this.appId.includes("dummy") &&
      !this.appId.includes("your_cashfree") &&
      !this.appId.startsWith("TEST10345678")
    );
  }

  private getHeaders(): Record<string, string> {
    return {
      "x-client-id": this.appId,
      "x-client-secret": this.secretKey,
      "x-api-version": this.apiVersion,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      ...(options.headers as Record<string, string>),
    };

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (err: any) {
      throw new CashfreeAPIError(`Cashfree network connection failed: ${err.message}`, 503, "network_error");
    }

    const responseText = await response.text();
    let data: any = {};
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText };
      }
    }

    if (!response.ok) {
      const errorMsg = data.message || data.error || `Cashfree API returned HTTP ${response.status}`;
      const errorCode = data.code || `http_${response.status}`;
      throw new CashfreeAPIError(errorMsg, response.status, errorCode, data);
    }

    return data as T;
  }

  public async createOrder(params: CreateCashfreeOrderParams): Promise<CashfreeOrderResponse> {
    if (this.isLiveConfigured()) {
      return this.request<CashfreeOrderResponse>("/orders", {
        method: "POST",
        body: JSON.stringify({
          order_id: params.order_id,
          order_amount: params.order_amount,
          order_currency: params.order_currency || "INR",
          customer_details: params.customer_details,
          order_meta: params.order_meta,
          order_note: params.order_note,
        }),
      });
    }

    const mockSessionId = `session_mock_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const mockPaymentLink = `${this.baseUrl}/orders/${params.order_id}`;

    return {
      cf_order_id: `cf_${Date.now()}`,
      order_id: params.order_id,
      payment_session_id: mockSessionId,
      order_status: "ACTIVE",
      order_amount: params.order_amount,
      order_currency: params.order_currency || "INR",
      payment_link: mockPaymentLink,
    };
  }

  public async getOrder(orderId: string): Promise<CashfreeOrderResponse> {
    if (this.isLiveConfigured() && !orderId.startsWith("cf_ord_mock")) {
      return this.request<CashfreeOrderResponse>(`/orders/${encodeURIComponent(orderId)}`, {
        method: "GET",
      });
    }

    let orderStatus: CashfreeOrderResponse["order_status"] = "ACTIVE";
    let orderAmount = 999.0;
    try {
      const stored = getStoredOrders();
      const found = stored.find((o: any) => o.orderId === orderId);
      if (found) {
        orderAmount = Number(found.amount) || 999.0;
        if (found.status === "SUCCESS") {
          orderStatus = "PAID";
        } else if (found.status === "FAILED" || found.status === "USER_DROPPED") {
          orderStatus = "TERMINATED";
        } else {
          orderStatus = "ACTIVE";
        }
      }
    } catch {}

    return {
      cf_order_id: `cf_${orderId}`,
      order_id: orderId,
      payment_session_id: `session_${orderId}`,
      order_status: orderStatus,
      order_amount: orderAmount,
      order_currency: "INR",
    };
  }

  public async getOrderPayments(orderId: string): Promise<CashfreePaymentEntity[]> {
    if (this.isLiveConfigured() && !orderId.startsWith("cf_ord_mock")) {
      return this.request<CashfreePaymentEntity[]>(`/orders/${encodeURIComponent(orderId)}/payments`, {
        method: "GET",
      });
    }

    let paymentStatus: "SUCCESS" | "FAILED" | "PENDING" = "PENDING";
    let paymentAmount = 0;
    let paymentId = `pending_${orderId}`;
    let paymentMethod = "upi";

    try {
      const stored = getStoredOrders();
      const found = stored.find((o: any) => o.orderId === orderId);
      if (found) {
        paymentAmount = Number(found.amount) || 999.0;
        if (found.status === "SUCCESS") {
          paymentStatus = "SUCCESS";
          paymentId = found.cfPaymentId || `cf_pay_${Date.now()}`;
          paymentMethod = found.paymentMethod || "upi";
        } else if (found.status === "FAILED" || found.status === "USER_DROPPED") {
          paymentStatus = "FAILED";
          paymentId = `cf_declined_${Date.now()}`;
        }
      }
    } catch {}

    return [
      {
        cf_payment_id: paymentId,
        order_id: orderId,
        payment_status: paymentStatus,
        payment_amount: paymentAmount,
        payment_currency: "INR",
        payment_group: paymentMethod,
        payment_time: new Date().toISOString(),
      },
    ];
  }

  public verifyWebhookSignature(rawBody: string, signature: string | null, timestamp: string | null): boolean {
    if (!signature || !timestamp) {
      return false;
    }

    if (!this.isLiveConfigured() && signature.startsWith("sim_wh_")) {
      return true;
    }

    try {
      const dataToSign = `${timestamp}${rawBody}`;
      const computed = crypto
        .createHmac("sha256", this.secretKey)
        .update(dataToSign)
        .digest("base64");

      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
    } catch {
      return false;
    }
  }
}

export const cashfree = new CashfreeService();
export default cashfree;
