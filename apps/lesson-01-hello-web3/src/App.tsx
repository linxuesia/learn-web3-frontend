import {
  useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain,
} from 'wagmi'
import { formatEther } from 'viem'
import CodePeek from './CodePeek'
// Vite 的 ?raw 特性：把这些文件当纯文本读进来，代码永远和实际跑的一致
import appSrc from './App.tsx?raw'
import wagmiSrc from './wagmi.ts?raw'
import mainSrc from './main.tsx?raw'

const CHAIN_NAME: Record<number, string> = {
  1: 'Ethereum Mainnet 💰',
  11155111: 'Sepolia',
  84532: 'Base Sepolia',
  8453: 'Base 💰',
}

export default function App() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const { chains, switchChain, isPending: switching, error: switchErr } = useSwitchChain()

  return (
    <main style={{ maxWidth: 640, margin: '3rem auto', fontFamily: 'system-ui', padding: '0 1.5rem' }}>
      <h1>Hello Web3 · Lesson 01</h1>
      <p style={{ color: '#888' }}>连钱包 · 读地址 · 读余额 · 主动切链</p>

      {!isConnected ? (
        <div>
          {connectors.map((c) => (
            <button
              key={c.uid}
              onClick={() => connect({ connector: c })}
              style={{ marginRight: 8, padding: '8px 16px', cursor: 'pointer' }}
            >
              连接 {c.name}
            </button>
          ))}
          {status === 'pending' && <p>连接中…</p>}
          {error && <p style={{ color: 'crimson' }}>{error.message}</p>}
        </div>
      ) : (
        <div>
          <p>地址：<code>{address}</code></p>
          <p>
            当前网络：<strong>{CHAIN_NAME[chainId] ?? '未知'}</strong>
            {' '}<code>chainId={chainId}</code>
            {' '}<code>(0x{chainId.toString(16)})</code>
          </p>
          <p>
            余额：{balance
              ? `${formatEther(balance.value)} ${balance.symbol}`
              : '读取中…'}
          </p>

          <div style={{ margin: '1.5rem 0', padding: '1rem', background: '#f6f8fa', borderRadius: 6 }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>切换网络（DApp 主动请求 · EIP-3326）</p>
            {chains.map((c) => (
              <button
                key={c.id}
                onClick={() => switchChain({ chainId: c.id })}
                disabled={switching || c.id === chainId}
                style={{
                  marginRight: 8, marginBottom: 4, padding: '6px 12px',
                  cursor: c.id === chainId ? 'default' : 'pointer',
                  fontWeight: c.id === chainId ? 700 : 400,
                  opacity: c.id === chainId ? 0.6 : 1,
                }}
              >
                {c.id === chainId ? '✓ ' : ''}{c.name}
              </button>
            ))}
            {switching && <p style={{ margin: '8px 0 0', color: '#888' }}>等待 MetaMask 弹窗确认…</p>}
            {switchErr && <p style={{ margin: '8px 0 0', color: 'crimson' }}>{switchErr.message}</p>}
          </div>

          <button onClick={() => disconnect()} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            断开
          </button>
        </div>
      )}

      <hr style={{ margin: '3rem 0 1rem', border: 'none', borderTop: '1px solid #ddd' }} />
      <p style={{ fontSize: 12, color: '#999' }}>
        面试题：balance 是 wagmi 通过 viem 发 <code>eth_getBalance</code> 到 RPC 节点拿的，
        不是从 MetaMask 读的。MM 只提供签名和 chainId/accounts。
      </p>
      <p style={{ fontSize: 12, color: '#999' }}>
        踩坑：MetaMask v12+ 的 per-site network 让「在 MM UI 里手动切网」不会触发 DApp 的
        <code>chainChanged</code> 事件。DApp 要切链就得自己调 <code>wallet_switchEthereumChain</code>
        （wagmi 封装为 <code>useSwitchChain</code>），MM 会弹窗让用户为当前 origin 确认切网。
      </p>

      <CodePeek
        files={{
          'App.tsx': appSrc,
          'wagmi.ts': wagmiSrc,
          'main.tsx': mainSrc,
        }}
      />
    </main>
  )
}
