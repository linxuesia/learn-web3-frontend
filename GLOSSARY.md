# Web3 前端 Glossary

面向 React/前端视角的最小可用词表。**只有当 sia 能正确使用一个术语后，它才会被加进来**——这份文档是"已掌握"的证据，不是词典。

## Terms

### 来自 Lesson 01

- **EIP-1193** — 浏览器钱包注入到网页的标准 provider 接口，`window.ethereum.request({ method, params })` 就是它。所有钱包和 dapp 之间的通用协议。
- **EIP-6963** — EIP-1193 的多钱包发现扩展。同时装了 MetaMask、Rabby、OKX 不再互相打架，用事件广播来发现每个钱包。现代 wagmi/RainbowKit 默认走这个。
- **chainId** — 每条 EVM 链的唯一标识。十六进制在 `window.ethereum` 里返回，十进制在 wagmi/viem 里用。Sepolia = `0xaa36a7` / `11155111`。
- **RPC endpoint** — 链的对外访问入口 URL（Infura/Alchemy/Chainstack 等）。钱包和前端都靠它读写链上数据。免费档有严格限速。
- **wagmi / viem** — 组合技。viem 是底层 EVM 客户端（RPC 调用、编解码、类型），wagmi 是它的 React hooks 封装。2024+ 主流选择。
- **`useAccount` / `useBalance` / `useConnect`** — wagmi 三件套，分别给"当前连了谁 / 地址余额是多少 / 触发连接"。

### 来自 Lesson 02

- **ABI**（Application Binary Interface）— 合约的接口说明书。前端拿它才知道怎么调方法、怎么解读返回值。JSON 数组格式；前端只需要留自己要用的那几个方法。
- **`view` / `pure` / `nonpayable` / `payable`** — Solidity 的 `stateMutability`。前两个只读、不上链、不花 gas；后两个要签名、要打包、要花 gas。
- **`eth_call`** — 只读调用的 RPC 方法。节点本地跑一遍合约字节码返回结果，不进区块。所有 `view` 调用底层都是它。
- **`decimals`** — ERC-20 存的是整数，`decimals()` 告诉你要挪几位小数才是人类可读金额。USDC = 6，LINK/DAI/WETH = 18。**永远用 `formatUnits(value, decimals)`，不能硬编码 `formatEther`。**
- **`uint256` / `bigint`** — 链上金额都是 `uint256`（最大 2^256-1）。JS 侧必须用 `bigint`，用 `Number` 会精度爆炸（超过 2^53-1 就丢精度）。
- **Multicall3** — 部署在几乎所有 EVM 链的同地址合约（`0xcA11bde05977b3631167028862bE2a173976CA11`）。可以把多个 read 打包成一次 `eth_call` 返回。`useReadContracts` 底层就在用它。
- **函数选择器（function selector）** — `keccak256("balanceOf(address)")` 的前 4 字节 = `0x70a08231`。这是合约区分方法的唯一标识，ABI 编码的第一步。

### 来自 Lesson 03

- **tx 生命周期** — 签名 → 广播进 mempool（拿到 tx hash）→ 被矿工打包进 block（receipt 出现）→ 等 N 个 confirmations 确认块。前端 UI 通常按这四段来呈现状态。
- **mempool** — 已广播但还没被打包的 tx 池。任何节点都能查到 pending tx；tx hash 拿到 ≠ 上链。
- **`eth_estimateGas`** — RPC 方法，节点用最新 state 模拟一次 tx 得出需要多少 gas 单位（gasLimit）。原生转账固定 21000。
- **EIP-1559** — 以太坊 2021 年上线的 fee 模型。用 `baseFee`（每块自动调整、被 burn 掉）+ `maxPriorityFeePerGas`（给矿工的小费），`maxFeePerGas` 是你愿意付的总上限。取代了老的 `gasPrice`。
- **`maxFeePerGas` / `maxPriorityFeePerGas`** — 前者是每单位 gas 你愿意付的上限，后者是给矿工的小费；实际结算价 = `min(maxFeePerGas, baseFee + priorityFee)`，叫 `effectiveGasPrice`。
- **gasLimit vs gasUsed** — limit 是你设的天花板（估算 × 缓冲），used 是实际消耗，`used <= limit`。
- **effectiveGasPrice** — receipt 里的实际单价（≠ 你设的 `maxFeePerGas`），最终手续费 = `gasUsed × effectiveGasPrice`。
- **nonce** — 你这个地址发的第 N 笔 tx，链上强制按 nonce 顺序执行。nonce=5 卡住，nonce=6 就算发了也永远 pending。发同 nonce + 更高 gas 可以覆盖（cancel / speedup）。
- **receipt / `eth_getTransactionReceipt`** — tx 被打包后产生的执行结果对象，包含 blockNumber、gasUsed、effectiveGasPrice、status、logs（事件）等。receipt 存在 ⇔ tx 上链。
- **`status: success` vs `reverted`** — tx 上链后合约执行的结果。reverted 也算上链，gas 照扣（矿工干活了）。原生转账几乎不 revert，合约调用才会。
- **confirmations** — receipt 出现之后又过了几个 block。测试网 1 就够；主网一般 2-6 防 reorg（区块重组）。
