import { Database } from "@db/sqlite";
import { Client, Context } from "@mtkruto/mtkruto";

export type BotCredentials = {
  apiId: number | undefined;
  apiHash: string | undefined;
  botToken: string | undefined;
};

export type CommandHandler = {
  name: string;
  description: string;
  callback: (
    bot: Client,
    ctx: Context,
    db: Database,
  ) => Promise<void>;
  botAdminOnly: boolean;
  botNeedsAdmin: boolean;
};

export type MessageHandler = {
  name: string; // only useful to enable in db
  callback: (
    bot: Client,
    ctx: Context,
    db: Database,
  ) => Promise<void>;
};

export type AdminExists = {
  item: boolean
}
