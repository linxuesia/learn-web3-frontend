# Web3 前端 Resources

面向"接远程活/求职、一个月内出能演示的 DApp"这条 mission，所以资源以**能直接抄的官方文档、能跑的教程、能问的高质量社区**为主，不收录卖课式内容。

## Knowledge

- [wagmi 官方文档](https://wagmi.sh/) — React 钱包/链上交互 hooks 的事实标准。**Use for**: 每一节 React 侧钱包/合约交互代码的第一参考。
- [viem 官方文档](https://viem.sh/) — 底层 EVM 客户端库，wagmi 就是它的 React 封装。**Use for**: 需要更细粒度控制、写脚本、看清楚 tx/ABI 语义时。
- [Ethereum 官方开发者门户](https://ethereum.org/en/developers/docs/) — 概念权威来源（账户、交易、gas、EVM、JSON-RPC）。**Use for**: 面试基础题、"到底怎么工作的"这类问题。
- [EIP-1193 提案](https://eips.ethereum.org/EIPS/eip-1193) — 浏览器钱包 provider 标准。**Use for**: 面试常考"钱包连接原理"，源头就是这里。
- [EIP-6963 提案](https://eips.ethereum.org/EIPS/eip-6963) — 多钱包发现标准，MetaMask 之外都要它。**Use for**: 讲清"为什么现代 DApp 不再直接读 window.ethereum"。
- [RainbowKit 官方文档](https://www.rainbowkit.com/) — 主流的钱包连接 UI 组件。**Use for**: 快速做出好看的钱包连接体验。
- [ConnectKit 官方文档](https://docs.family.co/connectkit) — RainbowKit 的高质量替代。**Use for**: 对比方案、简历里体现选型判断。
- [Solidity by Example](https://solidity-by-example.org/) — 极简可跑合约样例。**Use for**: 一个月内所有合约端"看得懂、抄得动"的场景。
- [OpenZeppelin Contracts 文档](https://docs.openzeppelin.com/contracts/) — 生产级合约模板（ERC-20 / ERC-721 / AccessControl）。**Use for**: 需要自己部署一个正经合约时的第一来源，永远不要手写标准合约。
- [Alchemy Docs](https://docs.alchemy.com/) — 主流 RPC + 索引服务。**Use for**: 生产环境 RPC、rate limit、testnet 支持。
- [Vercel Docs](https://vercel.com/docs) — 前端部署事实标准。**Use for**: 每个 DApp demo 上线的部署来源。

## Wisdom (Communities)

- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/) — 高质量问答社区，几乎所有"我这段代码为什么不对"都能搜到。**Use for**: 卡壳时第一站。
- [wagmi Discord](https://discord.gg/JUrRkGweXV) — wagmi 官方社区，issue 响应快。**Use for**: wagmi / viem 具体报错、版本兼容问题。
- [r/ethdev](https://www.reddit.com/r/ethdev/) — 相对高信号的 ETH 开发者子版。**Use for**: 招聘信息、行业风向、避坑帖。
- 中文远程 web3 求职渠道：Cryptohunt / RemoteOK / Web3.career / CryptoJobsList。**Use for**: 一个月末真正投递的地方（不是学，是用）。

## Gaps

- 目前尚未挑定一门"读懂中等复杂度 Solidity 合约"的中文教程；如果第 2–3 周需要补合约阅读能力，再补 1 个高质量资源。
