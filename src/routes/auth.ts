import { Hono } from 'hono'
import { AuthService } from '../services/auth.js'
import { sign } from 'hono/jwt'
import { config } from '../config.js'
import { JWTPayload } from 'hono/utils/jwt/types'
import registerSchema from '../schemas/authentification/register.js'
import { UserExternalService } from '../services/user-external-service.js'
import bcrypt from 'bcryptjs';
import loginSchema from '../schemas/authentification/login.js'
import { HTTPException } from 'hono/http-exception'

const SALT_ROUND = 10

const userExternalService = new UserExternalService()
const authService = new AuthService()
export const authRouter = new Hono()

authRouter.post('/register', async (c) => {
    const parseResult = registerSchema.safeParse(await c.req.json());
    if (!parseResult.success) {
      throw new HTTPException(400, {message: 'Wrong body'})
    }

    const body = parseResult.data;

    const user = await userExternalService.create({
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email
    });

    const salt = bcrypt.genSaltSync(SALT_ROUND);
    const hash = bcrypt.hashSync(body.password, salt);

    await authService.create({
        user_id: user.data.id,
        salt: salt,
        password: hash
    });

    return c.json({ data: user.data });
});

authRouter.post('/login', async(c) => {
    const parseResult = loginSchema.safeParse(await c.req.json());
    if (!parseResult.success) {
      throw new HTTPException(400, {message: 'Wrong body'})
    }

    const body = parseResult.data;
    const secret = config.JWT_SECRET;

    const userId: number = await userExternalService.getByEmail(body.email);
    if(!userId) {
        throw new HTTPException(401, {message: 'Wrong password or email'});
    }

    const authorization = await authService.show(userId);
    if (!authorization) {
        throw new HTTPException(400, {message: 'No Authorization found'});
    }

    const match = await bcrypt.compare(body.password, authorization.password);
    if(!match) {
        throw new HTTPException(401, {message: 'Wrong password or email'});
    }

    const payload: JWTPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600 * 24, // Expired in 24H
        userId: userId
    }

    const token = await sign(payload, secret);

    return c.json({data: token});
})
