import { Database } from "@db/sqlite";

export type CommandEntity = {
  Id: number;
  Name: string;
  Enabled: boolean;
  AdministratorOnly: boolean;
};
