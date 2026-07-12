import { useState } from 'react'
import {
  useAccount, useConnect, useDisconnect, useChainId, useSwitchChain,
  useBalance,
  useEstimateGas, useSendTransaction, useWaitForTransactionReceipt,
  useFeeData,
} from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { formatEther, parseEther, formatGwei, isAddress, type Address } from 'viem'
import CodePeek from './CodePeek'
// Vite ?raw：源码作为字符串导入，永远和跑的版本一致
import appSrc from './App.tsx?raw'
import wagmiSrc from './wagmi.ts?raw'
import mainSrc from './main.tsx?raw'

const CHAIN_NAME: Record<number, string> = {
  1: 'Ethereum Mainnet 💰',
  11155111: 'Sepolia',
  84532: 'Base Sepolia',
  8453: 'Base 💰',
}

// ────────────────────────────────────────────────────────────
// 一个 burn / demo 地址，收到就当销毁。教学演示用。
// vitalik.eth: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045（这个在 mainnet 有意义，Sepolia 上他不看）
// 0x0...dead: 传统的 burn 地址
// ────────────────────────────────────────────────────────────
const DEMO_TO: Address = '0x000000000000000000000000000000000000dEaD'

export default function App() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectors, connect, status: connectStatus, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: switching } = useSwitchChain()
  const { data: balance } = useBalance({ address })

  // ─── 表单状态 ───
  const [to, setTo] = useState<string>(DEMO_TO)
  const [amount, setAmount] = useState<string>('0.0001') // 一次别烧太多

  const toValid = isAddress(to)
  const amountValid = /^\d+(\.\d+)?$/.test(amount) && Number(amount) > 0
  const canPrepare = isConnected && chainId === sepolia.id && toValid && amountValid

  // ─── 1) 估算 gas ───
  // useEstimateGas 底层是 eth_estimateGas：节点用最新 state 模拟一次这笔 tx，返回预估 gasLimit。
  // enabled 兜底：所有输入没 ready 之前别去打 RPC，浪费还容易报错。
  const value = amountValid ? parseEther(amount) : undefined
  const gasEstimate = useEstimateGas({
    to: toValid ? (to as Address) : undefined,
    value,
    query: { enabled: canPrepare && value !== undefined },
  })

  // ─── 2) 拉当前 fee 数据（EIP-1559：baseFee + tip） ───
  // wagmi v2 用 useFeeData，返回 gasPrice（legacy）+ maxFeePerGas / maxPriorityFeePerGas（1559）
  const feeData = useFeeData({ query: { enabled: isConnected } })

  // ─── 3) 发交易 ───
  // useSendTransaction 底层：走 provider 的 eth_sendTransaction → MetaMask 弹签名 → 广播到 mempool
  // 返回的是 tx hash（0x + 64 hex chars），此时 tx 还没上链，只是进了 mempool
  const send = useSendTransaction()

  // ─── 4) 等 receipt ───
  // useWaitForTransactionReceipt：拿到 hash 后，wagmi 帮你轮询 eth_getTransactionReceipt
  // 直到 receipt 出现（tx 被打包进区块）。confirmations 参数控制"等几个确认块"，
  // 一般测试网用 1，主网用 2-6（防重组）。
  const receipt = useWaitForTransactionReceipt({
    hash: send.data,
    confirmations: 1,
  })

  // ─── 派生：手续费预估 = gasLimit × maxFeePerGas ───
  const estimatedFee =
    gasEstimate.data !== undefined && feeData.data?.maxFeePerGas
      ? gasEstimate.data * feeData.data.maxFeePerGas
      : undefined

  const explorer = (hash: string) => `https://sepolia.etherscan.io/tx/${hash}`

  return (
    <main style={{ maxWidth: 720, margin: '3rem auto', fontFamily: 'system-ui', padding: '0 1.5rem' }}>
      <h1>Lesson 03 · 发一笔真交易</h1>
      <p style={{ color: '#888' }}>useEstimateGas · useSendTransaction · useWaitForTransactionReceipt · tx 生命周期</p>

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
          <section style={{ background: '#f7f7f8', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
            <p style={{ margin: '4px 0' }}>地址：<code>{address}</code></p>
            <p style={{ margin: '4px 0' }}>
              网络：<strong>{CHAIN_NAME[chainId] ?? '未知'}</strong>{' '}
              <code>chainId={chainId}</code>
            </p>
            <p style={{ margin: '4px 0' }}>
              余额：{balance ? `${formatEther(balance.value)} ${balance.symbol}` : '读取中…'}
            </p>
            {chainId !== sepolia.id && (
              <p style={{ color: 'crimson', margin: '4px 0' }}>
                ⚠️ 当前不是 Sepolia，本课在 Sepolia 上做实验（真交易不烧钱）。
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

          {/* ─── 表单 ─── */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 12px' }}>1. 填交易参数</h3>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 4, color: '#555' }}>
                收款地址（to）
              </label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="0x..."
                style={{
                  width: '100%', padding: '8px 10px', fontFamily: 'ui-monospace, monospace',
                  fontSize: 13, border: `1px solid ${toValid ? '#d4d4d8' : 'crimson'}`,
                  borderRadius: 4, boxSizing: 'border-box',
                }}
              />
              {!toValid && to && (
                <p style={{ color: 'crimson', fontSize: 12, margin: '4px 0 0' }}>
                  地址格式不对（要求 0x + 40 hex）
                </p>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 4, color: '#555' }}>
                金额（ETH，可小数）
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0001"
                style={{
                  width: 200, padding: '8px 10px', fontFamily: 'ui-monospace, monospace',
                  fontSize: 13, border: `1px solid ${amountValid ? '#d4d4d8' : 'crimson'}`,
                  borderRadius: 4,
                }}
              />
              <span style={{ marginLeft: 12, color: '#888', fontSize: 12 }}>
                建议 0.0001（一根毛，safe）
              </span>
            </div>
          </section>

          {/* ─── 估算 ─── */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 12px' }}>2. 预估手续费（不发交易）</h3>
            {!canPrepare && (
              <p style={{ color: '#888', fontSize: 13 }}>
                填对 to + amount 且在 Sepolia 上，这里会自动出预估。
              </p>
            )}
            {canPrepare && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  <Row
                    k="gasLimit (eth_estimateGas)"
                    v={gasEstimate.isPending ? '估算中…' : gasEstimate.data?.toString() ?? '—'}
                    hint="节点模拟一次 tx 得出需要多少 gas。原生转账通常 21000。"
                  />
                  <Row
                    k="maxFeePerGas (EIP-1559)"
                    v={feeData.data?.maxFeePerGas ? `${formatGwei(feeData.data.maxFeePerGas)} gwei` : '—'}
                    hint="你愿意为每单位 gas 付的上限（baseFee + priority tip 上限）"
                  />
                  <Row
                    k="maxPriorityFeePerGas"
                    v={feeData.data?.maxPriorityFeePerGas ? `${formatGwei(feeData.data.maxPriorityFeePerGas)} gwei` : '—'}
                    hint="给矿工的小费，越高越快被打包"
                  />
                  <Row
                    k="预估手续费 (gasLimit × maxFeePerGas)"
                    v={estimatedFee !== undefined ? `${formatEther(estimatedFee)} ETH` : '—'}
                    highlight
                    hint="上限估算，实际付 = gasUsed × effectiveGasPrice，通常更低"
                  />
                </tbody>
              </table>
            )}
            {gasEstimate.error && (
              <p style={{ color: 'crimson', fontSize: 12, marginTop: 8 }}>
                估算失败：{gasEstimate.error.message}
              </p>
            )}
          </section>

          {/* ─── 发送 ─── */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 12px' }}>3. 发送</h3>
            <button
              onClick={() => {
                if (!canPrepare || !value) return
                send.sendTransaction({
                  to: to as Address,
                  value,
                })
              }}
              disabled={!canPrepare || send.isPending || receipt.isFetching}
              style={{
                padding: '10px 24px', fontSize: 14, cursor: 'pointer',
                background: canPrepare && !send.isPending ? '#18181b' : '#a1a1aa',
                color: '#fff', border: 'none', borderRadius: 6,
              }}
            >
              {send.isPending ? '等 MM 签名…' :
                receipt.isFetching ? '等打包…' :
                receipt.isSuccess ? '✓ 已确认，再发一笔？' :
                '发送交易'}
            </button>
            {send.error && (
              <p style={{ color: 'crimson', fontSize: 12, marginTop: 8 }}>
                发送失败：{send.error.message}
              </p>
            )}
          </section>

          {/* ─── 交易状态 ─── */}
          {send.data && (
            <section style={{
              padding: '14px 16px', background: '#f0f9ff', border: '1px solid #bae6fd',
              borderRadius: 8, marginBottom: 20,
            }}>
              <h3 style={{ margin: '0 0 10px' }}>4. 交易状态</h3>
              <p style={{ margin: '4px 0', fontSize: 13 }}>
                tx hash：<code style={{ wordBreak: 'break-all' }}>{send.data}</code>
              </p>
              <p style={{ margin: '4px 0', fontSize: 13 }}>
                <a href={explorer(send.data)} target="_blank" rel="noreferrer">在 Sepolia Etherscan 上查看 →</a>
              </p>
              <ul style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.8 }}>
                <li>
                  <strong>签名 & 广播：</strong>
                  {send.isSuccess ? '✅ 已提交到 mempool' : '进行中…'}
                </li>
                <li>
                  <strong>等待打包：</strong>
                  {receipt.isFetching && !receipt.isSuccess && '⏳ 轮询 receipt 中（大约 12-30s）…'}
                  {receipt.isSuccess && '✅ 已上链'}
                  {receipt.isError && `❌ ${receipt.error?.message}`}
                </li>
                {receipt.isSuccess && receipt.data && (
                  <>
                    <li>
                      <strong>Block：</strong>
                      <code>{receipt.data.blockNumber.toString()}</code>
                    </li>
                    <li>
                      <strong>Gas used：</strong>
                      <code>{receipt.data.gasUsed.toString()}</code>
                      {' '}(实际 &lt;= 你的 gasLimit)
                    </li>
                    <li>
                      <strong>Effective gas price：</strong>
                      <code>{formatGwei(receipt.data.effectiveGasPrice)} gwei</code>
                    </li>
                    <li>
                      <strong>实际手续费：</strong>
                      <code>
                        {formatEther(receipt.data.gasUsed * receipt.data.effectiveGasPrice)} ETH
                      </code>
                    </li>
                    <li>
                      <strong>状态：</strong>
                      {receipt.data.status === 'success' ? '✅ success' : '❌ reverted'}
                    </li>
                  </>
                )}
              </ul>
            </section>
          )}

          {/* ─── 面试题彩蛋 ─── */}
          <hr style={{ margin: '2rem 0 1rem', border: 'none', borderTop: '1px solid #ddd' }} />
          <details>
            <summary style={{ cursor: 'pointer', color: '#666' }}>面试题彩蛋（点开）</summary>
            <ul style={{ color: '#555', fontSize: 14, lineHeight: 1.7 }}>
              <li><strong>eth_estimateGas vs eth_gasPrice：</strong>前者算"要多少 gas 单位"（gasLimit），后者算"每单位 gas 多少钱"。两者相乘才是手续费上限。</li>
              <li><strong>为什么不 setInterval 轮 receipt：</strong>useWaitForTransactionReceipt 内部已经用 viem 的 pollingInterval + block number tracking + retry 处理好边界，setInterval 手写会撞节点限速、丢事件、内存泄漏。</li>
              <li><strong>tx hash ≠ tx 上链：</strong>拿到 hash 只代表进了 mempool，链上任何节点都能查到"pending tx"，但 receipt 还没有。receipt 出现 = 打包完成 = block hash 存在。</li>
              <li><strong>nonce 是啥：</strong>你这个地址发的第 N 笔 tx。链上强制顺序执行，nonce=5 的没确认，nonce=6 的就算发出去也永远 pending。可以用同 nonce + 更高 gas 发一笔"替换 tx"（cancel 或 speedup）。</li>
              <li><strong>交易 reverted：</strong>tx 上链了，但合约执行时 revert 了，gas 还是被扣（因为矿工干活了）。receipt.status = 'reverted'。原生转账基本不会 revert，合约调用才会。</li>
            </ul>
          </details>
        </>
      )}

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

function Row({
  k, v, hint, highlight,
}: { k: string; v: string; hint?: string; highlight?: boolean }) {
  return (
    <tr style={{ background: highlight ? '#fff8e1' : 'transparent' }}>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', width: 260 }}>
        <code style={{ fontSize: 12 }}>{k}</code>
      </td>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}>
        <div style={{ fontSize: 13 }}>{v}</div>
        {hint && (
          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
            {hint}
          </div>
        )}
      </td>
    </tr>
  )
}
