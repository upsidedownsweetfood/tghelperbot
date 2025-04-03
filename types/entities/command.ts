import { Database } from "@db/sqlite";
import { SqlAddModuleQuery, SqlGetModuleQuery } from "../../constants.ts";

export type Command = {
  Id: number;
  Name: string;
  Enabled: boolean;
  AdministratorOnly: boolean;
};
