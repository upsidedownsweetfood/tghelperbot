import { Database } from "@db/sqlite";

export type CommandSettings = {
  Chat: number;
  Command: string;
  Settings: string;
}

export class CommandSettingsRepo {
  db: Database;
  
  constructor(db: Database){
    this.db = db;
  }

  public getCommandSettingsJson() {}
}
