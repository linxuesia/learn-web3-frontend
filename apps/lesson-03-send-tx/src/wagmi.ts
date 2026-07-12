import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

// Lesson 03 继承 Lesson 01 的经验：
// - 多链 config 让"切网络"这个动作有意义
// - metaMask()（EIP-6963）主推 + injected()（EIP-1193）兜底
export const config = createConfig({
  chains: [sepolia, baseSepolia, mainnet],
  connectors: [
    metaMask(),
    injected(),
  ],
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
