import { useState } from 'react'
import {
  useAccount, useConnect, useDisconnect, useChainId, useSwitchChain,
  useBalance,
} from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { formatEther } from 'viem'
import { TIP_JAR_ADDRESS } from './contract'
import { TipJarStats } from './components/TipJarStats'
import { TipForm } from './components/TipForm'
import { TipWall } from './components/TipWall'

// ────────────────────────────────────────────────────────────────
// Mission · Sepolia Tip Jar 🍺
// End-to-end DApp：连钱包 → 读合约 → 发交易 → 事件订阅 → Vercel 部署
// ────────────────────────────────────────────────────────────────

const CHAIN_NAME: Record<number, string> = {
  1: 'Ethereum Mainnet 💰',
  11155111: 'Sepolia',
  84532: 'Base Sepolia',
  8453: 'Base 💰',
}

export default function App() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectors, connect, status: connectStatus, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: switching } = useSwitchChain()
  const { data: balance } = useBalance({ address })

  const onSepolia = chainId === sepolia.id
  const contractDeployed = TIP_JAR_ADDRESS !== '0x0000000000000000000000000000000000000000'

  // 用 counter 让 TipWall 在打赏成功后强制刷新 totalTips
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main style={{
      maxWidth: 760, margin: '3rem auto', padding: '0 1.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <h1 style={{ marginBottom: 6 }}>Sepolia Tip Jar 🍺</h1>
      <p style={{ color: '#666', marginTop: 0 }}>
        给这个墙留一句话 + 转一点点 Sepolia ETH。所有留言公开可见，链上永不删除。
      </p>

      {!contractDeployed && (
        <div style={{
          padding: '14px 18px', background: '#fef3c7', border: '1px solid #fbbf24',
          borderRadius: 8, marginBottom: 20, fontSize: 14, lineHeight: 1.6,
        }}>
          <strong>🚧 Step 2 未完成：合约还没部署。</strong>
          <br />
          用 Remix 部署 <code>contracts/TipJar.sol</code> 到 Sepolia，把地址填进{' '}
          <code>src/contract.ts</code>。
        </div>
      )}

      {!isConnected ? (
        <ConnectPanel
          connectors={connectors}
          connect={connect}
          connectStatus={connectStatus}
          connectError={connectError}
        />
      ) : (
        <>
          {/* 账户信息 */}
          <section style={{
            background: '#f7f7f8', padding: '12px 16px', borderRadius: 8,
            marginBottom: 20, fontSize: 14,
          }}>
            <div style={{ margin: '4px 0' }}>
              地址：<code style={{ fontSize: 12 }}>{address}</code>
            </div>
            <div style={{ margin: '4px 0' }}>
              网络：<strong>{CHAIN_NAME[chainId] ?? '未知'}</strong>{' '}
              <code style={{ fontSize: 12 }}>chainId={chainId}</code>
            </div>
            <div style={{ margin: '4px 0' }}>
              钱包余额：
              {balance ? `${formatEther(balance.value)} ${balance.symbol}` : '读取中…'}
            </div>
            {!onSepolia && (
              <div style={{ color: 'crimson', margin: '8px 0' }}>
                ⚠️ 当前不是 Sepolia。
                <button
                  onClick={() => switchChain({ chainId: sepolia.id })}
                  disabled={switching}
                  style={{ marginLeft: 8, padding: '4px 12px', cursor: 'pointer' }}
                >
                  {switching ? '等 MM 确认…' : '一键切到 Sepolia'}
                </button>
              </div>
            )}
            <button onClick={() => disconnect()} style={{ marginTop: 6 }}>断开</button>
          </section>

          {onSepolia && contractDeployed ? (
            <>
              <TipJarStats />
              <TipForm onSuccess={() => setRefreshKey((k) => k + 1)} />
              <TipWall refreshKey={refreshKey} />
            </>
          ) : (
            !onSepolia && (
              <p style={{ color: '#888', fontStyle: 'italic' }}>
                切到 Sepolia 才能看留言墙和打赏 ☝️
              </p>
            )
          )}

          <hr style={{ margin: '2rem 0 1rem', border: 'none', borderTop: '1px solid #eee' }} />
          <details>
            <summary style={{ cursor: 'pointer', color: '#666' }}>Mission 说明（点开）</summary>
            <ul style={{ color: '#555', fontSize: 14, lineHeight: 1.7 }}>
              <li>
                <strong>合约：</strong>
                <a
                  href={`https://sepolia.etherscan.io/address/${TIP_JAR_ADDRESS}`}
                  target="_blank" rel="noreferrer"
                >
                  {TIP_JAR_ADDRESS}
                </a>
              </li>
              <li><strong>技能覆盖：</strong>连钱包 · Multicall 读 · payable 写 · event 订阅</li>
              <li><strong>Sepolia 特性：</strong>测试网，链上永久留言，不花真钱</li>
            </ul>
          </details>
        </>
      )}
    </main>
  )
}

// ── 连接钱包子组件 ────────────────────────────────────────────
function ConnectPanel({
  connectors, connect, connectStatus, connectError,
}: {
  connectors: readonly { uid: string; name: string; icon?: string }[]
  connect: (opts: { connector: any }) => void
  connectStatus: string
  connectError: Error | null
}) {
  return (
    <div>
      <p style={{ color: '#666' }}>先连一个钱包，我们就可以开始了。</p>
      {connectors.map((c) => (
        <button
          key={c.uid}
          onClick={() => connect({ connector: c })}
          style={{
            marginRight: 8, padding: '10px 20px', cursor: 'pointer',
            background: 'white', border: '1px solid #d4d4d8', borderRadius: 6,
            fontSize: 14,
          }}
        >
          连接 {c.name}
        </button>
      ))}
      {connectStatus === 'pending' && <p>连接中…</p>}
      {connectError && (
        <p style={{ color: 'crimson' }}>{connectError.message}</p>
      )}
    </div>
  )
}
