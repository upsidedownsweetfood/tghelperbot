import { Database } from "@db/sqlite";
import { Chat } from "../types/tables/Chats.ts";
import { Administrator } from "../types/tables/Administrators.ts";
import { ModulePermissionRepo } from "../types/tables/ModulePermissions.ts";
import { User, UserRepo } from "../types/tables/Users.ts";
import { RolesRepo } from "../types/tables/Roles.ts";
import { ModuleRepo } from "../types/tables/Modules.ts";

export function checkUserPermissions(
	user: User,
	chatId: number,
	commandName: string,
	db: Database,
): boolean {
	// IDFK if this works
	const userRepo = new UserRepo(db);
	const roleRepo = new RolesRepo(db);
	const moduleRepo = new ModuleRepo(db);
	const modulePermissionRepo = new ModulePermissionRepo(db);

	const botAdminStatement = db.prepare(
		"SELECT * FROM Administrators WHERE User = ?",
	);

	const isAdmin: Administrator | undefined = botAdminStatement.get(
		user.UserId,
	);
	if (isAdmin != undefined) return true; // uncomment this

	const moduleId = moduleRepo.getModuleIdFromName(commandName);
	if (moduleId == undefined) return false;

	const userRoles = userRepo.getUserRoles(user, chatId, roleRepo);

	const modulePermission = modulePermissionRepo.getModulePermissions(
		chatId,
		moduleId,
	);
	if (modulePermission == undefined) return true;

	const AllowedRoles = modulePermissionRepo
		.getModulePermissionsRoles(modulePermission);

	if (AllowedRoles == undefined) return true;
	return userRoles.some((ur) => AllowedRoles.some((mr) => mr == ur.Name));
}

export function isChatEnabled(chatId: number, db: Database): boolean {
	const statement = db.prepare(
		"SELECT * FROM Chats WHERE ChatId = ?",
	);
	const chat: Chat | undefined = statement.get(chatId);

	if (chat == undefined) return false;
	return Boolean(chat.Enabled);
}

export function isChatAllowed(chatId: number, db: Database): boolean {
	const statement = db.prepare(
		"SELECT * FROM Chats WHERE ChatId = ?",
	);
	const chat: Chat | undefined = statement.get(chatId);

	if (chat == undefined) return false;
	return Boolean(chat.Allowed);
}

export function createDefaultChatRoles(chatId: number, db: Database) {}
