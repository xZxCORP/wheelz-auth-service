import { database } from "../infrastructure/kysely/database.js";
import type { UserRole } from "../infrastructure/kysely/types.js";

export class RoleService {
    async index() {
        const result = await database
            .selectFrom('role')
            .selectAll()
            .execute();
        return result;
    };

    async show(id: number) {
        const result = await database
        .selectFrom('role')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();

      return result;
    }

    async setRole(userId: number, roleId: number) {
        try {
            const existing = await database
              .selectFrom('user_role')
              .selectAll()
              .where('user_id', '=', userId)
              .where('role_id', '=', roleId)
              .executeTakeFirst();

            if (existing) {
              console.log(`User ${userId} already has role ${roleId}`);
              return { message: `User already has the role`, existing };
            }

            const result = await database
              .insertInto('user_role')
              .values({
                role_id: roleId,
                user_id: userId,
              })
              .execute();

            console.log(`Role ${roleId} assigned to user ${userId}`);
            return result;
          } catch (error) {
            console.error(`Error assigning role ${roleId} to user ${userId}:`, error);
            throw error;
          }
    }

    async getUserRoles(userId: number): Promise<undefined | String[]> {
      try {

        const user_role: UserRole | undefined = await database
          .selectFrom('user_role')
          .selectAll()
          .where('user_role.user_id', '=', userId)
          .executeTakeFirst();

        if (!user_role) {
          return undefined;
        }

        const roles = await database
          .selectFrom('user_role')
          .innerJoin('role', 'user_role.role_id', 'role.id')
          .select(['role.name'])
          .where('user_role.user_id', '=', userId)
          .execute();

        return roles.map(role => role.name);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        throw error;
      }
    }

    async getUserDefaultRole() {
        try {
          const result = await database
            .selectFrom('role')
						.selectAll()
            .where('name', '=', 'user')
            .executeTakeFirst();

          if (!result) {
            throw new Error('Default "user" role not found in database');
          }

          return result;
        } catch (error) {
          console.error('Error fetching default user role:', error);
          throw error;
        }
      }
}
