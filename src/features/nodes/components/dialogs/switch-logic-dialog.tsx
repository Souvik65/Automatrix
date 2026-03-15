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
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";

// Switch logic operates on an input expression, and tests multiple case values.
const formSchema = z.object({
    inputExpression: z.string().min(1, "Input expression required"),
    cases: z.array(z.object({
        value: z.string().min(1, "Value required"),
        branchId: z.string().min(1, "Branch identifier required"),
    }))
});

export type SwitchLogicFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: SwitchLogicFormValues) => void;
    defaultValues?: Partial<SwitchLogicFormValues>;
};

export const SwitchLogicDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<SwitchLogicFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            inputExpression: defaultValues.inputExpression || "{{item.eventType}}",
            cases: defaultValues.cases?.length ? defaultValues.cases : [{ value: "user.created", branchId: "branch-1" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "cases",
    });

    useEffect(() => {
        if (open) {
            form.reset({
                inputExpression: defaultValues.inputExpression || "{{item.eventType}}",
                cases: defaultValues.cases?.length ? defaultValues.cases : [{ value: "user.created", branchId: "branch-1" }],
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: SwitchLogicFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Switch Multi-Branch Array</DialogTitle>
                    <DialogDescription>
                        Evaluate one input string against multiple values to route execution to different branches.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField 
                            control={form.control}
                            name="inputExpression"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Input Expression to Evaluate</FormLabel>
                                    <FormControl>
                                        <Input placeholder="{{webhook.body.type}}" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The JSON path value to switch on.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel>Switch Cases</FormLabel>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => append({ value: "", branchId: `branch-${fields.length + 1}` })}
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add Case
                                </Button>
                            </div>
                            
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-4 bg-muted/30 p-3 rounded-md">
                                    <FormField
                                        control={form.control}
                                        name={`cases.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Match Value" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`cases.${index}.branchId`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Branch ID" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>


                        <DialogFooter className="mt-4">
                            <Button type="submit">Save Settings</Button>
                        </DialogFooter>
                     </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
