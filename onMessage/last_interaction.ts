import { Bot, Context } from "grammy";
import { MessageHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";

async function lastInteraction(bot: Bot, context: Context, db: Database) {
}

export const lastInteractionHandler: MessageHandler = {
  name: "lastInteraction",
  callback: lastInteraction
}
