import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { authenticationContract, roleContract } from '@zcorp/wheelz-contracts';
import Fastify from 'fastify';

import { openApiDocument } from './open-api.js';
import { authRouter } from './routes/auth.js';
import { server } from './server.js';
import { roleRouter } from './routes/role.js';
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
app.register(cors, {
  origin: '*',
});

server.registerRouter(authenticationContract.authentication, authRouter, app, {
  requestValidationErrorHandler(error, _, reply) {
    return reply.status(400).send({ message: 'Validation failed', data: error.body?.issues });
  },
});

server.registerRouter(roleContract.contract, roleRouter, app, {
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
