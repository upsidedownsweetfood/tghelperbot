import { Client, Context } from "@mtkruto/mtkruto";
import { WithFilter } from "https://deno.land/x/mtkruto@0.7.3/client/0_filters.ts";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { UserRepo } from "../types/tables/Users.ts";
import { getUserAdminRights } from "../helpers/telegram.ts";

// Todo
async function warnUser(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
	db: Database,
) {
	const userRepo = new UserRepo(db);

	const userId = ctx.message.replyToMessage!.from!.id;
	const userToBeMuted = await ctx.getChatMember(userId);
	const chatId = ctx.message.chat.id;

	if (await getUserAdminRights(bot, chatId) == undefined) {
		await ctx.reply("Bot does not have enough permissions");
		return;
	}

	if (!ctx.message.replyToMessageId) {
		await ctx.reply(
			"You need to reply to a user's message to warn them",
		);
		return;
	}

	userRepo.addUser(userId);
	const user = userRepo.getUser(userId)!;

	userRepo.addUserWarn(user, chatId, "");
	const userWarnsCount = userRepo.getUserWarnCounts(
		user,
		chatId,
	);

	await ctx.reply(
		`Warning user ${
			userToBeMuted.user.username ??
				`${userToBeMuted.user.firstName} ${userToBeMuted.user.lastName}`
		}, ${userWarnsCount} out of 3`,
	);

	if (userWarnsCount >= 3) {
		await bot.setChatMemberRights(chatId, userId, {
			rights: {
				canSendMessages: false,
			},
		});
		console.log(userToBeMuted);
	}
}

export const warnUserHandler: CommandHandler = {
	name: "warn",
	callback: warnUser,
	botAdminOnly: false,
};
