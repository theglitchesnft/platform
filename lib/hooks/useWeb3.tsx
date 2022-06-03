import { hooks as coinbaseWalletHooks } from '../../connectors/coinbaseWallet';
import { hooks as gnosisSafeHooks } from '../../connectors/gnosisSafe';
import { hooks as metaMaskHooks } from '../../connectors/metaMask';
import { hooks as walletConnectHooks } from '../../connectors/walletConnect';

const {
  useAccounts: useMetaMaskAccount,
  useProvider: useMetaMaskProvider,
  useChainId: useMetaMaskChainId,
} = metaMaskHooks;

const {
  useProvider: useCoinbaseWalletProvider,
  useAccounts: useCoinbaseWalletAccount,
  useChainId: useCoinbaseWalletChainId,
} = coinbaseWalletHooks;

const {
  useAccounts: useWalletConnectAccount,
  useProvider: useWalletConnectProvider,
  useChainId: useWalletConnectChainId,
} = walletConnectHooks;

const {
  useAccounts: useGnosisSafeAccount,
  useProvider: useGnosisSafeProvider,
  useChainId: useGnosisSafeChainId,
} = gnosisSafeHooks;

export function useWeb3() {
  const metaMaskChainId = useMetaMaskChainId();
  const metaMaskAccounts = useMetaMaskAccount();
  const metaMaskProvider = useMetaMaskProvider();

  const walletConnectChainId = useWalletConnectChainId();
  const walletConnectAccounts = useWalletConnectAccount();
  const walletConnectProvider = useWalletConnectProvider();

  const coinbaseWalletChainId = useCoinbaseWalletChainId();
  const coinbaseWalletAccounts = useCoinbaseWalletAccount();
  const coinbaseWalletProvider = useCoinbaseWalletProvider();

  const gnosisSafeChainId = useGnosisSafeChainId();
  const gnosisSafeAccounts = useGnosisSafeAccount();
  const gnosisSafeProvider = useGnosisSafeProvider();

  const provider = [
    metaMaskProvider,
    walletConnectProvider,
    coinbaseWalletProvider,
    gnosisSafeProvider,
  ].filter(Boolean)[0];

  const chainId = [
    metaMaskChainId,
    walletConnectChainId,
    coinbaseWalletChainId,
    gnosisSafeChainId,
  ].filter(Boolean)[0];

  const address = [
    metaMaskAccounts,
    walletConnectAccounts,
    coinbaseWalletAccounts,
    gnosisSafeAccounts,
  ].filter(Boolean)?.[0]?.[0];

  return {
    provider,
    address,
    chainId,
  };
}
