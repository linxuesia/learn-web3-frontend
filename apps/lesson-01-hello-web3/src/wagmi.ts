import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  // 列在这里的链，wagmi 才会 sync 状态。
  // 加 mainnet 只是为了让"切到主网"这个动作能被识别到，
  // 不代表我们真要在主网上做事——真发交易前 UI 会拦一层。
  chains: [sepolia, baseSepolia, mainnet],
  connectors: [
    // metaMask() 走 EIP-6963（Multi Injected Provider Discovery）+ MetaMask SDK。
    // 会通过事件广播找到"真正的 MetaMask"，带元数据（uuid/name/icon/rdns），
    // 冷启动有约 200-300ms 的 discovery 窗口——所以按钮出现和点击都比 injected 慢一点。
    metaMask(),
    // injected() 走 EIP-1193 老协议，同步读 window.ethereum。
    // 好处：0 延迟；缺点：多钱包共存时可能连错。留作兜底。
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
