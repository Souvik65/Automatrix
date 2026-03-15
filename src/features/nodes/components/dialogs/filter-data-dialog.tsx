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
    filterExpression: z.string().min(1, "Filter expression required"),
});

export type FilterDataFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: FilterDataFormValues) => void;
    defaultValues?: Partial<FilterDataFormValues>;
};

export const FilterDataDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<FilterDataFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            filterExpression: defaultValues.filterExpression || "item.amount > 100",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                filterExpression: defaultValues.filterExpression || "item.amount > 100",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: FilterDataFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Filter Data Array</DialogTitle>
                    <DialogDescription>
                        Filter items in an array based on a boolean expression.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="filterExpression"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Filter Expression (JS)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="item.status === 'active'" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        A JavaScript expression that evaluates to true/false for each `item`.
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
