import { BlockchainType, ChainEnum, WalletType } from '../types';
import create, { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

export type MyWalletState = {
  provider?: any;
  web3Provider?: any;
  address?: string;
  chainId?: BlockchainType;
  isDisconnected: WalletType[];
  previousConnections: WalletType[];
  connecting?: boolean;
  claimableNodes?: GlitchType[];
  resetProvider: () => void;
  updateWeb3Provider: (params: any) => void;
  addMintableGlitch: (params: GlitchType) => void;
  addDisconnectAction: (params: WalletType) => void;
  addPreviousConnectionAction: (params: WalletType) => void;
  removeDisconnectAction: (params: WalletType) => void;
};

export interface GlitchType {
  glitchId: string;
  chainId: ChainEnum;
}

type MyPersist = (
  config: StateCreator<MyWalletState>,
  options: PersistOptions<MyWalletState>
) => StateCreator<MyWalletState>;

const initialState = {
  provider: null,
  web3Provider: null,
  address: undefined,
  chainId: undefined,
  isDisconnected: [],
  connecting: false,
  claimableNodes: [],
  previousConnections: [],
};

export const useWalletStore = create<MyWalletState>(
  (persist as unknown as MyPersist)(
    (set, get) => ({
      provider: null,
      web3Provider: null,
      address: undefined,
      chainId: undefined,
      isDisconnected: [],
      connecting: false,
      claimableNodes: [],
      previousConnections: [],
      updateWeb3Provider: (params) => {
        set((state) => {
          return {
            ...state,
            ...params,
          };
        });
      },
      addMintableGlitch: (n) => {
        set((state) => {
          const currentNodes = state?.claimableNodes ?? [];
          const allNodes = [...currentNodes, n];
          const claimableNodes = new Map(
            allNodes?.map((i) => {
              return [i.glitchId, i];
            })
          );

          return {
            ...state,
            // @ts-expect-error
            claimableNodes: [...claimableNodes.values()],
          };
        });
      },
      removeDisconnectAction: (params) => {
        set((state) => ({
          ...state,
          isDisconnected: [],
        }));
      },
      addDisconnectAction: (params) => {
        set((state) => ({
          ...state,
          isDisconnected: [...state.isDisconnected, params],
        }));
      },
      removePreviousConnectionAction: () => {
        set((state) => ({
          ...state,
          previousConnections: [],
        }));
      },
      addPreviousConnectionAction: (params) => {
        set((state) => ({
          ...state,
          previousConnections: [...state.previousConnections, params],
        }));
      },
      resetProvider: () => {
        set(() => ({
          ...initialState,
        }));
      },
    }),
    { name: 'wallet' }
  )
);
