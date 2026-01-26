import { inngest } from "@/inngest/client";
import { sendWorkflowExecution } from "@/inngest/utils";
import prisma from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { workflowId: string } }
) {
    try {
        const workflowId = params.workflowId;

        // Verify workflow exists
        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId },
            select: { id: true, userId: true },
        });

        if (!workflow) {
            return NextResponse.json(
                { success: false, error: "Workflow not found" },
                { status: 404 }
            );
        }

        // Parse request body
        const contentType = request.headers.get("content-type") || "";
        let body: any;

        if (contentType.includes("application/json")) {
            body = await request.json();
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
            const formData = await request.formData();
            body = Object.fromEntries(formData);
        } else {
            body = await request.text();
        }

        // Capture request metadata
        const webhookData = {
            body,
            headers: Object.fromEntries(request.headers.entries()),
            method: request.method,
            query: Object.fromEntries(new URL(request.url).searchParams),
            timestamp: new Date().toISOString(),
        };

        // Trigger workflow execution
        await sendWorkflowExecution({
            workflowId,
            initialData: {
                webhook: webhookData,
            },
        });

        return NextResponse.json(
            { success: true, message: "Workflow triggered successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process webhook" },
            { status: 500 }
        );
    }
}

// Support GET for webhook testing
export async function GET(
    request: NextRequest,
    { params }: { params: { workflowId: string } }
) {
    return POST(request, { params });
}