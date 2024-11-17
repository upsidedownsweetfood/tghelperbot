CREATE TABLE IF NOT EXISTS Chats (
	ChatId int PRIMARY KEY NOT NULL UNIQUE,
	Enabled boolean NOT NULL,
	Allowed boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS Users (
	UserId int PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS Roles (
	Name varchar(255) NOT NULL,
	Chat int NOT NULL,

	FOREIGN KEY (Chat) REFERENCES Chats(ChatId)
);

CREATE TABLE IF NOT EXISTS UserRoles (
	User int NOT NULL,
	Role int NOT NULL,
	Chat int NOT NULL,

	FOREIGN KEY (User) REFERENCES Users(UserId),
	FOREIGN KEY (Role) REFERENCES Roles(Name),
	FOREIGN KEY (Chat) REFERENCES Chats(ChatId)
);

CREATE TABLE IF NOT EXISTS UserWarns (
	User int NOT NULL,
	Chat int NOT NULL,
	Motivation text,
	Date datetime NOT NULL,
	Valid boolean NOT NULL,
	
	FOREIGN KEY (User) REFERENCES Users(UserId),
	FOREIGN KEY (Chat) REFERENCES Chats(ChatId)
);

CREATE TABLE IF NOT EXISTS Administrators (
	User int NOT NULL UNIQUE,
	FOREIGN KEY (User) REFERENCES Users(UserId)
);

CREATE TABLE IF NOT EXISTS Modules (
	Id INTEGER PRIMARY KEY,
	Name varchar(255) NOT NULL UNIQUE,
	Enabled boolean NOT NULL,
	AdministratorOnly boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS ModulePermissions (
	Chat int NOT NULL,
	Module int NOT NULL,
	Roles text,
	
	FOREIGN KEY (Chat) REFERENCES Chats(ChatId),
	FOREIGN KEY (Module) REFERENCES Modules(ROWID)
)
