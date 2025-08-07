import { Database } from "@db/sqlite";
import { SqlAddActivityLog, SqlGetActivityLogByUserAndChat } from "../constants.ts";
import { ActivityLogType } from "../types/ActivitylogTypes.ts";
import { ActivityLogEntity } from "../types/entities/activityLog.ts";

export class ActivityLogRepo {
    db: Database

    constructor (db: Database) {
        this.db = db;
    }

    public AddActivity(chatId: number, userId: number, ac_type: ActivityLogType) {
        const statement = this.db.prepare(SqlAddActivityLog);
        statement.run(userId, chatId, ac_type);
    }

    public GetActivityByUserAndChat(chatId: number, userId: number): ActivityLogEntity[] {
        const statement = this.db.prepare(SqlGetActivityLogByUserAndChat);
        return statement.all<ActivityLogEntity>(userId, chatId);
    }
}