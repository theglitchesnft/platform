import type { AddEthereumChainParameter } from '@web3-react/types';

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
};

interface BasicChainInformation {
  urls: (string | undefined)[];
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export function getAddChainParameters(
  chainId: number
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      // @ts-expect-error
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
}

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
} = {
  1: {
    urls: [
      process.env.NEXT_PUBLIC_INFURA_ID
        ? `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
        : undefined,
      'https://cloudflare-eth.com',
    ].filter((url) => url !== undefined),
    name: 'Ethereum',
  },
  // 56: {
  //   urls: [`https://bsc-dataseed.binance.org`].filter(
  //     (url) => url !== undefined
  //   ),
  //   name: 'Binance Smart Chain',
  // },
  // 250: {
  //   urls: [`https://polygon-rpc.com`].filter((url) => url !== undefined),
  //   name: 'Fantom (Matic)',
  // },

  // '-1': {
  //   urls: [],
  //   name: 'Offline',
  // },
};

export const URLS: { [chainId: number]: (string | undefined)[] } = Object.keys(
  CHAINS
).reduce<{ [chainId: number]: (string | undefined)[] }>(
  (accumulator, chainId) => {
    const validURLs: (string | undefined)[] = CHAINS[Number(chainId)].urls;

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs;
    }

    return accumulator;
  },
  {}
);
