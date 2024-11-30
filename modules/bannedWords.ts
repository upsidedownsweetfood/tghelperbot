import { Client, Context } from "@mtkruto/mtkruto";
import { MessageHandler } from "../types/misc.ts";
import { WithFilter } from "https://deno.land/x/mtkruto@0.7.3/client/0_filters.ts";
import { Database } from "@db/sqlite";

async function bannedWords(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
	_db: Database,
) {
	if (ctx.message.text.toLowerCase() == "de peffo") {
		await ctx.reply("MUORI DI CANCRO");
	}
}

export const bannedWordsHandler: MessageHandler = {
	name: "bannedWords",
	callback: bannedWords,
};
