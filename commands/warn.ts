import { Bot, Context } from "grammy";
import { Database } from "@db/sqlite";
import { getUserAdminRights } from "../helpers/telegram.ts";
import { SettingsRepo } from "../repos/settings.ts";
import { UsersRepo } from "../repos/users.ts";

import { WarnSettings } from "../types/settings/warnSettings.ts"
import { CommandHandler } from "../types/misc.ts"

export async function warnUser(
  bot: Bot,
  ctx: Context,
  db: Database) {
  const chatId = ctx.message!.chat.id;

  const userToBeWarnedId = ctx.message?.reply_to_message?.from?.id;
  if (await getUserAdminRights(bot, chatId) == undefined) {
    await ctx.reply("Bot does not have enough permissions");
    return;
  }

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
  const userToBeWarnedName = userToBeWarned.user.username ?? `${userToBeWarned.user.first_name} ${userToBeWarned.user.last_name}`;

  userRepo.addUser(userToBeWarnedId);
  const user = userRepo.getUser(userToBeWarnedId)!;
}

export const warnUserHandler: CommandHandler = {
  name: "warn",
  description: "warn a user",
  callback: warnUser,
  botAdminOnly: false
}
