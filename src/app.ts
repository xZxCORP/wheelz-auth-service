import { authRouter } from './routes/auth.js'

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { authenticationContract} from '@zcorp/wheelz-contracts';
import Fastify from 'fastify';

import jwt from '@fastify/jwt'

import { openApiDocument } from './open-api.js';
import { server } from './server.js';
import { config } from './config.js';
export const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

app.setErrorHandler((error, _, reply) => {
  reply.status(error.statusCode ?? 500).send({ message: error.message, data: error.cause });
});

app.register(jwt, {
  secret: config.JWT_SECRET
});

server.registerRouter(authenticationContract, authRouter, app, {
  requestValidationErrorHandler(error, _, reply) {
    return reply.status(400).send({ message: 'Validation failed', data: error.body?.issues });
  },
});
app
  .register(fastifySwagger, {
    transformObject: () => openApiDocument,
  })
  .register(fastifySwaggerUI, {
    routePrefix: '/ui',
  });
