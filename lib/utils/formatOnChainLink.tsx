const CHAIN_PREFIXES: any = {
  1: 'etherscan.io',
  3: 'ropsten.etherscan.io',
  4: 'rinkeby.etherscan.io',
  5: 'goerli.etherscan.io',
  42: 'kovan.etherscan.io',
  56: 'bscscan.com',
};

export function formatOnChainLink(
  type: 'Account' | 'Transaction',
  data: [number | undefined, string]
) {
  const [chainId] = data;

  if (!chainId) {
    return ``;
  }

  switch (type) {
    case 'Account': {
      const [address] = data;
      return `https://${CHAIN_PREFIXES[chainId]}/address/${address}`;
    }
    case 'Transaction': {
      const [hash] = data;
      return `https://${CHAIN_PREFIXES[chainId]}/tx/${hash}`;
    }
  }
}
