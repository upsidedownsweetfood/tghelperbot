import { Bot, Context } from "grammy";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";

export async function setMuteStatus(
  bot: Bot,
  ctx: Context,
  userId: number,
  chatId: number,
  muted: boolean,
) {
  if (!ctx.message?.reply_to_message) {
    await ctx.reply(
      "You need to reply to a user's message to mute them",
    );
    return;
  }

  try {
    await bot.api.restrictChatMember(chatId, userId, {
      can_send_messages: muted,
    });
    return true;
  } catch {
    return false;
  }
}

async function muteUser(
  bot: Bot,
  ctx: Context,
  _db: Database,
) {
  const userId = ctx.message!.reply_to_message!.from!.id;
  const userToBeMuted = await ctx.getChatMember(userId);
  const chatId = ctx.message!.chat.id;

  const success = await setMuteStatus(bot, ctx, userId, chatId, false);

  const userToBeMutedName = userToBeMuted.user.username ??
    `${userToBeMuted.user.first_name} ${userToBeMuted.user.last_name}`;

  if (success) await ctx.reply(`Muted User ${userToBeMutedName}`);
  else await ctx.reply(`Error has occured with muting ${userToBeMutedName}`);
}

async function unmuteUser(
  bot: Bot,
  ctx: Context,
  _db: Database,
) {
  const userId = ctx.message!.reply_to_message!.from!.id;
  const userToBeUnmuted = await ctx.getChatMember(userId);
  const chatId = ctx.message!.chat.id;

  const success = await setMuteStatus(bot, ctx, userId, chatId, true);

  const userToBeMutedName = userToBeUnmuted.user.username ??
    `${userToBeUnmuted.user.first_name} ${userToBeUnmuted.user.last_name}`;

  if (success) await ctx.reply(`unmuted User ${userToBeMutedName}`);
  else {await ctx.reply(
      `Error has occured with unmuting ${userToBeMutedName}`,
    );}
}

export const muteUserHandler: CommandHandler = {
  name: "mute",
  description: "Mute a user",
  callback: muteUser,
  botAdminOnly: false,
  botNeedsAdmin: true
};

export const unmuteUserHandler: CommandHandler = {
  name: "unmute",
  description: "Unmute a user",
  callback: unmuteUser,
  botAdminOnly: false,
  botNeedsAdmin: true
};
