CREATE TABLE IF NOT EXISTS Chats (
	ChatId int PRIMARY KEY NOT NULL UNIQUE,
	Enabled boolean NOT NULL,
	Allowed boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS Users (
	UserId int PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS Roles (
	RoleName varchar(255) NOT NULL,
	ChatId int NOT NULL,

       	UNIQUE (ChatId, RoleName)
	FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);

CREATE TABLE IF NOT EXISTS UserRoles (
	UserId int NOT NULL,
	RoleName varchar(255) NOT NULL,
	ChatId int NOT NULL,

	FOREIGN KEY (UserId) REFERENCES Users(UserId),
	FOREIGN KEY (RoleName) REFERENCES Roles(RoleName),
	FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);

CREATE TABLE IF NOT EXISTS Administrators (
	UserId int NOT NULL UNIQUE,
	FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE IF NOT EXISTS Commands (
	Id INTEGER PRIMARY KEY,
	CommandName varchar(255) NOT NULL UNIQUE,
	Enabled boolean NOT NULL,
	AdministratorOnly boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS Permissions (
	ChatId int NOT NULL,
	CommandId int NOT NULL,
	Roles text,

       	UNIQUE (ChatId, CommandId),
	FOREIGN KEY (ChatId) REFERENCES Chats(ChatId),
	FOREIGN KEY (CommandId) REFERENCES Commands(Id)
);

CREATE TABLE IF NOT EXISTS Settings (
	ChatId int NOT NULL,
	SettingKey text NOT NULL,
	Settings text NOT NULL,
	
       	UNIQUE (ChatId, SettingKey),
	FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);

CREATE TABLE IF NOT EXISTS InfractionTypes (
       InfractionType text NOT NULL,
       ChatId int NOT NULL,

       UNIQUE (InfractionType, ChatId),
       FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);

CREATE TABLE IF NOT EXISTS InfractionLogs (
	UserId int NOT NULL,
	ChatId int NOT NULL,
		
	Infraction text NOT NULL,
	Log text NOT NULL,
	Date datetime NOT NULL,

	FOREIGN KEY(Infraction) REFERENCES InfractionTypes(InfractionType),
	FOREIGN KEY(UserId) REFERENCES Users(UserId),
       	FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);
