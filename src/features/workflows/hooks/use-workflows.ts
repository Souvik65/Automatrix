import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";
import { useToastNotification } from "@/hooks/use-toast-notification";


/**
 * Hook to fetch all workflows using suspense
 */
export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

/**
 * hook to create a new workflow
 */

export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const { showSuccess, showError } = useToastNotification();  // Add this

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess: (data) => {
                showSuccess(`Workflow "${data.name}" created successfully!`);  // Updated
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                );
            },
            onError: (error) => {
                showError(`Error creating workflow: ${error.message}`);  // Updated
            },
        }),
    );
};

/**
 * Hook to remove a workflow
 */
export const useRemoveWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { showSuccess } = useToastNotification();  // Add this

    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess: (data) => {
                showSuccess(`Workflow "${data.name}" removed successfully!`);  // Updated
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryFilter({ id: data.id }),
                );
            }
        })
    )
}

/**
 * Hook to fetch a single workflow using suspense
 */
export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};


/**
 * hook to update a workflow name
 */

export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const { showSuccess, showError } = useToastNotification();  // Add this

    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess: (data) => {
                showSuccess(`Workflow "${data.name}" Updated!`);  // Updated
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                );
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({ id: data.id }),
                );
            },
            onError: (error) => {
                showError(`Failed to update workflow: ${error.message}`);  // Updated
            },
        }),
    );
};

/**
 * hook to update a workflow 
 */

export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const { showSuccess, showError } = useToastNotification();  // Add this

    return useMutation(
        trpc.workflows.update.mutationOptions({
            onSuccess: (data) => {
                showSuccess(`Workflow "${data.name}" Saved`);  // Updated
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                );
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({ id: data.id }),
                );
            },
            onError: (error) => {
                showError(`Failed to save workflow: ${error.message}`);  // Updated
            },
        }),
    );
};


/**
 * hook to execute a workflow 
 */

export const useExecuteWorkflow = () => {
    const trpc = useTRPC();
    const { showSuccess, showError } = useToastNotification();  // Add this

    return useMutation(
        trpc.workflows.execute.mutationOptions({
            onSuccess: (data) => {
                showSuccess(`Workflow "${data.name}" executed successfully!`);  // Updated
            },
            onError: (error) => {
                showError(`Failed to execute workflow: ${error.message}`);  // Updated
            },
        }),
    );
};