import chalk from 'chalk';
import { ensureDatabaseExists, migrateToLatest } from '../database.js';

try {
  await ensureDatabaseExists();
  await migrateToLatest();
  console.log(chalk.green('Migrations completed successfully.'));
} catch (error) {
  console.error(chalk.red('An error occurred during migration:'), error);
  throw error;
}
