import { Client, StorageLocalStorage } from "@mtkruto/mtkruto";

import { log, LogTypes } from "./helpers/log.ts";
import {
	makeUrlPlayNiceWithCachePlz,
	parse_array_from_string,
} from "./helpers/utils.ts";
import { downloadFromURL } from "./helpers/yt-dlp.ts";

const downloadedFilePath: string | undefined = Deno.env.get(
	"TEMP_DOWNLOAD_PATH",
) ?? ".cache";
const bot_api_id: string | undefined = Deno.env.get("BOT_API_ID");
const bot_api_hash: string | undefined = Deno.env.get("BOT_API_HASH");
const bot_api_token: string | undefined = Deno.env.get("BOT_API_TOKEN");

const allowed_groups: string[] = parse_array_from_string(
	Deno.env.get("GROUPS") ?? "",
);
const allowed_platforms: string[] = parse_array_from_string(
	Deno.env.get("PLATFORMS") ?? "",
);

if (import.meta.main) {
	if (
		typeof bot_api_id === "undefined" ||
		typeof bot_api_hash === "undefined" ||
		typeof bot_api_token === "undefined"
	) throw "undefined bot credentials";

	const bot = new Client({
		storage: new StorageLocalStorage("bot"),
		apiId: Number(bot_api_id),
		apiHash: bot_api_hash,
	});

	log(LogTypes.INFO, `ALLOWED GROUPS: ${allowed_groups.toString()}`);

	bot.on("message:text", async (ctx) => {
		log(LogTypes.MESSAGE, `${ctx.chat.id} | ` + ctx.message.text);

		if (!URL.canParse(ctx.message.text)) return;
		if (!allowed_groups.includes(ctx.chat.id.toString())) {
			await bot.sendMessage(
				ctx.chat.id,
				"Chat or Group is not allowed to download vidoes.",
				{ replyTo: { messageId: ctx.message.id } },
			);
			return;
		}
		const sent_url: URL = new URL(ctx.message.text);
		let path = undefined;

		if (
			!allowed_platforms.includes(
				sent_url.hostname.toUpperCase().toString(),
			)
		) {
			return;
		}

		const notifMessage = await bot.sendMessage(
			ctx.chat.id,
			"Downloading Video...",
			{ replyTo: { messageId: ctx.message.id } },
		);

		const base64Url = makeUrlPlayNiceWithCachePlz(
			sent_url.toString(),
		);

		path = await downloadFromURL(
			sent_url,
			downloadedFilePath,
			base64Url,
		);

		if (typeof path === "undefined") {
			log(LogTypes.ERROR, `Could not download ${sent_url}`);
			await ctx.reply("Could not download file");
			return;
		}

		const video = await Deno.readFile(path);
		log(LogTypes.INFO, `Uploading video with url: ${sent_url}`);
		await bot.sendVideo(ctx.chat.id, video, {
			mimeType: "video/mp4",
			replyTo: { messageId: notifMessage.id },
		});
	});

	await bot.start({ botToken: bot_api_token });
	log(LogTypes.INFO, "Bot started");
}
