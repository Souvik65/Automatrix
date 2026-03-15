import { ExecutionContext, NodeResult, WorkflowNode } from "../../types";
import { NodeType } from "@prisma/client";
import { Resend } from "resend";

export const SendEmailActionNode: WorkflowNode = {
  type: NodeType.SEND_EMAIL_ACTION,
  ports: { inputs: 1, outputs: 1 },
  async execute(context: ExecutionContext): Promise<NodeResult> {
    const { to, subjectTemplate, bodyTemplate } = context.nodeData;
    
    if (!to || !subjectTemplate || !bodyTemplate) {
      return { success: false, data: [], error: "Missing email configuration." };
    }

    // In a real n8n environment, credentials come securely from DB
    const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");
    const outputItems = [];

    for (const item of context.inputData) {
      try {
        // Very basic template rendering
        let renderedTo = to as string;
        let renderedSubject = subjectTemplate as string;
        let renderedBody = bodyTemplate as string;

        // Replace {{key}} with item data
        Object.keys(item.json).forEach(key => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          const value = String(item.json[key] || '');
          renderedTo = renderedTo.replace(regex, value);
          renderedSubject = renderedSubject.replace(regex, value);
          renderedBody = renderedBody.replace(regex, value);
        });

        // Uncomment to actually send if API key exists
        /*
        const response = await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: renderedTo,
          subject: renderedSubject,
          html: renderedBody
        });
        */

        const response = { id: `mock_email_${Date.now()}` }; 

        outputItems.push({
          json: {
            success: true,
            messageId: response.id,
            sentTo: renderedTo,
            originalItem: item.json
          }
        });
      } catch (err: any) {
         return { success: false, data: outputItems, error: `Failed processing item for email: ${err.message}` };
      }
    }

    return { success: true, data: outputItems };
  }
};
