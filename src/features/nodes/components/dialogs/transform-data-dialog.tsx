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
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    code: z.string().min(1, "Transform code is required"),
});

export type TransformDataFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: TransformDataFormValues) => void;
    defaultValues?: Partial<TransformDataFormValues>;
};

export const TransformDataDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<TransformDataFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: defaultValues.code || "return { ...$json };",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                code: defaultValues.code || "return { ...$json };",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: TransformDataFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Data Transformation</DialogTitle>
                    <DialogDescription>
                        Write JavaScript to map properties over incoming items.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mapping Code</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="return { mappedData: $json.property };"
                                            className="min-h-[250px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Use `$json` to access the current item&quot;s data object. You must `return` an object.
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
