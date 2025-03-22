import { fileExists } from "./utils.ts";
import { log, LogTypes } from "./log.ts";

export async function downloadFromURL(
  url: URL,
  downloadPath: string,
  fileName: string,
) {
  log(LogTypes.INFO, `Starting download of video with URL: ${url}`);

  const fileNameCommand = new Deno.Command("yt-dlp", {
    args: [
      "-f",
      "bv*[height<=720][ext=mp4][vcodec^=avc1]+ba*[ext=m4a]",
      "--print",
      "filename",
      "-o",
      `${fileName}.%(ext)s`,
      url.toString(),
    ],
  });

  const fileNameCommandOutput = await fileNameCommand.output();
  const ytdlpFileName = new TextDecoder().decode(
    fileNameCommandOutput.stdout,
  );

  const path = `${downloadPath}/${ytdlpFileName}`.trimEnd();
  if (await fileExists(path)) {
    log(LogTypes.INFO, `Cache already exists for URL: ${url}`);
    return path;
  }
  const downloadCommand = new Deno.Command("yt-dlp", {
    args: [
      "-f",
      "bv*[height<=720][ext=mp4][vcodec^=avc1]+ba*[ext=m4a]",
      url.toString(),
      "-o",
      path,
    ],
  });
  downloadCommand.outputSync();
  return path;
}
