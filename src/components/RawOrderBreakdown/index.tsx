import "./index.css";
import { stringifyWithBigInt } from "../../utils/stringifyWithBigInt.ts";
import type { FullOrder } from "../../types.ts";

interface RawOrderBreakdownProps {
    order: FullOrder
}

export function RawOrderBreakdown({order}: RawOrderBreakdownProps) {
    return (
        <div>
            <h3>Order breakdown (API data)</h3>
            <pre className="order-breakdown">
            {stringifyWithBigInt(order, 4)}
        </pre>
        </div>
    )
}