import fs from "fs";
import path from "path";

export interface StoredPaymentOrder {
  id: string;
  orderId: string;
  workspaceId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "USER_DROPPED";
  cfPaymentId?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "payment_orders.json");

function ensureDirectoryExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify([]), "utf-8");
    }
  } catch (err: any) {
    console.warn("[TransactionsStore] Directory creation notice:", err.message);
  }
}

export function getStoredOrders(): StoredPaymentOrder[] {
  ensureDirectoryExists();
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (err: any) {
    console.warn("[TransactionsStore] Read notice:", err.message);
  }
  return [];
}

export function saveStoredOrder(order: StoredPaymentOrder): void {
  ensureDirectoryExists();
  try {
    const orders = getStoredOrders();
    const existingIndex = orders.findIndex((o) => o.orderId === order.orderId);
    if (existingIndex >= 0) {
      orders[existingIndex] = { ...orders[existingIndex], ...order, updatedAt: new Date().toISOString() };
    } else {
      orders.unshift({ ...order, createdAt: order.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err: any) {
    console.warn("[TransactionsStore] Save notice:", err.message);
  }
}
