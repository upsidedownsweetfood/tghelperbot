import { Database } from "@db/sqlite";

export type Chat = {
	ChatId: number;
	Enabled: boolean;
	Allowed: boolean;
};

export class ChatRepo {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	public AddChat(chatId: number) {
		const statement = this.db.prepare(
			"INSERT or IGNORE INTO Chats (ChatId, Enabled, Allowed) VALUES (?, ?, ?)",
		);
		statement.run(chatId, 0, 0);
	}
	public AllowChat(chatId: number) {
		this.AddChat(chatId);
		const statement = this.db.prepare(
			"UPDATE Chats SET Allowed = 1 WHERE ChatId = ?",
		);

		statement.run(chatId);
	}

	public EnableChat(chatId: number) {
		this.AddChat(chatId);
		const statement = this.db.prepare(
			"UPDATE Chats SET Enabled = 1 WHERE ChatId = ?",
		);

		statement.run(chatId);
	}
}
