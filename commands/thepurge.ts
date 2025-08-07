import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { log, LogTypes } from "../helpers/log.ts";
import { Client, Context } from "@mtkruto/mtkruto";
import { CustomMessageContext } from "../types/messageDataTypes.ts";
import { UsersRepo } from "../repos/users.ts";

export async function execute_purge(
  bot: Client,
  ctx: Context,
  db: Database
) {
  log(LogTypes.INFO, "EXECUTING PURGE")
  const chatId = ctx.chat?.id;
  if (!chatId)
    return;

  const UserRepo = new UsersRepo(db);

  const UsersDb = UserRepo.getUsers().map(e => e.UserId);
  const InactiveUsers = (await bot.getChatMembers(chatId))
    .filter(m => !["creator", "administrator"].includes(m.status))
    .map(m => m.user.id)
    .filter(m => !UsersDb.includes(m));

  for (const m of InactiveUsers)
  {
    log(LogTypes.INFO, "PURGE: kicked user: " + m);
    //await ctx.kickChatMember(m)
  }
}

export const purgeInactiveUsersHandler: CommandHandler<CustomMessageContext> = {
    name: "in_purge",
    description: "purge inactive users",
    callback: execute_purge,
    botAdminOnly: true,
    botNeedsAdmin: true
}
