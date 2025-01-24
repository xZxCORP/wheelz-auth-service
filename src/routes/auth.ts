import {
  authenticationContract,
  type CompanyCreateWithOwnerId,
  type User,
  type UserCreate,
} from '@zcorp/wheelz-contracts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '../config.js';
import { server } from '../server.js';
import { AuthService } from '../services/auth.js';
import { companyClient } from '../services/company-external-service.js';
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
    const createdUser = await registerUser({
      lastname: input.body.lastname,
      firstname: input.body.firstname,
      email: input.body.email,
    });
    if (!createdUser) {
      return {
        status: 500,
        body: {
          message: 'Erreur serveur',
        },
      };
    }

    const response = await createAuth(input.body.password, createdUser.id);
    if (!response) {
      return {
        status: 500,
        body: {
          message: 'Erreur serveur',
        },
      };
    }

    return {
      status: 201,
      body: {
        data: createdUser,
      },
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
    const user = userResponse.body.meta.total ? userResponse.body.items[0] : undefined;
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
  async registerAsCompany(input) {
    const createdUser = await registerUser({
      lastname: input.body.owner.lastname,
      firstname: input.body.owner.firstname,
      email: input.body.owner.email,
    });
    if (!createdUser) {
      return {
        status: 500,
        body: {
          message: 'Erreur serveur',
        },
      };
    }

    const response = await createAuth(input.body.owner.password, createdUser.id);
    if (!response) {
      return {
        status: 500,
        body: {
          message: 'Erreur serveur',
        },
      };
    }

    const companyParameters: CompanyCreateWithOwnerId = {
      ...input.body.company,
      ownerId: createdUser.id,
    };

    const companyResponse = await companyClient.contract.create({ body: companyParameters });
    if (companyResponse.status !== 201) {
      return {
        status: 500,
        body: {
          message: 'Erreur serveur',
        },
      };
    }

    return companyResponse;
  },
});

const registerUser = async (userParameters: UserCreate): Promise<User | null> => {
  const userResponse = await userClient.users.createUser({
    body: {
      firstname: userParameters.firstname,
      lastname: userParameters.lastname,
      email: userParameters.email,
    },
  });
  if (userResponse.status !== 201) {
    return null;
  }

  const userRole = await roleService.getUserDefaultRole();
  await roleService.setRole(userResponse.body.data.id, userRole.id);
  return userResponse.body.data;
};

const createAuth = async (password: string, userId: number): Promise<true | false> => {
  const salt = bcrypt.genSaltSync(SALT_ROUND);
  const hash = bcrypt.hashSync(password, salt);

  const createdAuthUser = await authService.create({
    user_id: userId,
    salt: salt,
    password: hash,
  });

  if (!createdAuthUser) {
    await userClient.users.deleteUser({ params: { id: String(userId) } });

    return false;
  }

  return true;
};
