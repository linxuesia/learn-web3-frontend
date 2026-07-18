// ─────────────────────────────────────────────────────────────────
// Tip Jar 合约地址 + ABI
// Step 2 部署完之后回来更新 TIP_JAR_ADDRESS
// Sepolia 部署 → 拿到 0x... 地址 → 粘到下面
// ─────────────────────────────────────────────────────────────────

import type { Address } from 'viem'

// TODO(Step 2): 部署后填入真实地址
export const TIP_JAR_ADDRESS: Address = '0x0000000000000000000000000000000000000000'

// TipJar.sol 的最小 ABI（只保留前端要调的方法 / 事件）
// as const 让 wagmi 能自动推导参数类型 + 返回值类型
export const tipJarAbi = [
  // ─── views ───
  { type: 'function', name: 'owner',        stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { type: 'function', name: 'totalTips',    stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  {
    type: 'function', name: 'getMessage', stateMutability: 'view',
    inputs: [{ name: 'index', type: 'uint256' }],
    outputs: [
      { name: 'from', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'message', type: 'string' },
      { name: 'timestamp', type: 'uint256' },
    ],
  },
  // ─── writes ───
  {
    type: 'function', name: 'tip', stateMutability: 'payable',
    inputs: [{ name: 'message', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function', name: 'withdraw', stateMutability: 'nonpayable',
    inputs: [], outputs: [],
  },
  // ─── events ───
  {
    type: 'event', name: 'NewTip',
    inputs: [
      { indexed: true,  name: 'from',    type: 'address' },
      { indexed: false, name: 'amount',  type: 'uint256' },
      { indexed: false, name: 'message', type: 'string' },
    ],
  },
] as const
