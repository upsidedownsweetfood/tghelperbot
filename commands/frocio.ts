import { Client, Context, MessageContentText } from "@mtkruto/mtkruto";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";

async function frocioCommand(client: Client, ctx: Context, db: Database, custom_ctx: MessageContentText) {
  
}


export const FrocioHandler: CommandHandler<MessageContentText> = {
  callback: frocioCommand,
  name: "frocio",
  description: "command required by archivi",
  botAdminOnly: false,
  botNeedsAdmin: false
}
