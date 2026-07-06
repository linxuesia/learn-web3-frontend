# Mission: Web3 前端开发

## Why
sia 处于离职阶段、在家自由接单做微信小程序，同时找 worldwide 全职远程工作。Web3 前端是当前远程岗位供给多、单价高、对现有 React 技术栈延续性强的方向。这条路径的真正目标不是"了解 web3"，而是**一个月后能拿一个能跑、能演示的 DApp 项目 + 一份能对着 web3 前端岗投递的简历版本**。

## Success looks like（30 天后）
- 用 wagmi + viem + React 独立搭出至少 1 个 end-to-end DApp：钱包连接、读链上数据、发一笔链上交易（Sepolia 或 Base Sepolia 测试网），部署到 Vercel 可公开演示。
- 简历里可以写具体的 web3 前端项目和技术点（wagmi、viem、EIP-1193、tx 生命周期、事件订阅、RainbowKit/ConnectKit、testnet 部署），不是虚的"了解 web3"。
- 面试能扛住这些基本盘：钱包连接原理（EIP-1193 / EIP-6963）、tx 生命周期（pending → mined → confirmed）、gas / nonce / 事件日志、常见前端坑（RPC 限速、链切换、断连重连、错误处理）。
- 能读懂一份中等复杂度的 Solidity 合约（ERC-20 / ERC-721 级别），知道前端怎么和它对齐（ABI、方法签名、事件、只读 vs 写入）。

## Constraints
- 时间：一个月，主线是找工作 + 接单，学习是主线里的一支，不能变成主线。
- 现有栈：Vue、React、Taro、NestJS、TypeScript、Node.js、MySQL；国外岗位偏 React，所以主线用 React。
- 语言：教学、术语、注释一律中文为主；技术名词保留英文。
- 学习方式：每节课要能在 20–30 分钟内完成一个可验证的小 win，不做纯理论课。
- 平台：本地 mac + Vercel 部署；不折腾主网（不花真钱），全走 Sepolia / Base Sepolia。

## Out of scope（这一个月内不追）
- Solidity 深度合约开发（能读、能改、能部署最简模板即可，不做审计/优化/DeFi 级复杂度）。
- Rust / Move / Solana / Aptos / Sui 等非 EVM 生态。
- MEV、跨链、L2 深层原理、ZK 电路。
- NFT 艺术生成 / 玩法设计（工程角度看会用即可）。
- 交易所对接、合约钱包（AA、EIP-4337 只做概念性了解，不落地实现）。
