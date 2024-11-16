import { Client, Context } from "@mtkruto/mtkruto";
import { WithFilter } from "https://deno.land/x/mtkruto@0.6.0/client/0_filters.ts";

import {
	makeUrlPlayNiceWithCachePlz,
	parseCommaSeparatedArray,
} from "../helpers/utils.ts";

import { downloadFromURL } from "../helpers/yt-dlp.ts";
import { log, LogTypes } from "../helpers/log.ts";
import { MessageHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";

const downloadedFilePath: string = Deno.env.get(
	"TEMP_DOWNLOAD_PATH",
) ?? ".cache";
const allowed_platforms: string[] = parseCommaSeparatedArray(
	Deno.env.get("PLATFORMS") ?? "",
);

async function VideoDownload(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
	_db: Database,
) {
	if (!URL.canParse(ctx.message.text)) return;

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
}

export const videoDownloadHandler: MessageHandler = {
	name: "videoDownloader",
	callback: VideoDownload,
};
