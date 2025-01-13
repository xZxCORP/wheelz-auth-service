import { authenticationContract } from '@zcorp/wheelz-contracts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '../config.js';
import { server } from '../server.js';
import { AuthService } from '../services/auth.js';
import { RoleService } from '../services/role.js';
import { userClient } from '../services/user-external-service.js';
interface JwtPayload {
  userId: number;
  roles: string[];
}
const SALT_ROUND = 10;
const authService = new AuthService();
const roleService = new RoleService();

export const authRouter = server.router(authenticationContract.authentication, {
  async register(input) {
    const userResponse = await userClient.users.createUser({
      body: {
        firstname: input.body.firstname,
        lastname: input.body.lastname,
        email: input.body.email,
      },
    });
    if (userResponse.status !== 201) {
      return userResponse;
    }

    const userRole = await roleService.getUserDefaultRole();
    await roleService.setRole(userResponse.body.data.id, userRole.id);

    const salt = bcrypt.genSaltSync(SALT_ROUND);
    const hash = bcrypt.hashSync(input.body.password, salt);

    const createdUser = await authService.create({
      user_id: userResponse.body.data.id,
      salt: salt,
      password: hash,
    });

    if (!createdUser) {
      return {
        status: 500,
        body: {
          message: 'Something went wrong',
        },
      };
    }

    return {
      status: 201,
      body: userResponse.body,
    };
  },
  async login(input) {
    const userResponse = await userClient.users.getUsers({
      query: {
        email: input.body.email,
      },
    });
    if (userResponse.status !== 200) {
      return {
        status: 500,
        body: {
          message: 'Something went wrong',
        },
      };
    }
    const user = userResponse.body.data.length > 0 ? userResponse.body.data[0] : undefined;
    if (!user) {
      return {
        status: 401,
        body: {
          message: 'Wrong password or email',
        },
      };
    }

    const authorization = await authService.show(user.id);
    if (!authorization) {
      return {
        status: 400,
        body: {
          message: 'No Authorization found',
        },
      };
    }

    const match = await bcrypt.compare(input.body.password, authorization.password);
    if (!match) {
      return {
        status: 401,
        body: {
          message: 'Wrong password or email',
        },
      };
    }

    const roles = await roleService.getUserRoles(user.id);
    if (!roles) {
      return {
        status: 401,
        body: {
          message: 'No user_role with this is id',
        },
      };
    }

    const payload: JwtPayload = {
      userId: user.id,
      roles: roles,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: '1d',
    });

    return {
      status: 201,
      body: {
        token,
      },
    };
  },
  async verify(input) {
    try {
      const response = jwt.verify(input.body.token, config.JWT_SECRET) as JwtPayload;
      return {
        status: 200,
        body: {
          userId: response.userId,
          roles: response.roles,
        },
      };
    } catch {
      return {
        status: 401,
        body: {
          message: 'Invalid token',
        },
      };
    }
  },
});
