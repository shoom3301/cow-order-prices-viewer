import type { EnrichedOrder } from "@cowprotocol/cow-sdk";

export interface QuoteData {
    gasAmount: string;
    gasPrice: string;
    sellTokenPrice: string;
    sellAmount: string;
    buyAmount: string;
    solver: string;
    verified: boolean;
    metadata: {
        interactions: {
            callData: string;
            target: string;
            value: string;
        }[];
        jitOrders: any[]; // Could be typed more strictly if known
        preInteractions: any[];
        version: string;
    };
}


export interface FullOrder extends EnrichedOrder {
    quote: QuoteData
}