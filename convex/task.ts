import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx : any) => {
    const tasks = await ctx.db.query("tasks").collect();
    return await ctx.db.query("tasks").collect();
  },
});