import { Database } from "@db/sqlite";

export type User = {
	userId: number;
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

	public addUserWarn(user: User, chatId: number, motivation: string) {
		// TODO
	}

	public getUserWarnCounts(user: User, chatId: number) {
		const statement = this.db.prepare(
			"SELECT * FROM UserWarns WHERE User = ? AND Chat = ?",
		);
		return statement.all(
			user.userId,
			chatId,
		).length;
	}
}
