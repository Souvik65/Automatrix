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
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
    routePath: z.string().min(1, "Route path required e.g. /my-hook"),
});

export type WebhookTriggerFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: WebhookTriggerFormValues) => void;
    defaultValues?: Partial<WebhookTriggerFormValues>;
};

export const WebhookTriggerDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<WebhookTriggerFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            method: defaultValues.method || "POST",
            routePath: defaultValues.routePath || "/receive",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                method: defaultValues.method || "POST",
                routePath: defaultValues.routePath || "/receive",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: WebhookTriggerFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Webhook Trigger</DialogTitle>
                    <DialogDescription>
                        Trigger workflow on incoming HTTP requests.
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
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="routePath"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Route Path Identifier</FormLabel>
                                    <FormControl>
                                        <Input placeholder="/custom-endpoint" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The URL path where payload will be expected. Example: `https://your-domain.com/api/webhooks[ROUTE_PATH]`
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
