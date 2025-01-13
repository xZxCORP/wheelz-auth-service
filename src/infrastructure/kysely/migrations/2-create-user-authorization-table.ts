import { type Kysely, sql } from 'kysely';

import type { Database } from '../types.js';

export const up = async (database: Kysely<Database>): Promise<void> => {
  await database.schema
    .createTable('role')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(40)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await database.schema
    .createTable('user_role')
    .addColumn('role_id', 'serial', (col) =>
      col.references('role.id').onDelete('cascade').notNull()
    )
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
};

export const down = async (database: Kysely<Database>): Promise<void> => {
  await database.schema.dropTable('role').execute();
  await database.schema.dropTable('user_role').execute();
};
