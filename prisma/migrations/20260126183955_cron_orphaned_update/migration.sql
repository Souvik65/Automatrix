-- AddForeignKey
ALTER TABLE "CronSchedule" ADD CONSTRAINT "CronSchedule_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
