import "./index.css";
import type { TokenInfo } from "@cowprotocol/cow-sdk";

interface OrderTokensProps {
    sellToken: TokenInfo
    buyToken: TokenInfo
}

export function OrderTokens({sellToken, buyToken}: OrderTokensProps) {
    return (
        <div className="tokens">
            <div className="token-item">
                <label>Sell token</label>
                <pre>{JSON.stringify({...sellToken, logoUrl: undefined}, null, 4)}</pre>
            </div>
            <div className="token-item">
                <label>Buy token</label>
                <pre>{JSON.stringify({...buyToken, logoUrl: undefined}, null, 4)}</pre>
            </div>
        </div>
    )
}