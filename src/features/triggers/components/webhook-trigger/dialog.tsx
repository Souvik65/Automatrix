"use client";

import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useToastNotification } from "@/hooks/use-toast-notification";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const WebhookTriggerDialog = ({ open, onOpenChange }: Props) => {
    const params = useParams();
    const workflowId = params.workflowId as string;
    const { showSuccess, showError } = useToastNotification();
    const [copied, setCopied] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/${workflowId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            setCopied(true);
            showSuccess("Webhook URL copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            showError("Failed to copy webhook URL");
        }
    };

    const curlExample = `curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello from webhook!"}'`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Webhook Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Send HTTP requests to this URL to trigger your workflow
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Webhook URL */}
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="webhook-url"
                                value={webhookUrl}
                                readOnly
                                className="font-mono text-sm"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={copyToClipboard}
                            >
                                {copied ? (
                                    <CheckIcon className="size-4 text-green-600" />
                                ) : (
                                    <CopyIcon className="size-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Supported Methods */}
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Supported HTTP Methods</h4>
                        <div className="flex gap-2 flex-wrap">
                            {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => (
                                <span
                                    key={method}
                                    className="px-2 py-1 bg-background rounded text-xs font-mono"
                                >
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Usage Instructions */}
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">How to use:</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Copy the webhook URL above</li>
                            <li>Configure your external service to send HTTP requests to this URL</li>
                            <li>The request body will be available in subsequent nodes as <code className="text-xs bg-background px-1 py-0.5 rounded">{"{{webhook.body}}"}</code></li>
                            <li>Request headers are available as <code className="text-xs bg-background px-1 py-0.5 rounded">{"{{webhook.headers}}"}</code></li>
                        </ol>
                    </div>

                    {/* cURL Example */}
                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Test with cURL</h4>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(curlExample);
                                        showSuccess("cURL command copied");
                                    } catch {
                                        showError("Failed to copy command");
                                    }
                                }}
                            >
                                <CopyIcon className="size-3 mr-2" />
                                Copy
                            </Button>
                        </div>
                        <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                            {curlExample}
                        </pre>
                    </div>

                    {/* Data Structure */}
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Available Data Structure</h4>
                        <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`{
  "webhook": {
    "body": { /* your request body */ },
    "headers": { /* request headers */ },
    "method": "POST",
    "query": { /* URL query parameters */ },
    "timestamp": "2026-01-26T..."
  }
}`}
                        </pre>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};