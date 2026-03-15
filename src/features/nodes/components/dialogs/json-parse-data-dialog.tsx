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
    targetField: z.string().min(1, "Target field required"),
});

export type JsonParseDataFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: JsonParseDataFormValues) => void;
    defaultValues?: Partial<JsonParseDataFormValues>;
};

export const JsonParseDataDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<JsonParseDataFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            targetField: defaultValues.targetField || "body",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                targetField: defaultValues.targetField || "body",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: JsonParseDataFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Parse JSON Data</DialogTitle>
                    <DialogDescription>
                        Parse a stringified JSON property into a working object.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="targetField"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Field Path</FormLabel>
                                    <FormControl>
                                        <Input placeholder="webhook.body.payload" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The JSON path to the string property to be parsed.
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
