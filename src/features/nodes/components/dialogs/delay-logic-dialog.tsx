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
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    durationMs: z.string().min(1, 'Duration required'),
});

export type DelayLogicFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: DelayLogicFormValues) => void;
    defaultValues?: Partial<DelayLogicFormValues>;
};

export const DelayLogicDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<DelayLogicFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            durationMs: defaultValues.durationMs ? String(defaultValues.durationMs) : "1000",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                durationMs: defaultValues.durationMs ? String(defaultValues.durationMs) : "1000",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: DelayLogicFormValues) => {
         onSubmit({
            ...values,
            durationMs: String(parseInt(values.durationMs) || 1000)
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Delay Execution</DialogTitle>
                    <DialogDescription>
                        Pause workflow execution for a specified amount of time.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="durationMs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (milliseconds)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="5000" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        How long to wait before resuming execution.
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
