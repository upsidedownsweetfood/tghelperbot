// START SQL QUERIES //

// ADMINISTRATORS
export const SqlCheckAtLeastOneAdministrator = "SELECT (COUNT(*) > 0) AS item FROM Administrators";
export const SqlBotAdminQuery = "SELECT * FROM Administrators WHERE UserId = ?";

// Activity Logs //
export const SqlAddActivityLog = "INSERT INTO ActivityLogs (UserId, ChatId, LogDate, LogType) Values (?, ?, DateTime('now'), ?)";

// Commands //
export const SqlAddCommandQuery = "INSERT OR IGNORE INTO Commands (CommandName, Enabled, AdministratorOnly) Values (?, 0, ?)";
export const SqlGetCommandQuery = "SELECT Id FROM Commands WHERE CommandName=?";

// CHATS //
export const SqlGetChatQuery = "SELECT * FROM Chats WHERE ChatId = ?";

// ROLES //
export const SqlAddRoleQuery = "INSERT OR IGNORE INTO Roles (RoleName, ChatId) Values (?, ?)"
export const SqlGetRoleQuery = "SELECT * FROM Roles WHERE ChatId = ? AND Id = ?";
export const SqlGetRoleByNameQuery = "SELECT * FROM Roles WHERE ChatId = ? AND RoleName = ?";
export const SqlGetRolesByChatQuery = "SELECT * FROM Roles WHERE ChatId = ?";
export const SqlGetUserRolesQuery = "SELECT * FROM UserRoles WHERE ChatId=? AND UserId=?";
export const SqlAddUserRoleQuery = "INSERT OR IGNORE INTO UserRoles (RoleId, ChatId, UserId) Values (?, ?, ?)";

// SETTINGS //
export const SqlGetSettingByKeyQuery = "SELECT * FROM Settings WHERE SettingKey = ? AND ChatId = ?";

// END SQL QUERIES //