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

if (import.meta.main) {
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
  
  if (botCreds.apiKey == null) throw "undefined bot credentials";

  const bot = new Bot(botCreds.apiKey);
  log(LogTypes.INFO, `Initialized bot`);

  const db = new Database(dbPath);
  log(LogTypes.INFO, `Initialized DB at path ${dbPath}`);
  
  log(LogTypes.INFO, "Registering error log handler");
  registerErrorHandler(bot);

  log(LogTypes.INFO, "Registering start command handler");
  registerStartHandler(bot, db);

  const commands: BotCommand[] = commandHandlers.map(h => {
    log(
      LogTypes.INFO,
      `Registering command handler: ${h.name}`,
    );
    registerCommandHandler(bot, h, db);
    return {command: h.name, description: h.description};
  });
  bot.api.setMyCommands(commands);

  textMessageHandlers.forEach( h => {
    log(
      LogTypes.INFO,
      `Registering message handler: ${h.name}`,
    );
    registerMessageHandler(bot, h, db);
  });
  
  await bot.start();
  log(LogTypes.INFO, "Bot started");
}
