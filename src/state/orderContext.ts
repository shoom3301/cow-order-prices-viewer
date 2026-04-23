import { create } from 'zustand'
import { SupportedChainId } from "@cowprotocol/cow-sdk";
import type { FullOrder } from "../types.ts";

export interface OrderContextState {
    chainId: SupportedChainId
    order: FullOrder | null
    rpcUrlByChain: Partial<Record<SupportedChainId, string>>
    setChainId(chainId: SupportedChainId): void
    setOrder(order: FullOrder): void
    removeOrder(): void
    setRpcUrl(chainId: SupportedChainId, url: string | undefined): void
}

export const useOrderContextStore = create<OrderContextState>((set) => ({
    order: null,
    chainId: SupportedChainId.MAINNET,
    rpcUrlByChain: {},
    setChainId: (chainId: SupportedChainId) => set(state => ({...state, chainId})),
    setOrder: (order: FullOrder) => set({ order }),
    removeOrder: () => set({ order: null }),
    setRpcUrl: (chainId: SupportedChainId, url: string | undefined) =>
        set(state => {
            const next = { ...state.rpcUrlByChain }
            if (url) {
                next[chainId] = url
            } else {
                delete next[chainId]
            }
            return { rpcUrlByChain: next }
        }),
}))