import { useWeb3 } from './useWeb3';
import { AddressZero } from '@ethersproject/constants';
import { Provider } from '@ethersproject/providers';
import { Contract, ContractInterface, Signer } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { useMemo } from 'react';

export function getContract<T = Contract>(
  address: string,
  abi: ContractInterface,
  provider: Signer | Provider
) {
  return new Contract(address, abi, provider);
}

export function useContract<Contract = any>(
  address: string,
  abi: ContractInterface
) {
  const { provider, chainId } = useWeb3();

  const signerOrProvider = useMemo(() => {
    if (provider?.['getSigner']) {
      return provider.getSigner();
    } else {
      return provider;
    }
  }, [provider]);

  if (!isAddress(address) || address === AddressZero) {
    console.log('address: ', address);
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  const contract = useMemo(
    // @ts-expect-error
    () => getContract<Contract>(address, abi, signerOrProvider),
    [address, abi, signerOrProvider, chainId]
  );

  return contract;
}
