export class UserRepo {
  db: Database;

  constructor(db: Database) {
    this.db = db;
  }
  public getUser(userId: number): User | undefined {
    const statement = this.db.prepare(
      "SELECT * FROM Users WHERE UserId = ?",
    );
    const user: User | undefined = statement.get(userId);
    return user;
  }

  public addUser(userId: number) {
    const statement = this.db.prepare(
      "INSERT OR IGNORE INTO Users (UserId) VALUES (?)",
    );
    statement.run(userId);
  }
}
