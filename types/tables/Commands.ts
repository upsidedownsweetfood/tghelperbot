import { Database } from "@db/sqlite";
import { SqlAddModuleQuery, SqlGetModuleQuery } from "../../constants.ts";

export type Command = {
  Id: number;
  Name: string;
  Enabled: boolean;
  AdministratorOnly: boolean;
};

export class CommandRepo {
  db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public addModule(name: string, adminOnly: boolean) {
    const statement = this.db.prepare(SqlAddModuleQuery);
    statement.run(name, adminOnly);
  }

  public getCommandIdFromName(name: string): number | undefined {
    const command: Command | undefined = this.db.prepare(SqlGetModuleQuery).get(name);

    return command?.Id;
  }
}
