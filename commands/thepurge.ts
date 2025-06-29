import { Bot } from "grammy";
import { CommandHandler } from "../types/misc.ts";
import { Database } from "@db/sqlite";
import { log, LogTypes } from "../helpers/log.ts";
import { UsersRepo } from "../repos/users.ts";
import { type BCtx } from "../types/bot_ctx.ts";

export async function execute_purge(
  bot: Bot<BCtx>,
  ctx: BCtx,
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