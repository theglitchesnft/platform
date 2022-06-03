import Glitches from '../../contracts/Glitches.json';
import {
  ETHERSCAN_URL,
  GLITCHES_V1_CONTRACT,
  RECOMMENDED_SINGLE_GAS,
} from '../../lib/constants';
import { useContract } from '../../lib/hooks/useContract';
import { useWeb3 } from '../../lib/hooks/useWeb3';
import { useWalletStore } from '../../lib/stores/wallet';
import { BlockchainType, ChainEnum } from '../../lib/types';
import request from '../../lib/utils/request';
import { Loading } from '../loading';
import { InformationCircleIcon, SparklesIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import error from 'next/error';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';

interface GlitchDetailsType {
  name: string;
  token_id: string;
  token_uri: string;
  metadata: string;
}

const attributes: any = {
  eyecolor: { color: 'teal', hex: '#abdcd0' },
  eyes: { color: 'blue', hex: '#9dc4ed' },
  facial: { color: 'cornflower', hex: '#aabbdc' },
  gender: { color: 'avocado', hex: '#c3dcaa' },
  glasses: { color: 'purple', hex: '#bbabdc' },
  hairaccessories: { color: 'mauve', hex: '#dcabab' },
  haircolor: { color: 'green', hex: '#b0e8be' },
  hairstyle: { color: 'teal', hex: '#abdcd0' },
  halloweenmask: { color: 'blue', hex: '#9dc4ed' },
  head: { color: 'cornflower', hex: '#aabbdc' },
  jewelry: { color: 'avocado', hex: '#c3dcaa' },
  mouth: { color: 'purple', hex: '#bbabdc' },
  nose: { color: 'mauve', hex: '#dcabab' },
  skin: { color: 'green', hex: '#b0e8be' },
};

export function GlitchDetails(props: GlitchDetailsType) {
  const { token_uri, token_id, metadata } = props;

  const glitchMeta = JSON.parse(metadata);

  const { data } = useSWR(token_uri ? token_uri : ``, (url: string) =>
    request(url, { method: 'GET' })
  );

  const { chainId } = useWeb3();

  const { addMintableGlitch } = useWalletStore((state) => state);
  const contract = useContract(GLITCHES_V1_CONTRACT, Glitches);

  const mintableGlitches = '0';

  useEffect(() => {
    if (parseInt(mintableGlitches) > 0 && chainId) {
      addMintableGlitch({ chainId, glitchId: token_id });
    }
  }, [mintableGlitches]);

  const nothingMintable = parseInt(mintableGlitches) === 0;

  const isLoading = !error && !data;

  const nodePic = data?.attributes?.[0].value?.toLowerCase();

  async function mintv2(glitchId: string) {
    try {
      if (!glitchId) {
        toast('No glitch found');
        return;
      }
      const { ethereum } = window;

      if (ethereum) {
        toast.success(`Confirming Transaction In Wallet`, {
          style: {
            background: '#3F88C5',
            color: 'white',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#3F88C5',
          },
        });
        const glitchMintTx = await contract?.mint(glitchId, {
          gasLimit: RECOMMENDED_SINGLE_GAS,
        });

        toast.loading(
          <div>
            <div>Your transaction is processing on chain</div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${generateChainBase(chainId)}/tx/${glitchMintTx.hash}`}
              className="font-bold underline cursor-pointer"
            >
              Transaction Link
            </a>
          </div>
        );
        const tx = await glitchMintTx.wait();

        toast.success(
          <div>
            <div>Your new Glitch has been minted</div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${generateChainBase(chainId)}/tx/${glitchMintTx.hash}`}
              className="font-bold underline cursor-pointer"
            >
              Transaction Link
            </a>
          </div>
        );
      } else {
        toast.error('Ethereum is not enabled in your browser!');
      }
    } catch (error) {
      toast.dismiss();

      console.error(error);
    }
  }

  return (
    <li className="flex flex-col col-span-1 text-center bg-white divide-y divide-gray-200 rounded-lg shadow">
      <div className="flex flex-col flex-1 px-8 py-6">
        {isLoading || !nodePic ? (
          <Loading size={64} fill="gray" />
        ) : (
          <img
            className="flex-shrink-0 w-48 h-48 mx-auto"
            src={`https://ipfs.infura.io/ipfs/${glitchMeta?.image?.replace(
              'ipfs://',
              ''
            )}`}
            alt="Glitch Image"
          />
        )}
        <h3 className="mt-2 text-sm font-black text-gray-900">{data?.name}</h3>
        <dl className="flex flex-col justify-between mt-1">
          <dt className="mt-2 font-bold text-gray-700 uppercase">Traits</dt>
          <dd className="my-0.5">
            {isLoading ? (
              <Loading
                containerClass="flex justify-center"
                size={4}
                fill="gray"
              />
            ) : (
              <ul>
                {glitchMeta?.attributes?.map((gm: any, i: number) => {
                  const attr = `${gm?.trait_type
                    .toLowerCase()
                    .replace(/\s/g, '')}`;
                  const activeAttr = attributes[attr];

                  if (attr === 'background') {
                    return null;
                  }

                  return (
                    <li
                      key={`${token_id}-gm-${i}`}
                      className={`m-0.5 text-sm font-bold text-gray-800 border-2 border-glitch-${activeAttr?.color} rounded-full flex overflow-hidden`}
                    >
                      <span
                        className={`flex truncate items-center w-24 pl-2 text-xs text-left bg-glitch-${activeAttr?.color}/30 rounded-r-full whitespace-nowrap`}
                      >
                        {gm?.trait_type}
                      </span>
                      <span className="mx-auto text-gray-700 truncate whitespace-nowrap">
                        {gm?.value}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </dd>
        </dl>
      </div>
      <div>
        <div className="flex -mt-px divide-x divide-gray-200">
          <div className="flex flex-1 w-0">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={generateSellLink(props?.token_id, chainId)}
              className="relative inline-flex items-center justify-center flex-1 w-0 py-4 -mr-px text-sm font-medium text-gray-700 border rounded-bl-lg hover:text-gray-500"
            >
              <InformationCircleIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-3">Sell</span>
            </a>
          </div>
          <div className="flex flex-1 w-0 -ml-px">
            <a
              onClick={async () => {
                if (nothingMintable) {
                  return toast.error(
                    // 'This Glitch has already been minted in v2'
                    `v2 Glitch minting isn't open/available yet`
                  );
                }
                mintv2(props?.token_id);
              }}
              className={classNames(
                nothingMintable
                  ? `from-gray-500 to-gray-700 hover:to-gray-90`
                  : `from-green-500 to-green-700 hover:to-green-90`,
                `"relative inline-flex items-center justify-center flex-1 w-0 py-4 text-sm font-medium text-gray-100 border rounded-br-lg cursor-pointer bg-gradient-to-r 0"`
              )}
            >
              <SparklesIcon
                className="w-5 h-5 text-gray-100"
                aria-hidden="true"
              />
              <span className="ml-3">Mint v2</span>
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}

function generateSellLink(nodeId: string, chain?: BlockchainType) {
  switch (chain) {
    case ChainEnum.erc:
      return `https://opensea.io/assets/${GLITCHES_V1_CONTRACT}/${nodeId}`;
    default:
      ``;
  }
}

export function generateChainBase(chain?: BlockchainType) {
  switch (chain) {
    case ChainEnum.erc:
      return ETHERSCAN_URL;
    default:
      ``;
  }
}
