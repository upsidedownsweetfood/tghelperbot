export class RolesRepo {
  db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public getRole(chatId: number, roleId: number): Role | undefined {
    return this.db.prepare(
      "SELECT * FROM Roles WHERE Chat=? AND Id=?",
    ).get(chatId, roleId);
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
