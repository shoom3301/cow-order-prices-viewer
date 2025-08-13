import { useState } from "react";
import { parseOrderIdFromInput } from "../../utils/parseOrderIdFromInput.ts";
import { useLoadOrder } from "../../hooks/useLoadOrder.ts";

export function OrderIdInput() {
    const [orderId, setOrderId] = useState('')

    const parsedOrderId = parseOrderIdFromInput(orderId)

    useLoadOrder(parsedOrderId)

    return (
        <input className="order-id-input" placeholder="Enter order Id" onChange={e => setOrderId(e.target.value)}/>
    )
}