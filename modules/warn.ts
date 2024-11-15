import { Client, Context } from "@mtkruto/mtkruto";
import { WithFilter } from "https://deno.land/x/mtkruto@0.6.0/client/0_filters.ts";
import { log, LogTypes } from "../helpers/log.ts";
import { CommandHandler } from "../types/misc.ts";

// Todo
async function warnUser(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
) {
}

export const warnUserHandler: CommandHandler = {
	name: "warn",
	callback: warnUser,
};
