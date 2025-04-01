import { Bot } from "https://deno.land/x/grammy@v1.32.0/bot";
import { Context } from "https://deno.land/x/grammy@v1.32.0/context";
import { Database } from "https://jsr.io/@db/sqlite/0.12.0/src/database";
import { getUserAdminRights } from "../helpers/telegram.ts";
import { CommandSettingsRepo } from "../types/tables/CommandSettings.ts";
import { UserRepo } from "../types/tables/Users.ts";
import { setMuteStatus } from "./mute.ts";
import { undefined } from "./warn.ts";

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

  const userRepo = new UserRepo(db);
  const settingsRepo = new CommandSettingsRepo(db);

  const commandSettings = settingsRepo;
  const userToBeWarned = await ctx.getChatMember(userToBeWarnedId);
  const userToBeWarnedName = userToBeWarned.user.username ?? `${userToBeWarned.user.first_name} ${userToBeWarned.user.last_name}`;

  userRepo.addUser(userToBeWarnedId);
  const user = userRepo.getUser(userToBeWarnedId)!;

  userRepo.addUserWarn(user, chatId, "");
  const userWarnsCount = userRepo.getUserWarnCounts(
    user,
    chatId
  );

  if (userWarnsCount <= 3) {
    await ctx.reply(
      `Warning user ${userToBeWarnedName}, ${userWarnsCount} out of 3`
    );
    return;
  }

  const success = await setMuteStatus(
    bot,
    ctx,
    userToBeWarnedId,
    chatId,
    true
  );

  if (success) await ctx.reply("User has been silenced");
  else {
    await ctx.reply(
      "Could not mute the user, maybe they are a group admin?"
    );
  }
}
