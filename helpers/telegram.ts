import { Bot, Context } from "grammy";
import { Database } from "@db/sqlite";
import { ChatMember } from "grammy_types";
import { CommandHandler, MessageHandler } from "../types/misc.ts";
import { checkUserPermissions } from "./database.ts";
import { isChatAllowed, createDefaultSettings, createDefaultChatRoles } from "./database.ts";
import { ChatRepo } from "../repos/chats.ts";
import { RolesRepo } from "../repos/roles.ts";
import { CommandRepo } from "../repos/commands.ts";
import { UsersRepo } from "../repos/users.ts";
import { User } from "../types/entities/user.ts";
import { log } from "./log.ts";
import { LogTypes } from "./log.ts";

import { AdminUserRole } from "../seeding/defaultChatRoles.ts";

export async function getUserAdminRights(
  bot: Bot,
  chatId: number,
): Promise<ChatMember | undefined> {
  const user = await bot.api.getMe();
  const admins = await bot.api.getChatAdministrators(chatId);
  const userRole = admins.find((member) => member.user.id == user.id);
  return userRole;
}

export function registerCommandHandler(
  bot: Bot,
  handler: CommandHandler,
  db: Database,
) {
  const repo = new CommandRepo(db);
  repo.addCommand(handler.name, handler.botAdminOnly);

  bot.on("message").command(handler.name, async (ctx: Context) => {
    const userRepo = new UsersRepo(db);
    const chatRepo = new ChatRepo(db);
    const userId = ctx.message!.from!.id;

    userRepo.addUser(userId);
    const user: User = userRepo.getUser(userId)!;

    if (
      !checkUserPermissions(
        user,
        ctx.chat!.id,
        handler.name,
        db,
      )
    ) {
      await ctx.reply(
        "Member doesn't have enough permissions",
      );
      return;
    }
    if (!chatRepo.isChatEnabled(ctx.chat!.id)) {
      await ctx.reply(
        "Chat is not enabled, please run the start command",
      );
      return;
    }

    await handler.callback(bot, ctx, db);
  });
}

//TODO: enable/disable check here too
export function registerMessageHandler(
  bot: Bot,
  handler: MessageHandler,
  db: Database,
) {
  bot.on("message", async (ctx: Context) => {
    await handler.callback(bot, ctx, db);
  });
}

export function registerErrorHandler(
  bot: Bot,
) {
  bot.catch(async (ctx) => {
    log(LogTypes.ERROR, String(ctx.error));
    await ctx.ctx.reply("Unknown error");
  });
}

export function registerStartHandler(
  bot: Bot,
  db: Database,
) {
  bot.command("start", async (ctx: Context) => {
    const userRepo = new UsersRepo(db);
    const chatRepo = new ChatRepo(db);
    const roleRepo = new RolesRepo(db);

    const chatId = ctx.chat?.id;

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

    chatRepo.AllowChat(chatId);
    chatRepo.EnableChat(chatId);

    createDefaultSettings(chatId, db);
    createDefaultChatRoles(chatId, db);

    const adminRoleId = roleRepo.getRoleByName(chatId, AdminUserRole);
    if (adminRoleId == undefined)
      return

    roleRepo.addUserRole(chatId, adminRoleId.Id, userId);
    await ctx.reply("Enabled Chat");
  });
}
