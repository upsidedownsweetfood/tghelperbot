import { Database } from "@db/sqlite";
import { User } from "../types/entities/user.ts";
import { SqlGetUSersByChat } from "../constants.ts";

export class UsersRepo {
  database: Database;

  constructor(db: Database) {
    this.database = db;
  }

  public getUsers(chatId: number): User[] {
    const statement = this.database.prepare(SqlGetUSersByChat)
    return statement.all<User>(chatId);
  }

  public getUser(userId: number): User | undefined {
    const statement = this.database.prepare(
      "SELECT * FROM Users WHERE UserId = ?",
    );
    const user: User | undefined = statement.get(userId);
    return user;
  }

  public addUser(userId: number) {
    const statement = this.database.prepare(
      "INSERT OR IGNORE INTO Users (UserId) VALUES (?)",
    );
    statement.run(userId);
  }
}
