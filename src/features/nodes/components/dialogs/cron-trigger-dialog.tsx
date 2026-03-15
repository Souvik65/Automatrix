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
    cronExpression: z.string().min(1, "Cron expression required"),
    timezone: z.string().min(1, "Timezone required"),
});

export type CronTriggerFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: CronTriggerFormValues) => void;
    defaultValues?: Partial<CronTriggerFormValues>;
};

export const CronTriggerDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<CronTriggerFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cronExpression: defaultValues.cronExpression || "0 * * * *",
            timezone: defaultValues.timezone || "UTC",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                cronExpression: defaultValues.cronExpression || "0 * * * *",
                timezone: defaultValues.timezone || "UTC",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: CronTriggerFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Cron Schedule Settings</DialogTitle>
                    <DialogDescription>
                        Trigger the workflow on a recurring time interval.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="cronExpression"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Schedule Interval</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Schedule" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="* * * * *">Every Minute</SelectItem>
                                            <SelectItem value="*/5 * * * *">Every 5 Minutes</SelectItem>
                                            <SelectItem value="*/15 * * * *">Every 15 Minutes</SelectItem>
                                            <SelectItem value="*/30 * * * *">Every 30 Minutes</SelectItem>
                                            <SelectItem value="0 * * * *">Every Hour</SelectItem>
                                            <SelectItem value="0 0 * * *">Every Day at Midnight</SelectItem>
                                            <SelectItem value="0 0 * * 1">Every Week (Monday)</SelectItem>
                                            <SelectItem value="0 0 1 * *">Every Month (1st Day)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Choose how often you want this workflow to run automatically.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="timezone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Timezone</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Timezone" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                                            <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST - Indian Standard Time)</SelectItem>
                                            <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                                        </SelectContent>
                                    </Select>
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
