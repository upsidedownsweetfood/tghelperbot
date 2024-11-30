import { ChatMember, Client } from "@mtkruto/mtkruto";
import { CommandHandler, MessageHandler } from "../types/misc.ts";
import { checkUserPermissions } from "./database.ts";
import { Database } from "@db/sqlite";
import { isChatAllowed, isChatEnabled } from "./database.ts";
import { ChatRepo } from "../types/tables/Chats.ts";
import { CommandRepo } from "../types/tables/Commands.ts";
import { User, UserRepo } from "../types/tables/Users.ts";

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
	const repo = new CommandRepo(db);
	repo.addModule(handler.name, handler.botAdminOnly);

	bot.command(handler.name, async (ctx) => {
		const userRepo = new UserRepo(db);
		const userId = ctx.message.from!.id;

		userRepo.addUser(userId);
		const user: User = userRepo.getUser(userId)!;

		if (
			!checkUserPermissions(
				user,
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

export function registerErrorHandler(
	bot: Client,
) {
	bot.use(async (ctx, next) => {
		try {
			await next(); // call the next handlers
		} catch (err) {
			console.error("Failed to handle an update:");
			console.trace(err);
			await ctx.reply(
				"An unknown error has occured, check the logs",
			);
		}
	});
}
export function registerStartHandler(
	bot: Client,
	db: Database,
) {
	bot.command("start", async (ctx) => {
		const userRepo = new UserRepo(db);
		const chatRepo = new ChatRepo(db);

		const userId = ctx.message.from!.id;
		userRepo.addUser(userId);

		const user: User = userRepo.getUser(userId)!;

		if (
			!isChatAllowed(ctx.chat.id, db) &&
			!checkUserPermissions(
				user,
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

		chatRepo.AllowChat(ctx.chat.id);
		chatRepo.EnableChat(ctx.chat.id);

		await ctx.reply("Enabled Chat");
	});
}
