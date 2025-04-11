import { Database } from "@db/sqlite"
import { SqlCheckAtLeastOneAdministrator } from "../constants.ts";
import { AdminExists } from "../types/misc.ts";
import { encodeBase64 } from "@std/encoding/base64";
import { BotCredentials } from "../types/misc.ts";
import { log, LogTypes } from "./log.ts";


export function parseCommaSeparatedArray(array: string) {
  return array.split(",");
}

export async function fileExists(path: string) {
  try {
    await Deno.lstat(path);
    return true;
  } catch {
    return false;
  }
}

export function makeUrlPlayNiceWithCachePlz(path: string) {
  return encodeBase64(path).replace(
    "/",
    "-",
  );
}

export function retrieveBotCredentials(): BotCredentials {
  return {
    apiKey: Deno.env.get("BOT_API_TOKEN"),
  };
}

export function startupChecks(db: Database) {
  const administratorExists: boolean = (db.prepare(SqlCheckAtLeastOneAdministrator).get()! as AdminExists).item;
  if (!administratorExists) log(LogTypes.ERROR, "Add an administrator to the database")
}
