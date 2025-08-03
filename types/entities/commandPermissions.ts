import { Database } from "@db/sqlite";

export type CommandPermission = {
  ChatId: number;
  Module: number;
  Roles: string | undefined;
};
