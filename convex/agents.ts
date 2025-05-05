import { v } from "convex/values";
import { components } from "./_generated/api";
import { Agent, createTool } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { tool } from "ai";
import { action } from "./_generated/server";
import { threadId } from "worker_threads";
import { z } from "zod";

const createThreadSchema = z.object({
    prompt: z.string(),
    code: z.string().min(100),
});

const supportAgent = new Agent(components.agent, {
    chat: openai.chat("gpt-4o-mini"),
    textEmbedding: openai.embedding("text-embedding-3-small"),
    instructions:
      "You are a code review assistant that is a Senior Software Engineer. Your goal is to help developers review their code by providing constructive feedback, identifying potential issues, and suggesting improvements. Focus on code quality, best practices, and potential bugs but avoid being too basic.",
    tools: {},
  });
  
  export const supportAgentStep = supportAgent.asTextAction({ maxSteps: 10 });

export const createCodeReviewThread = action({
    args: {
        prompt: v.string(),
        code: v.string(),
    },
    handler: async (ctx, args) => {

        const {prompt, code} = createThreadSchema.parse(args);

        const {threadId, thread} = await supportAgent.createThread(ctx);

        const result = await thread.generateText({
            prompt: `${prompt}\n\nHere's the code to review:\n\`\`\`\n${code}\n\`\`\``,
        });

        return {threadId: "123", prompt: args.prompt, code: args.code}
    },
})