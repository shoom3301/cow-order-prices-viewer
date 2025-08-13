import { create } from 'zustand'
import { SupportedChainId } from "@cowprotocol/cow-sdk";
import type { FullOrder } from "../types.ts";

export interface OrderContextState {
    chainId: SupportedChainId
    order: FullOrder | null
    setChainId(chainId: SupportedChainId): void
    setOrder(order: FullOrder): void
    removeOrder(): void
}

export const useOrderContextStore = create<OrderContextState>((set) => ({
    order: null,
    chainId: SupportedChainId.MAINNET,
    setChainId: (chainId: SupportedChainId) => set(state => ({...state, chainId})),
    setOrder: (order: FullOrder) => set({ order }),
    removeOrder: () => set({ order: null }),
}))