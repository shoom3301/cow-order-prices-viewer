import './index.css'
import { ALL_SUPPORTED_CHAINS, type SupportedChainId } from "@cowprotocol/cow-sdk";
import { useOrderContextStore } from "../../state/orderContext.ts";
import { useEffect, useState } from "react";
import { CHAINLIST_RPC_URLS } from "../../constants/rpcUrls.ts";

const CUSTOM_VALUE = '__custom__'

function getChainIdFromUrl(): number | null {
    const search = new URLSearchParams(window.location.search)
    const chainId = search.get('chainId')
    return chainId && !isNaN(+chainId) ? +chainId : null
}

function RpcSelector({ chainId }: { chainId: SupportedChainId }) {
    const { rpcUrlByChain, setRpcUrl } = useOrderContextStore()
    const [customInput, setCustomInput] = useState('')
    const [showCustom, setShowCustom] = useState(false)

    const currentRpcUrl = rpcUrlByChain[chainId]
    const chainlistUrls = CHAINLIST_RPC_URLS[chainId] ?? []

    useEffect(() => {
        if (currentRpcUrl && !chainlistUrls.includes(currentRpcUrl)) {
            setShowCustom(true)
            setCustomInput(currentRpcUrl)
        } else {
            setShowCustom(false)
            setCustomInput('')
        }
    }, [chainId])

    const selectValue = !currentRpcUrl
        ? ''
        : chainlistUrls.includes(currentRpcUrl)
            ? currentRpcUrl
            : CUSTOM_VALUE

    function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value
        if (val === CUSTOM_VALUE) {
            setShowCustom(true)
        } else if (val === '') {
            setShowCustom(false)
            setRpcUrl(chainId, undefined)
        } else {
            setShowCustom(false)
            setRpcUrl(chainId, val)
        }
    }

    function applyCustomUrl() {
        const trimmed = customInput.trim()
        setRpcUrl(chainId, trimmed || undefined)
    }

    return (
        <div className="rpc-selector-wrapper">
            <select className="network-selector" value={selectValue} onChange={handleSelectChange}>
                <option value="">SDK Default</option>
                {chainlistUrls.map(url => (
                    <option key={url} value={url}>{url}</option>
                ))}
                <option value={CUSTOM_VALUE}>Custom…</option>
            </select>
            {showCustom && (
                <div className="rpc-custom-input">
                    <input
                        type="text"
                        className="rpc-url-input"
                        value={customInput}
                        onChange={e => setCustomInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyCustomUrl()}
                        placeholder="https://..."
                    />
                    <button className="rpc-apply-btn" onClick={applyCustomUrl}>Apply</button>
                </div>
            )}
        </div>
    )
}

export function Header() {
    const defaultChainId = getChainIdFromUrl() ?? ALL_SUPPORTED_CHAINS[0].id
    const { chainId, setChainId } = useOrderContextStore()

    useEffect(() => {
        setChainId(defaultChainId)
    }, []);

    return (
        <div className="app-header">
            <div><img className="app-logo" src="https://d392zik6ho62y0.cloudfront.net/images/cowswap-logo.png"/></div>
            <div><h2>CoW Order Amounts Viewer</h2></div>
            <div className="header-right">
                <select className="network-selector" value={chainId} onChange={e => setChainId(+e.target.value)}>
                    {ALL_SUPPORTED_CHAINS.map(chain => (
                        <option key={chain.id} value={chain.id}>{chain.label}</option>
                    ))}
                </select>
                <div className="rpc-row">
                    <span className="rpc-label">RPC:</span>
                    <RpcSelector chainId={chainId} />
                </div>
            </div>
        </div>
    )
}
