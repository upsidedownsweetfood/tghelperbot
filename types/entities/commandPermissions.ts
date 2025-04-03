import { Database } from "@db/sqlite";

export type CommandPermission = {
  Chat: number;
  Module: number;
  Roles: string | undefined;
};

export class CommandPermissionRepo {
  db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public getCommandPermissions(
    chatId: number,
    commandId: number,
  ): CommandPermission | undefined {
    return this.db.prepare(
      "SELECT * FROM CommandPermissions WHERE Chat=? AND Command=?",
    ).get(chatId, commandId);
  }

  public getModulePermissionsRoles(command: CommandPermission): string[] {
    return command.Roles?.split(",") ?? [];
  }
}
