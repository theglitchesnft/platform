import { URLS } from '../lib/chains';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector } from '@web3-react/core';

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet(actions, {
      // @ts-expect-error
      url: URLS[1][0],
      appName: 'the-glitches',
    })
);
