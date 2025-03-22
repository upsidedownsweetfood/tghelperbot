import { Database } from "@db/sqlite";
import { UserRole } from "./UserRole.ts";
import { Role, RolesRepo } from "./Roles.ts";

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

  public getUserRoles(user: User, chatId: number, roleRepo: RolesRepo) {
    const userRolesStatement = this.db.prepare(
      "SELECT * FROM UserRoles WHERE Chat=? AND User=?",
    );
    const userRoles: Role[] = userRolesStatement
      .all<UserRole>(chatId, user.UserId)
      .map((ur) => roleRepo.getRole(chatId, ur.Role))
      .filter((r) => r != undefined);

    return userRoles;
  }

  public getUserWarnCounts(user: User, chatId: number): number {
    const statement = this.db.prepare(
      "SELECT * FROM UserWarns WHERE User=? AND Chat=? AND Valid=1",
    );
    return statement.all(
      user.UserId,
      chatId,
    ).length;
  }

  public InvalidateUserWarns(user: User, chatId: number) {
    const statement = this.db.prepare(
      "UPDATE UserWarns SET Valid=0 WHERE Chat=? AND User=?",
    );

    statement.run(chatId, user.UserId);
  }
}
