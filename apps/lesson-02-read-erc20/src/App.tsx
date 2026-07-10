import { useState } from 'react'
import {
  useAccount, useConnect, useDisconnect, useChainId, useReadContracts, useSwitchChain,
} from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { formatUnits } from 'viem'
import { erc20Abi, SEPOLIA_TOKENS, type TokenKey } from './erc20'

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
  const { switchChain, isPending: switching } = useSwitchChain()

  const [tokenKey, setTokenKey] = useState<TokenKey>('LINK')
  const token = SEPOLIA_TOKENS[tokenKey]

  // ────────────────────────────────────────────────────────────
  // 一次 multicall 读四个 view 方法
  //  - useReadContracts 会尽可能把多个 read 打包成一次 RPC 请求
  //  - allowFailure=false 让任何一个失败就整体 error，教学阶段更好排错
  //  - balanceOf 依赖钱包地址，enabled 控制 address 没连上时别发
  // ────────────────────────────────────────────────────────────
  const {
    data, isPending, isError, error: readError, refetch,
  } = useReadContracts({
    allowFailure: false,
    contracts: [
      { address: token.address, abi: erc20Abi, functionName: 'name' },
      { address: token.address, abi: erc20Abi, functionName: 'symbol' },
      { address: token.address, abi: erc20Abi, functionName: 'decimals' },
      { address: token.address, abi: erc20Abi, functionName: 'totalSupply' },
      {
        address: token.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
    ],
    query: { enabled: isConnected && !!address },
  })

  const [name, symbol, decimals, totalSupply, balance] = data ?? []

  return (
    <main style={{ maxWidth: 720, margin: '3rem auto', fontFamily: 'system-ui', padding: '0 1.5rem' }}>
      <h1>Lesson 02 · 读 ERC-20 合约</h1>
      <p style={{ color: '#888' }}>useReadContract(s) · ABI · decimals · multicall</p>

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
        <>
          <section style={{ background: '#f7f7f8', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
            <p style={{ margin: '4px 0' }}>地址：<code>{address}</code></p>
            <p style={{ margin: '4px 0' }}>
              网络：<strong>{CHAIN_NAME[chainId] ?? '未知'}</strong>{' '}
              <code>chainId={chainId}</code>
            </p>
            {chainId !== 11155111 && (
              <p style={{ color: 'crimson', margin: '4px 0' }}>
                ⚠️ 当前不是 Sepolia，本页合约在 Sepolia 上。
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

          <section style={{ marginBottom: 20 }}>
            <label style={{ marginRight: 8 }}>选一个 Sepolia ERC-20：</label>
            <select
              value={tokenKey}
              onChange={(e) => setTokenKey(e.target.value as TokenKey)}
              style={{ padding: '6px 10px' }}
            >
              {(Object.keys(SEPOLIA_TOKENS) as TokenKey[]).map((k) => (
                <option key={k} value={k}>{SEPOLIA_TOKENS[k].label}</option>
              ))}
            </select>
            <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
              合约地址：<code>{token.address}</code>
              {token.faucet && (
                <>
                  {' · '}
                  <a href={token.faucet} target="_blank" rel="noreferrer">领测试币</a>
                </>
              )}
            </p>
          </section>

          {isPending && <p>读取合约中…</p>}
          {isError && (
            <p style={{ color: 'crimson' }}>
              读失败：{readError?.message}
            </p>
          )}
          {data && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <Row k="name()" v={String(name)} />
                <Row k="symbol()" v={String(symbol)} />
                <Row k="decimals()" v={String(decimals)} />
                <Row
                  k="totalSupply()"
                  v={`${formatUnits(totalSupply as bigint, decimals as number)} ${symbol}`}
                  raw={String(totalSupply)}
                />
                <Row
                  k={`balanceOf(${address?.slice(0, 6)}…)`}
                  v={`${formatUnits(balance as bigint, decimals as number)} ${symbol}`}
                  raw={String(balance)}
                  highlight
                />
              </tbody>
            </table>
          )}

          <button
            onClick={() => refetch()}
            style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}
          >
            重新读一次
          </button>
        </>
      )}

      <hr style={{ margin: '3rem 0 1rem', border: 'none', borderTop: '1px solid #ddd' }} />
      <details>
        <summary style={{ cursor: 'pointer', color: '#666' }}>面试题彩蛋（点开）</summary>
        <ul style={{ color: '#555', fontSize: 14, lineHeight: 1.7 }}>
          <li><code>balanceOf</code> 返回的是 <code>uint256</code>，前端用 <code>bigint</code>。<em>永远不要</em>把它转成 Number，超过 2^53 会精度爆炸。</li>
          <li>展示金额必须用 <code>formatUnits(value, decimals)</code>，不能用 <code>formatEther</code>——那是硬编码 18 位小数，USDC 是 6 位会算错 12 个零。</li>
          <li><code>useReadContracts</code> 会尽量把多个 read 打包成一次 <code>eth_call</code> 到 Multicall3 合约，省 RPC 请求也省钱包插件的转发延迟。</li>
          <li>ABI 里 <code>stateMutability: 'view'</code> 表示只读，不上链、不花 gas；<code>'pure'</code> 是连链上状态都不读；<code>'nonpayable'</code>/<code>'payable'</code> 才是写操作，下一节讲。</li>
        </ul>
      </details>
    </main>
  )
}

function Row({
  k, v, raw, highlight,
}: { k: string; v: string; raw?: string; highlight?: boolean }) {
  return (
    <tr style={{ background: highlight ? '#fff8e1' : 'transparent' }}>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee', width: 220 }}>
        <code>{k}</code>
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid #eee' }}>
        <div>{v}</div>
        {raw && (
          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
            raw uint256: <code>{raw}</code>
          </div>
        )}
      </td>
    </tr>
  )
}
