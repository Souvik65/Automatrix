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
    field: z.string().min(1, "Field path required"),
    operator: z.enum(['eq', 'neq', 'gt', 'lt', 'includes']),
    value: z.string().min(1, "Comparison value required"),
});

export type ConditionalLogicFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: ConditionalLogicFormValues) => void;
    defaultValues?: Partial<ConditionalLogicFormValues>;
};

export const ConditionalLogicDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<ConditionalLogicFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            field: defaultValues.field || "status",
            operator: defaultValues.operator || "eq",
            value: defaultValues.value || "success",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                field: defaultValues.field || "status",
                operator: defaultValues.operator || "eq",
                value: defaultValues.value || "success",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: ConditionalLogicFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>If / Else Configuration</DialogTitle>
                    <DialogDescription>
                        Route items based on property evaluation.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="field"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>JSON Path to Evaluate</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user.age" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="operator"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Operator</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an operator" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="eq">Equal to</SelectItem>
                                            <SelectItem value="neq">Not equal to</SelectItem>
                                            <SelectItem value="gt">Greater than</SelectItem>
                                            <SelectItem value="lt">Less than</SelectItem>
                                            <SelectItem value="includes">Contains</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input placeholder="18" {...field} />
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
