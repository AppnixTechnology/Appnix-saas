CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "superAdminId" TEXT NOT NULL,
    "targetWorkspaceId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_logs_superAdminId_createdAt_idx"
ON "audit_logs"("superAdminId", "createdAt");

CREATE INDEX "audit_logs_targetWorkspaceId_createdAt_idx"
ON "audit_logs"("targetWorkspaceId", "createdAt");
