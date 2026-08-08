# 清度科技 / ACUindex 官方网站

ACUindex / 清度中文官方网站。当前生产环境由本仓库的 Node 静态服务托管，并通过统一域名的 `/acu/index/` 路径公开；同时保留 Vercel 部署兼容性。页面严格依据官网 PPT、原型图、ACU 方法论文档和白皮书构建。

## 技术结构

- 静态 HTML + TypeScript + 原生 CSS；
- 无运行时前端依赖、无大型 JS 包；
- `server.mjs` 与 Vercel Serverless API 均可处理预约、邮件和 ICS；
- 预构建产物已提交到 `public/`，无需安装依赖即可本地预览；
- `src/app.ts` 组件化为页面、区块、交互和数据模块；
- TypeScript 严格模式通过。

当前交付采用无框架实现，而不是 Next.js，原因是保证项目可以完整构建和独立托管。生产公网前缀固定为 `/acu/index`；源码、生成 HTML、canonical、Open Graph、sitemap 和内部链接必须保持这一前缀一致。

## 目录

```text
api/
  book-demo.js                 # Vercel Serverless 预约与邮件
src/
  app.ts                       # 页面、文章数据和交互源代码
  shell.html                   # 各路由 HTML 模板
public/
  app.js                       # 已编译浏览器代码
  styles.css
  assets/original/             # PPT media 原始文件，未修改
  assets/figures/              # 原始文件的无损裁切
  acu-index/index.html
  articles/index.html
  articles/<slug>/index.html   # 10 篇文章详情
  book-demo/index.html
screenshots/
  home-desktop-full.png
  home-screen-01.png ... home-screen-08.png
  home-mobile-full.png
  home-mobile-hero.png
  acu-index-desktop-full.png
  articles-desktop-full.png
  book-demo-mobile-full.png
docs/
  material-map.md
  visual-system.md
  unconnected-fields.md
deploy/
  acuindex-site.service        # 生产 systemd 单元的版本化来源
```

## 本地启动

项目已包含构建结果，直接运行：

```bash
npm run start
```

默认地址：`http://localhost:4173`

本地 Node 服务会执行与 Vercel 相同的预约处理器。未配置邮件环境变量时，表单仍会完成校验并生成 ICS，但明确返回 `emailStatus: not_configured`。

修改 TypeScript 后重新构建：

```bash
npm ci
npm run build
npm run check
```

## 页面路由

源码内的逻辑路由与生产公网路由对应如下：

- `/` → `/acu/index/`：首页八屏；
- `/acu-index/` → `/acu/index/acu-index/`：ACU 指数与方法论入口；
- `/articles/` → `/acu/index/articles/`：十篇行业观点；
- `/articles/<slug>/` → `/acu/index/articles/<slug>/`：文章详情；
- `/book-demo/` → `/acu/index/book-demo/`：预约演示；
- `/api/book-demo` → `/acu/index/api/book-demo`：预约 API。

## 当前生产部署

部署来源只有三处：本仓库源码、[`deploy/acuindex-site.service`](deploy/acuindex-site.service) 和 Claw Router 仓库中的 `deploy/alpha/nginx-acu-public-locations.conf`。不要在服务器上维护另一份未入库的启动脚本或 Nginx location。

```bash
cd /root/jerry/FrontendQD
git switch main
git pull --ff-only origin main
npm ci
npm run build
npm run check

ln -sfn /root/jerry/FrontendQD/deploy/acuindex-site.service \
  /etc/systemd/system/acuindex-site.service
systemctl daemon-reload
systemctl enable --now acuindex-site.service
systemctl restart acuindex-site.service
```

可选邮件配置只保存在 `/etc/acuindex-site.env`，权限设为 `0600`：

```text
RESEND_API_KEY=...
BOOKING_TO_EMAIL=team@example.com
BOOKING_FROM_EMAIL=清度科技 <booking@example.com>
SITE_URL=https://eu.jerrypsy.top/acu/index/
```

发布后必须验证：

```bash
systemctl is-active acuindex-site.service
curl -fsSI http://127.0.0.1:4173/
curl -fsSI https://eu.jerrypsy.top/acu/index/
curl -fsSI https://eu.jerrypsy.top/acu/index/styles.css
curl -fsSI https://eu.jerrypsy.top/acu/index/articles/
```

`/index` 与 `/acu/index` 由 Nginx 重定向到 `/acu/index/`。不要把官网文件复制进 New API 的构建目录；New API 只负责链接到这个独立文档入口。

## 可选 Vercel 部署

1. 将项目推送到 Git 仓库；
2. 在 Vercel 创建项目，Framework Preset 选择 `Other`；
3. Build Command：`npm run build`；
4. Output Directory：`public`；
5. 配置下列环境变量；
6. 部署后测试预约表单、两封邮件和 ICS 附件。

## 环境变量

```text
RESEND_API_KEY=...
BOOKING_TO_EMAIL=team@example.com
BOOKING_FROM_EMAIL=清度科技 <booking@your-domain.com>
SITE_URL=https://eu.jerrypsy.top/acu/index/
```

`SITE_URL` 预留用于后续补充会议链接与绝对 URL。当前邮件发送使用 Resend HTTP API，不在前端暴露密钥。

当 `RESEND_API_KEY`、`BOOKING_TO_EMAIL` 或 `BOOKING_FROM_EMAIL` 缺失时，服务端返回 `emailStatus: not_configured`，页面明确显示“邮件未发送”，同时仍可下载 ICS；不会伪装成邮件成功。

## 预约 API 安全与验证

- 服务端必填字段校验；
- 邮箱、日期和时间格式校验；
- Honeypot 反机器人字段；
- IP 十分钟最多五次；
- `Idempotency-Key` + 表单指纹十分钟去重；
- 文本长度限制和 HTML 转义；
- 服务器端生成 ICS；
- 邮件 API key 仅使用环境变量。

生产多实例环境若需要严格持久去重与预约记录，应接入 Vercel KV、Postgres 或 CRM。当前实现不虚构数据库持久化。

## 视觉资产纪律

- `assets/original/` 为从 PPT `ppt/media` 原样提取的文件；
- 球体使用 `image1.png` 的无损矩形裁切 `hero-ball.png`，球体内部、轮廓、密度、黑白关系和阴影未修改；
- 图表与流程图仅做无损裁切，数值、节点、箭头和线条关系未改变；
- 不包含库存图片、紫蓝渐变、霓虹、Three.js 或生成式替代球体；
- 未打包或分发 PingFang SC、DIN Alternate 等字体文件。

## 验证结果

```bash
npm run build   # 通过
npm run check   # 通过
```

截图由 1920×1080 与 390×844 视口生成，位于 `screenshots/`。
