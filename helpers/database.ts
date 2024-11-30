import { Database } from "@db/sqlite";
import { Chat } from "../types/tables/Chats.ts";
import { Administrator } from "../types/tables/Administrators.ts";
import { CommandPermissionRepo } from "../types/tables/CommandPermissions.ts";
import { User, UserRepo } from "../types/tables/Users.ts";
import { RolesRepo } from "../types/tables/Roles.ts";
import { CommandRepo } from "../types/tables/Commands.ts";
import { SqlBotAdminQuery, SqlGetChatQuery } from "../constants.ts";

export function checkUserPermissions(
	user: User,
	chatId: number,
	commandName: string,
	db: Database,
): boolean {
	// IDFK if this works
	const userRepo = new UserRepo(db);
	const roleRepo = new RolesRepo(db);
	const commandRepo = new CommandRepo(db);
	const commandPermissionRepo = new CommandPermissionRepo(db);

	const isAdmin: Administrator | undefined = db.prepare(SqlBotAdminQuery)
		.get(user.UserId);
	if (isAdmin != undefined) return true;

	const commandId = commandRepo.getCommandIdFromName(commandName);
	if (commandId == undefined) return false;

	const userRoles = userRepo.getUserRoles(user, chatId, roleRepo);

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
