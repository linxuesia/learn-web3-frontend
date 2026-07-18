import {
  useAccount, useConnect, useDisconnect, useChainId, useSwitchChain,
  useBalance,
} from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { formatEther } from 'viem'
import { TIP_JAR_ADDRESS } from './contract'

// ────────────────────────────────────────────────────────────────
// Mission · Sepolia Tip Jar 🍺
// 目标：一个能演示的 end-to-end DApp，跑完一个月 mission 的验收
// 三节课的技能会全部串联：
//   Lesson 01 → 连钱包 + 切链
//   Lesson 02 → 读合约（余额 + 留言列表，用 useReadContracts + Multicall）
//   Lesson 03 → 发交易（tip + message，走 useWriteContract）
//   ➕ 新技能 → 事件监听（useWatchContractEvent，让新留言实时刷进 UI）
// 部署：Vercel
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

  return (
    <main style={{ maxWidth: 760, margin: '3rem auto', fontFamily: 'system-ui', padding: '0 1.5rem' }}>
      <h1>Sepolia Tip Jar 🍺</h1>
      <p style={{ color: '#666' }}>
        给这个墙留一句话 + 转一点点 Sepolia ETH。所有留言公开可见，链上永不删除。
      </p>

      {/* ─── Step 1 状态提示：合约还没部署 ─── */}
      {!contractDeployed && (
        <div style={{
          padding: '14px 18px', background: '#fef3c7', border: '1px solid #fbbf24',
          borderRadius: 8, marginBottom: 20, fontSize: 14, lineHeight: 1.6,
        }}>
          <strong>🚧 Step 1 骨架已就位，等 Step 2 部署合约。</strong>
          <br />
          下一步：用 Remix 部署 <code>contracts/TipJar.sol</code> 到 Sepolia，把地址填进{' '}
          <code>src/contract.ts</code> 就能继续。
        </div>
      )}

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
          {connectStatus === 'pending' && <p>连接中…</p>}
          {connectError && <p style={{ color: 'crimson' }}>{connectError.message}</p>}
        </div>
      ) : (
        <>
          {/* ─── 账户信息 ─── */}
          <section style={{
            background: '#f7f7f8', padding: '12px 16px', borderRadius: 8, marginBottom: 20,
          }}>
            <p style={{ margin: '4px 0' }}>
              地址：<code>{address}</code>
            </p>
            <p style={{ margin: '4px 0' }}>
              网络：<strong>{CHAIN_NAME[chainId] ?? '未知'}</strong>{' '}
              <code>chainId={chainId}</code>
            </p>
            <p style={{ margin: '4px 0' }}>
              钱包余额：{balance ? `${formatEther(balance.value)} ${balance.symbol}` : '读取中…'}
            </p>
            {!onSepolia && (
              <p style={{ color: 'crimson', margin: '4px 0' }}>
                ⚠️ 当前不是 Sepolia。
                <button
                  onClick={() => switchChain({ chainId: sepolia.id })}
                  disabled={switching}
                  style={{ marginLeft: 8, padding: '4px 12px', cursor: 'pointer' }}
                >
                  {switching ? '等 MM 确认…' : '一键切到 Sepolia'}
                </button>
              </p>
            )}
            <button onClick={() => disconnect()} style={{ marginTop: 6 }}>断开</button>
          </section>

          {/* ─── Step 2: 读合约（余额 + 留言列表） ─── */}
          <section style={{
            marginBottom: 20, padding: '14px 18px', border: '1px dashed #d4d4d8',
            borderRadius: 8, color: '#888', fontSize: 14,
          }}>
            <h3 style={{ margin: '0 0 8px', color: '#444' }}>[TODO Step 3] Tip Jar 状态</h3>
            <p style={{ margin: 0 }}>
              这里会显示：<br />
              · Tip Jar 合约余额（<code>useReadContract</code> · <code>getBalance()</code>）
              <br />
              · 最新 N 条留言（<code>useReadContracts</code> · Multicall 打包 <code>getMessage(i)</code>）
              <br />
              · Owner 是谁（是不是我）
            </p>
          </section>

          {/* ─── Step 3: 发交易（tip + message） ─── */}
          <section style={{
            marginBottom: 20, padding: '14px 18px', border: '1px dashed #d4d4d8',
            borderRadius: 8, color: '#888', fontSize: 14,
          }}>
            <h3 style={{ margin: '0 0 8px', color: '#444' }}>[TODO Step 3] 打赏 + 留言</h3>
            <p style={{ margin: 0 }}>
              · 输入金额 + 留言内容
              <br />
              · <code>useWriteContract.writeContract</code> 调用 <code>tip(string)</code> 并 <code>value</code> 附 ETH
              <br />
              · <code>useWaitForTransactionReceipt</code> 等确认
              <br />
              · 成功后自动清空表单
            </p>
          </section>

          {/* ─── Step 3+: 事件监听 ─── */}
          <section style={{
            marginBottom: 20, padding: '14px 18px', border: '1px dashed #d4d4d8',
            borderRadius: 8, color: '#888', fontSize: 14,
          }}>
            <h3 style={{ margin: '0 0 8px', color: '#444' }}>[TODO Step 3] 实时新留言</h3>
            <p style={{ margin: 0 }}>
              <code>useWatchContractEvent</code> 订阅 <code>NewTip(address,uint256,string)</code>
              事件；有新交易就 push 进 UI 顶部，附 <code>from / value / message</code> 三列。
              <br />
              简历里「event subscription」的落点。
            </p>
          </section>

          <hr style={{ margin: '2rem 0 1rem', border: 'none', borderTop: '1px solid #eee' }} />
          <details>
            <summary style={{ cursor: 'pointer', color: '#666' }}>Mission 说明（点开）</summary>
            <ul style={{ color: '#555', fontSize: 14, lineHeight: 1.7 }}>
              <li><strong>为什么做这个：</strong>一次串起「连钱包 · 读合约 · 发交易 · 事件订阅 · Vercel 部署」五件事，正好是简历 Web3 前端项目要 tick 的所有 box。</li>
              <li><strong>合约选择 Tip Jar：</strong>逻辑极简（十几行 Solidity）但覆盖 payable / state / event 三个核心；不需要 ERC-20/721 的额外概念。</li>
              <li><strong>只上 Sepolia：</strong>不花真钱，faucet 领水就够跑。</li>
            </ul>
          </details>
        </>
      )}
    </main>
  )
}
