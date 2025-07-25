import { Client, Context } from "@mtkruto/mtkruto";
import { MessageHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { CustomMessageContext } from "../types/messageDataTypes.ts";
import { ActivityLogRepo } from "../repos/activityLog.ts";
import { ChatRepo } from "../repos/chats.ts";
import { ActivityLogType } from "../types/ActivitylogTypes.ts";
import { UsersRepo } from "../repos/users.ts";

async function lastInteraction(bot: Client, context: Context, db: Database, custom_ctx: CustomMessageContext) {
  const chatId = context.chat?.id!;
  const userId = custom_ctx.message.from.id;

  const activityRepo = new ActivityLogRepo(db);
  const userRepo = new UsersRepo(db);

  userRepo.addUser(userId);
  activityRepo.AddActivity(chatId, userId, ActivityLogType.MESSAGE);
}

export const lastInteractionHandler: MessageHandler<CustomMessageContext> = {
  name: "lastInteraction",
  callback: lastInteraction,
}
