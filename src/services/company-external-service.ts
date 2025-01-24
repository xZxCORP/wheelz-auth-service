import { initClient } from '@ts-rest/core';
import { companyContract } from '@zcorp/wheelz-contracts';

import { config } from '../config.js';

export const companyClient = initClient(companyContract, {
  baseUrl: config.USER_SERVICE_URL,
  baseHeaders: {
    'x-app-source': 'ts-rest',
  },
});
