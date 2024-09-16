import { Hono } from 'hono'
import { AuthService } from '../services/auth.js'
import { sign } from 'hono/jwt'
import { config } from '../config.js'
import { JWTPayload } from 'hono/utils/jwt/types'
import { RegisterSchema } from '../schemas/authentification/register.js'
import { UserExternalService } from '../services/user-external-service.js'


const userExternalService = new UserExternalService()
const authService = new AuthService()
export const authRouter = new Hono()


authRouter.post('/register', async (c) => {
    const body: RegisterSchema = await c.req.json();
    const secret = config.JWT_SECRET;

    const user = await userExternalService.create({
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email
        }
    )

    console.log(user);

    const payload: JWTPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600 * 24, // Expired in 24H
    }

    const token = await sign(payload, secret);

    return c.json({message: token})
})
