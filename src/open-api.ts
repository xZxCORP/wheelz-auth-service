import { generateOpenApi } from '@ts-rest/open-api';
import { authenticationContract } from '@zcorp/wheelz-contracts';

export const openApiDocument = generateOpenApi(
  authenticationContract,
  {
    info: {
      title: 'Wheelz User Service',
      version: '1.0.0',
    },
  },
  {
    setOperationId: true,
  }
);
