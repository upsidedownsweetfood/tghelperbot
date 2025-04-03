import { Database } from "@db/sqlite";

export type CommandPermission = {
  Chat: number;
  Module: number;
  Roles: string | undefined;
};
