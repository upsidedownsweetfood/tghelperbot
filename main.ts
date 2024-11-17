import { Client, StorageLocalStorage } from "@mtkruto/mtkruto";
import { Database } from "@db/sqlite";

import { log, LogTypes } from "./helpers/log.ts";
import { retrieveBotCredentials } from "./helpers/utils.ts";
import { warnUserHandler } from "./modules/warn.ts";
import { CommandHandler, MessageHandler } from "./types/misc.ts";
import {
	registerCommandHandler,
	registerMessageHandler,
	registerStartHandler,
} from "./helpers/telegram.ts";

const botCreds = retrieveBotCredentials();

const dbPath = Deno.env.get("DATABASE_PATH") ?? "./database.db";

const messageHandlers: MessageHandler[] = [];
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

	log(LogTypes.INFO, "Registering start command handler");
	registerStartHandler(bot, db);

	for (const handler of commandHandlers) {
		log(
			LogTypes.INFO,
			`Registering command handler: ${handler.name}`,
		);
		registerCommandHandler(bot, handler, db);
	}

	for (const handler of messageHandlers) {
		log(
			LogTypes.INFO,
			`Registering message handler: ${handler.name}`,
		);
		registerMessageHandler(bot, handler, db);
	}

	await bot.start({ botToken: botCreds.apiKey });
	log(LogTypes.INFO, "Bot started");
}
