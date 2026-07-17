# NOTES.md — 教学偏好和工作笔记

## sia 的偏好（教学要遵守）

- 中文为主，直接、务实、不要官方套话和营销腔。
- "简单一点" = 去掉"欢迎来到 xxx / 提供全方位 xxx 服务"这类，改成朋友教朋友的语气。
- 代码任务要闭环：能跑、能验证。不接受只有计划、没有真实执行的输出。
- 已熟练 React / Vue / Taro / NestJS / TypeScript / Node.js / MySQL；国外远程岗位偏 React，所以主线用 React。
- 平台：macOS，日常 Node 走 nvm，编辑器/终端由 sia 自己控制，我不擅自改她全局环境。

## 教学节奏

- 每节课 ≤ 30 分钟能跑完一个可验证的小 win。
- 每节课都要 tie 回 MISSION.md 的"一个月出可演示 DApp + 能投的简历版本"。
- 每节课末尾问 sia 一个开放问题，用来判断她是否真掌握，作为下一节的 ZPD 参考。
- 关键掌握点写进 `learning-records/`；术语只有在她会用之后写进 `GLOSSARY.md`。

## 已知路径与账号

- Learning workspace: `~/sia/learn-web3-frontend/`
- 简历/求职邮箱: `linxue.sia@gmail.com`
- 关联项目（非 web3，但可能穿插上下文）: 门窗报价助手（Taro + NestJS 小程序）

## 三端同步铁律（本次会话新增，以后所有课件/文档改动都遵守）

**任何内容变更都必须三端同步，缺一端算没完：**

1. **本地** — `lessons/*.html`、`*.md`、`assets/*`
2. **飞书课程系列文件夹** — `QJbMf0SXilwFU6dMneTcqIj9n2g`（见下），每节课一个 docx，追加式更新
3. **GitHub** — `git@github.com:linxuesia/learn-web3-frontend.git`，commit + push 到 `master`

完成后回报三端状态（本地路径 / 飞书链接 / GitHub commit hash）。

## 飞书课程系列（sia 是所有者，bot 保留 full_access）

- **文件夹**: `QJbMf0SXilwFU6dMneTcqIj9n2g` — 「Web3 前端从 0 到 1 · 学习系列」
  - URL: https://my.feishu.cn/drive/folder/QJbMf0SXilwFU6dMneTcqIj9n2g
- **规则**: 每节课独立 docx（不再往 L01 doc 里堆），全部收进这个文件夹
- **owner**: sia (`ou_b054825b6015149969ccfc891e21b609`)。bot (`ou_6e2d1edb671ca5f0e37d926cca918321`) 保留 full_access 用来继续追加内容
- **格式**: 飞书原生 block（heading/bullet/code_block/quote/divider），不贴 Markdown

### 各节文档

| Lesson | doc_token | 标题 |
|---|---|---|
| L01 | `DZSqdCaxKof50zxJcrccnVtFnIh` | Web3 前端从 0 到 1 · 实战教程（初期做的合集，只包含 L01 内容） |
| L02 | `XlNudaUFiouTycxq2Q4c9PXxndg` | Web3 前端 · Lesson 02 · 读 ERC-20 合约 |
| L03 | `F6nedSNrnoCIFoxiMKlc7yrfn45` | Web3 前端 · Lesson 03 · 发一笔真交易 |

### 新建文档 / 多维表格的强制流程（不要漏）

1. 创建 docx / bitable
2. **`transfer_owner` 转给 sia**（`ou_b054825b6015149969ccfc891e21b609`），带 `stay_put=true` 让 bot 保留 full_access
3. `move` 到对应文件夹（学习系列 → `QJbMf0SXilwFU6dMneTcqIj9n2g`；其他项目类似地建独立系列文件夹）
4. 把文档链接发到飞书 DM 给 sia
