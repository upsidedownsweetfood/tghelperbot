import { Bot, MemorySessionStorage } from "grammy";
import { BotCommand, ChatMember } from "grammy_types";
import {chatMembers} from "grammy_chat_members"
import { Database } from "@db/sqlite";

import { CommandHandler, MessageHandler } from "./types/misc.ts";

import { log, LogTypes } from "./helpers/log.ts";
import { retrieveBotCredentials, startupChecks } from "./helpers/utils.ts";

import {
  registerCommandHandler,
  registerErrorHandler,
  registerMessageHandler,
  registerStartHandler,
} from "./helpers/telegram.ts";

import { warnUserHandler } from "./commands/warn.ts";
import { muteUserHandler, unmuteUserHandler } from "./commands/mute.ts";
import { lastInteractionHandler } from "./onMessage/last_interaction.ts";
import { type BCtx } from "./types/bot_ctx.ts";

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
  
  const bot = new Bot<BCtx>(botCreds.apiKey);
  
  const adapter = new MemorySessionStorage<ChatMember>();
  bot.use(chatMembers(adapter));

  log(LogTypes.INFO, `Initialized bot`);

  const db = new Database(dbPath);
  log(LogTypes.INFO, `Initialized DB at path ${dbPath}`);
  
  log(LogTypes.INFO, "Registering error log handler");
  registerErrorHandler(bot);

  log(LogTypes.INFO, "Registering start command handler");
  registerStartHandler(bot, db);

  const commands: BotCommand[] = commandHandlers.map(h => {
    log(LogTypes.INFO, `Registering command handler: ${h.name}`);
    registerCommandHandler(bot, h, db);
    return {command: h.name, description: h.description};
  });
  bot.api.setMyCommands(commands);

  textMessageHandlers.forEach( h => {
    log(LogTypes.INFO, `Registering message handler: ${h.name}`);
    registerMessageHandler(bot, h, db);
  });
  
  startupChecks(db);

  await bot.start({
      allowed_updates: ["chat_member", "message"]
  });
  log(LogTypes.INFO, "Bot started");
}
