import { Database } from "@db/sqlite";
import { RolesRepo } from "./Roles.ts";

export type UserRoleEntity = {
  UserId: number;
  ChatId: number;
  RoleId: number;
};
