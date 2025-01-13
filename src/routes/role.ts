import { roleContract } from '@zcorp/wheelz-contracts';

import { server } from '../server.js';
import { RoleService } from '../services/role.js';

const roleService = new RoleService();

export const roleRouter = server.router(roleContract.contract, {
  async getRoles(input) {
    const userId: number = Number.parseInt(input.params.id);

    const roles = await roleService.getUserRoles(userId);

    if (!roles) {
      return {
        status: 404,
        body: {
          message: 'No user role with this id',
        },
      };
    }

    return {
      status: 200,
      body: roles,
    };
  },
});
