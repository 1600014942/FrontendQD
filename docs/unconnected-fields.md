# 尚未接入真实数据的字段

## 首页

- “已为开发者节省”金额；
- “累计节省 Token”；
- “任务效能利用率提升”；
- “实时更新”状态。

当前处理：保留原型数值，并在首屏明确标注 `Demo 数据 · 沿用原型数值 · 尚未接入实时生产接口`。

## ACU 指数页

- H100-SPOT、H200-SPOT 当前值与变动；
- GPU-BASKET 与 H200/H100-PREMIUM 派生值；
- ACU-CodeFix、ACU-Coding/USD、ACU-Reasoning、ACU-CPI 的 Official / Nowcast；
- 置信度评分、来源数量、last_checked、last_updated；
- 历史曲线和 sparkline。

当前处理：不制造数值，统一显示方法论和“未接入”状态。

## 预约系统

- 邮件服务需要生产环境变量；
- 未接入 CRM 或持久化数据库；
- 防重复提交采用前端锁、Idempotency-Key、服务端十分钟内存去重和 IP 频率限制；多实例持久化去重建议后续接入 Vercel KV 或数据库。

## 域名与品牌元数据

- 当前 canonical、Open Graph 与 sitemap 使用 `https://eu.jerrypsy.top/acu/index/` 生产前缀；未来切换正式独立域名时必须同时修改 `build.mjs`、`src/shell.html`、`public/robots.txt` 和 `public/sitemap.xml`，然后重新构建；
- Open Graph 使用 `/acu/index/og.svg` 品牌图；
- 未提供 ICP、隐私政策或公司注册地址，因此未自行补写。
