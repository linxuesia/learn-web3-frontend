# Web3 前端从 0 到 1

<p align="center">
  <strong>一个月内从零搭出可演示的 DApp</strong><br/>
  React + wagmi + viem · 实战驱动 · 每课可验证
</p>

<p align="center">
  <img src="https://img.shields.io/badge/stack-React_18-blue" alt="react"/>
  <img src="https://img.shields.io/badge/web3-wagmi_%2B_viem-green" alt="web3"/>
  <img src="https://img.shields.io/badge/status-learning-orange" alt="status"/>
</p>

---

## 这是什么

一份**实战导向**的 Web3 前端学习记录，目标是一个月内产出：

- 至少 1 个端到端 DApp（钱包连接 → 读链上数据 → 发交易 → 部署上线）
- 一份能投 Web3 前端岗位的简历

不是纯理论笔记，每节课 20-30 分钟，必须产出**可跑、可验证**的代码。

## 学习路线

| 阶段 | 内容 | 产出 |
|------|------|------|
| 基础入门 | 钱包连接、读余额、链切换 | 一个能连钱包的页面 |
| 链上交互 | 发送交易、调用合约、事件监听 | 可交互的 DApp |
| 合约阅读 | ERC-20/ERC-721 ABI、方法签名 | 能读懂合约接口 |
| 部署上线 | Vercel 部署、测试网 | 公开可演示的 Demo |

## 项目结构

```
learn-web3-frontend/
├── MISSION.md           # 学习目标与约束
├── NOTES.md             # 学习偏好与笔记
├── GLOSSARY.md          # Web3 术语表（已掌握）
├── RESOURCES.md         # 精选学习资源
├── lessons/             # 课程代码
├── learning-records/    # 阶段性掌握记录
└── reference/           # 参考代码
```

## 技术栈

- **前端**: React 18 + TypeScript
- **Web3**: wagmi + viem
- **钱包**: RainbowKit / ConnectKit
- **测试网**: Sepolia / Base Sepolia
- **部署**: Vercel

## 为什么做这个

远程 Web3 前端岗位供给多、单价高、与现有 React 技术栈延续性强。这个仓库记录了从传统前端跨越到 Web3 前端的完整学习路径——从零概念到能独立开发 DApp。

## 进度

- [x] Lesson 01: 第一支能跑的 DApp — 连钱包 + 读余额
- [x] Lesson 02: 读 ERC-20 合约 — ABI + useReadContracts + decimals + Multicall
- [x] Lesson 03: 发一笔真交易 — useSendTransaction + tx 生命周期 + EIP-1559 fee

## License

MIT
