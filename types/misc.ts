import { Database } from "@db/sqlite";
import { Bot, Context } from "grammy";

export type BotCredentials = {
  apiKey: string | undefined;
};

export type CommandHandler = {
  name: string;
  description: string;
  callback: (
    bot: Bot,
    ctx: Context,
    db: Database,
  ) => Promise<void>;
  botAdminOnly: boolean;
  botNeedsAdmin: boolean;
};

export type MessageHandler = {
  name: string; // only useful to enable in db
  callback: (
    bot: Bot,
    ctx: Context,
    db: Database,
  ) => Promise<void>;
};

export type AdminExists = {
  item: boolean
}
