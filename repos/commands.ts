import { Database } from "@db/sqlite";
import { CommandEntity } from "../types/entities/command.ts";
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
    const command = this.db.prepare(SqlGetCommandQuery).get<CommandEntity>(name);
    return command?.Id;
  }
}
