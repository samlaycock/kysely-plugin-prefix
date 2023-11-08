# Kysely Prefix Plugin

Automatically add prefixes to your table names with
[Kysely](https://kysely.dev/).

This is handy for when you have multiple `Kysely` clients connected to the same
database and you want to avoid table name/migration collisions.

## Install

`npm i kysely kysely-prefix-plugin`


## Usage

```ts
import { Kysely, SqliteDialect } from "kysely";
import { TablePrefixPlugin } from "kysely-prefix-plugin";
import Database from "better-sqlite3";

interface ExampleDatabase {
  users: {
    id: number;
    name: string;
  };
}

const db = new Kysely<ExampleDatabase>({
  dialect: new SqliteDialect({
    database: new Database(':memory:'),
  }),
  plugins: [new TablePrefixPlugin({ prefix: "prefix" })],
});

const users = await db.selectFrom("users").selectAll().execute();
```

### Excludes

You can exclude tables from being prefixed by passing an array of table names to
the optional `exclude` option.

```ts
import { Kysely, SqliteDialect } from "kysely";
import { TablePrefixPlugin } from "kysely-prefix-plugin";
import Database from "better-sqlite3";

interface ExampleDatabase {
  users: {
    id: number;
    name: string;
  };
  posts: {
    id: number;
    title: string;
  };
}

const db = new Kysely<ExampleDatabase>({
  dialect: new SqliteDialect({
    database: new Database(':memory:'),
  }),
  plugins: [new TablePrefixPlugin({ prefix: "prefix", exclude: ["posts"] })],
});

const posts = await db.selectFrom("posts").selectAll().execute();
```
