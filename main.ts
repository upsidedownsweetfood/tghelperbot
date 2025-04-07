import { Bot } from "grammy";
import { BotCommand } from "grammy_types";
import { Database } from "@db/sqlite";

import { CommandHandler, MessageHandler } from "./types/misc.ts";

import { log, LogTypes } from "./helpers/log.ts";
import { retrieveBotCredentials } from "./helpers/utils.ts";

import {
  registerCommandHandler,
  registerErrorHandler,
  registerMessageHandler,
  registerStartHandler,
} from "./helpers/telegram.ts";

import { warnUserHandler } from "./commands/warn.ts";
import { muteUserHandler, unmuteUserHandler } from "./commands/mute.ts";
import { lastInteractionHandler } from "./onMessage/last_interaction.ts";

const botCreds = retrieveBotCredentials();
const dbPath = Deno.env.get("DB_PATH") ?? "./database.db";

const textMessageHandlers: MessageHandler[] = [
  lastInteractionHandler
];
const commandHandlers: CommandHandler[] = [
  warnUserHandler,
  muteUserHandler,
  unmuteUserHandler,
];

if (import.meta.main) {
  if (botCreds.apiKey == null) throw "undefined bot credentials";

  const bot = new Bot(botCreds.apiKey);

  const db = new Database(dbPath);
  log(LogTypes.INFO, `Initialized DB at path ${dbPath}`);

  log(LogTypes.INFO, "Registering error log handler");
  registerErrorHandler(bot);

  log(LogTypes.INFO, "Registering start command handler");
  registerStartHandler(bot, db);

  let commands: BotCommand[] = commandHandlers.map(h => {
    log(
      LogTypes.INFO,
      `Registering command handler: ${h.name}`,
    );
    registerCommandHandler(bot, h, db);
    return {command: h.name, description: h.description};
  })
  bot.api.setMyCommands(commands);

  for (const handler of textMessageHandlers) {
    log(
      LogTypes.INFO,
      `Registering message handler: ${handler.name}`,
    );
    registerMessageHandler(bot, handler, db);
  }
  
  log(LogTypes.INFO, "Bot started");
  await bot.start();
}
