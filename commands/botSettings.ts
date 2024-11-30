import { Client, Context } from "@mtkruto/mtkruto";
import { WithFilter } from "https://deno.land/x/mtkruto@0.6.0/client/0_filters.ts";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";

async function botSettings(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
	db: Database,
) {
	// TODO
}

export const botSettingsHandler: CommandHandler = {
	name: "AdminSettings",
	callback: botSettings,
	botAdminOnly: true,
};
