# Mission · Sepolia Tip Jar 🍺

**目标**：一个 end-to-end DApp，把三节课的技能全部串联，跑完就是简历上「Web3 前端项目」的落点。

## 涉及技能

| 技能 | 来源 | 用在哪 |
|---|---|---|
| 连钱包 + 切链 | Lesson 01 | 顶部账户区 |
| 读合约状态（`useReadContracts` + Multicall） | Lesson 02 | 留言列表 + owner + 合约余额 |
| 发交易（`useWriteContract` + `useWaitForTransactionReceipt`） | Lesson 03 | 打赏 + 留言 |
| 事件监听（`useWatchContractEvent`） | ⭐ 新技能 | 新留言实时推 |
| Vercel 部署 | ⭐ 新技能 | 拿公开可演示链接 |

## 目录

```
mission-tip-jar/
├── contracts/
│   └── TipJar.sol          # 一份 Solidity 合约，~80 行
├── src/
│   ├── App.tsx             # 前端主页面
│   ├── contract.ts         # 合约地址 + ABI
│   ├── wagmi.ts            # wagmi config（复用 Lesson 03）
│   └── main.tsx
├── index.html
├── package.json            # dev 端口 5176
└── README.md
```

## 分四步走

### Step 1 · 骨架就位（已完成）

- ✅ 从 Lesson 03 复制脚手架
- ✅ 写 `TipJar.sol` 合约
- ✅ `contract.ts` 里放最小 ABI（views + writes + events）
- ✅ `App.tsx` 有账户区 + 三个 TODO section 占位
- ⏳ `TIP_JAR_ADDRESS` 目前是 `0x0000...0000`（占位），跑起来会显示黄色提示

**验证 Step 1 通了**：
```bash
cd apps/mission-tip-jar
npm install
npm run dev
# 打开 http://localhost:5176 应该看到「Sepolia Tip Jar 🍺」+ 黄色的 Step 2 提示
```

### Step 2 · 部署合约到 Sepolia（下一步）

用 Remix（不装工具链）：

1. 打开 https://remix.ethereum.org
2. 新建 `TipJar.sol`，粘贴 `contracts/TipJar.sol` 内容
3. Solidity Compiler tab → 选 0.8.20+ → Compile
4. Deploy & Run tab → **Environment 选 "Injected Provider - MetaMask"**（这一步让 Remix 用你 MM 的 Sepolia 账户）
5. 确认 MM 里当前是 Sepolia + 有点余额（≥ 0.01 ETH）
6. 点 Deploy，MM 弹窗签名，等 tx 上链
7. 部署成功后 Remix 底部会显示合约地址（0x...40 位十六进制）
8. 把地址填到 `src/contract.ts` 的 `TIP_JAR_ADDRESS`
9. 在 Sepolia Etherscan 上把合约 verify 一下（可选，但简历加分）

### Step 3 · 前端接入（20 分钟）

三块 TODO section 依次填：
1. **读**：`useReadContract` 读 owner + totalTips + getBalance；`useReadContracts` 打包读最近 N 条 `getMessage(i)`
2. **写**：表单 → `useWriteContract.writeContract` 调 `tip(message)` 附 `value: parseEther(amount)`
3. **事件**：`useWatchContractEvent` 订阅 `NewTip`，新留言 push 到列表顶部

### Step 4 · Vercel 部署

- monorepo 部署：Root Directory 填 `apps/mission-tip-jar`
- Build Command 用默认 `npm run build`
- 拿到公开 URL → 加进简历

## 简历一句话（Step 4 完成后）

> 用 wagmi + viem + React 独立实现 Sepolia 上的 Tip Jar DApp：自写并部署 Solidity 合约（payable / storage / event），前端覆盖连钱包（EIP-1193/6963）、读合约（`useReadContracts` + Multicall3）、发交易（tx 生命周期 + EIP-1559 fee）、事件订阅（`useWatchContractEvent` 实时刷新留言墙）四个核心场景。部署到 Vercel 可公开演示，合约在 Sepolia Etherscan 上 verified。

## Sepolia 资源

- Faucet: https://sepoliafaucet.com · https://faucets.chain.link/sepolia
- Etherscan: https://sepolia.etherscan.io/
- 合约地址（Step 2 后填）: `TBD`
- 公开 Demo（Step 4 后填）: `TBD`
