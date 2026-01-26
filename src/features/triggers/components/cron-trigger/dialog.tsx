"use client";

import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { parseCronExpression, generateCronDescription } from "./utils";
import { saveCronSchedule } from "./actions";
import { useReactFlow } from "@xyflow/react";
import * as parser from "cron-parser";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nodeId: string;
}

const PRESET_SCHEDULES = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Every 5 minutes", value: "*/5 * * * *" },
    { label: "Every hour", value: "0 * * * *" },
    { label: "Every day at 9 AM", value: "0 9 * * *" },
    { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
    { label: "Every 1st of month", value: "0 0 1 * *" },
    { label: "Custom", value: "custom" },
];

const TIMEZONES = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Kolkata",
    "Australia/Sydney",
];

export const CronTriggerDialog = ({ open, onOpenChange, nodeId }: Props) => {
    const params = useParams();
    const workflowId = params.workflowId as string;
    const { showSuccess, showError } = useToastNotification();
    const { setNodes } = useReactFlow();

    const [preset, setPreset] = useState("0 9 * * *");
    const [customExpression, setCustomExpression] = useState("");
    const [timezone, setTimezone] = useState("UTC");
    const [enabled, setEnabled] = useState(true);
    const [nextRuns, setNextRuns] = useState<string[]>([]);
    const [description, setDescription] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [loading, setLoading] = useState(false);

    const cronExpression = preset === "custom" ? customExpression : preset;

    useEffect(() => {
        try {
            const interval = parser.parseExpression(cronExpression, {
                currentDate: new Date(),
                tz: timezone,
            });

            const runs: string[] = [];
            for (let i = 0; i < 5; i++) {
                runs.push(interval.next().toDate().toLocaleString());
            }
            setNextRuns(runs);
            setDescription(generateCronDescription(cronExpression));
            setIsValid(true);
        } catch (error) {
            setNextRuns([]);
            setDescription("Invalid cron expression");
            setIsValid(false);
        }
    }, [cronExpression, timezone]);

    const handleSave = async () => {
        if (!isValid) {
            showError("Please enter a valid cron expression");
            return;
        }

        setLoading(true);
        try {
            await saveCronSchedule({
                workflowId,
                nodeId,
                cronExpression,
                timezone,
                enabled,
            });

            // Update node data
            setNodes((nodes) => 
                nodes.map((node) => {
                    if (node.id === nodeId) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                cronExpression,
                                timezone,
                                enabled,
                            },
                        };
                    }
                    return node;
                })
            );

            showSuccess("Cron schedule saved successfully");
            onOpenChange(false);
        } catch (error) {
            showError("Failed to save cron schedule");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-6 rounded-scrollbar max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Cron Schedule Configuration</DialogTitle>
                    <DialogDescription>
                        Schedule your workflow to run automatically at specified times
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Preset Selector */}
                    <div className="space-y-2">
                        <Label>Schedule Preset</Label>
                        <Select value={preset} onValueChange={setPreset}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PRESET_SCHEDULES.map((p) => (
                                    <SelectItem key={p.value} value={p.value}>
                                        {p.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Custom Expression */}
                    {preset === "custom" && (
                        <div className="space-y-2">
                            <Label>Custom Cron Expression</Label>
                            <Input
                                placeholder="0 9 * * *"
                                value={customExpression}
                                onChange={(e) => setCustomExpression(e.target.value)}
                                className={`font-mono ${!isValid ? "border-red-500" : ""}`}
                            />
                            <p className="text-xs text-muted-foreground">
                                Format: minute hour day month weekday
                            </p>
                        </div>
                    )}

                    {/* Timezone */}
                    <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TIMEZONES.map((tz) => (
                                    <SelectItem key={tz} value={tz}>
                                        {tz}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    {isValid && (
                        <div className="rounded-lg bg-muted p-4">
                            <p className="text-sm font-medium mb-2">Schedule Description:</p>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                    )}

                    {/* Next Runs */}
                    {isValid && nextRuns.length > 0 && (
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm">Next 5 Executions:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                {nextRuns.map((run, i) => (
                                    <li key={i} className="font-mono text-xs">
                                        {i + 1}. {run}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Cron Syntax Help */}
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Cron Syntax:</h4>
                        <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`*    *    *    *    *
┬    ┬    ┬    ┬    ┬
│    │    │    │    └─ Weekday (0-6, Sun-Sat)
│    │    │    └────── Month (1-12)
│    │    └─────────── Day (1-31)
│    └──────────────── Hour (0-23)
└───────────────────── Minute (0-59)

Examples:
0 9 * * *     → Every day at 9:00 AM
*/15 * * * *  → Every 15 minutes
0 0 1 * *     → First day of every month
0 9 * * 1     → Every Monday at 9:00 AM`}
                        </pre>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!isValid || loading}>
                        {loading ? "Saving..." : "Save Schedule"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};