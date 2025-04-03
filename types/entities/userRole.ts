import { Database } from "@db/sqlite";
import { RolesRepo } from "./Roles.ts";

export type UserRoleEntity = {
  UserId: number;
  ChatId: number;
  RoleId: number;
};

export class UserRoleRepo {
  database: Database
  rolesRepo: RolesRepo
  
  constructor(db: Database, rolesRepo: RolesRepo) {
    this.database = db;
    this.rolesRepo = rolesRepo;
  }

  public getUserRoles(userId: number, chatId: number) {
    const userRolesStatement = this.database.prepare(
      "SELECT * FROM UserRoles WHERE ChatId=? AND UserId=?",
    );
    const userRoles: Role[] = userRolesStatement
      .all<UserRoleEntity>(chatId, userId)
      .map((ur) => this.rolesRepo.getRole(chatId, ur.RoleId))
      .filter((r) => r != undefined);

    return userRoles;
  }
}
