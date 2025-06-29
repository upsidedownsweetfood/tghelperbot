import { Database } from "@db/sqlite";
import { SettingsRepo } from "../repos/settings.ts";
import { UsersRepo } from "../repos/users.ts";

import { WarnSettings } from "../types/settings/warnSettings.ts"
import { CommandHandler } from "../types/misc.ts"
import { Client, Context } from "@mtkruto/mtkruto";

export async function warnUser(
  bot: Client,
  ctx: Context,
  db: Database) {
  const chatId = ctx.msg!.chat.id;

  const userToBeWarnedId = ctx.msg?.replyToMessage?.from?.id;

  if (userToBeWarnedId == undefined) {
    await ctx.reply(
      "You need to reply to a user's message to warn them or mention them"
    );
    return;
  }

  const userRepo = new UsersRepo(db);
  const settingsRepo = new SettingsRepo(db);

  const commandSettings = settingsRepo.getSettingsJson<WarnSettings>("warn", chatId);
  const userToBeWarned = await ctx.getChatMember(userToBeWarnedId);
  const userToBeWarnedName = userToBeWarned.user.username ?? `${userToBeWarned.user.firstName} ${userToBeWarned.user.lastName}`;

  userRepo.addUser(userToBeWarnedId);
  const user = userRepo.getUser(userToBeWarnedId)!;
}

export const warnUserHandler: CommandHandler = {
  name: "warn",
  description: "warn a user",
  callback: warnUser,
  botAdminOnly: false,
  botNeedsAdmin: true
}
