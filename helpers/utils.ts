import { encodeBase64 } from "@std/encoding/base64";

export function parse_array_from_string(array: string) {
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
