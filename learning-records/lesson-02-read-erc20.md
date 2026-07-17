# Lesson 02 · 读 ERC-20 合约 — 掌握记录

**完成时间**: 2026-07-08
**用时**: 约 30 分钟
**Lesson 页面**: [`lessons/0002-read-erc20-contract.html`](../lessons/0002-read-erc20-contract.html)
**Demo 工程**: `apps/lesson-02-read-erc20/`

## 会做什么

- 用 `useReadContracts` 一次读 ERC-20 的 `name / symbol / decimals / totalSupply / balanceOf`。
- 用最小 ABI（只保留要用的方法）配合 `as const` 拿到强类型。
- 用 `formatUnits(value, decimals)` 正确显示金额，能解释为什么不用 `formatEther`。
- 能切换 LINK/USDC 直观看到 `decimals=18` vs `decimals=6` 的差异。

## 立住的概念

| 概念 | 一句话 |
|---|---|
| ABI | 合约暴露给外部的接口说明书；前端只保留要调的方法。 |
| `view` / `eth_call` | 只读函数走 `eth_call`，不上链、不花 gas。 |
| `decimals` | 链上是整数，前端要靠它挪小数点；不同代币位数不同（USDC=6, LINK=18）。 |
| Multicall3 | `useReadContracts` 底层用来把多个 read 打包成一次 RPC，同 EVM 链地址都是 `0xcA11...CA11`。 |
| `bigint` vs `Number` | uint256 必须 bigint；Number 超过 2^53 会精度爆炸。 |

## 简历一句话

用 wagmi `useReadContracts` + viem 读取 Sepolia ERC-20（LINK/USDC/WETH）合约状态，通过 Multicall3 一次打包 5 个 `view` 调用，减少 80% RPC 请求。TypeScript 强类型 ABI，`formatUnits` 处理不同代币的 decimals 差异。

## 面试可以答的点

- 钱包读余额 vs 合约读余额分别走哪个 RPC？（`eth_getBalance` vs `eth_call`）
- 怎么优化 read 调用次数？→ Multicall3
- 为什么前端要用 bigint 不用 Number？→ uint256 精度
- `formatEther` 和 `formatUnits` 区别？→ 前者硬编码 18 位小数
- ABI 里 `stateMutability` 的四个值都是啥？

## 卡过的坑

（等 sia 跑完补）

## 下一节

**Lesson 03**：发一笔真交易（`useWriteContract` + `useWaitForTransactionReceipt`），走完 tx 生命周期 pending → mined → confirmed。
