import "./index.css";
import type { FullOrder } from "../../types.ts";
import type { TokenInfo } from "@cowprotocol/cow-sdk";
import { getAppDataParams } from "../../logic/getAppDataParams.ts";

interface OrderParamsProps {
    order: FullOrder
    sellToken: TokenInfo
    buyToken: TokenInfo
}

export function OrderParams({order}: OrderParamsProps) {
    const { partnerFeeBps, slippagePercentBps } = getAppDataParams(order)

    return (
        <div className="params">
            <div className="param-item">
                <label>Status: </label><strong>{order.status}</strong>
            </div>
            <div className="param-item">
                <label>Partner fee: </label><strong>{partnerFeeBps / 100}%</strong>
            </div>
            <div className="param-item">
                <label>Slippage: </label><strong>{slippagePercentBps / 100}%</strong>
            </div>
        </div>
    )
}