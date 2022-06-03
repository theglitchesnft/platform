import { URLS } from '../lib/chains';
import { initializeConnector } from '@web3-react/core';
import { Network } from '@web3-react/network';

export const [network, hooks] = initializeConnector<Network>(
  // @ts-expect-error
  (actions) => new Network(actions, URLS),
  Object.keys(URLS).map((chainId) => Number(chainId))
);
