import { Database } from "@db/sqlite";

export type Module = {
	Id: number;
	Name: string;
	Enabled: boolean;
	AdministratorOnly: boolean;
};

export class ModuleRepo {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	public addModule(name: string, adminOnly: boolean) {
		const statement = this.db.prepare(
			"INSERT OR IGNORE INTO Modules (Name, Enabled, AdministratorOnly) Values (?, 0, ?)",
		);

		statement.run(name, adminOnly);
	}

	public getModuleIdFromName(name: string): number | undefined {
		const module: Module | undefined = this.db.prepare(
			"SELECT Id FROM Modules WHERE Name=?",
		).get(name);

		return module.Id;
	}
}
