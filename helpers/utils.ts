import { encodeBase64 } from "@std/encoding/base64";
import { BotCredentials } from "../types/misc.ts";

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
