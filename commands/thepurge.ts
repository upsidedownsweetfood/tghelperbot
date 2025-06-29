import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { log, LogTypes } from "../helpers/log.ts";
import { chatAdministratorRightsToTlObject, Client, Context } from "@mtkruto/mtkruto";
import { typeByExtension } from "jsr:@std/media-types@1.1.0/type-by-extension";
import { MessageDataType } from "../types/messageDataTypes.ts";

export async function execute_purge(
  bot: Client,
  ctx: Context,
  db: Database
) {
  log(LogTypes.INFO, "EXECUTING PURGE")
  const chatId = ctx.chat?.id;
  if (!chatId)
    return;

  for (const m of await bot.getChatMembers(chatId))
  {
    if (!["creator", "administrator"].includes(m.status))
    await ctx.kickChatMember(m.user.id)
  }
}

export const purgeInactiveUsersHandler: CommandHandler<MessageDataType> = {
    name: "in_purge",
    description: "purge inactive users",
    callback: execute_purge,
    botAdminOnly: false,
    botNeedsAdmin: true
}