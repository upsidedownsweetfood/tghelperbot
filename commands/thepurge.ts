import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { log, LogTypes } from "../helpers/log.ts";
import { chatAdministratorRightsToTlObject, Client, Context } from "@mtkruto/mtkruto";

export async function execute_purge(
  bot: Client,
  ctx: Context,
  db: Database
) {
  log(LogTypes.INFO, "EXECUTING PURGE")
  const chatId = ctx.chat?.id;
  if (!chatId)
    return;

  const inactiveUsers = (await bot.getChatMembers(chatId)).filter(async m => {
    if (!m.user.isBot)
    {
      const messages = await ctx.searchMessages("", {
        from: m.user.id
      })
      return messages.length
    }
  })
}

export const purgeInactiveUsersHandler: CommandHandler = {
    name: "in_purge",
    description: "purge inactive users",
    callback: execute_purge,
    botAdminOnly: false,
    botNeedsAdmin: true
}