import { useState } from "react";
import { parseOrderIdFromInput } from "../../utils/parseOrderIdFromInput.ts";
import { useLoadOrder } from "../../hooks/useLoadOrder.ts";

function getOrderIdFromUrl(): string {
    const search = new URLSearchParams(window.location.search)

    return search.get('orderId') || ''
}

export function OrderIdInput() {
    const initial = getOrderIdFromUrl()
    const [orderId, setOrderId] = useState(initial)

    const parsedOrderId = parseOrderIdFromInput(orderId)

    useLoadOrder(parsedOrderId)

    return (
        <input className="order-id-input"
               placeholder={initial || "Enter order Id"}
               onChange={e => setOrderId(e.target.value)}/>
    )
}