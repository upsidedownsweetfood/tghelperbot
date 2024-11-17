import { Client } from "@mtkruto/mtkruto";
import { CommandHandler, MessageHandler } from "../types/misc.ts";
import { checkUserPermissions } from "./database.ts";
import { Database } from "@db/sqlite";
import { isChatAllowed, isChatEnabled } from "./database.ts";

export function registerCommandHandler(
	bot: Client,
	handler: CommandHandler,
	db: Database,
) {
	bot.command(handler.name, async (ctx) => {
		if (
			!checkUserPermissions(
				ctx.message.from!.id,
				ctx.chat.id,
				handler.name,
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
		if (!isChatAllowed(ctx.chat.id, db)) {
			await ctx.reply(
				"Please contact an administrator to allow the bot to work here. Then run the command again",
			);
		} else await ctx.reply("blep:");
	});
}
