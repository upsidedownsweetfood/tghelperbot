import { Client, Context } from "@mtkruto/mtkruto";
import { WithFilter } from "https://deno.land/x/mtkruto@0.6.0/client/0_filters.ts";
import { Database } from "@db/sqlite";

export type BotCredentials = {
	apiKey: string | undefined;
	apiHash: string | undefined;
	apiID: number | undefined;
};

export type CommandHandler = {
	name: string;
	callback: (
		bot: Client,
		ctx: WithFilter<Context, "message:text">,
		db: Database,
	) => Promise<void>;
	botAdminOnly: boolean;
};

export type MessageHandler = {
	name: string; // only useful to enable in db
	callback: (
		bot: Client,
		ctx: WithFilter<Context, "message:text">,
		db: Database,
	) => Promise<void>;
};
