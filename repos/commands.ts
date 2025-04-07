import { Database } from "@db/sqlite";
import { Command } from "../types/entities/command.ts";
import { SqlAddCommandQuery, SqlGetCommandQuery } from "../constants.ts"

export class CommandRepo {
  db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public addCommand(name: string, adminOnly: boolean) {
    const statement = this.db.prepare(SqlAddCommandQuery);
    statement.run(name, adminOnly);
  }

  public getCommandIdFromName(name: string): number | undefined {
    const command: Command | undefined = this.db.prepare(SqlGetCommandQuery).get(name);

    return command?.Id;
  }
}
