import { Bot, Context } from "grammy";
import { MessageHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { BCtx } from "../types/bot_ctx.ts";

async function lastInteraction(bot: Bot<BCtx>, context: BCtx, db: Database) {
}

export const lastInteractionHandler: MessageHandler = {
  name: "lastInteraction",
  callback: lastInteraction
}
