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
    to: z.string().min(1, "Recipient email is required"),
    subjectTemplate: z.string().min(1, "Subject is required"),
    bodyTemplate: z.string().min(1, "Body content is required"),
});

export type SendEmailFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: SendEmailFormValues) => void;
    defaultValues?: Partial<SendEmailFormValues>;
};

export const SendEmailDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<SendEmailFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            to: defaultValues.to || "",
            subjectTemplate: defaultValues.subjectTemplate || "",
            bodyTemplate: defaultValues.bodyTemplate || "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                to: defaultValues.to || "",
                subjectTemplate: defaultValues.subjectTemplate || "",
                bodyTemplate: defaultValues.bodyTemplate || "",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: SendEmailFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Send Email Configuration</DialogTitle>
                    <DialogDescription>
                        Configure recipient and message templates.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="to"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>To</FormLabel>
                                    <FormControl>
                                        <Input placeholder="{{user.email}}" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Recipient email. Use {"{{item.path}}"} to map dynamically.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="subjectTemplate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Hello {{user.name}}!" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="bodyTemplate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>HTML Body Template</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="<h1>Welcome {{user.name}}</h1>"
                                            className="min-h-[120px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
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
