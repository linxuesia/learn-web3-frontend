import { useReadContract, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { TIP_JAR_ADDRESS, tipJarAbi } from '../contract'
import { useAccount } from 'wagmi'

/**
 * TipJarStats — 显示 Tip Jar 合约的三个核心状态
 *
 * 用到：
 *   - useReadContract     → 单个 view 调用（owner / totalTips）
 *   - useBalance          → 直接读地址余额（比调 getBalance() 更简洁）
 *
 * 面试点：为什么这里没用 useReadContracts 打包？
 *   → owner 几乎不变、totalTips 变化时会 refetch、balance 是 eth_getBalance 不是合约调用
 *   → 三个来源不同的 hook，语义上更清晰；用 useReadContracts 反而要包 eth_call 里
 */
export function TipJarStats() {
  const { address: userAddress } = useAccount()

  const { data: owner } = useReadContract({
    address: TIP_JAR_ADDRESS,
    abi: tipJarAbi,
    functionName: 'owner',
  })

  const { data: totalTips } = useReadContract({
    address: TIP_JAR_ADDRESS,
    abi: tipJarAbi,
    functionName: 'totalTips',
  })

  const { data: balance } = useBalance({ address: TIP_JAR_ADDRESS })

  const isOwner = owner && userAddress &&
    owner.toLowerCase() === userAddress.toLowerCase()

  return (
    <section style={{
      background: '#f7f7f8', padding: '14px 18px', borderRadius: 8,
      marginBottom: 20, fontSize: 14,
    }}>
      <h3 style={{ margin: '0 0 10px' }}>🍺 Tip Jar 状态</h3>
      <div style={{ display: 'grid', gap: 6 }}>
        <div>
          合约余额：
          <strong>
            {balance ? `${formatEther(balance.value)} SepoliaETH` : '读取中…'}
          </strong>
        </div>
        <div>
          累计留言：
          <strong>{totalTips !== undefined ? totalTips.toString() : '…'}</strong> 条
        </div>
        <div>
          Owner：
          <code style={{ fontSize: 12 }}>
            {owner ?? '…'}
          </code>
          {isOwner && (
            <span style={{
              marginLeft: 8, padding: '2px 8px', background: '#22c55e',
              color: 'white', borderRadius: 4, fontSize: 11,
            }}>
              是你 👑
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
