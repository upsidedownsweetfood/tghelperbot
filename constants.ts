// START SQL QUERIES //

// Commands //
export const SqlAddCommandQuery = "INSERT OR IGNORE INTO Commands (CommandName, Enabled, AdministratorOnly) Values (?, 0, ?)";
export const SqlGetCommandQuery = "SELECT Id FROM Commands WHERE CommandName=?";

export const SqlBotAdminQuery = "SELECT * FROM Administrators WHERE UserId = ?";

// CHATS //
export const SqlGetChatQuery = "SELECT * FROM Chats WHERE ChatId = ?";

// SETTINGS //
export const SqlGetSettingByKeyQuery = "SELECT * FROM Settings WHERE SettingKey = ? AND ChatId = ?";

// END SQL QUERIES //
