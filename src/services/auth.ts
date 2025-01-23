import { database } from '../infrastructure/kysely/database.js';
import type { Authorization, NewAuthorization } from '../infrastructure/kysely/types.js';
export class AuthService {
  async index() {
    const result: Authorization[] = await database
      .selectFrom('user_authentification')
      .selectAll()
      .execute();
    return result;
  }

  async show(userId: number): Promise<Authorization | undefined> {
    const result = await database
      .selectFrom('user_authentification')
      .selectAll()
      .where('user_id', '=', userId)
      .executeTakeFirst();

    return result;
  }

  async create(user_authentification: NewAuthorization): Promise<Authorization | null> {
    const result = await database
      .insertInto('user_authentification')
      .values({ ...user_authentification })
      .returning('id')
      .executeTakeFirst();

    if (!result || !result.id) {
      return null;
    }

    const authorization = await database
      .selectFrom('user_authentification')
      .selectAll()
      .where('id', '=', result.id)
      .executeTakeFirstOrThrow();

    return authorization;
  }
}
