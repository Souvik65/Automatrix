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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    strategy: z.enum(['deep', 'shallow', 'array_concat']),
});

export type MergeDataFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: MergeDataFormValues) => void;
    defaultValues?: Partial<MergeDataFormValues>;
};

export const MergeDataDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<MergeDataFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            strategy: defaultValues.strategy || "deep",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                strategy: defaultValues.strategy || "deep",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: MergeDataFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Merge Data</DialogTitle>
                    <DialogDescription>
                        Merge payloads from multiple inbound connections.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="strategy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Merge Strategy</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Strategy" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="deep">Deep Merge</SelectItem>
                                            <SelectItem value="shallow">Shallow Merge (Overwrite)</SelectItem>
                                            <SelectItem value="array_concat">Array Concatenate (Fast)</SelectItem>
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
