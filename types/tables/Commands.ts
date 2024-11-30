import { Database } from "@db/sqlite";

export type Command = {
	Id: number;
	Name: string;
	Enabled: boolean;
	AdministratorOnly: boolean;
};

export class CommandRepo {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	public addModule(name: string, adminOnly: boolean) {
		const statement = this.db.prepare(
			"INSERT OR IGNORE INTO Commands (Name, Enabled, AdministratorOnly) Values (?, 0, ?)",
		);

		statement.run(name, adminOnly);
	}

	public getCommandIdFromName(name: string): number | undefined {
		const command: Command | undefined = this.db.prepare(
			"SELECT Id FROM Commands WHERE Name=?",
		).get(name);

		return command?.Id;
	}
}
