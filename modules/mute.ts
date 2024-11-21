import { Client, Context } from "@mtkruto/mtkruto";
import { WithFilter } from "https://deno.land/x/mtkruto@0.7.3/client/0_filters.ts";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { getUserAdminRights } from "../helpers/telegram.ts";

async function toggleMuteUser(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
	_db: Database,
) {
	const userToBeMutedId = ctx.message.replyToMessage!.from!.id;
	const userToBeMuted = await ctx.getChatMember(userToBeMutedId);
	const userToBeMutedName = userToBeMuted.user.username ??
		`${userToBeMuted.user.firstName} ${userToBeMuted.user.lastName}`;

	const chatId = ctx.message.chat.id;

	if (await getUserAdminRights(bot, chatId) == undefined) {
		await ctx.reply("Bot does not have enough permissions");
		return;
	}

	if (!ctx.message.replyToMessageId) {
		await ctx.reply(
			"You need to reply to a user's message to mute them",
		);
		return;
	}

	try {
		await bot.setChatMemberRights(chatId, userToBeMutedId, {
			rights: {
				canSendMessages: false,
			},
		});

		await ctx.reply(`Muted User ${userToBeMutedName}`);
	} catch {
		await ctx.reply(
			`Error has occured with muting ${userToBeMutedName}`,
		);
	}
}

export const toggleMuteUserHandler: CommandHandler = {
	name: "mute",
	callback: toggleMuteUser,
	botAdminOnly: false,
};
