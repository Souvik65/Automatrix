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
    databaseId: z.string().min(1, "Database ID required"),
    action: z.enum(['create_page', 'query']),
});

export type NotionFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: NotionFormValues) => void;
    defaultValues?: Partial<NotionFormValues>;
};

export const NotionDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<NotionFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            databaseId: defaultValues.databaseId || "",
            action: defaultValues.action || "create_page",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                databaseId: defaultValues.databaseId || "",
                action: defaultValues.action || "create_page",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: NotionFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Notion Integration</DialogTitle>
                    <DialogDescription>
                        Interact with Notion databases and pages.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                         <FormField 
                            control={form.control}
                            name="action"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Action</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Action" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="create_page">Create Page (Add Row)</SelectItem>
                                            <SelectItem value="query">Query Database</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="databaseId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Database ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="b9f4..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The ID of the target Notion database.
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
