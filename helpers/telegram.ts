import { Database } from "@db/sqlite";
import { CommandHandler, MessageHandler } from "../types/misc.ts";
import { checkUserPermissions } from "./database.ts";
import { isChatAllowed, createDefaultSettings, createDefaultChatRoles } from "./database.ts";
import { ChatRepo } from "../repos/chats.ts";
import { RolesRepo } from "../repos/roles.ts";
import { CommandRepo } from "../repos/commands.ts";
import { UsersRepo } from "../repos/users.ts";
import { User } from "../types/entities/user.ts";

import { AdminUserRole } from "../seeding/defaultChatRoles.ts";
import { UndefinedSeededError } from "../types/errors/undefinedSeededError.ts";
import { ChatMember, Client } from "@mtkruto/mtkruto";
import { MessageDataType } from "../types/messageDataTypes.ts";

export async function getUserAdminRights(
  bot: Client,
  chatId: number,
): Promise<ChatMember | undefined> {
  const user = await bot.getMe();
  const admins = await bot.getChatAdministrators(chatId);
  const userRole = admins.find((member) => member.user.id == user.id);
  return userRole;
}

export async function getUserFromApi(bot: Client, chatId: number, userId: number): Promise<ChatMember | null> {
  try {
    return await bot.getChatMember(chatId, userId)
  }
  catch
  {
    return null
  }
}
export function registerTextCommandHandler(
  bot: Client,
  handler: CommandHandler<MessageDataType>,
  db: Database,
) {
  const repo = new CommandRepo(db);
  repo.addCommand(handler.name, handler.botAdminOnly);

  bot.on("message").command(handler.name, async (ctx) => {
    const userRepo = new UsersRepo(db);
    const chatRepo = new ChatRepo(db);
    const userId = ctx.message!.from!.id;
    const chatId = ctx.chat?.id;

    userRepo.addUser(userId);
    const user: User = userRepo.getUser(userId)!;

    if (!checkUserPermissions(user, ctx.chat!.id, handler.name, db)) {
      await ctx.reply(
        "Member doesn't have enough permissions",
      );
      return;
    }

    if (!chatRepo.isChatEnabled(chatId)) {
      await ctx.reply(
        "Chat is not enabled, please run the start command",
      );
      return;
    }

    const botRights = await getUserAdminRights(bot, chatId);
    if (botRights == undefined) {
      await ctx.reply("Bot does not have enough permissions");
      return;
    }
    const messagedata: MessageDataType = {
      body: ctx.msg.text.replace("/"+handler.name, "")
    } 
    await handler.callback(bot, ctx, db, messagedata);
  });
}

//TODO: enable/disable check here too
export function registerMessageHandler(
  bot: Client,
  handler: MessageHandler,
  db: Database,
) {
  bot.on("message", async (ctx) => {
    await handler.callback(bot, ctx, db);
  });
}

export function registerStartHandler(
  bot: Client,
  db: Database,
): void | UndefinedSeededError {
  bot.command("start", async (ctx) => {
    const userRepo = new UsersRepo(db);
    const chatRepo = new ChatRepo(db);
    const roleRepo = new RolesRepo(db);

    const chatId = ctx.chat.id;

    if (ctx.message == undefined)
      return
    const userId = ctx.message.from.id;
    if (chatId == undefined || userId == undefined)
      return
    
    userRepo.addUser(userId);
    const user: User = userRepo.getUser(userId)!;
    if (
      !isChatAllowed(chatId, db) &&
      !checkUserPermissions(
        user,
        chatId,
        "INTERNAL_STARTCOMMAND_DONT_ADD_TO_DB",
        db,
      )
    ) {
      await ctx.reply(
        "Please contact an administrator to allow the bot to work here. Then run the command again",
      );
      return;
    }

    if (chatRepo.isChatEnabled(chatId))
      return

    chatRepo.AllowChat(chatId);
    chatRepo.EnableChat(chatId);

    createDefaultSettings(chatId, db);
    createDefaultChatRoles(chatId, db);

    const adminRoleId = roleRepo.getRoleByName(chatId, AdminUserRole);
    if (adminRoleId == undefined)
      return new UndefinedSeededError;

    roleRepo.addUserRole(chatId, adminRoleId.Id, userId);
    await ctx.reply("Enabled Chat");
  });
}
