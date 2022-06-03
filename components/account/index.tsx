import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from '../../connectors/coinbaseWallet';
import {
  gnosisSafe,
  hooks as gnosisSafeHooks,
} from '../../connectors/gnosisSafe';
import { hooks as metaMaskHooks, metaMask } from '../../connectors/metaMask';
import {
  hooks as walletConnectHooks,
  walletConnect,
} from '../../connectors/walletConnect';
import { useWalletStore } from '../../lib/stores/wallet';
import { WalletEnum } from '../../lib/types';
import { ConnectionComponent } from '../connectorComponents/connection';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';

const {
  useChainId: useMetaMaskChainId,
  useAccounts: useMetaMaskAccount,
  useProvider: useMetaMaskProvider,
  useError: useMetaMaskError,
  useIsActivating: useIsMetaMaskActivating,
  useIsActive: useIsMetaMaskActive,
  useENSNames: useMetaMaskENSNames,
} = metaMaskHooks;

const {
  useChainId: useCoinbaseWalletChainId,
  useAccounts: useCoinbaseWalletAccount,
  useProvider: useCoinbaseWalletProvider,
  useError: useCoinbaseWalletError,
  useIsActivating: useIsCoinbaseWalletActivating,
  useIsActive: useIsCoinbaseWalletActive,
  useENSNames: useCoinbaseWalletENSNames,
} = coinbaseWalletHooks;

const {
  useChainId: useWalletConnectChainId,
  useAccounts: useWalletConnectAccount,
  useProvider: useWalletConnectProvider,
  useError: useWalletConnectError,
  useIsActivating: useIsWalletConnectActivating,
  useIsActive: useIsWalletConnectActive,
  useENSNames: useWalletConnectENSNames,
} = walletConnectHooks;

const {
  useChainId: useGnosisSafeChainId,
  useAccounts: useGnosisSafeAccount,
  useProvider: useGnosisSafeProvider,
  useError: useGnosisSafeError,
  useIsActivating: useIsGnosisSafeActivating,
  useIsActive: useIsGnosisSafeActive,
  useENSNames: useGnosisSafeENSNames,
} = gnosisSafeHooks;

export function Web3Account(props: { id: 'mobile' | 'desktop' }) {
  const { id } = props;
  const { isDisconnected, previousConnections } = useWalletStore(
    (state) => state
  );

  let [isOnboardingModal, setOnboardingModal] = useState(false);

  function closeOnboardingModal() {
    setOnboardingModal(false);
  }

  function openOnboardingModal() {
    setOnboardingModal(true);
  }

  // MetaMask
  const metaMaskChainId = useMetaMaskChainId();
  const metaMaskError = useMetaMaskError();
  const isMetaMaskActivating = useIsMetaMaskActivating();
  const isMetaMaskActive = useIsMetaMaskActive();
  const metaMaskENS = useMetaMaskENSNames();
  const metaMaskAccounts = useMetaMaskAccount();
  const metaMaskProvider = useMetaMaskProvider();

  useEffect(() => {
    if (
      !isDisconnected?.includes(WalletEnum.metamask) &&
      previousConnections.includes(WalletEnum.metamask)
    ) {
      void metaMask.connectEagerly();
    }
  }, []);

  // Wallet Connect
  const walletConnectChainId = useWalletConnectChainId();
  const walletConnectError = useWalletConnectError();
  const isWalletConnectActivating = useIsWalletConnectActivating();
  const isWalletConnectActive = useIsWalletConnectActive();
  const walletConnectENS = useWalletConnectENSNames();
  const walletConnectAccounts = useWalletConnectAccount();
  const walletConnectProvider = useWalletConnectProvider();

  useEffect(() => {
    if (
      !isDisconnected?.includes(WalletEnum.walletConnect) &&
      previousConnections.includes(WalletEnum.walletConnect)
    ) {
      try {
        void walletConnect.connectEagerly();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }, []);

  // Coinbase Wallet
  const coinbaseWalletChainId = useCoinbaseWalletChainId();
  const coinbaseWalletError = useCoinbaseWalletError();
  const isCoinbaseWalletActivating = useIsCoinbaseWalletActivating();
  const isCoinbaseWalletActive = useIsCoinbaseWalletActive();
  const coinbaseWalletENS = useCoinbaseWalletENSNames();
  const coinbaseWalletAccounts = useCoinbaseWalletAccount();
  const coinbaseWalletProvider = useCoinbaseWalletProvider();

  useEffect(() => {
    if (
      !isDisconnected?.includes(WalletEnum.coinbase) &&
      previousConnections.includes(WalletEnum.coinbase)
    ) {
      try {
        void coinbaseWallet.connectEagerly();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }, []);

  // Gnosis Safe
  const gnosisSafeChainId = useGnosisSafeChainId();
  const gnosisSafeError = useGnosisSafeError();
  const isGnosisSafeActivating = useIsGnosisSafeActivating();
  const isGnosisSafeActive = useIsGnosisSafeActive();
  const gnosisSafeENS = useGnosisSafeENSNames();
  const gnosisSafeAccounts = useGnosisSafeAccount();
  const gnosisSafeProvider = useGnosisSafeProvider();

  useEffect(() => {
    if (
      !isDisconnected?.includes(WalletEnum.gnosisSafe) &&
      previousConnections.includes(WalletEnum.gnosisSafe)
    ) {
      try {
        void gnosisSafe.connectEagerly();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }, []);

  function renderConnections(isOnboarding?: boolean) {
    return (
      <>
        <ConnectionComponent
          id={id}
          type={WalletEnum.metamask}
          connector={metaMask}
          chainId={metaMaskChainId}
          isActivating={isMetaMaskActivating}
          error={metaMaskError}
          isActive={isMetaMaskActive}
          accounts={metaMaskAccounts}
          ens={metaMaskENS}
          provider={metaMaskProvider}
          isOnboarding={isOnboarding}
          closeOnboardingModal={closeOnboardingModal}
        />
        <ConnectionComponent
          id={id}
          type={WalletEnum.walletConnect}
          connector={walletConnect}
          chainId={walletConnectChainId}
          isActivating={isWalletConnectActivating}
          error={walletConnectError}
          isActive={isWalletConnectActive}
          accounts={walletConnectAccounts}
          ens={walletConnectENS}
          provider={walletConnectProvider}
          isOnboarding={isOnboarding}
          closeOnboardingModal={closeOnboardingModal}
        />
        <ConnectionComponent
          id={id}
          type={WalletEnum.coinbase}
          connector={coinbaseWallet}
          chainId={coinbaseWalletChainId}
          isActivating={isCoinbaseWalletActivating}
          error={coinbaseWalletError}
          isActive={isCoinbaseWalletActive}
          accounts={coinbaseWalletAccounts}
          ens={coinbaseWalletENS}
          provider={coinbaseWalletProvider}
          isOnboarding={isOnboarding}
          closeOnboardingModal={closeOnboardingModal}
        />
        <ConnectionComponent
          id={id}
          type={WalletEnum.gnosisSafe}
          connector={gnosisSafe}
          chainId={gnosisSafeChainId}
          isActivating={isGnosisSafeActivating}
          error={gnosisSafeError}
          isActive={isGnosisSafeActive}
          accounts={gnosisSafeAccounts}
          ens={gnosisSafeENS}
          provider={gnosisSafeProvider}
          isOnboarding={isOnboarding}
          closeOnboardingModal={closeOnboardingModal}
        />
      </>
    );
  }

  if (
    isMetaMaskActive ||
    isCoinbaseWalletActive ||
    isGnosisSafeActive ||
    isWalletConnectActive
  ) {
    return renderConnections();
  }

  const isWalletActivating =
    isMetaMaskActivating ||
    isCoinbaseWalletActivating ||
    isGnosisSafeActivating ||
    isWalletConnectActivating;

  return (
    <>
      <button
        className="relative inline-flex items-center justify-center px-3 py-1 overflow-hidden text-sm font-bold tracking-tighter text-white bg-gray-800 rounded-lg group"
        onClick={() => openOnboardingModal()}
      >
        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-500 rounded-full group-hover:h-56 group-hover:w-56" />
        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg bg-gradient-to-b from-transparent via-transparent to-gray-700 opacity-30" />
        <span className="relative whitespace-nowrap">
          {isWalletActivating ? 'Connecting...' : `Connect Wallet`}
        </span>
        <span className="sr-only">Connect Wallet</span>
      </button>

      <Transition appear show={isOnboardingModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeOnboardingModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="grid w-full max-w-2xl grid-cols-1 gap-2 p-2 overflow-hidden transition-all transform bg-gray-800 shadow-xl rounded-2xl text-gray-50 sm:grid-cols-2">
                  {renderConnections(true)}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
