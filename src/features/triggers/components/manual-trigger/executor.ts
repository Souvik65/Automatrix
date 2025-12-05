import type { NodeExecutor } from "@/features/executions/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
    nodeId,
    context,
    step,
}) => {
    //todo publish loading for manua trigger node

    const result = await step.run("manual-trigger", async () => context);

    //todo: publish success state for manual trigger node

    return result;
};