import { Database } from "@db/sqlite";
import { CommandSettingsEntity, CommandSettings } from "../types/entities/settings.ts";

import { SqlGetSettingByKeyQuery } from "../constants.ts";

export class SettingsRepo {
  db: Database;
  
  constructor(db: Database){
    this.db = db;
  }

  public getSettingsJson<T>(setting_key: string, chatId: number): CommandSettings<T> | null {
    const db_settings: CommandSettingsEntity | undefined = this.db.prepare(SqlGetSettingByKeyQuery).get(setting_key, chatId);
    if (db_settings == null) return null

    return {
      ChatId: chatId,
      SettingKey: setting_key,
      Settings: db_settings.Settings as T
    };
  }

  public addSettingJson<T>(setting_key: string, chatId: number, commandSettings: T) {

  }
}
