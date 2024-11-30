import { Client, Context } from "@mtkruto/mtkruto";
import { WithFilter } from "https://deno.land/x/mtkruto@0.7.3/client/0_filters.ts";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { getUserAdminRights } from "../helpers/telegram.ts";

async function setMuteStatus(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
	userId: number,
	chatId: number,
	muted: boolean,
) {
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
		await bot.setChatMemberRights(chatId, userId, {
			rights: {
				canSendMessages: muted,
			},
		});
		return true;
	} catch {
		return false;
	}
}

async function muteUser(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
	_db: Database,
) {
	const userId = ctx.message.replyToMessage!.from!.id;
	const userToBeMuted = await ctx.getChatMember(userId);
	const chatId = ctx.message.chat.id;

	const success = await setMuteStatus(bot, ctx, userId, chatId, false);

	const userToBeMutedName = userToBeMuted.user.username ??
		`${userToBeMuted.user.firstName} ${userToBeMuted.user.lastName}`;

	if (success) await ctx.reply(`Muted User ${userToBeMutedName}`);
	else {await ctx.reply(
			`Error has occured with muting ${userToBeMutedName}`,
		);}
}

async function unmuteUser(
	bot: Client,
	ctx: WithFilter<Context, "message:text">,
	_db: Database,
) {
	const userId = ctx.message.replyToMessage!.from!.id;
	const userToBeMuted = await ctx.getChatMember(userId);
	const chatId = ctx.message.chat.id;

	const success = await setMuteStatus(bot, ctx, userId, chatId, true);

	const userToBeMutedName = userToBeMuted.user.username ??
		`${userToBeMuted.user.firstName} ${userToBeMuted.user.lastName}`;

	if (success) await ctx.reply(`unmuted User ${userToBeMutedName}`);
	else {await ctx.reply(
			`Error has occured with unmuting ${userToBeMutedName}`,
		);}
}

export const muteUserHandler: CommandHandler = {
	name: "mute",
	callback: muteUser,
	botAdminOnly: false,
};

export const unmuteUserHandler: CommandHandler = {
	name: "unmute",
	callback: unmuteUser,
	botAdminOnly: false,
};
