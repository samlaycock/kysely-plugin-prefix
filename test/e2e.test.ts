import test from "ava";
import Database from "better-sqlite3";
import {
  Kysely,
  type MigrationInfo,
  type MigrationProvider as BaseMigrationProvider,
  Migrator,
  SqliteDialect,
} from "kysely";

import { IndexPrefixPlugin, TablePrefixPlugin } from "../src";

export type Migrations = MigrationInfo[];

export class MigrationProvider implements BaseMigrationProvider {
  readonly #migrations: Migrations;

  constructor(migrations: Migrations) {
    this.#migrations = migrations;
  }

  async getMigrations() {
    return Object.fromEntries(
      this.#migrations.map((migration) => [
        migration.name,
        migration.migration,
      ]),
    );
  }

  get migrations() {
    return this.#migrations;
  }
}

interface TestDatabase {
  test: {
    id: string;
  };
}

test("table prefix", async (t) => {
  const db = new Database(":memory:");
  const prefix = new Kysely<TestDatabase>({
    dialect: new SqliteDialect({ database: db }),
    plugins: [new TablePrefixPlugin({ prefix: "prefix" })],
  });

  const createTable = prefix.schema
    .createTable("test")
    .addColumn("id", "text")
    .compile();

  t.is(createTable.sql, 'create table "prefix_test" ("id" text)');

  const insertInto = prefix.insertInto("test").values({ id: "1" }).compile();

  t.is(insertInto.sql, 'insert into "prefix_test" ("id") values (?)');

  const selectFrom = prefix.selectFrom("test").selectAll().compile();

  t.is(selectFrom.sql, 'select * from "prefix_test"');

  const updateTable = prefix.updateTable("test").set({ id: "2" }).compile();

  t.is(updateTable.sql, 'update "prefix_test" set "id" = ?');

  const deleteFrom = prefix.deleteFrom("test").where("id", "=", "2").compile();

  t.is(deleteFrom.sql, 'delete from "prefix_test" where "id" = ?');

  const dropTable = prefix.schema.dropTable("test").compile();

  t.is(dropTable.sql, 'drop table "prefix_test"');

  const migrationProvider = new MigrationProvider([
    {
      name: "test",
      migration: {
        async up(db) {
          await db.schema.createTable("test").addColumn("id", "text");
        },
        async down(db) {
          await db.schema.dropTable("test");
        },
      },
    },
  ]);
  const migrator = new Migrator({ db: prefix, provider: migrationProvider });

  await migrator.migrateUp();

  const tables = db
    .prepare("SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;")
    .all();

  t.deepEqual(tables, [
    { name: "prefix_kysely_migration" },
    { name: "prefix_kysely_migration_lock" },
  ]);
});

test("table prefix w/ excludes", async (t) => {
  const db = new Database(":memory:");
  const prefix = new Kysely<TestDatabase>({
    dialect: new SqliteDialect({ database: db }),
    plugins: [
      new TablePrefixPlugin({
        prefix: "prefix",
        exclude: ["kysely_migration", "kysely_migration_lock"],
      }),
    ],
  });

  const createTable = prefix.schema
    .createTable("test")
    .addColumn("id", "text")
    .compile();

  t.is(createTable.sql, 'create table "prefix_test" ("id" text)');

  const insertInto = prefix.insertInto("test").values({ id: "1" }).compile();

  t.is(insertInto.sql, 'insert into "prefix_test" ("id") values (?)');

  const selectFrom = prefix.selectFrom("test").selectAll().compile();

  t.is(selectFrom.sql, 'select * from "prefix_test"');

  const updateTable = prefix.updateTable("test").set({ id: "2" }).compile();

  t.is(updateTable.sql, 'update "prefix_test" set "id" = ?');

  const deleteFrom = prefix.deleteFrom("test").where("id", "=", "2").compile();

  t.is(deleteFrom.sql, 'delete from "prefix_test" where "id" = ?');

  const dropTable = prefix.schema.dropTable("test").compile();

  t.is(dropTable.sql, 'drop table "prefix_test"');

  const migrationProvider = new MigrationProvider([
    {
      name: "test",
      migration: {
        async up(db) {
          await db.schema.createTable("test").addColumn("id", "text");
        },
        async down(db) {
          await db.schema.dropTable("test");
        },
      },
    },
  ]);
  const migrator = new Migrator({ db: prefix, provider: migrationProvider });

  await migrator.migrateUp();

  const tables = db
    .prepare("SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;")
    .all();

  t.deepEqual(tables, [
    { name: "kysely_migration" },
    { name: "kysely_migration_lock" },
  ]);
});

test("index prefix", async (t) => {
  const db = new Database(":memory:");
  const prefix = new Kysely<TestDatabase>({
    dialect: new SqliteDialect({ database: db }),
    plugins: [new IndexPrefixPlugin({ prefix: "prefix" })],
  });

  const createIndex = prefix.schema
    .createIndex("idx_test")
    .on("test")
    .columns(["id"])
    .compile();

  t.is(createIndex.sql, 'create index "prefix_idx_test" on "test" ("id")');

  const dropIndex = prefix.schema.dropIndex("idx_test").compile();

  t.is(dropIndex.sql, 'drop index "prefix_idx_test"');
});

test("index prefix w/ excludes", async (t) => {
  const db = new Database(":memory:");
  const prefix = new Kysely<TestDatabase>({
    dialect: new SqliteDialect({ database: db }),
    plugins: [
      new IndexPrefixPlugin({ prefix: "prefix", exclude: ["idx_test"] }),
    ],
  });

  const createIndex = prefix.schema
    .createIndex("idx_test")
    .on("test")
    .columns(["id"])
    .compile();

  t.is(createIndex.sql, 'create index "idx_test" on "test" ("id")');

  const dropIndex = prefix.schema.dropIndex("idx_test").compile();

  t.is(dropIndex.sql, 'drop index "idx_test"');
});
