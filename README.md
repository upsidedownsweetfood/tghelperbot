# Unnamed, modular Telegram helper bot

This bot was written to better manage a telegram meme channel, and I have
decided to publish it, as I am extremely against properietary software, even in
these circumnstances.

---

## How to run the project

First off, you need to use Deno as the typescript runtime. You'll also need to
set a few environment variables that are needed for the bot.

- BOT_API_TOKEN
- DB_PATH

After that is done, you should probably run the migrations, the instructions on
how to do that are available further below in the README. Then, you should add
yourself, or another telegram user to the Administrators and Users table in the
database.

## Migrations

I didn't plan for the bot to have automatically generated migrations, if you
make any change to the db structure, you will have to make and run a SQL script yourselg.

### Naming a new SQL script

As you may have noticed from the files in the migrations directory, the
migrations are named with a prefix that has a skip of 10 digits. I made it this
way to have an overall ordinated list of migrations that won't cause issues in
case you decide to add your own migrations.

Example. The latest commit added a migration named
**10_added_amongus_support.sql**, you may name your migration any number between
10(excluded) and (excluded)20.

### Running a migration

The way I'd run the migrations is this one.

```sh
cat migration_name | sqlite3 db_path
```

## QA

- Why did you make the bot this way? I'm a mentally ill faggot

- Why is there no automatic migration tool or ORM to ease with database
  operations? I'm not going to trust random projects that are likely to die in a
  month's time, or use too many NodeJS only libraries. I'm also against using a
  lot of external libraries.

---

This bot does not have a user agreement, or anything, but i'd personally like if
this was not used in General hate and in LGBT hate groups. Thanks.
