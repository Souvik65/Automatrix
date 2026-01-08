"use client";

import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { PlayIcon } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { useState } from "react";

export const ExecuteWorkflowButton = ({ 
  workflowId 
}: { 
  workflowId: string 
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    executeWorkflow.mutate(
      { id: workflowId },
      {
        onSettled: () => setIsExecuting(false), // Reset after success/error
      }
    );
  };

  return (
    <>
      <Button
        onClick={handleExecute}
        disabled={executeWorkflow.isPending || isExecuting}
        className="flex items-center gap-2"
      >
        {(executeWorkflow.isPending || isExecuting) ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Executing...
          </>
        ) : (
          <>
            <PlayIcon className="size-4" />
            Execute Workflow
          </>
        )}
      </Button>

      {/* Full-screen loading overlay during execution */}
      {isExecuting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loading size="lg" text="Executing workflow... Please wait." />
        </div>
      )}
    </>
  );
};