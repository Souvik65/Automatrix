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
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    connectionStringId: z.string().min(1, "Postgres connection string required"),
    queryTemplate: z.string().min(1, "SQL Query required"),
});

export type DatabaseQueryFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: DatabaseQueryFormValues) => void;
    defaultValues?: Partial<DatabaseQueryFormValues>;
};

export const DatabaseQueryDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<DatabaseQueryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            connectionStringId: defaultValues.connectionStringId || "",
            queryTemplate: defaultValues.queryTemplate || "SELECT * FROM users LIMIT 10;",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                connectionStringId: defaultValues.connectionStringId || "",
                queryTemplate: defaultValues.queryTemplate || "SELECT * FROM users LIMIT 10;",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: DatabaseQueryFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Database Query Configuration</DialogTitle>
                    <DialogDescription>
                        Execute SQL queries against a Postgres database.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="connectionStringId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Database Connection URI</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="postgresql://user:pass@host:5432/db" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The connection URL for the Postgres database.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="queryTemplate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SQL Query</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="SELECT * FROM users WHERE id = {{item.userId}}"
                                            className="min-h-[150px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Write raw SQL. Use double braces `{"{{variable}}"}` to inject item data securely.
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
