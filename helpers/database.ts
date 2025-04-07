import { Database } from "@db/sqlite";
import { AdministratorEntity } from "../types/entities/administrator.ts";
import { SqlBotAdminQuery, SqlGetChatQuery } from "../constants.ts";
import { User } from "../types/entities/user.ts"

import { UsersRepo } from "../repos/users.ts";
import { CommandRepo } from "../repos/commands.ts";
import { CommandPermissionRepo } from "../repos/commandPermissions.ts";

export function checkUserPermissions(
  user: User,
  chatId: number,
  commandName: string,
  db: Database,
): boolean {
  // IDFK if this works
  const userRepo = new UsersRepo(db);
  const commandRepo = new CommandRepo(db);
  const commandPermissionRepo = new CommandPermissionRepo(db);

  const isAdmin: AdministratorEntity | undefined = db.prepare(SqlBotAdminQuery)
    .get(user.UserId);
  if (isAdmin != undefined) return true;

  const commandId = commandRepo.getCommandIdFromName(commandName);
  if (commandId == undefined) return false;

  const userRoles = userRepo.getUserRoles(user.UserId, chatId);

  const commandPermission = commandPermissionRepo.getCommandPermissions(
    chatId,
    commandId,
  );
  if (commandPermission == undefined) return true;

  const AllowedRoles = commandPermissionRepo
    .getModulePermissionsRoles(commandPermission);

  if (AllowedRoles == undefined) return true;
  return userRoles.some((ur) => AllowedRoles.some((mr) => mr == ur.Name));
}

export function isChatEnabled(chatId: number, db: Database): boolean {
  const statement = db.prepare(SqlGetChatQuery);
  const chat: Chat | undefined = statement.get(chatId);

  if (chat == undefined) return false;
  return Boolean(chat.Enabled);
}

export function isChatAllowed(chatId: number, db: Database): boolean {
  const statement = db.prepare(SqlGetChatQuery);
  const chat: Chat | undefined = statement.get(chatId);

  if (chat == undefined) return false;
  return Boolean(chat.Allowed);
}

export function createDefaultChatRoles(chatId: number, db: Database) {
  // TODO
}
