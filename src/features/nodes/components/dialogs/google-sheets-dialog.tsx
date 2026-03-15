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
    spreadsheetId: z.string().min(1, "Spreadsheet ID required"),
    range: z.string().min(1, "Range required e.g Sheet1!A:D"),
    action: z.enum(['append', 'read']),
});

export type GoogleSheetsFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: GoogleSheetsFormValues) => void;
    defaultValues?: Partial<GoogleSheetsFormValues>;
};

export const GoogleSheetsDialog = ({
    open, 
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const form = useForm<GoogleSheetsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            spreadsheetId: defaultValues.spreadsheetId || "",
            range: defaultValues.range || "Sheet1!A:Z",
            action: defaultValues.action || "append",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                spreadsheetId: defaultValues.spreadsheetId || "",
                range: defaultValues.range || "Sheet1!A:Z",
                action: defaultValues.action || "append",
            });
        }
    }, [open, defaultValues, form]);

    const handleSubmit = (values: GoogleSheetsFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar">  
                <DialogHeader>
                    <DialogTitle>Google Sheets Configuration</DialogTitle>
                    <DialogDescription>
                        Read or write data to a Google Sheet.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                         <FormField 
                            control={form.control}
                            name="action"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Action</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Action" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="append">Append Rows</SelectItem>
                                            <SelectItem value="read">Read Data Range</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="spreadsheetId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Spreadsheet ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1BxiMVs0XRYFgwnm..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Found in the URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="range"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sheet Range</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Sheet1!A:D" {...field} />
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
