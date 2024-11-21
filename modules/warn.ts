import { Client, Context } from "@mtkruto/mtkruto";
import { WithFilter } from "https://deno.land/x/mtkruto@0.7.3/client/0_filters.ts";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { UserRepo } from "../types/tables/Users.ts";
import { getUserAdminRights } from "../helpers/telegram.ts";

async function warnUser(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
	db: Database,
) {
	const userRepo = new UserRepo(db);

	const userToBeWarnedId = ctx.message.replyToMessage!.from!.id;
	const userToBeWarned = await ctx.getChatMember(userToBeWarnedId);
	const userToBeWarnedName = userToBeWarned.user.username ??
		`${userToBeWarned.user.firstName} ${userToBeWarned.user.lastName}`;

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

	userRepo.addUser(userToBeWarnedId);
	const user = userRepo.getUser(userToBeWarnedId)!;

	userRepo.addUserWarn(user, chatId, "");
	const userWarnsCount = userRepo.getUserWarnCounts(
		user,
		chatId,
	);

	await ctx.reply(
		`Warning user ${userToBeWarnedName}, ${userWarnsCount} out of 3`,
	);

	if (userWarnsCount >= 3) {
		try {
			await bot.setChatMemberRights(
				chatId,
				userToBeWarnedId,
				{
					rights: {
						canSendMessages: false,
					},
				},
			);
		} catch {
			await ctx.reply(
				`Error has occured with warning ${userToBeWarnedName}, reverting the warn`,
			);
		}
	}
}

export const warnUserHandler: CommandHandler = {
	name: "warn",
	callback: warnUser,
	botAdminOnly: false,
};
