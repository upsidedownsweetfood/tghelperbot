import { Database } from "@db/sqlite";
import { Client, Context } from "@mtkruto/mtkruto";
import { CommandHandler } from "../types/misc.ts";
import { MessageDataType } from "../types/messageDataTypes.ts";
import { getUserAdminRights, getUserFromApi } from "../helpers/telegram.ts";
import { log, LogTypes } from "../helpers/log.ts";

export async function kickUser(
  bot: Client,
  ctx: Context,
  db: Database,
  messageData: MessageDataType
) {
    const chatId = ctx.chat?.id;
    if (!chatId)
        return;
    
    log(LogTypes.INFO, "kicking " + messageData.body)
    const user = await getUserFromApi(bot, chatId, Number(messageData.body.trim()))
    if (user == null)
        return
    if (user.status == "member")
        bot.kickChatMember(chatId, messageData.body)
}

export const kickUserHandler: CommandHandler<MessageDataType> = {
  name: "kick",
  description: "kick a user",
  callback: kickUser,
  botAdminOnly: false,
  botNeedsAdmin: true
};