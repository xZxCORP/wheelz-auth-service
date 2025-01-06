import { database, ensureDatabaseExists, migrateToLatest } from "../database.js";

const seedRoles =  async () => {
    console.log('Seeding roles...');

    const roles = ['user', 'admin'];

    for (const roleName of roles) {
      const existingRole = await database
        .selectFrom('role')
        .select('id')
        .where('name', '=', roleName)
        .executeTakeFirst();

      if (!existingRole) {
        await database.insertInto('role').values({ name: roleName }).execute();
        console.log(`Role "${roleName}" has been added.`);
      } else {
        console.log(`Role "${roleName}" already exists.`);
      }
    }

    await database.destroy();
    console.log('Roles seeding completed.');
}

const seedAll = async () => {
  seedRoles();
}

try {
    await ensureDatabaseExists();
    await migrateToLatest(false);
    await seedAll();
    console.log('Seeding completed')
} catch (e) {
    console.log(`Error while seeding ${e}`)
}
