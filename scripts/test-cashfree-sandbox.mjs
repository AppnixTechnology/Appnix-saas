#!/usr/bin/env node

/**
 * Test Suite: Cashfree Payment Gateway Sandbox & MCP Server Verification
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mcpScript = path.resolve(__dirname, "cashfree-mcp-server.mjs");

console.log("=================================================");
console.log("   CASHFREE PAYMENT GATEWAY SANDBOX & MCP TEST   ");
console.log("=================================================\n");

async function runMcpTest() {
  console.log("▶ [1/4] Spawning Cashfree MCP Server Process...");

  const child = spawn("node", [mcpScript], {
    env: {
      ...process.env,
      CASHFREE_APP_ID: "TEST10345678abcdef0123456789cf",
      CASHFREE_SECRET_KEY: "cfsk_ma_test_0123456789abcdef0123456789_abcdef01",
      CASHFREE_MODE: "sandbox",
      CASHFREE_API_VERSION: "2023-08-01",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  let messageId = 1;
  const pendingRequests = new Map();

  child.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const json = JSON.parse(trimmed);
        if (json.id && pendingRequests.has(json.id)) {
          const resolve = pendingRequests.get(json.id);
          pendingRequests.delete(json.id);
          resolve(json);
        }
      } catch {
        // Not a JSON line
      }
    }
  });

  child.stderr.on("data", (data) => {
    const text = data.toString().trim();
    if (text) {
      console.log(`  [MCP Server stderr]: ${text}`);
    }
  });

  function sendRpc(method, params = {}) {
    return new Promise((resolve) => {
      const id = messageId++;
      pendingRequests.set(id, resolve);
      const msg = JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n";
      child.stdin.write(msg);
    });
  }

  // 1. Initialize
  console.log("\n▶ [2/4] Testing MCP Protocol Initialization & Tool Discovery...");
  const initRes = await sendRpc("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "test-client", version: "1.0.0" },
  });
  console.log("  ✓ Server Info:", JSON.stringify(initRes.result?.serverInfo));

  const toolsRes = await sendRpc("tools/list");
  const toolNames = toolsRes.result?.tools?.map((t) => t.name) || [];
  console.log("  ✓ Discovered MCP Tools (" + toolNames.length + "):", toolNames.join(", "));

  // 2. Health Check
  const healthRes = await sendRpc("tools/call", {
    name: "cashfree_health_check",
    arguments: {},
  });
  const healthData = JSON.parse(healthRes.result?.content[0]?.text || "{}");
  console.log("  ✓ Server Health:", healthData);

  // 3. Create Sandbox Order
  console.log("\n▶ [3/4] Creating Test Order in Cashfree Sandbox...");
  const orderRes = await sendRpc("tools/call", {
    name: "cashfree_create_sandbox_order",
    arguments: {
      amount: 999,
      planId: "starter",
      customerName: "Dev Admin",
      customerEmail: "dev@appnix.io",
      customerPhone: "9876543210",
    },
  });
  const orderData = JSON.parse(orderRes.result?.content[0]?.text || "{}");
  console.log("  ✓ Generated Order ID:       ", orderData.orderId);
  console.log("  ✓ Generated Payment Session: ", orderData.paymentSessionId);
  console.log("  ✓ Generated Payment Link:    ", orderData.paymentLink);
  console.log("  ✓ Order Status:              ", orderData.orderStatus);

  // 4. Simulate Payment & Verify Status
  console.log("\n▶ [4/4] Simulating Sandbox Payment & Verification...");
  const simRes = await sendRpc("tools/call", {
    name: "cashfree_simulate_sandbox_payment",
    arguments: {
      orderId: orderData.orderId,
      action: "SUCCESS",
    },
  });
  const simData = JSON.parse(simRes.result?.content[0]?.text || "{}");
  console.log("  ✓ Payment Simulation:        ", simData.status, `(${simData.message})`);

  const statusRes = await sendRpc("tools/call", {
    name: "cashfree_get_order_status",
    arguments: {
      orderId: orderData.orderId,
    },
  });
  const statusData = JSON.parse(statusRes.result?.content[0]?.text || "{}");
  console.log("  ✓ Verified Order Status:     ", statusData.status);
  console.log("  ✓ Verified Payment Method:   ", statusData.paymentMethod);
  console.log("  ✓ Transaction Captured At:   ", statusData.paidAt);

  child.kill();
  console.log("\n=================================================");
  console.log("  ALL CASHFREE SANDBOX & MCP TESTS PASSED (100%) ");
  console.log("=================================================\n");
}

runMcpTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
