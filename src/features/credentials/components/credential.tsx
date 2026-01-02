"use client";

import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCreateCredential, useUpdateCredential, useSuspenseCredential } from "../hooks/use-credentials";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from "next/link";



const  formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(CredentialType),
    value: z.string().min(1, "API Key is required"),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
    { 
        label: "Gemini", 
        value: CredentialType.GEMINI,
        logo: "/logos/gemini.svg",
    },
    { 
        label: "OpenAI", 
        value: CredentialType.OPENAI,
        logo: "/logos/openai.svg",
    },
    { 
        label: "Anthropic", 
        value: CredentialType.ANTHROPIC,
        logo: "/logos/anthropic.svg",
    },
];

interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        type: CredentialType;
        value: string;
    };
};


export const CredentialForm = ({
    initialData,
}: CredentialFormProps) => {
    const router = useRouter();
    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();
    const { handleError, modal } = useUpgradeModal();

    const isEdit = !!initialData?.id;
  const [showKey, setShowKey] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: undefined,
            value: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData?.id) {
            await updateCredential.mutateAsync({
                id: initialData.id,
                ...values,
            })
        } else {
            await createCredential.mutateAsync(values, {
                onSuccess: (data) => {
                    router.push(`/credentials/${data.id}`);
                },
                onError: (error) => {
                    handleError(error);
                }
            });
        }
    }

    
    return (
        <>
            {modal}
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle>
                        {isEdit ? "Edit Credential" : "New Credential"}
                    </CardTitle>
                    <CardDescription>
                        {isEdit 
                            ? "Update your credential information below."
                            : "Add a new credential to get started."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My API Key" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} 
                            />

                            <FormField 
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value} 
                                            >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a credential type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {credentialTypeOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Image
                                                                src={option.logo}
                                                                alt={option.label}
                                                                width={18}
                                                                height={18}
                                                            />
                                                            {option.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
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
                                        <FormLabel>API Key</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showKey ? "text" : "password"}
                                                    placeholder="sk-..."
                                                    {...field}
                                                    className="pr-10"
                                                    onBlur={() => setShowKey(false)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowKey((prev) => !prev)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                                                    aria-label={
                                                        showKey ? "Hide API key" : "Show API key"
                                                    }
                                                >
                                                    {showKey ? (
                                                        <EyeOff size={18} />
                                                    ) : (
                                                        <Eye size={18} />
                                                    )}
                                                    </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4 justify-center mt-4">
                                <Button
                                    type="submit"
                                    disabled={createCredential.isPending || updateCredential.isPending}
                                    className="hover:scale-105 transition-all"
                                >
                                    {isEdit ? "Update" : "Create"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="hover:bg-red-400 hover:scale-100 transition-all hover:text-white"
                                    asChild
                                    // onClick={() => router.back()}  // Temporary fix until we have a proper cancel flow
                                >
                                    <Link href="/credentials" prefetch>
                                        Cancel
                                    </Link>
                                </Button>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
};


export const CredentialView = ({
    credentialId,
}: {credentialId: string}) => {
    const { data: credential } = useSuspenseCredential(credentialId)

    return <CredentialForm initialData={credential} />
}