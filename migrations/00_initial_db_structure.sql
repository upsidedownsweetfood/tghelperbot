CREATE TABLE IF NOT EXISTS Chats (
	ChatId int NOT NULL UNIQUE,
	Enabled BOOLEAN NOT NULL,
	
	PRIMARY KEY (ChatId)
);

CREATE TABLE IF NOT EXISTS Users (
	UserId int NOT NULL,
	
	PRIMARY KEY (UserId)
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
	
	FOREIGN KEY (User) REFERENCES Users(UserId),
	FOREIGN KEY (Chat) REFERENCES Chats(ChatId)
)
