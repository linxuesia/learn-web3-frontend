// ─────────────────────────────────────────────────────────────
// ERC-20 最小 ABI
//
// 教学要点：
// - 一个合约完整 ABI 可能上百个方法，前端只需要"你要调的那几个"。
// - ABI 是前端和合约的"接口协议"，viem/wagmi 靠它做类型推导和编解码。
// - name / symbol / decimals 一次读永远不变，balanceOf 是随地址变的。
// ─────────────────────────────────────────────────────────────

export const erc20Abi = [
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

// ─────────────────────────────────────────────────────────────
// 常用 Sepolia ERC-20 测试合约
// LINK 是首选：Chainlink 官方发的测试代币，可以从 faucets.chain.link 领。
// 领到后本节的 balanceOf 就不是 0，演示效果最好。
// ─────────────────────────────────────────────────────────────

export const SEPOLIA_TOKENS = {
  LINK: {
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    label: 'LINK (Chainlink)',
    faucet: 'https://faucets.chain.link/sepolia',
  },
  WETH: {
    address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    label: 'WETH (Wrapped Ether)',
    faucet: null,
  },
  USDC: {
    // Circle 官方 Sepolia USDC
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    label: 'USDC (Circle)',
    faucet: 'https://faucet.circle.com/',
  },
} as const

export type TokenKey = keyof typeof SEPOLIA_TOKENS
