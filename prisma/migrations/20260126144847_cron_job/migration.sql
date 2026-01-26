-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NodeType" ADD VALUE 'WEBHOOK_TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'CRON_TRIGGER';

-- CreateTable
CREATE TABLE "CronSchedule" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CronSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronSchedule_nodeId_key" ON "CronSchedule"("nodeId");

-- CreateIndex
CREATE INDEX "CronSchedule_workflowId_enabled_idx" ON "CronSchedule"("workflowId", "enabled");

-- CreateIndex
CREATE INDEX "CronSchedule_nextRunAt_enabled_idx" ON "CronSchedule"("nextRunAt", "enabled");

-- AddForeignKey
ALTER TABLE "CronSchedule" ADD CONSTRAINT "CronSchedule_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
