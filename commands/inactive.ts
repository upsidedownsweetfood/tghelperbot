import { Client, Context } from "@mtkruto/mtkruto";
import { CustomMessageContext } from "../types/messageDataTypes.ts";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";

async function inactiveList(bot: Client, ctx: Context, db: Database, custom_context: CustomMessageContext) {
  //const activityRepo;
  //const activeUsers = activityRepo.getActiveUsersForChat(chat_id);
}

export const inactiveListHandler: CommandHandler<CustomMessageContext> = {
  name: "list_inactive",
  description: "a command to list inactive users",
  callback: inactiveList,
  botAdminOnly: false,
  botNeedsAdmin: false
}
