import { Database } from "@db/sqlite";

export type ChatEntity = {
  ChatId: number;
  Enabled: boolean;
  Allowed: boolean;
};
