# 材料理解与页面映射

## 1. 文件用途与优先级

1. `清度科技官网(2).pptx`：首页屏幕顺序、构图、主要文案、导航结构和交互要求的最高依据。PPT 共 9 页，其中前 8 页对应首页八屏，第 9 页定义站内外跳转。
2. `清度科技官网(1).pdf`：PPT 的渲染核对版，用于确认每屏比例、留白和资产位置。
3. `public/assets/original/image1.png` 至 `image10.png`：从 PPT 压缩包 `ppt/media` 原样提取的 10 张原始视觉资产，未重绘。
4. 用户上传的 PNG/JPG 原型：用于交叉检查球体、图表、流程图、评价卡片、测算器和最终 CTA 的具体视觉。
5. `2026.6.10ACUindex-20260611135313.pdf`：业务叙事校准，主要用于需求侧 AI 能力定价、产品层、企业调用流程和示例结果。
6. `ACU_Compute_Indices_1_0_上架标的方法论文档(1).md` 与对应 PDF：ACU 指数页的标的定义、状态字段、Official / Nowcast、last_checked / last_updated、Public reference 和 Not for settlement 口径。
7. `AcuIndex_Whitepaper_v0.2.3_Author_Revision.pdf`：ACU、ACU/USD、USD/ACU、Public ACU、Private ACU、Router、Ledger、置信度和数据模式的最终概念依据。

## 2. 首页映射

| 官网屏幕 | PPT 页面 | 使用方式 | 关键资产 |
|---|---:|---|---|
| 1. 品牌首屏 | 1 | 文案与指标用 HTML；右侧球体使用 PPT 原始图的无损裁切 | `assets/figures/hero-ball.png`，来源 `original/image1.png` |
| 2. 生态与适配范围 | 2 | 标题用 HTML；Logo 条使用原始视觉裁切 | `assets/figures/logo-strip.png`，来源 `original/image2.png` |
| 3. AI 产能错配 | 3 | 标题用 HTML；图示主体使用原始视觉无损裁切 | `assets/figures/misallocation-chart.png`，来源 `original/image3.png` |
| 4. 最低成本合格路径 | 4 | 标题用 HTML；曲线和数值使用原始视觉无损裁切 | `assets/figures/frontier-chart.png`，来源 `original/image4.png` |
| 5. 私有产能闭环 | 5 | 标题、副标题用 HTML；流程和曲线使用原始视觉无损裁切 | `assets/figures/capacity-loop.png`，来源 `original/image5.png` |
| 6. 年度节省测算器 | 6 | 依据原型用 HTML/CSS/TypeScript 重建为真实交互，不使用静态截图 | `original/image6.png` 仅作参考 |
| 7. 客户评价 | 7 | 三张卡片直接使用 PPT 原始资产；外层加入拖动、触控与键盘交互 | `original/image7.png`、`image8.png`、`image9.png` |
| 8. 最终转化 | 8 | 用 HTML/CSS 重建，保持极简构图 | `original/image10.png` 仅作参考 |
| 导航与跳转 | 9 | 实现站内与外部链接 | 见下表 |

说明：用户正文中曾把“客户评价”列为第 6 屏、“测算器”列为第 7 屏；但材料优先级明确规定官网 PPT 为最高依据，PPT 第 6 页为测算器、第 7 页为客户评价，因此实现采用 PPT 顺序。

## 3. 资产处理边界

必须作为原始资产使用：

- 首页球体；
- Logo 条；
- AI 产能错配图；
- 成本—质量曲线；
- 私有产能闭环图；
- 三张客户评价卡片。

允许 HTML/CSS/TypeScript 重建：

- 导航栏；
- 首屏标题、副标题、指标和 Demo 状态；
- 节省测算器；
- 最终 CTA；
- ACU 指数页；
- 文章列表和文章详情；
- 预约表单与成功状态。

所有 `assets/figures/*.png` 都只是对 PPT 原始媒体文件的无损矩形裁切，没有重绘、滤镜、增密、改线、改数值或重新生成。原始文件完整保留在 `assets/original/`。

## 4. Demo / 测试数据

以下值来自官网原型，并在页面中明确标注为 Demo，而非实时生产数据：

- 已为开发者节省：`¥8,426,300`；
- 累计节省 Token：`1.28B`；
- 任务效能利用率提升：`29.4%`；
- 测算器默认输入与输出：团队 120 人、人均月支出 ¥2,000、混合结构、约 32% 成本下降。

ACU 指数页不展示任何未经接入的实时数值，全部使用“未接入”“Public reference”“Demo methodology”“Not for settlement”等明确状态。

## 5. 外部链接放置

| 入口 | 地址 | 页面位置 |
|---|---|---|
| 成本优化器 | `https://eu.jerrypsy.top/acu-router/` | 主导航“成本优化器” |
| 控制台 | `https://eu.jerrypsy.top:8443/dashboard/overview` | 主导航“控制台” |
| API / 价格 | `https://eu.jerrypsy.top:8443/pricing` | 页脚与 ACU 指数页 CTA |
