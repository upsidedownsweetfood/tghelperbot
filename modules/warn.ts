import { Client, Context } from "@mtkruto/mtkruto";
import { WithFilter } from "https://deno.land/x/mtkruto@0.6.0/client/0_filters.ts";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { UserRepo } from "../types/tables/Users.ts";

// Todo
async function warnUser(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
	db: Database,
) {
	const userRepo = new UserRepo(db);

	if (!ctx.message.replyToMessageId) {
		await ctx.reply(
			"You need to reply to a user's message to warn them",
		);
		return;
	}
	const userId = ctx.message.replyToMessage!.from!.id;
	const userName = ctx.message.replyToMessage?.from?.username;
	userRepo.addUser(userId);
	const user = userRepo.getUser(userId)!;

	userRepo.addUserWarn(user, ctx.message.chat.id, "");
	const userWarnsCount = userRepo.getUserWarnCounts(
		user,
		ctx.message.chat.id,
	);
	await ctx.reply(`Warning user ${userName}, ${userWarnsCount} out of 3`);
}

export const warnUserHandler: CommandHandler = {
	name: "warn",
	callback: warnUser,
	botAdminOnly: false,
};
