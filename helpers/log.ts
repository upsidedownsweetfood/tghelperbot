export enum LogTypes {
	INFO = "INFO",
	ERROR = "ERROR",
	MESSAGE = "MESSAGE",
}

export function log(type: LogTypes, text: string) {
	const date = new Date();
	const month = date.getMonth();
	const day = date.getDate();
	const year = date.getFullYear();
	const hour = date.getHours();
	const minute = date.getMinutes();

	console.log(
		` ${type} | ${year}/${month}/${day} ${hour}:${minute} | ${text}`,
	);
}
