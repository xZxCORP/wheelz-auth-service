import { promises as fs } from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';
import { Kysely, PostgresDialect } from 'kysely';
import { FileMigrationProvider, Migrator } from 'kysely';
import pg from 'pg';

import { config } from '../../config.js';
import type { Database } from './types.js';

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    database: config.DB_NAME,
    host: config.DB_HOST,
    user: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
  }),
});

export const database = new Kysely<Database>({
  dialect,
});

export const ensureDatabaseExists = async () => {
  const client = new pg.Client({
    host: config.DB_HOST,
    user: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: 'postgres',
  });
  await client.connect();
  try {
    const { rowCount } = await client.query(
      'SELECT datname FROM pg_catalog.pg_database WHERE datname = $1',
      [config.DB_NAME]
    );
    if (rowCount === 0) {
      console.log(chalk.yellow(`Database "${config.DB_NAME}" does not exist. Creating...`));
      await client.query('CREATE DATABASE $1', [config.DB_NAME]);
      console.log(chalk.green(`Database "${config.DB_NAME}" created successfully.`));
    } else {
      console.log(chalk.blue(`Database "${config.DB_NAME}" already exists.`));
    }
  } catch (error) {
    console.error(chalk.red('Error checking/creating database:', error));
    throw error;
  } finally {
    await client.end();
  }
};

export const migrateToLatest = async (destroy: boolean = true) => {
  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(import.meta.dirname, './migrations'),
    }),
    allowUnorderedMigrations: true,
  });

  const { error, results } = await migrator.migrateToLatest();

  if (error) {
    console.error(chalk.red('Migration failed:'), error);
    throw error;
  }

  if (results && results.length > 0) {
    for (const it of results) {
      if (it.status === 'Success') {
        console.log(chalk.green(`Migration "${it.migrationName}" executed successfully`));
      } else if (it.status === 'Error') {
        console.error(chalk.red(`Failed to execute migration "${it.migrationName}":`), it.status);
      }
    }
  } else {
    console.log(chalk.blue('No migrations to run'));
  }

  if (destroy) {
    await database.destroy();
  }
};

export const USER_ROLE = 'user';
export const ADMIN_ROLE = 'admin';
