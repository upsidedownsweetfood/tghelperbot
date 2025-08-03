import { Database } from "@db/sqlite";
import { CommandPermission } from "../types/entities/commandPermissions.ts";

export class CommandPermissionRepo {
  db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public getCommandPermissions(chatId: number, commandId: number): CommandPermission | undefined {
    return this.db.prepare(
      "SELECT * FROM CommandPermissions WHERE ChatId=? AND Command=?",
    ).get(chatId, commandId);
  }

  public getCommandPermissionsRoles(command: CommandPermission): string[] {
    return command.Roles?.split(",") ?? [];
  }
}
