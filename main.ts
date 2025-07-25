import { BotCommand, Client, StorageLocalStorage } from "@mtkruto/mtkruto"
import { Database } from "@db/sqlite";

import { CommandHandler, MessageHandler } from "./types/misc.ts";

import { log, LogTypes } from "./helpers/log.ts";
import { retrieveBotCredentials, startupChecks } from "./helpers/utils.ts";

import {
  registerTextCommandHandler,
  registerMessageHandler,
  registerStartHandler,
} from "./helpers/telegram.ts";

import { warnUserHandler } from "./commands/warn.ts";
import { muteUserHandler, unmuteUserHandler } from "./commands/mute.ts";
import { lastInteractionHandler } from "./onMessage/last_interaction.ts";
import { purgeInactiveUsersHandler } from "./commands/thepurge.ts";
import { kickUserHandler } from "./commands/kick.ts";

if (import.meta.main) {
  const botCreds = retrieveBotCredentials();
  const dbPath = Deno.env.get("DB_PATH") ?? "./database.db";

  const textMessageHandlers: MessageHandler[] = [
    lastInteractionHandler
  ];
  const commandHandlers: CommandHandler<any>[] = [
    warnUserHandler,
    muteUserHandler,
    unmuteUserHandler,
    purgeInactiveUsersHandler,
    kickUserHandler
  ];
  
  if (botCreds.apiId == null) throw "undefined bot api id";
  if (botCreds.apiHash == null) throw "undefined bot api key";
  if (botCreds.botToken == null) throw "undefined bot token";
  
  const bot = new Client({
    apiId: botCreds.apiId,
    apiHash: botCreds.apiHash,
    storage: new StorageLocalStorage("client")
  });
  log(LogTypes.INFO, `Initialized bot`);
  
  const db = new Database(dbPath);
  log(LogTypes.INFO, `Initialized DB at path ${dbPath}`);
  
  registerStartHandler(bot, db);
  log(LogTypes.INFO, "Registering start command handler");

  const commands: BotCommand[] = commandHandlers.map(h => {
    registerTextCommandHandler(bot, h, db);
    log(LogTypes.INFO, `Registering command handler: ${h.name}`);
    return {command: h.name, description: h.description};
  });

  textMessageHandlers.forEach( h => {
    registerMessageHandler(bot, h, db);
    log(LogTypes.INFO, `Registering message handler: ${h.name}`);
  });
  
  startupChecks(db);

  await bot.start({botToken: botCreds.botToken})
  log(LogTypes.INFO, "Bot started");
}
