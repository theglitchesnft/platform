import { URLS } from '../lib/chains';
import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      // @ts-expect-error
      rpc: URLS,
    }),
  Object.keys(URLS).map((chainId) => Number(chainId))
);
