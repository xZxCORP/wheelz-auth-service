import { type Kysely, sql } from 'kysely';

import type { Database } from '../types.js';

export const up = async (database: Kysely<Database>): Promise<void> => {
  await database.schema.dropTable('user_role').execute();
  await database.schema
    .createTable('user_role')
    .addColumn('role_id', 'bigint', (col) =>
      col.references('role.id').onDelete('cascade').notNull().unsigned()
    )
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addPrimaryKeyConstraint('user_id_role_id', ['user_id', 'role_id'])
    .addUniqueConstraint('user_id_role_id', ['user_id', 'role_id'])
    .execute();
};

export const down = async (database: Kysely<Database>): Promise<void> => {
  await database.schema.dropTable('user_role').execute();
};
