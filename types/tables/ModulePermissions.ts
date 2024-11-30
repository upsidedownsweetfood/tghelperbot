import { Database } from "@db/sqlite";

export type ModulePermission = {
	Chat: number;
	Module: number;
	Roles: string | undefined;
};

export class ModulePermissionRepo {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	public getModulePermissions(
		chatId: number,
		moduleId: number,
	): ModulePermission | undefined {
		return this.db.prepare(
			"SELECT * FROM ModulePermissions WHERE Chat=? AND Module=?",
		).get(chatId, moduleId);
	}

	public getModulePermissionsRoles(module: ModulePermission): string[] {
		return module.Roles?.split(",") ?? [];
	}
}
