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
    targetArray: z.string().min(1, "Target array reference required"),
    batchSize: z.string().min(1, "Batch size required"),
});

export type LoopLogicFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: LoopLogicFormValues) => void;
    defaultValues?: Partial<LoopLogicFormValues>;
};

export const LoopLogicDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<LoopLogicFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            targetArray: defaultValues.targetArray || "{{webhook.body.items}}",
            batchSize: defaultValues.batchSize ? String(defaultValues.batchSize) : "1",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                targetArray: defaultValues.targetArray || "{{webhook.body.items}}",
                batchSize: defaultValues.batchSize ? String(defaultValues.batchSize) : "1",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: LoopLogicFormValues) => {
        onSubmit({
            ...values,
            batchSize: parseInt(values.batchSize) || 1
        } as unknown as LoopLogicFormValues);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Loop Configuration</DialogTitle>
                    <DialogDescription>
                        Iterate over an array of items dynamically.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="targetArray"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Array Reference</FormLabel>
                                    <FormControl>
                                        <Input placeholder="{{nodeName.data.array}}" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The JSON path to the array you want to loop over.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="batchSize"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Batch Size</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="1" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        How many items to process concurrently per loop iteration.
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
