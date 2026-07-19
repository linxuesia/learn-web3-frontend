import { useState } from 'react'
import {
  useAccount, useWriteContract, useWaitForTransactionReceipt,
} from 'wagmi'
import { parseEther, type Hash } from 'viem'
import { TIP_JAR_ADDRESS, tipJarAbi } from '../contract'

/**
 * TipForm — 打赏 + 留言表单
 *
 * 用到：
 *   - useWriteContract         → 发起合约写调用
 *   - useWaitForTransactionReceipt → 等 tx 上链确认
 *
 * tx 生命周期 UI 反馈（面试要能讲）：
 *   1. idle       → 表单可填
 *   2. pending    → MM 弹窗中，等用户签名
 *   3. confirming → tx 已进 mempool，拿到 hash，等打包
 *   4. success    → receipt 拿到，UI 显示成功 + 清表单
 *   5. error      → 用户拒绝签名 or revert，显示错误
 */
export function TipForm({ onSuccess }: { onSuccess?: () => void }) {
  const { isConnected } = useAccount()
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('0.0001')

  const {
    writeContract, data: hash, isPending, error: writeError, reset,
  } = useWriteContract()

  const {
    isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError,
  } = useWaitForTransactionReceipt({ hash })

  // 交易上链成功 → 清表单 + 通知父组件刷新列表
  if (isConfirmed && message) {
    setMessage('')
    setAmount('0.0001')
    onSuccess?.()
    reset() // 让 hash / isPending 回到初始态
  }

  const disabled = !isConnected || isPending || isConfirming || !message.trim()

  const submit = () => {
    if (!message.trim()) return
    writeContract({
      address: TIP_JAR_ADDRESS,
      abi: tipJarAbi,
      functionName: 'tip',
      args: [message.trim()],
      value: parseEther(amount || '0'),
    })
  }

  return (
    <section style={{
      marginBottom: 20, padding: '16px 20px',
      border: '2px solid #f59e0b', borderRadius: 8, background: '#fffbeb',
    }}>
      <h3 style={{ margin: '0 0 12px' }}>✍️ 打赏 + 留言</h3>

      <label style={{ display: 'block', marginBottom: 10, fontSize: 14 }}>
        留言（1-280 字符）
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={280}
          rows={3}
          placeholder="给未来的自己 / 给某个朋友 / 给整个 Web3 世界，说点什么"
          style={{
            display: 'block', width: '100%', marginTop: 4, padding: 8,
            borderRadius: 4, border: '1px solid #d4d4d8', fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
          disabled={isPending || isConfirming}
        />
        <span style={{ fontSize: 12, color: '#888' }}>
          {message.length} / 280
        </span>
      </label>

      <label style={{ display: 'block', marginBottom: 12, fontSize: 14 }}>
        打赏金额（SepoliaETH，可以是 0）
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.0001"
          min="0"
          style={{
            display: 'block', marginTop: 4, padding: 8, width: 200,
            borderRadius: 4, border: '1px solid #d4d4d8',
          }}
          disabled={isPending || isConfirming}
        />
      </label>

      <button
        onClick={submit}
        disabled={disabled}
        style={{
          padding: '10px 24px', background: disabled ? '#ccc' : '#f59e0b',
          color: 'white', border: 'none', borderRadius: 6,
          cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 15,
          fontWeight: 600,
        }}
      >
        {isPending
          ? '等 MM 签名…'
          : isConfirming
          ? '⛓ 上链中…'
          : `打赏 ${amount || '0'} + 留言`}
      </button>

      {hash && (
        <TxStatus hash={hash} isConfirming={isConfirming} isConfirmed={isConfirmed} />
      )}

      {writeError && (
        <p style={{ color: 'crimson', marginTop: 10, fontSize: 13 }}>
          ❌ {(writeError as Error).message.slice(0, 200)}
        </p>
      )}
      {receiptError && (
        <p style={{ color: 'crimson', marginTop: 10, fontSize: 13 }}>
          ❌ Receipt error: {(receiptError as Error).message.slice(0, 200)}
        </p>
      )}
    </section>
  )
}

function TxStatus({
  hash, isConfirming, isConfirmed,
}: { hash: Hash; isConfirming: boolean; isConfirmed: boolean }) {
  return (
    <div style={{
      marginTop: 12, padding: 10, background: 'white',
      borderRadius: 4, fontSize: 13,
    }}>
      <div>
        Tx Hash:{' '}
        <a
          href={`https://sepolia.etherscan.io/tx/${hash}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: '#0369a1' }}
        >
          <code style={{ fontSize: 12 }}>{hash.slice(0, 10)}…{hash.slice(-8)}</code> ↗
        </a>
      </div>
      <div style={{ marginTop: 4, color: isConfirmed ? '#22c55e' : '#888' }}>
        {isConfirming && '⏳ 等打包确认…'}
        {isConfirmed && '✅ 已上链！新留言即将出现在墙上'}
      </div>
    </div>
  )
}
