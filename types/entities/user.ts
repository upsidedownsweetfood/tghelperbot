import { Database } from "@db/sqlite";
import { UserRole } from "./UserRole.ts";
import { Role, RolesRepo } from "./Roles.ts";

export type User = {
  UserId: number;
};
