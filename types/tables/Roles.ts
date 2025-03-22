import { Database } from "@db/sqlite";

export type Role = {
  Id: number;
  Name: string;
  Chat: number;
};

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
}
