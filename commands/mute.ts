import { Client, Context } from "@mtkruto/mtkruto";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";

export async function setMuteStatus(
  bot: Client,
  ctx: Context,
  userId: number,
  chatId: number,
  muted: boolean,
) {
  if (!ctx.msg?.replyToMessage) {
    await ctx.reply(
      "You need to reply to a user's message to mute them",
    );
    return;
  }

  try {
    await bot.setChatMemberRights(chatId, userId, {
      "rights": {
        "canSendMessages": muted
      }
    });
    return true;
  } catch {
    return false;
  }
}

async function muteUser(
  bot: Client,
  ctx: Context,
  _db: Database,
) {
  const userId = ctx.msg!.replyToMessage!.from!.id;
  const userToBeMuted = await ctx.getChatMember(userId);
  const chatId = ctx.msg!.chat.id;

  const success = await setMuteStatus(bot, ctx, userId, chatId, false);

  const userToBeMutedName = userToBeMuted.user.username ??
    `${userToBeMuted.user.firstName} ${userToBeMuted.user.lastName}`;

  if (success) await ctx.reply(`Muted User ${userToBeMutedName}`);
  else await ctx.reply(`Error has occured with muting ${userToBeMutedName}`);
}

async function unmuteUser(
  bot: Client,
  ctx: Context,
  _db: Database,
) {
  const userId = ctx.msg!.replyToMessage!.from!.id;
  const userToBeUnmuted = await ctx.getChatMember(userId);
  const chatId = ctx.msg!.chat.id;

  const success = await setMuteStatus(bot, ctx, userId, chatId, true);

  const userToBeMutedName = userToBeUnmuted.user.username ??
    `${userToBeUnmuted.user.firstName} ${userToBeUnmuted.user.lastName}`;

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
