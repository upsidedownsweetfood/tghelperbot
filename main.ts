import { Client, StorageLocalStorage } from "@mtkruto/mtkruto";

import { log, LogTypes } from "./helpers/log.ts";
import { retrieveBotCredentials } from "./helpers/utils.ts";
import { videoDownloadHandler } from "./modules/videoDownload.ts";
import { warnUserHandler } from "./modules/warn.ts";
import { CommandHandler, MessageHandler } from "./types/misc.ts";
import { Database } from "@db/sqlite";

const botCreds = retrieveBotCredentials();
const dbPath = Deno.env.get("DATABASE_PATH") ?? "./database.db";
const messageHandlers: MessageHandler[] = [
	videoDownloadHandler,
];

const commandHandlers: CommandHandler[] = [
	warnUserHandler,
];

if (import.meta.main) {
	if (
		botCreds.apiHash == null || botCreds.apiKey == null ||
		botCreds.apiID == null
	) throw "undefined bot credentials";

	const bot = new Client({
		storage: new StorageLocalStorage("bot"),
		apiId: botCreds.apiID,
		apiHash: botCreds.apiHash,
	});

	const db = new Database(dbPath);
	log(LogTypes.INFO, `Initialized DB at path ${dbPath}`);

	for (const handler of commandHandlers) {
		log(
			LogTypes.INFO,
			`Registering on command handler: ${handler.name}`,
		);
		bot.command(handler.name, async (ctx) => {
			await handler.callback(bot, ctx, db);
		});
	}

	for (const handler of messageHandlers) {
		log(
			LogTypes.INFO,
			`Registering on message handler: ${handler.name}`,
		);
		bot.on("message:text", async (ctx) => {
			await handler.callback(bot, ctx, db);
		});
	}

	log(LogTypes.INFO, "Starting bot");
	await bot.start({ botToken: botCreds.apiKey });
	log(LogTypes.INFO, "Bot started");
}
