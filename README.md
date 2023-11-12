# Kysely Prefix Plugin

Automatically add prefixes to your table names with
[Kysely](https://kysely.dev/).

This is handy for when you have multiple `Kysely` clients connected to the same
database and you want to avoid table and index name/migration collisions.

## Install

`npm i kysely kysely-plugin-prefix`


## Usage

### Tables

```ts
import { Kysely, SqliteDialect } from "kysely";
import { TablePrefixPlugin } from "kysely-plugin-prefix";
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

### Indexes

```ts
import { Kysely, SqliteDialect } from "kysely";
import { IndexPrefixPlugin } from "kysely-plugin-prefix";

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
  plugins: [new IndexPrefixPlugin({ prefix: "prefix" })],
});

const users = await db.schema
  .createIndex("idx_users_id")
  .on("users")
  .columns(["id"])
  .compile(); // Index will be named "prefix_idx_users_id"
```

## Excludes

You can exclude tables (or indexes) from being prefixed by passing an array of
table/index names to the optional `exclude` option on either plugin.

```ts
import { Kysely, SqliteDialect } from "kysely";
import { TablePrefixPlugin } from "kysely-plugin-prefix";
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
