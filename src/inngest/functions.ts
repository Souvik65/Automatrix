import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("a", "10s");

    await step.sleep("b", "10s");

    await step.sleep("c", "10s");

    await step.sleep("d", "10s");


    await step.run("Create-workflow", () => {
        return prisma.workflow.create({
            data: {
                name: "from-inngest-function",
            },
        });
    });
  },
);