import { Database } from "@db/sqlite";
import { SqlGetSettingByKeyQuery } from "../../constants.ts";

export type CommandSettingsEntity = {
  ChatId: number;
  SettingKey: string;
  Settings: string;

}

export type CommandSettings<T> = {
  ChatId: number;
  SettingKey: string;
  Settings: T;
}
