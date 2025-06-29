import { Bot, Context } from "grammy";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { log, LogTypes } from "../helpers/log.ts";
import { UsersRepo } from "../repos/users.ts";

export async function execute_purge(
  bot: Bot,
  ctx: Context,
  db: Database
) {
    log(LogTypes.INFO, "EXECUTING PURGE")
    const ur = new UsersRepo(db)
}

export const purgeInactiveUsersHandler: CommandHandler = {
    name: "in_purge",
    description: "purge inactive users",
    callback: execute_purge,
    botAdminOnly: false,
    botNeedsAdmin: true
}