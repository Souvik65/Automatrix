"use client";

import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    endpoint: z.string().min(1, "Endpoint required"),
    bodyTemplate: z.string().optional(),
});

export type GithubApiFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: GithubApiFormValues) => void;
    defaultValues?: Partial<GithubApiFormValues>;
};

export const GithubApiDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<GithubApiFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            method: defaultValues.method || "GET",
            endpoint: defaultValues.endpoint || "/repos/{owner}/{repo}",
            bodyTemplate: defaultValues.bodyTemplate || "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                method: defaultValues.method || "GET",
                endpoint: defaultValues.endpoint || "/repos/{owner}/{repo}",
                bodyTemplate: defaultValues.bodyTemplate || "",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: GithubApiFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>GitHub API Request</DialogTitle>
                    <DialogDescription>
                        Make authenticated requests to the GitHub API.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>HTTP Method</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>API Endpoint</FormLabel>
                                    <FormControl>
                                        <Input placeholder="/repos/facebook/react/issues" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The path relative to `https://api.github.com`. Supports `{"{{variables}}"}`.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="bodyTemplate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Request Body (JSON)</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder='{"title":"New Issue Title"}'
                                            className="font-mono text-sm max-h-[300px]"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Optional. Payload for POST/PATCH requests.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save Settings</Button>
                        </DialogFooter>
                     </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
