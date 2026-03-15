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
    path: z.string().min(1, "Path required"),
});

export type SplitDataFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: SplitDataFormValues) => void;
    defaultValues?: Partial<SplitDataFormValues>;
};

export const SplitDataDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<SplitDataFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            path: defaultValues.path || "items",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                path: defaultValues.path || "items",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: SplitDataFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Split Data Array</DialogTitle>
                    <DialogDescription>
                        Takes an array property and triggers independent branch executions for each item.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="path"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Array Path</FormLabel>
                                    <FormControl>
                                        <Input placeholder="webhook.body.line_items" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The JSON path to the array you want to iterate over.
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
