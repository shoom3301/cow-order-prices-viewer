import './index.css'
import { ALL_SUPPORTED_CHAINS } from "@cowprotocol/cow-sdk";
import { useOrderContextStore } from "../../state/orderContext.ts";

export function Header() {
    const {setChainId} = useOrderContextStore()

    return (
        <div className="app-header">
            <div><img className="app-logo" src="https://d392zik6ho62y0.cloudfront.net/images/cowswap-logo.png"/></div>
            <div><h2>CoW Order Amounts Viewer</h2></div>
            <div>
                <select className="network-selector" onChange={e => setChainId(+e.target.value)}>
                    {ALL_SUPPORTED_CHAINS.map(chain => {
                        return <option key={chain.id} value={chain.id}>{chain.label}</option>
                    })}
                </select>
            </div>
        </div>
    )
}