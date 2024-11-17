import { Database } from "@db/sqlite";
import { Chat } from "../types/tables/Chats.ts";

export function checkUserPermissions(
	userId: number,
	chatId: number,
	commandName: string,
): boolean {
	// TODO
	return true;
}

export function isChatEnabled(chatId: number, db: Database): boolean {
	const statement = db.prepare(
		"SELECT * FROM Chats WHERE ChatId = ?",
	);
	const chat: Chat | undefined = statement.get(chatId);

	if (chat == undefined) return false;
	return chat.enabled;
}

export function isChatAllowed(chatId: number, db: Database): boolean {
	const statement = db.prepare(
		"SELECT * FROM Chats WHERE ChatId = ?",
	);
	const chat: Chat | undefined = statement.get(chatId);

	if (chat == undefined) return false;
	return chat.allowed;
}
