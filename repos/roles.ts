import { Database } from "@db/sqlite";
import { Role } from "../types/entities/roles.ts";
import { UserRoleEntity } from "../types/entities/userRole.ts";

export class RolesRepo {
  database: Database;

  constructor(db: Database) {
    this.database = db;
  }

  public getRole(chatId: number, roleId: number): Role | undefined {
    return this.database.prepare(
      "SELECT * FROM Roles WHERE Chat=? AND Id=?",
    ).get(chatId, roleId);
  }

  public getUserRoles(userId: number, chatId: number) {
    const userRolesStatement = this.database.prepare(
      "SELECT * FROM UserRoles WHERE ChatId=? AND UserId=?",
    );
    const userRoles: Role[] = userRolesStatement
      .all<UserRoleEntity>(chatId, userId)
      .map((ur) => this.getRole(chatId, ur.RoleId))
      .filter((r) => r != undefined);

    return userRoles;
  }
}
