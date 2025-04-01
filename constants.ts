/// SQL QUERIES ///
export const SqlAddModuleQuery = "INSERT OR IGNORE INTO Commands (CommandName, Enabled, AdministratorOnly) Values (?, 0, ?)";
export const SqlGetModuleQuery = "SELECT Id FROM Commands WHERE CommandName=?";
export const SqlBotAdminQuery = "SELECT * FROM Administrators WHERE UserId = ?";
export const SqlGetChatQuery = "SELECT * FROM Chats WHERE ChatId = ?";
