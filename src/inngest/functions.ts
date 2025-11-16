import prisma from "@/lib/db";
import { inngest } from "./client";
import * as Sentry from "@sentry/nextjs";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import {createAnthropic} from '@ai-sdk/anthropic';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretended-delay", "5s");

    Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' })
    console.warn("something is missing");
    console.error("this is an error log");

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text", 
      generateText, 
      {
        model: google("gemini-2.5-flash-preview-09-2025"),
        system: "you are a helpful assistant.",
        prompt: "what is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text", 
      generateText, 
      {
        model: openai("gpt-4.1-mini"),
        system: "you are a helpful assistant.",
        prompt: "what is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text", 
      generateText, 
      {
        model: anthropic("claude-2"),
        system: "you are a helpful assistant.",
        prompt: "what is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    };
  },
);