import { useOrderContextStore } from "../state/orderContext.ts";
import { useEffect } from "react";
import { orderBookApi } from "../sdk.ts";
import type { FullOrder } from "../types.ts";

export function useLoadOrder(orderId: string | null) {
    const { chainId, setOrder, removeOrder } = useOrderContextStore()

    useEffect(() => {
        if (!orderId) {
            removeOrder()
            return
        }

        orderBookApi.getOrder(orderId, {chainId}).then(order => setOrder(order as FullOrder))
    }, [orderId, chainId, setOrder, removeOrder]);
}