import { useOrderContextStore } from "../state/orderContext.ts";
import { useEffect } from "react";
import { orderBookApi } from "../sdk.ts";
import type { FullOrder } from "../types.ts";
import type { CowEnv } from "@cowprotocol/cow-sdk";

export function useLoadOrder(orderId: string | null) {
    const { chainId, setOrder, removeOrder } = useOrderContextStore()

    useEffect(() => {
        if (!orderId) {
            removeOrder()
            return
        }

        function getOrderForEnv(orderId: string, env: CowEnv) {
            return orderBookApi.getOrder(orderId, {chainId, env}).then(order => {
                setOrder(order as FullOrder)
            })
        }

        getOrderForEnv(orderId, 'prod').catch(() => getOrderForEnv(orderId, 'staging'))
    }, [orderId, chainId, setOrder, removeOrder]);
}