import { Database } from "@db/sqlite";
import { Client, Context } from "@mtkruto/mtkruto";

export type BotCredentials = {
  apiId: number | undefined;
  apiHash: string | undefined;
  botToken: string | undefined;
};

export type CommandHandler<T> = {
  name: string;
  description: string;
  callback: (
    bot: Client,
    ctx: Context,
    db: Database,
    commandData: T
  ) => Promise<void>;
  botAdminOnly: boolean;
  botNeedsAdmin: boolean;
};

export type MessageHandler<T> = {
  name: string; // only useful to enable in db
  callback: (
    bot: Client,
    ctx: Context,
    db: Database,
    custom_ctx: T
  ) => Promise<void>;
};

export type AdminExists = {
  item: boolean
}
