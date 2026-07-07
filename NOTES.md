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
2. **飞书教程文档** — `DZSqdCaxKof50zxJcrccnVtFnIh`，走原生 block 追加（`index=-1`），不贴 Markdown 源码
3. **GitHub** — `git@github.com:linxuesia/learn-web3-frontend.git`，commit + push 到 `main`

完成后回报三端状态（本地路径 / 飞书链接 / GitHub commit hash）。

## 飞书教程文档（公开可读，追加式更新）

- **URL**: https://shanlisi.feishu.cn/docx/DZSqdCaxKof50zxJcrccnVtFnIh
- **document_id**: `DZSqdCaxKof50zxJcrccnVtFnIh`
- **权限**: link_share_entity=anyone_readable（互联网获得链接的用户可阅读）
- **更新规则**: 每完成一节课，用 `POST /open-apis/docx/v1/documents/{doc_id}/blocks/{doc_id}/children` `index=-1` 追加到末尾，不重建。
- **格式**: 走飞书原生 block（heading/bullet/code_block/quote/divider），不贴 Markdown 源码。
- **已同步**: 封面 · Lesson 01
