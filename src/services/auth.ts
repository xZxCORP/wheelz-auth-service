import { HTTPException } from "hono/http-exception";
import { database } from "../infrastructure/kysely/database.js";
import { Authorization, NewAuthorization } from "../infrastructure/kysely/types.js";
export class AuthService {

    async index() {
        const result: Authorization[] = await database.selectFrom('user_authentification').selectAll().execute()
        return result
    }

    async show(userId: number): Promise<Authorization | undefined> {
        const result = await database
        .selectFrom('user_authentification')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst();

        return result;
    }

    async create(user_authentification: NewAuthorization): Promise<Authorization> {
        const result = await database
        .insertInto('user_authentification')
        .values({...user_authentification})
        .executeTakeFirst();

        if (!result || !result.insertId) {
            throw new HTTPException(500, {message: 'Insertion failed'});
        }

        const insertId = Number(result.insertId);


        const authorization = await database
        .selectFrom('user_authentification')
        .selectAll()
        .where('id', '=', insertId)
        .executeTakeFirstOrThrow();

        return authorization
    }

}
