"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { 
    GlobeIcon,
    MousePointerIcon,
    ClockIcon,
    WebhookIcon,
    MailIcon,
    GithubIcon,
    DatabaseIcon,
    UploadIcon,
    DownloadIcon,
    GitBranchIcon,
    WaypointsIcon,
    RepeatIcon,
    TimerIcon,
    AlertTriangleIcon,
    CogIcon,
    FilterIcon,
    MergeIcon,
    SplitIcon,
    BracesIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
} from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@prisma/client";
import { Separator } from "./ui/separator";

export type NodeTypeOption = {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{className?: string}> | string;
};

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Manual Trigger",
        description: "Start the workflow manually.",
        icon: MousePointerIcon,
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: "Google Form Trigger",
        description: "Start the workflow when a Google Form is submitted.",
        icon: "/logos/googleform.svg",
    },
    {
        type: NodeType.CRON_TRIGGER,
        label: "Cron Schedule",
        description: "Run workflow on a recurring schedule.",
        icon: ClockIcon,
    },
    {
        type: NodeType.WEBHOOK_TRIGGER,
        label: "Webhook",
        description: "Trigger workflow from an external HTTP request.",
        icon: WebhookIcon,
    },
    {
        type: NodeType.EMAIL_RECEIVED_TRIGGER,
        label: "Email Received",
        description: "Trigger when an email is received.",
        icon: MailIcon,
    },
    {
        type: NodeType.GITHUB_EVENT_TRIGGER,
        label: "GitHub Event",
        description: "Trigger on GitHub webhook events.",
        icon: GithubIcon,
    },
];

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Make an HTTP request to an external API.",
        icon: GlobeIcon,
    },
    {
        type: NodeType.GEMINI,
        label: "Gemini",
        description: "Use a Gemini node.",
        icon: "/logos/gemini.svg",
    },
    {
        type: NodeType.OPENAI,
        label: "OpenAI",
        description: "Use an OpenAI node.",
        icon: "/logos/openai.svg",
    },
    {
        type: NodeType.ANTHROPIC,
        label: "Anthropic",
        description: "Use an Anthropic node.",
        icon: "/logos/anthropic.svg",
    },
    {
        type: NodeType.SEND_EMAIL_ACTION,
        label: "Send Email",
        description: "Send an email using Resend.",
        icon: MailIcon,
    },
    {
        type: NodeType.DATABASE_QUERY_ACTION,
        label: "Database Query",
        description: "Execute a query against a database.",
        icon: DatabaseIcon,
    },
    {
        type: NodeType.FILE_UPLOAD_ACTION,
        label: "File Upload",
        description: "Upload a file to cloud storage.",
        icon: UploadIcon,
    },
    {
        type: NodeType.FILE_DOWNLOAD_ACTION,
        label: "File Download",
        description: "Download a file from a URL.",
        icon: DownloadIcon,
    },
    {
        type: NodeType.CONDITIONAL_LOGIC,
        label: "If / Else",
        description: "Branch workflow conditionally.",
        icon: GitBranchIcon,
    },
    {
        type: NodeType.SWITCH_LOGIC,
        label: "Switch",
        description: "Route based on multiple cases.",
        icon: WaypointsIcon,
    },
    {
        type: NodeType.LOOP_LOGIC,
        label: "Loop",
        description: "Iterate over an array of items.",
        icon: RepeatIcon,
    },
    {
        type: NodeType.DELAY_LOGIC,
        label: "Delay",
        description: "Pause the workflow execution.",
        icon: TimerIcon,
    },
    {
        type: NodeType.ERROR_HANDLER_LOGIC,
        label: "Error Handler",
        description: "Catch and handle node errors.",
        icon: AlertTriangleIcon,
    },
    {
        type: NodeType.TRANSFORM_DATA,
        label: "Transform Data",
        description: "Map and restructure JSON objects.",
        icon: CogIcon,
    },
    {
        type: NodeType.FILTER_DATA,
        label: "Filter Data",
        description: "Filter arrays and collections.",
        icon: FilterIcon,
    },
    {
        type: NodeType.MERGE_DATA,
        label: "Merge Data",
        description: "Combine multiple data sources.",
        icon: MergeIcon,
    },
    {
        type: NodeType.SPLIT_DATA,
        label: "Split Data",
        description: "Split an array into separate runs.",
        icon: SplitIcon,
    },
    {
        type: NodeType.JSON_PARSE_DATA,
        label: "JSON Parse",
        description: "Parse structured text into a JSON object.",
        icon: BracesIcon,
    },
    {
        type: NodeType.GITHUB_API_INTEGRATION,
        label: "GitHub API",
        description: "Interact with GitHub REST API.",
        icon: GithubIcon,
    },
    {
        type: NodeType.GOOGLE_SHEETS_INTEGRATION,
        label: "Google Sheets",
        description: "Read or write to spreadsheets.",
        icon: FileSpreadsheetIcon,
    },
    {
        type: NodeType.NOTION_INTEGRATION,
        label: "Notion",
        description: "Create pages or query databases in Notion.",
        icon: FileTextIcon,
    },
];

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
};

export function NodeSelector({
    open,
    onOpenChange,
    children
}: NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        //check if trying to add a manual trigger when one already exists
        if (selection.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some(
                (node) => node.type === NodeType.MANUAL_TRIGGER,
            );

            if (hasManualTrigger) {
                toast.error("Only one Manual Trigger node is allowed per workflow.");
                return;
            }
        }

        setNodes((nodes) => {
            const hasInitialTrigger = nodes.some(
            (node) => node.type === NodeType.INITIAL,
            );
            
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const flowPosition = screenToFlowPosition({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200,
            });

            const newNode = {
                id: createId(),
                data: {},
                position: flowPosition,
                type: selection.type,
            };

            if (hasInitialTrigger) {
                return [newNode];
            }

            return [...nodes, newNode];
        });

        onOpenChange(false);
    }, [
        setNodes,
        getNodes,
        onOpenChange,
        screenToFlowPosition,
    ]);


    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>what triggers this workflow?</SheetTitle>
                    <SheetDescription>
                        A trigger in a step that starts your workflow.
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <div>
                    {triggerNodes.map((nodeType) => {
                        const Icon = nodeType.icon;

                        return (
                            <div
                                key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4
                                rounded-none cursor-pointer border-l-2 border-transparent
                                hover:border-l-primary "
                                onClick={() => handleNodeSelect(nodeType)}
                            > 
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img 
                                        src={Icon}
                                        alt={nodeType.label}
                                        className="size-5 object-contain rounded-sm"
                                    />
                                    ): (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>
                    {executionNodes.map((nodeType) => {
                        const Icon = nodeType.icon;

                        return (
                            <div
                                key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4
                                rounded-none cursor-pointer border-l-2 border-transparent
                                hover:border-l-primary "
                                onClick={() => handleNodeSelect(nodeType)}
                            > 
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img 
                                        src={Icon}
                                        alt={nodeType.label}
                                        className="size-5 object-contain rounded-sm"
                                    />
                                    ): (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </SheetContent> 
        </Sheet>
    );
};