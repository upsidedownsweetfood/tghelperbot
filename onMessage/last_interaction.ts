import { Client, Context } from "@mtkruto/mtkruto";
import { MessageHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";

async function lastInteraction(bot: Client, context: Context, db: Database) {
}

export const lastInteractionHandler: MessageHandler = {
  name: "lastInteraction",
  callback: lastInteraction
}
