import Glitches from '../../contracts/Glitches.json';
import {
  GLITCHES_V1_CONTRACT,
  RECOMMENDED_MULTI_GAS,
} from '../../lib/constants';
import { useContract } from '../../lib/hooks/useContract';
import { useWeb3 } from '../../lib/hooks/useWeb3';
import { GlitchType, useWalletStore } from '../../lib/stores/wallet';
import { BlockchainType, ChainEnum } from '../../lib/types';
import request from '../../lib/utils/request';
import { generateChainBase, GlitchDetails } from '../glitchDetails';
import { Loading } from '../loading';
import toast from 'react-hot-toast';
import useSWR from 'swr';

export function GlitchesGrid() {
  const { address, chainId } = useWeb3();
  const { claimableNodes } = useWalletStore((state) => state);

  const contract = useContract(GLITCHES_V1_CONTRACT, Glitches);

  async function mintAllV2(glitches?: GlitchType[]) {
    const isReady = false;
    try {
      if (!isReady) {
        return toast.error(`Hang on we're not quite ready for v2 minting`);
      }

      const glitchIds = glitches
        ?.filter((n) => n.chainId === chainId)
        .map((i) => i.glitchId);

      const confirmingToast = toast.success(
        `Confirming Transaction In Wallet`,
        {
          style: {
            background: '#3F88C5',
            color: 'white',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#3F88C5',
          },
        }
      );

      // @ts-expect-error
      const gasLimit = RECOMMENDED_MULTI_GAS * glitchIds?.length;

      const glitchMintTxt = await contract?.mintMultiplev2Glitches(glitchIds, {
        gasLimit,
      });

      toast.remove(confirmingToast);
      const loadingToast = toast.loading(
        <div>
          <div>Your transaction is processing on chain</div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${generateChainBase(chainId)}/tx/${glitchMintTxt.hash}`}
            className="font-bold underline cursor-pointer"
          >
            Transaction Link
          </a>
        </div>
      );

      const tx = await glitchMintTxt.wait();

      toast.remove(loadingToast);
      toast.success(
        <div>
          <div>Your v2 Glitches have been minted to your wallet</div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${generateChainBase(chainId)}/tx/${glitchMintTxt.hash}`}
            className="font-bold underline cursor-pointer"
          >
            Transaction Link
          </a>
        </div>
      );
    } catch (error: any) {
      toast.dismiss();

      if (error?.code === 4001) {
        return toast.error('User denied transaction signature');
      }
      toast.error(error?.message);

      console.error(error);
    }
  }

  const { data, isLoading } = useSWR(
    address
      ? `https://deep-index.moralis.io/api/v2/${address}/nft/${GLITCHES_V1_CONTRACT}?chain=${generateChainName(
          chainId
        )}&format=decimal&limit=99`
      : ``,
    (url: string) =>
      request(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${process.env.NEXT_PUBLIC_MORALIS_API_KEY}`,
        },
      })
  );

  if (!address) {
    return <div className="py-36" />;
  }

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading size={24} fill="#FFF" />;
      </div>
    );
  }

  return (
    <div className="py-10">
      <header>
        {data?.result?.length ? (
          <div className="mt-2 mb-8 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-100 sm:truncate sm:text-3xl">
                Your Glitches
              </h2>
            </div>
            <div className="flex flex-shrink-0 mt-4 md:mt-0 md:ml-4">
              <button
                type="button"
                onClick={() => mintAllV2(claimableNodes)}
                className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-100 border rounded-md bg-gradient-to-r from-green-500 to-green-700 hover:to-green-900 focus:ring-green-500 focus:ring-offset-2"
              >
                Mint All v2
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 mb-8 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-100 sm:truncate sm:text-3xl">
                You don't have any Glitches in this wallet
              </h2>
            </div>
          </div>
        )}
      </header>

      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {data?.result?.map((n: any) => (
          <GlitchDetails key={`glitch-details-${n.token_id}`} {...n} />
        ))}
      </ul>
    </div>
  );
}

function generateChainName(chain?: BlockchainType) {
  switch (chain) {
    case ChainEnum.erc:
      return `eth`;
    default:
      ``;
  }
}
