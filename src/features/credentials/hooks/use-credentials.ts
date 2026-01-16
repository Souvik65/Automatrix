import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@prisma/client";
import { useToastNotification } from "@/hooks/use-toast-notification";


/**
 * Hook to fetch all credentials using suspense
 */
export const useSuspenseCredentials = () => {
    const trpc = useTRPC();
    const [params] = useCredentialsParams();

    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

/**
 * hook to create a new credential
 */

export const useCreateCredential = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const { showSuccess, showError } = useToastNotification();

    return useMutation(
        trpc.credentials.create.mutationOptions({
            onSuccess: (data) => {
                showSuccess(`Credential "${data.name}" created successfully!`);
                queryClient.invalidateQueries(
                    trpc.credentials.getMany.queryOptions({}),
                );
            },
            onError: (error) => {
                showError("Failed to create credential.");
            },
        }),
    );
};

/**
 * Hook to remove a credential
 */
export const useRemoveCredential = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { showSuccess } = useToastNotification();  // Add this

    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess: (data) => {
                showSuccess(`Credential "${data.name}" removed successfully!`);  // Updated
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryFilter({ id: data.id }),
                );
            }
        })
    )
}

/**
 * Hook to fetch a single credential using suspense
 */
export const useSuspenseCredential = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};




/**
 * hook to update a credential
 */

export const useUpdateCredential = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const { showSuccess, showError } = useToastNotification();  // Add this

    return useMutation(
        trpc.credentials.update.mutationOptions({
            onSuccess: (data) => {
                showSuccess(`Credential "${data.name}" Saved`);  // Updated
                queryClient.invalidateQueries(
                    trpc.credentials.getMany.queryOptions({}),
                );
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryOptions({ id: data.id }),
                );
            },
            onError: (error) => {
                showError(`Failed to save credential: ${error.message}`);  // Updated
            },
        }),
    );
};


/**
 * Hook to fetch credential by types
 */

export const useCredentialsByType = (type: CredentialType) => {
    const trpc = useTRPC();
    return useQuery(trpc.credentials.getByType.queryOptions({ type }));
}