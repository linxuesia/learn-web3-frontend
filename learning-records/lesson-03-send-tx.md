# Lesson 03 · 发一笔真交易 — 掌握记录

**完成时间**: 2026-07-17
**用时**: 约 30 分钟
**Lesson 页面**: [`lessons/0003-send-transaction.html`](../lessons/0003-send-transaction.html)
**Demo 工程**: `apps/lesson-03-send-tx/`

## 会做什么

- 用 `useEstimateGas` 拿 gasLimit（底层 `eth_estimateGas`），`useFeeData` 拿 EIP-1559 的 `maxFeePerGas` / `maxPriorityFeePerGas`，两者相乘算手续费上限。
- 用 `useSendTransaction` 发原生 ETH 转账，走 MM 签名 → 广播 mempool → 拿到 tx hash。
- 用 `useWaitForTransactionReceipt` 轮询 receipt（`confirmations: 1`），拿到 blockNumber / gasUsed / effectiveGasPrice / status。
- 表单前置校验：`isAddress(to)` + 金额正则 + `chainId === sepolia.id`，都过了才 `enabled` 估算，避免瞎打 RPC。
- UI 上把 tx 生命周期四段拆开呈现：签名&广播 → 等打包 → 已上链 → 手续费/状态。

## 立住的概念

| 概念 | 一句话 |
|---|---|
| tx 生命周期 | 签名 → 广播进 mempool（拿到 hash）→ 被矿工打包进 block → receipt 出现 → 等 N 个确认块。 |
| tx hash ≠ 上链 | 拿到 hash 只代表进了 mempool，任何节点都能查 pending tx，但 receipt 还没出。receipt 出现才算上链。 |
| `eth_estimateGas` vs `eth_gasPrice` | 前者算「要多少 gas 单位」（gasLimit），后者算「每单位 gas 多少钱」。相乘才是手续费上限。 |
| EIP-1559 | `maxFeePerGas` = 你愿意付的上限；`maxPriorityFeePerGas` = 给矿工的小费；实际付 = `baseFee + tip`，通常低于上限。 |
| gasLimit vs gasUsed | gasLimit 是你设的天花板（估算 × 缓冲）；gasUsed 是实际消耗，`gasUsed <= gasLimit`。原生转账固定 21000。 |
| effectiveGasPrice | receipt 里的实际单价（≠ 你设的 maxFeePerGas），最终手续费 = `gasUsed × effectiveGasPrice`。 |
| nonce | 你这个地址发的第 N 笔 tx，链上强制按 nonce 顺序执行。nonce=5 卡住，nonce=6 就算发了也永远 pending。 |
| Replace tx（cancel / speedup） | 同 nonce + 更高 gas 再发一笔覆盖前一笔，可以是 0 值转给自己（cancel）或提速原 tx。 |
| receipt.status | `success` / `reverted`。tx 上链但合约 revert，gas 照扣（矿工干活了）；原生转账几乎不会 revert，合约调用才会。 |
| 为什么不手写 setInterval 轮 receipt | `useWaitForTransactionReceipt` 内部用 viem 的 pollingInterval + block tracking + retry，手写会撞节点限速、漏事件、内存泄漏。 |

## 简历一句话

用 wagmi `useSendTransaction` + `useWaitForTransactionReceipt` 在 Sepolia 上实现原生 ETH 转账，完整覆盖 tx 生命周期（签名 → mempool → 打包 → 确认）。用 `useEstimateGas` + `useFeeData` 做 EIP-1559 手续费预估（`maxFeePerGas` × `gasLimit`），实际结算对齐 `gasUsed × effectiveGasPrice`；表单前置校验（`isAddress` + `chainId`）避免无效 RPC。

## 面试可以答的点

- **tx 生命周期四段是啥？** 签名 → 广播进 mempool（拿到 hash）→ 被矿工打包（receipt 出现）→ 等 confirmations 确认块。
- **tx hash 拿到了但为啥还没确认？** hash 只代表进 mempool，需要被打包才有 receipt。可以在 Etherscan 上以 pending 状态查到。
- **EIP-1559 手续费怎么算？** `实际 = gasUsed × effectiveGasPrice`；`effectiveGasPrice = min(maxFeePerGas, baseFee + maxPriorityFeePerGas)`。所以 `maxFeePerGas` 是上限，通常付得比它少。
- **gasLimit 和 gasUsed 区别？** limit 是你设的天花板（估算 × 缓冲），used 是实际消耗，`used <= limit`。原生转账 21000 固定。
- **nonce 是啥？为什么可以「取消」/「提速」交易？** nonce 是这个地址第 N 笔 tx，链上按顺序执行。发同 nonce + 更高 gas 的 tx 可以覆盖前一笔。
- **交易 reverted 是啥情况？** tx 上链了，但合约执行报错，gas 照扣。原生转账几乎不会 revert，合约调用才会（require 失败 / 越权 / 余额不足等）。
- **为什么用 `useWaitForTransactionReceipt` 不手写 setInterval？** wagmi/viem 帮你处理了 pollingInterval、block number tracking、retry、断连重连、RPC 限速回退。手写踩坑无数。
- **`confirmations` 参数怎么选？** 测试网 1 就够；主网一般 2-6 防区块重组（reorg）；DeFi 大额转账可能 12+。

## 卡过的坑

（等 sia 跑完补：常见有 —— Sepolia 没水？地址转 checksum？MM 签名弹窗被 tab 挡住？RPC 429？）

## 下一节

**Lesson 04（可选路径 A）**：合约事件监听（`useWatchContractEvent` / event logs），把 ERC-20 Transfer 事件流式打到 UI，是简历「事件订阅」那条的落点。
**Mission 项目（可选路径 B）**：三节课基础够了，进入 end-to-end DApp（连钱包 + 读合约 + 发交易 + 部署 Vercel），一次性把简历项目跑出来。
