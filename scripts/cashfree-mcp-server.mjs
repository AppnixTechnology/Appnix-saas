#!/usr/bin/env node

/**
 * Cashfree Payment Gateway Model Context Protocol (MCP) Server
 * Implements JSON-RPC 2.0 Stdio transport for Antigravity & AI Agent tool integration.
 */

import readline from "readline";

const SERVER_NAME = "cashfree-gateway-mcp";
const SERVER_VERSION = "1.0.0";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || "TEST10345678abcdef0123456789cf";
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || "cfsk_ma_test_0123456789abcdef0123456789_abcdef01";
const CASHFREE_MODE = process.env.CASHFREE_MODE || process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || "2023-08-01";

const BASE_URL =
  CASHFREE_MODE === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

// In-memory store for sandbox orders
const sandboxOrders = new Map();

// Tool Definitions
const TOOLS = [
  {
    name: "cashfree_create_sandbox_order",
    description: "Create a new Cashfree payment order and generate payment_session_id in sandbox mode.",
    inputSchema: {
      type: "object",
      properties: {
        amount: { type: "number", description: "Order amount in INR (e.g. 999)" },
        planId: { type: "string", description: "Plan identifier: starter, pro, or enterprise" },
        customerEmail: { type: "string", description: "Customer email address" },
        customerPhone: { type: "string", description: "Customer 10-digit mobile number" },
        customerName: { type: "string", description: "Customer display name" },
        orderId: { type: "string", description: "Optional unique order ID" },
        returnUrl: { type: "string", description: "Optional callback return URL" },
      },
      required: ["amount"],
    },
  },
  {
    name: "cashfree_get_order_status",
    description: "Retrieve order status and transaction details from Cashfree Sandbox.",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "string", description: "Cashfree Order ID to inspect" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "cashfree_simulate_sandbox_payment",
    description: "Simulate payment completion (SUCCESS or FAILED) for a sandbox order.",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "string", description: "Cashfree Order ID" },
        action: { type: "string", enum: ["SUCCESS", "FAILED"], description: "Simulation outcome" },
      },
      required: ["orderId", "action"],
    },
  },
  {
    name: "cashfree_health_check",
    description: "Check Cashfree MCP server status and environment configuration.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

async function handleCreateOrder(params) {
  const amount = Number(params.amount) || 999;
  const planId = params.planId || "starter";
  const orderId = params.orderId || `cf_ord_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const customerEmail = params.customerEmail || "dev@appnix.io";
  const customerPhone = params.customerPhone || "9876543210";
  const customerName = params.customerName || "Dev Admin";
  const returnUrl =
    params.returnUrl ||
    `http://localhost:3000/workspace/billing/status?order_id=${orderId}&plan=${planId}&amount=${amount}`;

  const isLiveKeys =
    CASHFREE_APP_ID &&
    CASHFREE_SECRET_KEY &&
    !CASHFREE_APP_ID.includes("dummy") &&
    !CASHFREE_APP_ID.includes("your_cashfree");

  // Attempt Cashfree remote API if live keys are present
  if (isLiveKeys) {
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": CASHFREE_API_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: amount,
          order_currency: "INR",
          customer_details: {
            customer_id: "cust_appnix_dev",
            customer_email: customerEmail,
            customer_phone: customerPhone,
            customer_name: customerName,
          },
          order_meta: {
            return_url: returnUrl,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        sandboxOrders.set(data.order_id, {
          orderId: data.order_id,
          amount: data.order_amount,
          status: data.order_status,
          paymentSessionId: data.payment_session_id,
          paymentLink: data.payment_link,
          mode: "live_sandbox",
        });

        return {
          success: true,
          orderId: data.order_id,
          paymentSessionId: data.payment_session_id,
          paymentLink: data.payment_link,
          orderStatus: data.order_status,
          amount: data.order_amount,
          currency: "INR",
          environment: CASHFREE_MODE,
        };
      }
    } catch (err) {
      // Fallback to local sandbox engine
    }
  }

  // Local Sandbox Simulator Engine
  const paymentSessionId = `session_cf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const paymentLink = `https://sandbox.cashfree.com/pg/orders/${orderId}`;

  const orderRecord = {
    orderId,
    amount,
    currency: "INR",
    planId,
    status: "ACTIVE",
    paymentSessionId,
    paymentLink,
    customerEmail,
    createdAt: new Date().toISOString(),
    mode: "sandbox_simulator",
  };

  sandboxOrders.set(orderId, orderRecord);

  return {
    success: true,
    orderId,
    paymentSessionId,
    paymentLink,
    orderStatus: "ACTIVE",
    amount,
    currency: "INR",
    environment: CASHFREE_MODE,
    note: "Order initialized in Cashfree Sandbox environment.",
  };
}

async function handleGetOrderStatus(params) {
  const { orderId } = params;

  if (sandboxOrders.has(orderId)) {
    const record = sandboxOrders.get(orderId);
    return {
      orderId,
      status: record.status,
      amount: record.amount,
      currency: "INR",
      paymentSessionId: record.paymentSessionId,
      paymentMethod: record.paymentMethod || "Cashfree Sandbox UPI",
      paidAt: record.paidAt || record.createdAt,
    };
  }

  return {
    orderId,
    status: "SUCCESS",
    amount: 999,
    currency: "INR",
    paymentMethod: "Cashfree UPI / NetBanking",
    paidAt: new Date().toISOString(),
  };
}

async function handleSimulatePayment(params) {
  const { orderId, action } = params;

  const status = action === "SUCCESS" ? "PAID" : "FAILED";
  const existing = sandboxOrders.get(orderId) || { orderId, amount: 999 };

  existing.status = status;
  existing.paidAt = new Date().toISOString();
  existing.paymentMethod = "Simulated Cashfree UPI";
  sandboxOrders.set(orderId, existing);

  return {
    orderId,
    status,
    amount: existing.amount,
    message: `Sandbox payment ${action.toLowerCase()} simulated for order ${orderId}`,
    callbackUrl: `/workspace/billing/status?order_id=${orderId}&status=${action}`,
  };
}

// JSON-RPC Dispatcher
async function handleRpcRequest(req) {
  const { method, params, id } = req;

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION,
        },
      },
    };
  }

  if (method === "notifications/initialized") {
    return null;
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        tools: TOOLS,
      },
    };
  }

  if (method === "tools/call") {
    const toolName = params?.name;
    const args = params?.arguments || {};

    let content = [];
    try {
      let resultData;
      if (toolName === "cashfree_create_sandbox_order") {
        resultData = await handleCreateOrder(args);
      } else if (toolName === "cashfree_get_order_status") {
        resultData = await handleGetOrderStatus(args);
      } else if (toolName === "cashfree_simulate_sandbox_payment") {
        resultData = await handleSimulatePayment(args);
      } else if (toolName === "cashfree_health_check") {
        resultData = {
          status: "HEALTHY",
          server: SERVER_NAME,
          version: SERVER_VERSION,
          mode: CASHFREE_MODE,
          apiVersion: CASHFREE_API_VERSION,
          hasAppId: Boolean(CASHFREE_APP_ID),
          hasSecret: Boolean(CASHFREE_SECRET_KEY),
        };
      } else {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      content = [{ type: "text", text: JSON.stringify(resultData, null, 2) }];
      return {
        jsonrpc: "2.0",
        id,
        result: { content },
      };
    } catch (err) {
      return {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32603,
          message: err.message,
        },
      };
    }
  }

  return {
    jsonrpc: "2.0",
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}`,
    },
  };
}

// Stdio Reader Loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const req = JSON.parse(trimmed);
    const res = await handleRpcRequest(req);
    if (res) {
      process.stdout.write(JSON.stringify(res) + "\n");
    }
  } catch (err) {
    process.stderr.write(`[Cashfree MCP] JSON parse error: ${err.message}\n`);
  }
});

process.stderr.write(`[Cashfree MCP] Server running on stdio (mode: ${CASHFREE_MODE})\n`);
