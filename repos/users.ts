import { Database } from "@db/sqlite";
import { User } from "../types/entities/user.ts";
import { UserRoleEntity } from "../types/entities/userRole.ts";
import { Role } from "../types/entities/roles.ts";
import { RolesRepo } from "./roles.ts";

export class UsersRepo {
  database: Database;

  constructor(db: Database) {
    this.database = db;
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

  public getUserRoles(userId: number, chatId: number, rolesRepo: RolesRepo) {
    const userRolesStatement = this.database.prepare(
      "SELECT * FROM UserRoles WHERE ChatId=? AND UserId=?",
    );
    const userRoles: Role[] = userRolesStatement
      .all<UserRoleEntity>(chatId, userId)
      .map((ur) => rolesRepo.getRole(chatId, ur.RoleId))
      .filter((r) => r != undefined);

    return userRoles;
  }
}
