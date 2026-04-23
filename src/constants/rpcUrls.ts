import { SupportedChainId } from "@cowprotocol/cow-sdk";

export const CHAINLIST_RPC_URLS: Partial<Record<SupportedChainId, string[]>> = {
    [SupportedChainId.MAINNET]: [
        'https://api.mycryptoapi.com/eth',
        'https://cloudflare-eth.com',
        'https://ethereum-rpc.publicnode.com',
        'https://mainnet.gateway.tenderly.co',
        'https://rpc.blocknative.com/boost',
    ],
    [SupportedChainId.BNB]: [
        'https://bsc-dataseed1.bnbchain.org',
        'https://bsc-dataseed2.bnbchain.org',
        'https://bsc-dataseed3.bnbchain.org',
        'https://bsc-dataseed4.bnbchain.org',
        'https://bsc-dataseed1.defibit.io',
    ],
    [SupportedChainId.GNOSIS_CHAIN]: [
        'https://rpc.gnosischain.com',
        'https://rpc.gnosis.gateway.fm',
        'https://rpc.ankr.com/gnosis',
        'https://gnosischain-rpc.gateway.pokt.network',
        'https://gnosis-mainnet.public.blastapi.io',
    ],
    [SupportedChainId.POLYGON]: [
        'https://polygon.drpc.org',
        'https://rpc-mainnet.matic.quiknode.pro',
        'https://polygon-bor-rpc.publicnode.com',
        'https://polygon.gateway.tenderly.co',
    ],
    [SupportedChainId.BASE]: [
        'https://mainnet.base.org',
        'https://developer-access-mainnet.base.org',
        'https://base.gateway.tenderly.co',
        'https://base-rpc.publicnode.com',
    ],
    [SupportedChainId.PLASMA]: [
        'https://rpc.plasma.to',
    ],
    [SupportedChainId.ARBITRUM_ONE]: [
        'https://arb1.arbitrum.io/rpc',
        'https://arbitrum-one-rpc.publicnode.com',
    ],
    [SupportedChainId.AVALANCHE]: [
        'https://api.avax.network/ext/bc/C/rpc',
        'https://avalanche-c-chain-rpc.publicnode.com',
    ],
    [SupportedChainId.INK]: [
        'https://rpc-gel.inkonchain.com',
        'https://rpc-qnd.inkonchain.com',
    ],
    [SupportedChainId.LINEA]: [
        'https://rpc.linea.build',
        'https://linea-rpc.publicnode.com',
    ],
    [SupportedChainId.SEPOLIA]: [
        'https://rpc.sepolia.org',
        'https://rpc2.sepolia.org',
        'https://rpc.sepolia.ethpandaops.io',
        'https://sepolia.gateway.tenderly.co',
        'https://ethereum-sepolia-rpc.publicnode.com',
    ],
}
