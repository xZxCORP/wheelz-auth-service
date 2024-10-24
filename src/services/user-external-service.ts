import { initClient } from '@ts-rest/core';
import { userContract } from '@zcorp/wheelz-contracts';

import { config } from '../config.js';

export const userClient = initClient(userContract, {
  baseUrl: config.USER_SERVICE_URL,
  baseHeaders: {
    'x-app-source': 'ts-rest',
  },
});
