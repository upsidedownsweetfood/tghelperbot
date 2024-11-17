import { Database } from "@db/sqlite";
import { Chat } from "../types/tables/Chats.ts";
import { Administrator } from "../types/tables/Administrators.ts";

export function checkUserPermissions(
	userId: number,
	chatId: number,
	commandName: string,
	db: Database,
): boolean {
	const statementAdministrators = db.prepare(
		"SELECT * FROM Administrators WHERE User = ?",
	);

	const isAdmin: Administrator | undefined = statementAdministrators.get(
		userId,
	);

	if (isAdmin != undefined) return true;

	return false;
}

export function isChatEnabled(chatId: number, db: Database): boolean {
	const statement = db.prepare(
		"SELECT * FROM Chats WHERE ChatId = ?",
	);
	const chat: Chat | undefined = statement.get(chatId);

	if (chat == undefined) return false;
	return Boolean(chat.Enabled);
}

export function isChatAllowed(chatId: number, db: Database): boolean {
	const statement = db.prepare(
		"SELECT * FROM Chats WHERE ChatId = ?",
	);
	const chat: Chat | undefined = statement.get(chatId);

	if (chat == undefined) return false;
	return Boolean(chat.Allowed);
}
