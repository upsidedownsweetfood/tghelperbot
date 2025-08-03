import { Client, Context } from "@mtkruto/mtkruto";
import { CustomMessageContext } from "../types/messageDataTypes.ts";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { UsersRepo } from "../repos/users.ts";
import { log, LogTypes } from "../helpers/log.ts";

async function memberList(bot: Client, ctx: Context, db: Database, custom_context: CustomMessageContext) {
  const userRepo = new UsersRepo(db);
  const chatId = ctx.chat?.id;
  const messageId: number | undefined = ctx!.msg!.replyToMessageId;

  if (chatId == undefined) {
    log(LogTypes.ERROR, "unable to get chad Id")
    return;
  }

  if (messageId != undefined) {
    const messageAuthor = (await bot.getMessage(chatId, messageId))?.from.id;
    if (messageAuthor != undefined)
      await ctx.reply("userId = " + messageAuthor);
  }
  else {
    await ctx.reply("This command requires you to a user's message");
  }
}

export const memberInfoHandler: CommandHandler<CustomMessageContext> = {
  name: "info",
  description: "a command to list user info",
  callback: memberList,
  botAdminOnly: false,
  botNeedsAdmin: false
}
