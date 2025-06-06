import { Database } from "@db/sqlite";
import { AdministratorEntity } from "../types/entities/administrator.ts";
import { SqlBotAdminQuery, SqlGetChatQuery } from "../constants.ts";
import { User } from "../types/entities/user.ts"
import { ChatEntity } from "../types/entities/chat.ts"

import { UsersRepo } from "../repos/users.ts";
import { RolesRepo } from "../repos/roles.ts";
import { CommandRepo } from "../repos/commands.ts";
import { CommandPermissionRepo } from "../repos/commandPermissions.ts";

import { DefaultChatRoles } from "../seeding/defaultChatRoles.ts";

export function checkUserPermissions(
  user: User,
  chatId: number,
  commandName: string,
  db: Database,
): boolean {
  // IDFK if this works
  const rolesRepo = new RolesRepo(db);
  const commandRepo = new CommandRepo(db);
  const commandPermissionRepo = new CommandPermissionRepo(db);

  const isAdmin: AdministratorEntity | undefined = db.prepare(SqlBotAdminQuery)
    .get(user.UserId);
  if (isAdmin != undefined) return true;

  const commandId = commandRepo.getCommandIdFromName(commandName);
  if (commandId == undefined) return false;

  const userRoles = rolesRepo.getRolesByUser(user.UserId, chatId);

  const commandPermission = commandPermissionRepo.getCommandPermissions(
    chatId,
    commandId,
  );
  if (commandPermission == undefined) return true;

  const AllowedRoles = commandPermissionRepo
    .getCommandPermissionsRoles(commandPermission);

  if (AllowedRoles == undefined) return true;
  return userRoles.some((ur) => AllowedRoles.some((mr) => mr == ur.RoleName));
}

// Checks if chat is actually allowed to be enabled
export function isChatAllowed(chatId: number, db: Database): boolean {
  const statement = db.prepare(SqlGetChatQuery);
  const chat: ChatEntity | undefined = statement.get(chatId);

  if (chat == undefined) return false;
  return Boolean(chat.Allowed);
}

export function createDefaultChatRoles(chatId: number, db: Database) {
  const rolesRepo = new RolesRepo(db);
  const chatRoles = rolesRepo.getRolesByChat(chatId);
  if(chatRoles != undefined && chatRoles.length > 0)
    return

  DefaultChatRoles.forEach(r => rolesRepo.addRole(r, chatId));
}

export function createDefaultSettings(chatId: number, db: Database) {
  // TODO
}
