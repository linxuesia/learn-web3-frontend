import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  // 列在这里的链，wagmi 才会 sync 状态。
  // 加 mainnet 只是为了让"切到主网"这个动作能被识别到，
  // 不代表我们真要在主网上做事——真发交易前 UI 会拦一层。
  chains: [sepolia, baseSepolia, mainnet],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
