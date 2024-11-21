import { ChatMember, Client } from "@mtkruto/mtkruto";
import { CommandHandler, MessageHandler } from "../types/misc.ts";
import { checkUserPermissions } from "./database.ts";
import { Database } from "@db/sqlite";
import { isChatAllowed, isChatEnabled } from "./database.ts";
import { ChatRepo } from "../types/tables/Chats.ts";
import { ModuleRepo } from "../types/tables/Modules.ts";
import { UserRepo } from "../types/tables/Users.ts";

export async function getUserAdminRights(
	bot: Client,
	chatId: number,
): Promise<ChatMember | undefined> {
	const user = await bot.getMe();
	const admins = await bot.getChatAdministrators(chatId);
	const userRole = admins.find((member) => member.user.id == user.id);

	return userRole;
}

export function registerCommandHandler(
	bot: Client,
	handler: CommandHandler,
	db: Database,
) {
	const repo = new ModuleRepo(db);
	repo.addModule(handler.name, handler.botAdminOnly);

	bot.command(handler.name, async (ctx) => {
		if (
			!checkUserPermissions(
				ctx.message.from!.id,
				ctx.chat.id,
				handler.name,
				db,
			)
		) {
			await ctx.reply(
				"Member doesn't have enough permissions",
			);
			return;
		}
		if (!isChatEnabled(ctx.chat.id, db)) {
			await ctx.reply(
				"Chat is not enabled, please run the start command",
			);
			return;
		}

		await handler.callback(bot, ctx, db);
	});
}

export function registerMessageHandler(
	bot: Client,
	handler: MessageHandler,
	db: Database,
) {
	bot.on("message:text", async (ctx) => {
		await handler.callback(bot, ctx, db);
	});
}

export function registerStartHandler(
	bot: Client,
	db: Database,
) {
	bot.command("start", async (ctx) => {
		new UserRepo(db).addUser(ctx.message.from!.id);
		if (
			!isChatAllowed(ctx.chat.id, db) &&
			!checkUserPermissions(
				ctx.message?.from?.id!,
				ctx.chat.id,
				"INTERNAL_STARTCOMMAND_DONT_ADD_TO_DB",
				db,
			)
		) {
			await ctx.reply(
				"Please contact an administrator to allow the bot to work here. Then run the command again",
			);
			return;
		}
		const repo = new ChatRepo(db);
		repo.AllowChat(ctx.chat.id);
		repo.EnableChat(ctx.chat.id);

		await ctx.reply("Enabled Chat");
	});
}
