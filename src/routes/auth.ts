import { AuthService } from '../services/auth.js'
import registerSchema from '../schemas/authentification/register.js'
import { userClient } from '../services/user-external-service.js'
import bcrypt from 'bcryptjs';
import loginSchema from '../schemas/authentification/login.js'

import { authenticationContract } from '@zcorp/wheelz-contracts';
import { server } from '../server.js';
import { app } from '../app.js';

const SALT_ROUND = 10
const authService = new AuthService()

export const authRouter = server.router(authenticationContract, {
    async register(input, reply) {
        const parseResult = registerSchema.safeParse(input.body);
        if (!parseResult.success) {
            return reply.status(400).send({ message: 'Wrong body' });
        }

        const body = parseResult.data;

        const user = await userClient.users.createUser({
            body: {
                firstname: body.firstname,
                lastname: body.lastname,
                email: body.email
            }
        })

        const salt = bcrypt.genSaltSync(SALT_ROUND);
        const hash = bcrypt.hashSync(body.password, salt);

        await authService.create({
            user_id: user.body.id,
            salt: salt,
            password: hash
        });

        return {
        status: 201,
        body: {
            data: {
            id: user.body.id,
            email: user.body.email,
            firstname: user.body.firstname,
            lastname: user.body.lastname,
            createdAt: user.body.created_at,
            },
        },
    }},
    async login(input, reply) {
        const parseResult = loginSchema.safeParse(input.body);
        if (!parseResult.success) {
            return reply.status(400).send({ message: 'Wrong Body'});
        }

        const body = parseResult.data;

        const user = await userClient.users.getUsers({
            query:{
                email: body.email
            }
        });
        if(!user) {
            return reply.status(401).send({ message: 'Wrong password or email' });
        };

        const authorization = await authService.show(user.id);
        if (!authorization) {
            return reply.status(400).send({ message: 'No Authorization found'});
        }

        const match = await bcrypt.compare(body.password, authorization.password);
        if(!match) {
            return reply.status(401).send({ message: 'Wrong password or email' });
        }

        const payload = {
            userId: user.id
        }

        const token = app.jwt.sign(payload, {expiresIn: 24})


        return {
            status: 201,
            body: {
                data: {
                    token: token
                }
            }
        }
    }
});
