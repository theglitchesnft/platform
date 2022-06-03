import { URLS } from '../lib/chains';
import { initializeConnector } from '@web3-react/core';
import { Url } from '@web3-react/url';

export const [url, hooks] = initializeConnector<Url>(
  // @ts-expect-error
  (actions) => new Url(actions, URLS[1][0]),
  [1]
);
