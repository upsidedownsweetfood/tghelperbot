import { Database } from "@db/sqlite";
import { Bot, Context } from "grammy";
import { BCtx } from "./bot_ctx.ts";

export type BotCredentials = {
  apiKey: string | undefined;
};

export type CommandHandler = {
  name: string;
  description: string;
  callback: (
    bot: Bot<BCtx>,
    ctx: BCtx,
    db: Database,
  ) => Promise<void>;
  botAdminOnly: boolean;
  botNeedsAdmin: boolean;
};

export type MessageHandler = {
  name: string; // only useful to enable in db
  callback: (
    bot: Bot<BCtx>,
    ctx: BCtx,
    db: Database,
  ) => Promise<void>;
};

export type AdminExists = {
  item: boolean
}
