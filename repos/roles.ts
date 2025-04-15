import { Database } from "@db/sqlite";
import { RoleEntity } from "../types/entities/roles.ts";
import { UserRoleEntity } from "../types/entities/userRole.ts";

export class RolesRepo {
  database: Database;

  constructor(db: Database) {
    this.database = db;
  }

  public getRole(chatId: number, roleId: number): RoleEntity | undefined {
    return this.database.prepare(
      "SELECT * FROM Roles WHERE Chat=? AND Id=?",
    ).get<RoleEntity>(chatId, roleId);
  }

  public addRole(roleName: string, chatId: number) {}

  public getRolesByUser(userId: number, chatId: number): RoleEntity[] {
    const userRolesStatement = this.database.prepare(
      "SELECT * FROM UserRoles WHERE ChatId=? AND UserId=?",
    );
    return userRolesStatement
      .all<UserRoleEntity>(chatId, userId)
      .map((ur) => this.getRole(chatId, ur.RoleId))
      .filter((r) => r != undefined);
  }
}
