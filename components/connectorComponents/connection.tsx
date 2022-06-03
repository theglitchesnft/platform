import Glitches from '../../contracts/Glitches.json';
import { CHAINS, getAddChainParameters, URLS } from '../../lib/chains';
import { GLITCHES_V1_CONTRACT } from '../../lib/constants';
import useMetaMaskOnboarding from '../../lib/hooks/useMetaMaskOnboarding';
import { useTokenBalance } from '../../lib/hooks/useTokenBalance';
import { useWalletStore } from '../../lib/stores/wallet';
import { WalletEnum, WalletType } from '../../lib/types';
import { abbreviateNumber } from '../../lib/utils/formatNumbers';
import { shortenHex } from '../../lib/utils/shortenHex';
import GlitchesLogo from '../../public/logos/base.png';
import looksRare from '../../public/marketplaces/looksrare.png';
import openSea from '../../public/marketplaces/opensea.png';
import { CoinbaseWalletSvg } from '../svgs/coinbaseWallet';
import { GnosisSafeSvg } from '../svgs/gnosisSafe';
import { MetamaskSvg } from '../svgs/metamask';
import { WalletConnectSvg } from '../svgs/walletConnect';
import { ChainSelect } from './chainSelect';
import { Dialog, Popover, Transition } from '@headlessui/react';
import { CashIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import type { Web3ReactHooks } from '@web3-react/core';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { WalletConnect } from '@web3-react/walletconnect';
import classNames from 'classnames';
import Image from 'next/image';
import Router from 'next/router';
import { Fragment, useCallback, useState } from 'react';

interface ConnectionProps {
  type: WalletType;
  connector: MetaMask | WalletConnect | CoinbaseWallet | Network | GnosisSafe;
  chainId: ReturnType<Web3ReactHooks['useChainId']>;
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
  error: ReturnType<Web3ReactHooks['useError']>;
  isActive: ReturnType<Web3ReactHooks['useIsActive']>;
  accounts: ReturnType<Web3ReactHooks['useAccounts']>;
  ens: ReturnType<Web3ReactHooks['useENSNames']>;
  provider: ReturnType<Web3ReactHooks['useProvider']>;
  id: string;
  isOnboarding?: boolean;
  closeOnboardingModal: () => void;
}

const solutions = [
  {
    name: 'OpenSea',
    description:
      'A marketplace for NFTs on Ethereum. Create, buy, sell, browse and auction NFTs on the Ethereum blockchain.',
    href: 'https://opensea.io/collection/the-glitches-nft',
    icon: () => (
      <Image alt="Opensea logo" src={openSea} width={40} height={40} />
    ),
  },
  {
    name: 'LooksRare',
    description:
      'LooksRare is a next generation NFT market. Buy NFTs, sell NFTs… or just HODL: Collectors, traders, and creators alike earn passive income! 👀💎',
    href: 'https://looksrare.org/collections/0x33825285eB66c11237Cc68CC182c1e9BF01bA00B',
    icon: () => (
      <Image alt="LooksRare logo" src={looksRare} width={40} height={40} />
    ),
  },
];

export function ConnectionComponent(props: ConnectionProps) {
  const {
    connector,
    chainId,
    isActivating,
    error,
    isActive,
    type,
    isOnboarding,
    accounts,
    ens,
    closeOnboardingModal,
  } = props;
  const isNetwork = connector instanceof Network;
  const displayDefault = !isNetwork;
  const chainIds = (isNetwork ? Object.keys(URLS) : Object.keys(CHAINS)).map(
    (chainId) => Number(chainId)
  );

  const {
    removeDisconnectAction,
    addDisconnectAction,
    addPreviousConnectionAction,
  } = useWalletStore((state) => state);
  const [desiredChainId, setDesiredChainId] = useState<number>(
    isNetwork ? 1 : -1
  );

  let [isAccountOpen, setAccountIsOpen] = useState(false);

  const glitchesBalance = useTokenBalance({
    contractAddress: GLITCHES_V1_CONTRACT,
    abi: Glitches,
  });

  function closeAccountModal() {
    setAccountIsOpen(false);
  }

  function openAccountModal() {
    setAccountIsOpen(true);
  }

  const { isWeb3Available, startOnboarding } = useMetaMaskOnboarding();

  const switchChain = useCallback(
    async (desiredChainId: number) => {
      setDesiredChainId(desiredChainId);
      // if we're already connected to the desired chain, return
      if (desiredChainId === chainId) return;
      // if they want to connect to the default chain and we're already connected, return
      if (desiredChainId === -1 && chainId !== undefined) return;

      if (connector instanceof WalletConnect || connector instanceof Network) {
        await connector.activate(
          desiredChainId === -1 ? undefined : desiredChainId
        );
      } else {
        await connector.activate(
          desiredChainId === -1
            ? undefined
            : getAddChainParameters(desiredChainId)
        );
      }
      addPreviousConnectionAction(type);
      // @ts-expect-error
      Router.reload(window.location.pathname);
    },
    [connector, chainId]
  );

  if (isActive) {
    return (
      <div className="relative flex items-center mt-1">
        <button
          type="button"
          onClick={() => openAccountModal()}
          className="relative inline-flex items-center h-6 px-2 py-2 ml-1 font-bold text-gray-900 bg-white border border-gray-300 rounded-full shadow-sm sm:px-4 whitespace-nowrap -right-2 bg-opacity-40 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-0"
        >
          {ens?.[0] || `${shortenHex(accounts?.[0] ?? ``, 4)}`}
        </button>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open ? 'text-gray-900' : 'text-gray-500',
                  'group bg-white z-10 h-10 rounded-md px-0.5 sm:px-2 inline-flex items-center hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                )}
              >
                <span className="w-4 h-4 sm:w-6 sm:h-6">
                  <Image src={GlitchesLogo} className="w-4 h-4" />
                </span>
                <span className="flex flex-col justify-center pt-4 pl-1 text-lg font-bold text-gray-700">
                  <span className="leading-[0px] text-left">Glitches</span>
                  <span className="block text-[10px] text-left">
                    {parseInt(glitchesBalance) > 0
                      ? abbreviateNumber(glitchesBalance, 2)
                      : `--`}
                  </span>
                </span>
                <ChevronDownIcon
                  className={classNames(
                    open ? 'text-gray-600' : 'text-gray-400',
                    'ml-1 h-5 w-5 group-hover:text-gray-500 transition ease-in-out duration-150'
                  )}
                  aria-hidden="true"
                />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-screen max-w-sm px-2 mt-3 transform sm:max-w-md sm:-translate-x-3/4 -translate-x-2/3 left-1/2 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-6 px-5 py-6 bg-white sm:gap-8 sm:p-8 lg:grid-cols-2">
                      {solutions.map((item) => (
                        <a
                          key={item.name}
                          target="_blank"
                          href={item.href}
                          className="flex items-start p-1 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100"
                        >
                          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white bg-gray-100 rounded-md sm:h-12 sm:w-12">
                            <item.icon aria-hidden="true" />
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="p-5 bg-gray-100 sm:p-8">
                      <span className="flow-root p-3 -m-3 transition duration-150 ease-in-out rounded-md ">
                        <span className="block mt-1 text-sm text-gray-500">
                          Trade your Glitches on these exchanges
                        </span>
                      </span>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Transition.Root show={isAccountOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={closeAccountModal}
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
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                    <div>
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                        <CashIcon
                          className="w-6 h-6 text-blue-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-left text-gray-900"
                        >
                          Wallet Overview
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-left text-gray-500">
                            Coming soon a nice little broader wallet overview.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-black border border-black rounded-md shadow-sm hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                        onClick={async () => {
                          await connector.deactivate();
                          addDisconnectAction(type);
                          closeAccountModal();
                        }}
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <div className="ml-1 sm:ml-2">
          {!(connector instanceof GnosisSafe) && (
            <ChainSelect
              chainId={chainId}
              switchChain={switchChain}
              displayDefault={displayDefault}
              chainIds={chainIds}
            />
          )}
        </div>
      </div>
    );
  } else if (isOnboarding || error) {
    return (
      <div className="relative flex flex-col items-center space-x-3">
        <div
          className={classNames(
            'relative group p-6 w-full hover:bg-slate-700 rounded-lg transition-colors duration-150'
          )}
        >
          <div>
            <span className={classNames('inline-flex')}>
              {renderMessaging(type)?.img}
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-medium">
              <button
                onClick={
                  connector instanceof MetaMask && !isWeb3Available
                    ? () => startOnboarding()
                    : isActivating
                    ? undefined
                    : () => {
                        connector instanceof GnosisSafe
                          ? void connector.activate()
                          : connector instanceof WalletConnect ||
                            connector instanceof Network
                          ? connector.activate(
                              desiredChainId === -1 ? undefined : desiredChainId
                            )
                          : connector.activate(
                              desiredChainId === -1
                                ? undefined
                                : getAddChainParameters(desiredChainId)
                            );
                        addPreviousConnectionAction(type);
                        removeDisconnectAction(type);
                        closeOnboardingModal();
                      }
                }
                // disabled={isActivating}
                className="focus:outline-none"
              >
                {/* Extend touch target to entire panel */}
                <span className="absolute inset-0" aria-hidden="true" />
                {renderMessaging(type)?.title}
                {error && (
                  <span className="flex items-center justify-center text-xs bg-red-600">
                    There was an error connecting - Try Again?
                  </span>
                )}
              </button>
            </h3>
            <p className="mt-2 text-sm text-gray-200">
              {renderMessaging(type)?.action}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function renderMessaging(type: WalletType):
  | {
      title: string;
      action: string;
      img: JSX.Element;
    }
  | undefined {
  switch (type) {
    case WalletEnum.coinbase:
      return {
        title: 'Coinbase Wallet',
        action: 'Connect to Coinbase Wallet (not Coinbase App)',
        img: <CoinbaseWalletSvg size={64} />,
      };
    case WalletEnum.metamask:
      return {
        title: 'Metamask',
        action: 'Connect to your MetaMask Wallet directly',
        img: <MetamaskSvg size={64} />,
      };
    case WalletEnum.walletConnect:
      return {
        title: 'WalletConnect',
        action: 'Scan with WalletConnect to connect',
        img: <WalletConnectSvg size={64} />,
      };
    case WalletEnum.gnosisSafe:
      return {
        title: 'Gnosis Safe',
        action: 'Connect your multi-sig wallet directly',
        img: <GnosisSafeSvg size={64} />,
      };
    default:
      return undefined;
  }
}
