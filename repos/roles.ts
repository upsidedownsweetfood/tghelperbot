import { Database } from "@db/sqlite";
import { RoleEntity } from "../types/entities/roles.ts";
import { UserRoleEntity } from "../types/entities/userRole.ts";

import {SqlGetRoleQuery, SqlGetUserRolesQuery, SqlAddRoleQuery, SqlGetRolesByChatQuery, SqlAddUserRoleQuery, SqlGetRoleByNameQuery } from "../constants.ts";

export class RolesRepo {
  database: Database;

  constructor(db: Database) {
    this.database = db;
  }
  
  public getRole(chatId: number, roleId: number): RoleEntity | undefined {
    return this.database.prepare(SqlGetRoleQuery).get<RoleEntity>(chatId, roleId);
  }

  public getRoleByName(chatId: number, roleName: string ): RoleEntity | undefined {
    return this.database.prepare(SqlGetRoleByNameQuery).get<RoleEntity>(chatId, roleName);
  }
  public getRolesByChat(chatId: number): RoleEntity[] | undefined {
    return this.database.prepare(SqlGetRolesByChatQuery).all<RoleEntity>(chatId);
  }

  public addRole(roleName: string, chatId: number) {
    const statement = this.database.prepare(SqlAddRoleQuery);
    statement.run(roleName, chatId)
  }

  public addUserRole(chatId: number, roleId: number, userId: number) {
    const statement = this.database.prepare(SqlAddUserRoleQuery);
    statement.run(roleId, chatId, userId);
  }

  public getRolesByUser(userId: number, chatId: number): RoleEntity[] {
    const userRolesStatement = this.database.prepare(SqlGetUserRolesQuery);
    return userRolesStatement
      .all<UserRoleEntity>(chatId, userId)
      .map((ur) => this.getRole(chatId, ur.RoleId))
      .filter((r) => r != undefined);
  }
}
