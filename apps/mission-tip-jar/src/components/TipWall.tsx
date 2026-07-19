import { useMemo } from 'react'
import { useReadContract, useReadContracts, useWatchContractEvent } from 'wagmi'
import { formatEther, type Address } from 'viem'
import { TIP_JAR_ADDRESS, tipJarAbi } from '../contract'
import { useState, useEffect } from 'react'

type TipRecord = {
  from: Address
  amount: bigint
  message: string
  timestamp: bigint
  txHash?: string // 事件监听拿到的 tx hash（初始加载的没有）
}

/**
 * TipWall — 留言墙
 *
 * 用到：
 *   - useReadContract      → 拿 totalTips 决定要读多少条
 *   - useReadContracts     → Multicall 批量拿最近 N 条 getMessage(i)
 *   - useWatchContractEvent → 订阅 NewTip 事件，实时推新留言
 *
 * 面试点：
 *   1. 为什么用 Multicall（useReadContracts）而不是 N 个 useReadContract？
 *      → 打包成 1 次 eth_call 到 Multicall3 合约，N 从 5 变 1 次 RPC
 *   2. 为什么还要事件监听？直接每 5 秒 poll 一次不行吗？
 *      → 事件是 push，polling 是 pull，UX 差距大；且 polling 更浪费 RPC quota
 *   3. 事件里拿到的新数据怎么合并？
 *      → 用 useState 缓存"事件后新增"的列表，和"初始加载"的列表合并渲染
 */
export function TipWall({ refreshKey }: { refreshKey: number }) {
  // 拿总条数
  const { data: totalTips, refetch: refetchTotal } = useReadContract({
    address: TIP_JAR_ADDRESS,
    abi: tipJarAbi,
    functionName: 'totalTips',
    query: {
      // 每次 refreshKey 变化触发重新拉取（TipForm 成功后会 +1）
      refetchInterval: false,
    },
  })

  // 每次 refreshKey 变化，手动 refetch
  useEffect(() => {
    if (refreshKey > 0) refetchTotal()
  }, [refreshKey, refetchTotal])

  const total = totalTips ? Number(totalTips) : 0
  const RECENT_N = 10 // 只读最近 10 条，避免链上留言变多之后 gas 爆炸
  const startIdx = Math.max(0, total - RECENT_N)

  // 用 useMemo 构造 contracts 数组：调 total-1, total-2, ... 直到 startIdx
  const contracts = useMemo(() => {
    if (total === 0) return []
    const indices: bigint[] = []
    for (let i = total - 1; i >= startIdx; i--) indices.push(BigInt(i))
    return indices.map((idx) => ({
      address: TIP_JAR_ADDRESS,
      abi: tipJarAbi,
      functionName: 'getMessage' as const,
      args: [idx] as const,
    }))
  }, [total, startIdx])

  const { data: rawTips, isLoading } = useReadContracts({
    contracts,
    allowFailure: false,
    query: { enabled: contracts.length > 0 },
  })

  // rawTips 结构：[[from, amount, message, timestamp], ...]（tuple 数组）
  const historicalTips = useMemo<TipRecord[]>(() => {
    if (!rawTips) return []
    return rawTips.map((t) => {
      const [from, amount, message, timestamp] = t as unknown as readonly [
        Address, bigint, string, bigint
      ]
      return { from, amount, message, timestamp }
    })
  }, [rawTips])

  // 事件订阅：新的 NewTip 会 push 到 liveTips
  const [liveTips, setLiveTips] = useState<TipRecord[]>([])

  useWatchContractEvent({
    address: TIP_JAR_ADDRESS,
    abi: tipJarAbi,
    eventName: 'NewTip',
    onLogs: (logs) => {
      const nowSec = BigInt(Math.floor(Date.now() / 1000))
      const newOnes: TipRecord[] = logs.map((log) => ({
        from: (log.args.from ?? '0x0') as Address,
        amount: (log.args.amount ?? 0n) as bigint,
        message: (log.args.message ?? '') as string,
        timestamp: nowSec, // 事件没带 timestamp，用当前秒近似
        txHash: log.transactionHash,
      }))
      setLiveTips((prev) => [...newOnes, ...prev])
    },
  })

  // 合并：liveTips 在前，historicalTips 在后
  // 简单去重：如果 liveTips 里已经有一条 message + from 一样的，historicalTips 就跳过
  const allTips = useMemo(() => {
    const liveKeys = new Set(
      liveTips.map((t) => `${t.from.toLowerCase()}|${t.message}`)
    )
    const filtered = historicalTips.filter(
      (t) => !liveKeys.has(`${t.from.toLowerCase()}|${t.message}`)
    )
    return [...liveTips, ...filtered]
  }, [liveTips, historicalTips])

  return (
    <section style={{ marginBottom: 20 }}>
      <h3 style={{ margin: '0 0 12px' }}>
        📝 最近留言 {total > 0 && `(显示最新 ${Math.min(total, RECENT_N)} / 共 ${total} 条)`}
      </h3>

      {isLoading && contracts.length > 0 && (
        <p style={{ color: '#888' }}>加载留言中…</p>
      )}

      {total === 0 && (
        <p style={{ color: '#888', fontStyle: 'italic' }}>
          还没人留言。做第一个 👆
        </p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {allTips.map((t, i) => (
          <li
            key={`${t.from}-${t.timestamp}-${i}`}
            style={{
              padding: '12px 16px', marginBottom: 8,
              background: t.txHash ? '#ecfdf5' : '#fafafa', // 实时收到的高亮
              border: `1px solid ${t.txHash ? '#86efac' : '#e5e7eb'}`,
              borderRadius: 8, fontSize: 14,
            }}
          >
            <div style={{ marginBottom: 4 }}>
              <code style={{ fontSize: 12, color: '#666' }}>
                {t.from.slice(0, 6)}…{t.from.slice(-4)}
              </code>
              <span style={{ marginLeft: 10, color: '#888', fontSize: 12 }}>
                打赏 {formatEther(t.amount)} SepoliaETH
              </span>
              {t.txHash && (
                <span style={{
                  marginLeft: 10, padding: '1px 6px', fontSize: 11,
                  background: '#22c55e', color: 'white', borderRadius: 3,
                }}>
                  刚上链
                </span>
              )}
            </div>
            <div style={{ color: '#111' }}>{t.message}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
