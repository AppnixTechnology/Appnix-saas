import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  } catch (err: any) {
    console.warn("[Prisma Init Notice]:", err.message);
    // Proxy fallback for build-time safety
    return new Proxy({} as any, {
      get: (_target, prop) => {
        if (prop === "$transaction") {
          return async (fn: any) => fn(new Proxy({} as any, { get: () => () => Promise.resolve(null) }));
        }
        return new Proxy({} as any, {
          get: () => () => Promise.resolve(null),
        });
      },
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
