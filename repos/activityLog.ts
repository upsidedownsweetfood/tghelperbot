import { Database } from "@db/sqlite";
import { SqlAddActivityLog } from "../constants.ts";
import { ActivityLogType } from "../types/ActivitylogTypes.ts";

export class ActivityLogRepo {
    db: Database

    constructor (db: Database) {
        this.db = db;
    }

    public AddActivity(chatId: number, userId: number, ac_type: ActivityLogType) {
        const statement = this.db.prepare(SqlAddActivityLog);
        statement.run(userId, chatId, ac_type);
    }
}