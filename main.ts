import { Client, StorageLocalStorage } from "@mtkruto/mtkruto";

import { log, LogTypes } from "./helpers/log.ts";
import {
	parseCommaSeparatedArray,
	retrieveBotCredentials,
} from "./helpers/utils.ts";
import { videoDownloadHandler } from "./modules/videoDownload.ts";
import { warnUserHandler } from "./modules/warn.ts";
import { CommandHandler, MessageHandler } from "./types/misc.ts";
import { sha1 } from "https://deno.land/x/mtkruto@0.6.0/1_utilities.ts";

const allowed_groups: string[] = parseCommaSeparatedArray(
	Deno.env.get("GROUPS") ?? "",
);

const botCreds = retrieveBotCredentials();

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

	log(LogTypes.INFO, `ALLOWED GROUPS: ${allowed_groups.toString()}`);

	const bot = new Client({
		storage: new StorageLocalStorage("bot"),
		apiId: botCreds.apiID,
		apiHash: botCreds.apiHash,
	});

	for (const handler of commandHandlers) {
		log(
			LogTypes.INFO,
			`Registering on command handler: ${handler.name}`,
		);
		bot.command(handler.name, async (ctx) => {
			await handler.callback(bot, ctx);
		});
	}

	for (const handler of messageHandlers) {
		log(
			LogTypes.INFO,
			`Registering on message handler: ${handler.name}`,
		);
		bot.on("message:text", async (ctx) => {
			await handler.callback(bot, ctx);
		});
	}

	await bot.start({ botToken: botCreds.apiKey });
	log(LogTypes.INFO, "Bot started");
}
