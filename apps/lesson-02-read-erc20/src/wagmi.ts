import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Lesson 02 承接 Lesson 01 的经验：
// 只列 sepolia 会让"用户切到其他链"这个动作被 wagmi 拒识，
// 所以把主网/Base Sepolia 一并列进来，UI 里再判断"当前不是 Sepolia"提示切回。
export const config = createConfig({
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
