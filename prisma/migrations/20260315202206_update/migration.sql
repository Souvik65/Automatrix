-- CreateEnum
CREATE TYPE "NodeState" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'RETRYING', 'SKIPPED');

-- AlterEnum
ALTER TYPE "ExecutionStatus" ADD VALUE 'PENDING';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NodeType" ADD VALUE 'CRON_TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'WEBHOOK_TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'EMAIL_RECEIVED_TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'GITHUB_EVENT_TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'SEND_EMAIL_ACTION';
ALTER TYPE "NodeType" ADD VALUE 'DATABASE_QUERY_ACTION';
ALTER TYPE "NodeType" ADD VALUE 'FILE_UPLOAD_ACTION';
ALTER TYPE "NodeType" ADD VALUE 'FILE_DOWNLOAD_ACTION';
ALTER TYPE "NodeType" ADD VALUE 'CONDITIONAL_LOGIC';
ALTER TYPE "NodeType" ADD VALUE 'SWITCH_LOGIC';
ALTER TYPE "NodeType" ADD VALUE 'LOOP_LOGIC';
ALTER TYPE "NodeType" ADD VALUE 'DELAY_LOGIC';
ALTER TYPE "NodeType" ADD VALUE 'ERROR_HANDLER_LOGIC';
ALTER TYPE "NodeType" ADD VALUE 'TRANSFORM_DATA';
ALTER TYPE "NodeType" ADD VALUE 'FILTER_DATA';
ALTER TYPE "NodeType" ADD VALUE 'MERGE_DATA';
ALTER TYPE "NodeType" ADD VALUE 'SPLIT_DATA';
ALTER TYPE "NodeType" ADD VALUE 'JSON_PARSE_DATA';
ALTER TYPE "NodeType" ADD VALUE 'GITHUB_API_INTEGRATION';
ALTER TYPE "NodeType" ADD VALUE 'GOOGLE_SHEETS_INTEGRATION';
ALTER TYPE "NodeType" ADD VALUE 'NOTION_INTEGRATION';

-- AlterTable
ALTER TABLE "Execution" ADD COLUMN     "durationMs" INTEGER,
ADD COLUMN     "snapshotId" TEXT,
ADD COLUMN     "triggerState" JSONB;

-- CreateTable
CREATE TABLE "ExecutionLog" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "status" "NodeState" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "inputSnapshot" JSONB,
    "outputSnapshot" JSONB,
    "errorState" JSONB,
    "durationMs" INTEGER,
    "retryCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExecutionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowVersion" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "definition" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "WorkflowVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowMetrics" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "successfulRuns" INTEGER NOT NULL DEFAULT 0,
    "failedRuns" INTEGER NOT NULL DEFAULT 0,
    "avgExecutionMs" INTEGER NOT NULL DEFAULT 0,
    "nodeFrequency" JSONB NOT NULL,

    CONSTRAINT "WorkflowMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowVersion_workflowId_version_key" ON "WorkflowVersion"("workflowId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowMetrics_workflowId_periodStart_key" ON "WorkflowMetrics"("workflowId", "periodStart");

-- AddForeignKey
ALTER TABLE "ExecutionLog" ADD CONSTRAINT "ExecutionLog_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "Execution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowVersion" ADD CONSTRAINT "WorkflowVersion_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnalytics" ADD CONSTRAINT "UserAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowMetrics" ADD CONSTRAINT "WorkflowMetrics_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
