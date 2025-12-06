import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString =  new Handlebars.SafeString(jsonString);

    return safeString;
});

type HttpRequestData = {
    variableName: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId,
    context,
    step,
}) => {
    //todo publish loading for  Http Request

    if (!data.endpoint) {
        //todo publish error state for  Http Request
        throw new NonRetriableError("Endpoint is required");
    }
    if (!data.variableName) {
        //todo publish error state for  Http Request
        throw new NonRetriableError("Variable name is required");
    }
    if (!data.method) {
        //todo publish error state for  Http Request
        throw new NonRetriableError("Method is not configured");
    }

    const result = await step.run("http_request", async () => {
        const endpoint = Handlebars.compile(data.endpoint)(context);
        console.log("ENDPOINTS", { endpoint });
        const method = data.method;

        const options: KyOptions = { method };

        if (["POST", "PUT", "PATCH"].includes(method)) {
            const resolved = Handlebars.compile(data.body || "{}")(context);
            JSON.parse(resolved); // Validate JSON
            options.body = resolved;
            options.headers = {
                "Content-Type": "application/json",
            };
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type");
        const responseData = contentType?.includes("application/json")
            ? await response.json()
            : await response.text();

        const responsePayload = {
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            },
        };

        return {
            ...context,
            [data.variableName]: responsePayload,
        }
    });


    //todo: publish success state for  Http Request

    return result;
};