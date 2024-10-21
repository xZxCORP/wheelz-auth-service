import { type Kysely, sql } from 'kysely';

import type { Database } from '../types.js';

export const up = async (database: Kysely<Database>): Promise<void> => {
  await database.schema
    .createTable('user_authentification')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => col.notNull().unique())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addColumn('salt', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
};

export const down = async (database: Kysely<Database>): Promise<void> => {
  await database.schema.dropTable('user_authentification').execute();
};
