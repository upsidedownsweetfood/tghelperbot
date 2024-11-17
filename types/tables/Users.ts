import { Database } from "@db/sqlite";

export type User = {
	UserId: number;
};

export class UserRepo {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}
	public getUser(userId: number): User | undefined {
		const statement = this.db.prepare(
			"SELECT * FROM Users WHERE UserId = ?",
		);
		const user: User | undefined = statement.get(userId);
		return user;
	}

	public addUser(userId: number) {
		const statement = this.db.prepare(
			"INSERT OR IGNORE INTO Users (UserId) VALUES (?)",
		);
		statement.run(userId);
	}

	public addUserWarn(
		user: User,
		chatId: number,
		motivation: string | undefined,
	) {
		const statement = this.db.prepare(
			"INSERT INTO UserWarns (User, Chat, Motivation, Date, Valid) VALUES (?, ?, ?, ?, 1)",
		);

		statement.run(user.UserId, chatId, motivation, Date.now());
	}

	public getUserWarnCounts(user: User, chatId: number): number {
		const statement = this.db.prepare(
			"SELECT * FROM UserWarns WHERE User = ? AND Chat = ? AND Valid = 1",
		);
		return statement.all(
			user.UserId,
			chatId,
		).length;
	}
}
