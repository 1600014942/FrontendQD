"use strict";
const deploymentBase = () => {
    const pathname = window.location.pathname;
    return pathname === '/acu/index' || pathname.startsWith('/acu/index/') ? '/acu/index' : '';
};
const deploymentPath = () => {
    const base = deploymentBase();
    const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
    return base && pathname.startsWith(base) ? (pathname.slice(base.length) || '/') : pathname;
};
function prefixLocalUrls(root) {
    const base = deploymentBase();
    if (!base)
        return;
    root.querySelectorAll('[href], [src]').forEach((element) => {
        for (const attr of ['href', 'src']) {
            const value = element.getAttribute(attr);
            if (value?.startsWith('/') && !value.startsWith('//') && !value.startsWith(base))
                element.setAttribute(attr, `${base}${value}`);
        }
    });
}
const articles = [
    {
        slug: 'token-is-not-capacity', title: '为什么 Token 不是 AI 产能', category: '基础概念', date: '2026.08.07',
        summary: 'Token 能描述模型处理了多少文本，却不能说明企业得到多少可验证工作产出。',
        dek: '当模型成为生产基础设施，计费单位与产出单位之间的差异开始决定真实成本。',
        sections: [
            { id: 'billing', title: '计费单位不等于产出单位', paragraphs: [
                    'Token 是输入与输出序列的计量方式，也是 API 账单的重要基础。但一百万 Token 在不同模型、不同运行时和不同任务上，不代表相同数量的有效工作。它可能对应一次成功的代码修复，也可能对应多轮失败、重试和人工复核。',
                    '企业真正购买的是在成本、时延、可靠性、合规和风险约束下完成任务的概率。只比较 Token 单价，会忽略失败成本、验证成本、工具调用和回退路径。'
                ], quote: '价格可以按 Token 报出，产能必须按任务结果验证。' },
            { id: 'verified-output', title: '从文本数量转向可验证输出', paragraphs: [
                    'ACU 将计量边界放在任务族内部。对于代码修复，一次通过验证的仓库问题修复可以形成一单位 CodeFix-ACU；对于客观推理，一次被验证为正确的题目完成可以形成 Reasoning-ACU。不同任务族不被强行压缩成一个通用智能分数。',
                    '这种任务原生的做法保留了验证器、运行时、成本模式和置信度，使同一类任务中的模型选择可以被复算、比较和审计。'
                ] },
            { id: 'procurement', title: '采购口径需要改变', paragraphs: [
                    '当企业以 ACU/USD 观察每一美元得到的有效产能，以 USD/ACU 观察完成一单位有效任务的完整成本，模型采购就从品牌偏好转向任务级经济决策。',
                    '这并不否定 Token 价格。Token 仍是成本输入，只是不再被误当作最终产出。'
                ] }
        ]
    },
    {
        slug: 'acu-per-dollar', title: '每一美元究竟买到了多少 AI 能力', category: '方法论', date: '2026.08.05',
        summary: 'ACU/USD 与 USD/ACU 把模型能力、任务成功和完整成本放进同一经济口径。',
        dek: '低价模型不一定便宜，高分模型也不一定高效。关键是单位成本下得到多少合格产出。',
        sections: [
            { id: 'two-quotes', title: '两种互为倒数的报价', paragraphs: [
                    'ACU/USD 表示每一美元获得多少有效 AI 产能，数值越高，单位预算的产出越多。USD/ACU 表示获得一单位有效产能需要多少完整成本，数值越低，完成任务越经济。',
                    '两者必须建立在同一任务族、同一验证标准和明确成本边界之上。若任务定义、运行时或验证器不同，报价不可直接横向比较。'
                ] },
            { id: 'full-cost', title: '完整成本不止输入输出 Token', paragraphs: [
                    '任务成本应包含输入、输出、推理、工具、重试、验证和必要的系统开销。便宜模型若产生更多失败与回退，最终 USD/ACU 可能高于表面更贵的模型。',
                    '反过来，强模型在大量简单任务上可能提供极小的质量增量，却带来显著的成本上升。有效前沿的价值，就是识别这些非必要投入。'
                ] },
            { id: 'decision', title: '从排行榜转向预算决策', paragraphs: [
                    '企业不需要为所有任务寻找同一个“最好模型”。它需要在质量门槛、预算、时延和风险约束下，为每一类任务选择最合适的模型—运行时系统，并配置校验与回退。',
                    '因此，单位美元产能不是另一个排行榜，而是采购、路由和成本治理的共同语言。'
                ] }
        ]
    },
    {
        slug: 'demand-side-ai-infra', title: 'AI Infra 的需求侧正在出现', category: '行业观察', date: '2026.08.03',
        summary: '算力、模型和 Token 定价主要描述供给；企业最终需要的是对有效产出的需求侧度量。',
        dek: 'AI 基础设施正在从“能提供什么”走向“同等预算能完成多少合格任务”。',
        sections: [
            { id: 'supply', title: '供给侧价格已经很丰富', paragraphs: [
                    'GPU 租赁价格、模型 API 单价、订阅费用和推理吞吐都在快速透明化。这些数据回答算力和模型访问权如何定价，却没有直接回答业务任务的完成成本。',
                    '相同的供给资源，经过不同任务拆分、上下文策略、工具链、验证器和回退政策，会形成完全不同的有效产能。'
                ] },
            { id: 'demand', title: '需求侧关心合格任务', paragraphs: [
                    '代码团队关心修复通过率，文档团队关心字段准确率，客服系统关心接受率和风险，智能体工作流关心端到端成功率。需求侧的共同问题是：在质量达标前提下，同样预算能完成多少任务。',
                    '这要求基础设施不仅观测模型价格，还要把任务、结果、成本和验证连接起来。'
                ] },
            { id: 'layer', title: '产能配置层的出现', paragraphs: [
                    '产能配置层位于应用与模型供应之间：识别任务，读取公开先验与客户私有证据，选择路径，执行验证，并把结果写入账本。',
                    '它不替代模型供应商，也不只是一层 API 聚合，而是把资源选择转化为可测量的经济优化。'
                ] }
        ]
    },
    {
        slug: 'dynamic-capacity-routing', title: '从固定模型调用到动态产能配置', category: '路由系统', date: '2026.08.01',
        summary: '真正的动态路由不是随机分流，而是在任务和约束下选择可验证路径。',
        dek: '模型选择从静态规则变成包含识别、预测、执行、验证和回退的闭环。',
        sections: [
            { id: 'fixed', title: '固定调用为何普遍存在', paragraphs: [
                    '固定使用一个强模型，实施简单、责任边界清楚，也能减少早期系统复杂度。但当调用规模上升，任务差异和价格差异会被放大，固定策略逐渐形成结构性浪费。',
                    '另一种常见做法是人工维护静态规则。它可以覆盖明显场景，却难以适应模型版本、价格、客户任务和验收标准的持续变化。'
                ] },
            { id: 'route', title: '路由是约束优化问题', paragraphs: [
                    '候选路径首先要满足模型许可、数据政策、预算、时延和最低置信度；随后再比较预期有效产能、成本、风险和可靠性。',
                    '对于需要回退的任务，系统应计算整条路径的预期成本和成功概率，而不是只比较第一跳单价。'
                ] },
            { id: 'loop', title: '没有验证，就没有可学习路由', paragraphs: [
                    '路由器只有在结果被验证、失败原因被记录、人工验收被回写时，才能形成客户专属后验。否则系统只是在重复公开排行榜。',
                    '动态产能配置的核心资产，是任务级执行轨迹与不断收敛的私有产能曲线。'
                ] }
        ]
    },
    {
        slug: 'benchmark-and-enterprise-capacity', title: '为什么 Benchmark 不能直接代表企业产能', category: '评测', date: '2026.07.29',
        summary: '公开 Benchmark 提供可比较证据，但任务迁移、运行时和成本边界决定其生产解释力。',
        dek: 'Benchmark 是重要先验，不是对企业工作负载的直接承诺。',
        sections: [
            { id: 'evidence', title: 'Benchmark 是证据，不是答案', paragraphs: [
                    '公开评测提供统一任务集和可追溯结果，是构建公共参考不可缺少的基础。但每个评测只覆盖特定分布、验证方式和运行设置。',
                    '同一模型在公开任务上的排序，可能因客户数据、提示结构、工具权限和风险要求而改变。'
                ] },
            { id: 'runtime', title: '模型与运行时必须共同识别', paragraphs: [
                    '代码修复结果通常由基础模型、Agent scaffold、搜索策略、工具调用和补丁流程共同产生。把这类结果归因于“裸模型”，会造成错误比较。',
                    'ACU Quote 因此保留模型—运行时身份、成本模式、验证器和置信度，而不是只摘取一个分数。'
                ] },
            { id: 'posterior', title: '公开先验需要私有后验', paragraphs: [
                    'Public ACU 回答公开证据建议什么；Private ACU 回答在某个客户工作负载上什么真正有效。随着真实任务样本累积，客户专属后验应逐渐降低对公共先验的依赖。',
                    '这也是企业产能配置能够持续改善，而不是一次性咨询报告的原因。'
                ] }
        ]
    },
    {
        slug: 'public-and-private-acu', title: 'Public ACU 与 Private ACU', category: '协议边界', date: '2026.07.26',
        summary: '公共参考要可复算，私有后验要贴近客户；两者必须明确隔离。',
        dek: 'Public ACU 是市场先验，Private ACU 是客户工作负载上的后验。',
        sections: [
            { id: 'public', title: 'Public ACU：公开市场参考', paragraphs: [
                    'Public ACU 来自公开 Benchmark、公开价格、模型元数据和披露的方法论。它需要标注数据模式、来源、更新时间、检查时间和置信度。',
                    '它适合用于模型初筛、市场观察和第一版路由先验，但不应被表述为正式金融结算指数或客户生产效果保证。'
                ] },
            { id: 'private', title: 'Private ACU：客户专属后验', paragraphs: [
                    'Private ACU 来自客户真实任务、验收标准、生产尝试、回退路径和人工反馈。它能够描述每类任务在特定模型—运行时系统上的真实成功率与完整成本。',
                    'Private ACU 不应未经许可进入公共指数。客户数据需要经过授权、匿名化、聚合和治理审查。'
                ] },
            { id: 'boundary', title: '边界本身就是产品纪律', paragraphs: [
                    '公共层越透明，越能建立方法论信任；私有层越严格，越能保护客户数据和商业壁垒。',
                    '一个可靠的产能系统必须同时做到可复算与可隔离，而不是在“开放”与“保密”之间含混处理。'
                ] }
        ]
    },
    {
        slug: 'efficient-frontier', title: '模型能力、成本与质量之间的有效前沿', category: '经济学', date: '2026.07.23',
        summary: '不是所有更贵的路径都带来有意义的质量提升；有效前沿用于识别非支配选择。',
        dek: '在给定任务族中，用更低成本保住合格结果。',
        sections: [
            { id: 'frontier', title: '什么是有效前沿', paragraphs: [
                    '如果不存在另一条路径能够同时提供不低于当前的质量、不高于当前的成本，并保持不低于当前的置信度，那么这条路径位于有效前沿。',
                    '前沿之外的路径被其他方案支配：企业为同等或更差结果支付了更多成本。'
                ] },
            { id: 'qualified', title: '目标不是无限追求最高分', paragraphs: [
                    '生产系统通常存在合格阈值。达到阈值后，额外质量增量的边际价值可能迅速下降，而成本仍持续上升。',
                    '清度路线的目标是在结果达到要求时停止过度投入，并把强模型保留给真正需要的任务、校验或回退。'
                ] },
            { id: 'constraints', title: '成本之外还有时延与风险', paragraphs: [
                    '有效前沿不能只看 API 费用。低成本路径若带来超时、格式错误、合规风险或大量人工复核，也可能不是有效选择。',
                    '因此，前沿应建立在任务、验证器、运行时和客户约束共同定义的报价空间中。'
                ] }
        ]
    },
    {
        slug: 'private-capacity-ledger', title: '每一次调用如何形成企业私有产能账本', category: '数据闭环', date: '2026.07.20',
        summary: '把任务、路径、成本、结果和验收写入同一账本，路由才会随真实执行改善。',
        dek: '执行数据不是日志尾气，而是下一次资源配置的训练证据。',
        sections: [
            { id: 'record', title: '账本记录什么', paragraphs: [
                    '每次调用至少应记录任务族、难度、风险、模型—运行时、输入输出成本、工具与重试成本、质量评分、验证结果、失败原因、回退路径、时延和人工验收。',
                    '这些字段共同形成实际 USD/ACU 与 ACU/USD。只有完整成本和真实结果同时存在，记录才具有产能含义。'
                ] },
            { id: 'learning', title: '从记录到后验更新', paragraphs: [
                    '新客户可以从 Public ACU 先验开始。随着成功和失败样本累积，系统逐步更新不同任务族与路径的私有成功概率、成本和可靠性。',
                    '任务分布发生变化时，账本也能揭示公共 Benchmark 与客户工作负载之间的迁移差距。'
                ] },
            { id: 'defensibility', title: '真正难复制的是执行轨迹', paragraphs: [
                    '公开方法论可以被阅读和复现，但客户任务分布、回退结果、验证反馈和长期产能曲线不会自然出现在公开数据中。',
                    '私有账本使路由策略从通用建议变成客户专属基础设施。'
                ] }
        ]
    },
    {
        slug: 'strongest-is-not-best-value', title: '为什么最强模型不等于最高性价比', category: '模型选择', date: '2026.07.17',
        summary: '总榜领先描述能力上界，不代表每一个任务上的单位美元产能最优。',
        dek: '模型选择应由任务和约束决定，而不是由单一品牌或排行榜决定。',
        sections: [
            { id: 'underspecified', title: '“最强”通常没有说明任务', paragraphs: [
                    '一个模型可能擅长复杂推理，却在分类、抽取或短文本改写上没有足以抵消价格差的优势。另一个模型可能适合作为低成本第一跳，却不适合高风险最终输出。',
                    '脱离任务族、运行时、验证器和风险等级讨论“最好模型”，在生产决策中信息不足。'
                ] },
            { id: 'fixed', title: '固定强模型是一种组织默认', paragraphs: [
                    '大量团队并没有真正的任务级动态路由。为了降低系统复杂度和责任风险，它们会把多数请求固定交给熟悉的强模型。',
                    '这种做法在规模较小时合理，但随着请求数量增长，会把小幅质量冗余转化为持续成本。'
                ] },
            { id: 'allocation', title: '正确问题是如何配置', paragraphs: [
                    '简单任务可以使用高性价比路径，中等任务可以先执行再校验，高风险任务可以直接使用强模型或双模型验证，失败任务进入明确回退。',
                    '性价比不是一味选择便宜模型，而是在质量不牺牲的条件下，把预算放在真正产生边际价值的位置。'
                ] }
        ]
    },
    {
        slug: 'fine-grained-compute-allocation', title: '计算资源如何从粗放消费走向精细调度', category: '基础设施', date: '2026.07.14',
        summary: '从统一模型、统一预算和统一规则，转向任务级定价、配置、验证与复盘。',
        dek: 'AI 成本治理的下一步，不是更便宜的 Token，而是更精确的产能配置。',
        sections: [
            { id: 'coarse', title: '粗放消费的三个特征', paragraphs: [
                    '第一，预算以 API 总账单管理，无法追踪到任务产出；第二，模型选择按团队或产品统一配置；第三，失败、重试和人工复核没有进入完整成本。',
                    '在这种结构下，采购部门看到价格，研发团队看到调用，业务部门看到结果，但三者没有共同的计量对象。'
                ] },
            { id: 'fine', title: '精细调度需要统一对象', paragraphs: [
                    '任务原生 ACU 把请求、验证结果和成本连接起来。公开指数提供市场先验，私有账本提供客户后验，路由器在约束下把两者转化为具体路径。',
                    '每次调用都产生新的产能证据，使配置策略可以被测量、解释和逐步校准。'
                ] },
            { id: 'transition', title: '这是一种渐进式迁移', paragraphs: [
                    '企业不必一次替换全部模型调用。可以先从可验证、重复量大、成本敏感的任务开始，保留强模型作为回退，并逐步扩大覆盖。',
                    '精细调度的目标不是追求复杂系统，而是让每一层复杂度都对应可验证的成本收益。'
                ] }
        ]
    }
];
const instrumentGroups = [
    {
        title: 'External Compute Indices', subtitle: '公开算力价格参考', items: [
            ['H100-SPOT', '追踪公开市场 H100 GPU 按小时租赁价格，统一折算为 USD / GPU-hour。', 'Public reference', '未接入'],
            ['H200-SPOT', '追踪公开市场 H200 GPU 按小时租赁价格，统一折算为 USD / GPU-hour。', 'Public reference', '未接入'],
            ['GPU-BASKET', 'H100、H200、A100 与 B200 的加权公开租赁价格篮子。', 'Demo methodology', '未接入'],
            ['H200/H100-PREMIUM', '由 H200-SPOT 与 H100-SPOT 派生的相对价格溢价。', 'Derived', '未接入']
        ]
    },
    {
        title: 'ACU Dashboard', subtitle: '任务原生能力与生产率参考', items: [
            ['ACU-CodeFix', '标准化代码修复任务中的综合解决能力；不包含 Token 便宜程度。', 'Demo methodology', '未接入'],
            ['ACU-Coding/USD', '每 1 美元能够购买到多少标准化代码修复能力。', 'Demo methodology', '未接入'],
            ['ACU-Reasoning', '数学、科学与动态客观推理任务的能力参考，Official 与 Nowcast 分离。', 'Demo methodology', '未接入'],
            ['ACU-CPI', 'ACU-CodeFix、ACU-Reasoning 与 ACU-Coding/USD 的加权几何综合。', 'Official + Nowcast', '未接入']
        ]
    }
];
function headerHtml(path) {
    const current = (prefix) => path.startsWith(prefix) ? ' aria-current="page"' : '';
    return `
  <header class="site-header">
    <div class="header-inner">
      <a class="brand-lockup" href="/" aria-label="清度科技首页"><span class="brand-box">ACUindex</span><span>清度</span></a>
      <button class="mobile-toggle" aria-expanded="false" aria-label="打开导航菜单"><span></span><span></span></button>
      <nav class="main-nav" aria-label="主导航">
        <a href="/acu-index/"${current('/acu-index')}>ACU 指数</a>
        <a href="https://eu.jerrypsy.top/acu-router/" target="_blank" rel="noreferrer">成本优化器</a>
        <a href="https://eu.jerrypsy.top:8443/dashboard/overview" target="_blank" rel="noreferrer">控制台</a>
        <a href="/articles/"${current('/articles')}>文章</a>
        <a class="contact-button" href="/book-demo/"${current('/book-demo')}>联系我们</a>
      </nav>
    </div>
  </header>`;
}
function footerHtml() {
    return `<footer class="site-footer"><div class="footer-inner"><span>© ${new Date().getFullYear()} 清度科技 / ACUindex</span><div class="footer-links"><a href="/acu-index/">方法论</a><a href="/articles/">文章</a><a href="https://eu.jerrypsy.top:8443/pricing" target="_blank" rel="noreferrer">API / 价格</a><a href="/book-demo/">预约演示</a></div></div></footer>`;
}
function diagramFrame(svg, alt) {
    return `<div class="reveal diagram-figure" role="img" aria-label="${alt}">${svg}</div>`;
}
function misallocationSvg() {
    return `<svg class="diagram-svg misallocation-svg" viewBox="0 0 1440 720" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><marker id="arrow-mis" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>
    <g class="diagram-labels">
      <text x="110" y="112">摘要总结</text><rect x="225" y="101" width="10" height="10" transform="rotate(45 230 106)"/>
      <text x="110" y="205">分类任务</text><rect x="225" y="194" width="10" height="10" transform="rotate(45 230 199)"/>
      <text x="110" y="298">文档提取</text><rect x="225" y="287" width="10" height="10" transform="rotate(45 230 292)"/>
      <text x="110" y="391">代码编辑</text><rect x="225" y="380" width="10" height="10" transform="rotate(45 230 385)"/>
      <text x="110" y="484">推理任务</text><rect x="225" y="473" width="10" height="10" transform="rotate(45 230 478)"/>
      <text x="110" y="577">高风险任务</text><rect x="225" y="566" width="10" height="10" transform="rotate(45 230 571)"/>
    </g>
    <g class="diagram-lines" fill="none" stroke="currentColor" stroke-width="1.55" marker-end="url(#arrow-mis)">
      <path class="route-path" d="M250 106 C520 106 760 55 1000 106"/>
      <path class="route-path" d="M250 199 C545 199 770 112 1000 106"/>
      <path class="route-path" d="M250 292 C555 292 790 155 1000 106"/>
      <path class="route-path" d="M250 385 C570 385 810 205 1000 106"/>
      <path class="route-path" d="M250 478 C610 478 835 260 1000 106"/>
      <path class="route-path" d="M250 478 C600 478 815 350 1000 292"/>
      <path class="route-path" d="M250 571 C620 571 830 488 1000 455"/>
    </g>
    <g class="tier-axis" stroke="currentColor" fill="currentColor">
      <line x1="1024" y1="106" x2="1024" y2="600" stroke-width="1.15"/>
      <circle cx="1024" cy="106" r="10"/><circle cx="1024" cy="292" r="10"/><circle cx="1024" cy="455" r="10"/><circle cx="1024" cy="600" r="10"/>
      <text x="1065" y="114" stroke="none">最强模型</text><text x="1065" y="300" stroke="none">推理模型</text><text x="1065" y="463" stroke="none">均衡模型</text><text x="1065" y="608" stroke="none">快速模型</text>
      <line x1="1290" y1="600" x2="1290" y2="72" stroke-width="1.15"/><path d="M1290 54 l-7 18 h14z"/>
      <text x="1290" y="34" text-anchor="middle" stroke="none" class="axis-title">成本</text>
    </g>
    <text x="110" y="665" class="axis-footer">任务类型</text><text x="1024" y="665" class="axis-footer" text-anchor="middle">模型层级</text>
    <text x="720" y="700" class="diagram-footnote" text-anchor="middle">大多数工作负载仍在使用固定模型。</text>
  </svg>`;
}
function frontierSvg() {
    return `<svg class="diagram-svg frontier-svg" viewBox="0 0 1440 760" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><marker id="arrow-frontier" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>
    <g fill="none" stroke="currentColor" stroke-width="1.5">
      <line x1="100" y1="650" x2="100" y2="95" marker-end="url(#arrow-frontier)"/>
      <line x1="100" y1="650" x2="1340" y2="650" marker-end="url(#arrow-frontier)"/>
      <line x1="100" y1="170" x2="676" y2="170" stroke-dasharray="7 7" opacity=".8"/>
      <path class="frontier-curve route-path" d="M100 650 C250 375 420 220 610 180 C640 173 662 170 690 170"/>
      <line x1="690" y1="170" x2="1240" y2="170"/>
    </g>
    <g class="frontier-points" fill="none" stroke="currentColor" stroke-width="1.4">
      <circle cx="690" cy="170" r="9" fill="currentColor"/><circle cx="1130" cy="170" r="9" fill="var(--paper)"/>
      <circle cx="190" cy="585" r="8"/><circle cx="310" cy="548" r="8"/><circle cx="465" cy="505" r="8"/><circle cx="610" cy="470" r="8"/><circle cx="860" cy="520" r="8"/><circle cx="1000" cy="445" r="8"/>
      <path d="M260 550 h16 M268 542 v16 M410 470 h16 M418 462 v16 M545 530 h16 M553 522 v16 M815 440 h16 M823 432 v16 M960 515 h16 M968 507 v16"/>
    </g>
    <g class="diagram-labels">
      <text x="690" y="125" text-anchor="middle">清度路线</text><text x="690" y="226" text-anchor="middle" class="small-note">1.0× 成本</text>
      <text x="1130" y="125" text-anchor="middle">最强模型</text><text x="1130" y="226" text-anchor="middle" class="small-note">3.2× 成本</text>
      <text x="1258" y="177">合格输出</text>
      <text x="48" y="390" transform="rotate(-90 48 390)" class="axis-title">质量</text>
      <text x="1260" y="704" class="axis-title">成本</text><text x="1260" y="730" class="axis-sub">每个合格任务的成本</text>
    </g>
    <text x="720" y="748" text-anchor="middle" class="diagram-footnote">保证质量，追求 Token 调度的性价比。</text>
  </svg>`;
}
function capacityLoopSvg() {
    const node = (x, w, label, dark = false) => `<rect x="${x}" y="145" width="${w}" height="58" rx="10" class="${dark ? 'node-dark' : 'node-light'}"/><text x="${x + w / 2}" y="181" text-anchor="middle" class="${dark ? 'node-text-dark' : 'node-text'}">${label}</text>`;
    return `<svg class="diagram-svg loop-svg" viewBox="0 0 1440 720" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><marker id="arrow-loop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>
    <g transform="translate(75 0)">${node(55, 130, '任务识别')}${node(260, 130, '任务画像')}${node(465, 150, '清度路由器', true)}${node(700, 130, '执行调用')}${node(900, 130, '质量验证')}${node(1105, 130, '能力账本')}</g>
    <g transform="translate(75 0)" fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#arrow-loop)">
      <line x1="185" y1="174" x2="245" y2="174"/><line x1="390" y1="174" x2="450" y2="174"/><line x1="615" y1="174" x2="685" y2="174"/><line x1="830" y1="174" x2="885" y2="174"/><line x1="1030" y1="174" x2="1090" y2="174"/>
      <path class="route-path" d="M1170 214 C1170 380 1030 518 750 555 C485 590 255 535 220 415 C205 365 260 330 365 318 C430 310 505 288 525 220"/>
    </g>
    <g transform="translate(75 0)" fill="currentColor">
      <circle cx="220" cy="415" r="6"/><circle cx="390" cy="541" r="6"/><circle cx="620" cy="560" r="6"/><circle cx="855" cy="535" r="6"/><circle cx="1045" cy="455" r="6"/>
    </g>
    <g class="diagram-labels">
      <g transform="translate(75 0)">
      <text x="220" y="448" text-anchor="middle">成本</text><text x="390" y="578" text-anchor="middle">质量</text><text x="620" y="596" text-anchor="middle">回退方案</text><text x="855" y="569" text-anchor="middle">接受率</text><text x="1045" y="489" text-anchor="middle">延迟</text>
      </g>
      <text x="720" y="405" text-anchor="middle" class="loop-title">私有产能曲线</text>
    </g>
  </svg>`;
}
function homeHtml() {
    return `
  <main id="main">
    <section class="screen hero" id="home"><div class="screen-inner hero-grid">
      <div class="hero-copy">
        <h1 class="hero-title"><span>释放每一滴</span><span class="token-line"><span class="latin">Token</span>的最大产能</span></h1>
        <p class="hero-deck">AI 产能配置引擎，帮助用户在同样预算下，完成更多高质量任务</p>
        <div class="hero-data">
          <div class="metric-grid">
            <div class="metric"><div class="metric-label">已为开发者节省</div><div class="metric-value" id="live-savings">¥ 84,279.01</div></div>
            <div class="metric"><div class="metric-label">累计节省 <span class="latin">Token</span></div><div class="metric-value" id="live-tokens">1.2800B</div></div>
            <div class="metric"><div class="metric-label"><span class="latin">Token</span>利用率提升</div><div class="metric-value" id="live-efficiency">29.4%</div></div>
            <div class="metric"><div class="metric-label">任务级稳定性</div><div class="metric-value">99.99%</div></div>
          </div>
          <div class="hero-live-note"><span class="hero-live-dot" aria-hidden="true"></span><span>实时更新</span></div>
        </div>
      </div>
      <div class="hero-visual" aria-label="清度原始流线场球体主视觉">
        <img class="hero-source" src="/assets/figures/hero-ball-transparent.png" alt="由细密流线构成的黑白球体，清度科技原始主视觉">
        <canvas class="hero-particles" aria-hidden="true"></canvas>
      </div>
    </div></section>

    <section class="screen ecosystem"><div class="screen-inner"><div class="reveal">
      <div class="logo-strip-frame" tabindex="0" aria-label="支持接入的平台、模型与开发工具 Logo"><img class="logo-strip" src="/assets/figures/logo-strip.png" alt="为一线开发者：清度支持接入的平台、模型与开发工具"></div>
    </div></div></section>

    <section class="screen diagram-screen misallocation"><div class="screen-inner">
      <div class="reveal diagram-heading"><div class="section-kicker">1. AI 产能的错配</div><h2 class="section-title">加速从固定模型调用，到精细化配置 Token 的 AI 使用范式跃迁。</h2></div>
      ${diagramFrame(misallocationSvg(), '不同任务类型被集中导向最强模型，右侧成本向上，体现固定强模型造成的产能错配。')}
    </div></section>

    <section class="screen diagram-screen frontier"><div class="screen-inner">
      <div class="reveal diagram-heading"><div class="section-kicker">2. 找到最低成本的合格路径</div><h2 class="section-title">同样的任务，以更低的成本完成。</h2></div>
      ${diagramFrame(frontierSvg(), '成本质量有效前沿：在合格输出标准下，清度路线以 1.0× 成本达到目标，最强模型对应 3.2× 成本。')}
    </div></section>

    <section class="screen diagram-screen loop"><div class="screen-inner">
      <div class="reveal diagram-heading"><div class="section-kicker">3. 构建私有产能闭环</div><h2 class="section-title">每一次调用，都让下一次路由更智能。</h2><p class="section-subtitle">清度将真实执行转化为私有产能账本，使未来的资源分配更加精准。</p></div>
      ${diagramFrame(capacityLoopSvg(), '任务识别、任务画像、清度路由器、执行调用、质量验证、能力账本构成的私有产能闭环。')}
      <p class="loop-diagram-caption">执行数据沉淀为更优的资源分配。</p>
    </div></section>

    <section class="screen calculator-section"><div class="screen-inner">
      <div class="calculator-title-row reveal"><div><div class="section-kicker calculator-kicker">SAVINGS ESTIMATOR</div><h2 class="section-title">一年能省多少钱？</h2></div><p>输入团队规模与当前 AI 支出，按等效质量口径估算可优化空间。</p></div>
      <div class="reveal calculator-shell">
        <div class="calculator-controls">
          <div class="control-row"><label class="control-label" for="team-range">团队规模</label><div class="range-wrap"><output class="range-value" id="team-output" for="team-range">120</output><input id="team-range" type="range" min="5" max="500" step="5" value="120"></div></div>
          <div class="control-row"><label class="control-label" for="spend-range">人均月度 AI 支出</label><div class="range-wrap"><output class="range-value" id="spend-output" for="spend-range">¥2,000</output><input id="spend-range" type="range" min="100" max="10000" step="100" value="2000"></div></div>
          <div class="control-row"><div class="control-label">月度用量增速</div><div class="segmented" data-segment="growth"><button type="button" data-value="low" aria-pressed="false">低</button><button type="button" data-value="medium" aria-pressed="true">中</button><button type="button" data-value="high" aria-pressed="false">高</button></div></div>
          <div class="control-row"><div class="control-label">当前使用结构</div><div class="segmented" data-segment="structure"><button type="button" data-value="claude" aria-pressed="false">Claude</button><button type="button" data-value="openai" aria-pressed="false">OpenAI</button><button type="button" data-value="mixed" aria-pressed="true">混合</button></div></div>
          <p class="calculator-disclaimer"><span aria-hidden="true">ⓘ</span> 结果基于等效质量建模，仅作测算参考。</p>
        </div>
        <div class="savings-panel" aria-live="polite">
          <div class="savings-eyebrow">SAVINGS PROJECTION</div>
          <div class="savings-row"><span>当前年度支出</span><strong id="current-spend">¥2.88M / 年</strong></div>
          <div class="savings-row"><span>接入清度后</span><strong id="after-spend">¥1.96M / 年</strong></div>
          <div class="savings-rule"></div><div class="savings-main-label">预计年度节省</div>
          <div class="savings-main"><div class="savings-amount" id="savings-amount">¥922K</div><div class="savings-badge" id="savings-badge">约 32% 成本下降</div></div>
          <div class="savings-caption">在保持同等任务质量与验收标准下</div><div class="savings-rate" id="savings-rate">预计单位任务成本下降 31%</div>
          <a class="button button-light" href="/book-demo/">预约专属测算</a>
        </div>
      </div>
    </div></section>

    <section class="screen testimonials"><div class="screen-inner">
      <div class="testimonials-head"><div><div class="section-kicker testimonials-kicker">PRIVATE CAPACITY IN PRACTICE</div><h2 class="testimonials-title">来自真实使用场景的反馈</h2></div></div>
      <div class="testimonial-viewport" tabindex="0" role="region" aria-label="客户评价卡片，可横向滚动"><div class="testimonial-track">
        <article class="testimonial-card"><blockquote>接入清度后，我们第一次知道，每一美元究竟买到了多少真正可用的 AI 产能。</blockquote><footer><span class="testimonial-avatar avatar-one" role="img" aria-label="客户头像"></span><span class="testimonial-person"><strong>某伦敦对冲基金</strong><span>量化工程负责人</span></span></footer></article>
        <article class="testimonial-card"><blockquote>清度把模型选择从一套静态规则，变成了能够根据真实任务结果持续学习的产能配置系统。</blockquote><footer><span class="testimonial-avatar avatar-two" role="img" aria-label="客户头像"></span><span class="testimonial-person"><strong>某 AIGC 厂牌</strong><span>视频负责人</span></span></footer></article>
        <article class="testimonial-card"><blockquote>清度帮助我们在不牺牲交付质量的情况下，把更多请求从昂贵模型迁移到更合适的路径。</blockquote><footer><span class="testimonial-avatar avatar-three" role="img" aria-label="客户头像"></span><span class="testimonial-person"><strong>某具身智能公司</strong><span>创始人</span></span></footer></article>
      </div></div>
    </div></section>

    <section class="screen final-cta"><div class="screen-inner"><div class="reveal"><h2 class="final-title">同等质量下，让每一块 AI 预算完成更多任务</h2><p class="final-subtitle">用 AI 产能配置，开始真正省下 AI 成本</p><a class="button button-dark" href="/book-demo/">预约演示</a></div></div></section>

    <footer class="site-ending" aria-label="清度科技网站结尾"><div class="ending-inner">
      <div class="ending-main">
        <div class="ending-brand-block"><a class="ending-brand" href="/"><span class="ending-brand-acu">ACUindex</span><span class="ending-brand-cn">清度</span></a><p>AI 产能配置基础设施</p></div>
        <nav class="ending-grid" aria-label="页脚导航">
          <div><span class="ending-label">产品</span><a href="/acu-index/">ACU 指数</a><a href="https://eu.jerrypsy.top/acu-router/" target="_blank" rel="noreferrer">成本优化器</a><a href="https://eu.jerrypsy.top:8443/dashboard/overview" target="_blank" rel="noreferrer">控制台</a><a href="https://eu.jerrypsy.top:8443/pricing" target="_blank" rel="noreferrer">API / 价格</a></div>
          <div><span class="ending-label">研究</span><a href="/articles/">文章</a><a href="/acu-index/">ACU 方法论</a></div>
          <div><span class="ending-label">公司</span><a href="/book-demo/">联系我们</a><a href="/book-demo/">预约演示</a></div>
        </nav>
      </div>
    </div></footer>
  </main>`;
}
function acuIndexHtml() {
    const defs = [
        ['ACU', '任务族原生的 AI 产能计量单位。基础实现中，一次被验证的任务完成等于一单位对应任务族 ACU。'],
        ['ACU / USD', '每 1 美元获得多少有效 AI 产能；用于比较单位预算的生产率。'],
        ['USD / ACU', '获得 1 单位有效 AI 产能所需的完整成本；包含重试、验证和必要开销。'],
        ['Public ACU', '由公开 Benchmark、公开价格和公开模型运行信息形成的市场参考先验。'],
        ['Private ACU', '由客户真实任务、验收标准、执行反馈和生产账本形成的客户专属后验。'],
        ['Router', '在质量、成本、时延、风险、可靠性和客户约束下选择路径，并管理校验与 Fallback。']
    ];
    const groups = instrumentGroups.map(group => `<div class="index-group"><div class="index-group-head"><h2>${group.title}</h2><span>${group.subtitle}</span></div><div class="instrument-list">${group.items.map(item => `<div class="instrument-row"><div class="instrument-symbol">${item[0]}</div><div class="instrument-desc">${item[1]}</div><span class="state-tag ${item[2].includes('reference') ? 'reference' : ''}">${item[2]}</span><span class="instrument-time">Last checked: ${item[3]}</span></div>`).join('')}</div></div>`).join('');
    return `<main id="main" class="page-main">
    <section class="page-hero"><div class="page-wrap"><div class="page-eyebrow">ACU Index / Public Reference</div><h1 class="page-title">为 AI 产能建立<br>可比较的计量口径</h1><p class="page-intro">ACU 是任务族原生的 AI 产能单位，不是通用智能分数，也不是 Token 单价。当前页面为 Demo-stage methodology 与产品入口，不提供结算指数。</p></div></section>
    <section class="content-section"><div class="page-wrap split-grid"><div class="content-label">UNIT &amp; BOUNDARY</div><div class="content-body"><h2>先定义任务、验证与成本边界，再讨论指数。</h2><p>ACU 把公开 Benchmark 结果翻译为任务族报价，同时保留模型—运行时身份、验证器类型、成本模式、置信度与数据模式。缺失值保持缺失，不被当作 0。</p><div class="definition-grid">${defs.map(d => `<div class="definition"><div class="definition-symbol">${d[0]}</div><p>${d[1]}</p></div>`).join('')}</div></div></div></section>
    <section class="content-section"><div class="page-wrap"><div class="page-eyebrow">INSTRUMENTS / STATUS</div>${groups}<div class="disclosure-box"><strong>方法论披露：</strong> 当前全部指数入口均按 Public reference / Demo-stage methodology 展示。未接入真实数据的字段不显示伪造数值；Official 与 Nowcast 将保持分离；模拟历史不得进入正式值；本页面 Not for settlement。</div></div></section>
    <section class="content-section"><div class="page-wrap split-grid"><div class="content-label">PUBLIC → PRIVATE</div><div class="content-body"><h2>公开指数提供先验，真实执行形成后验。</h2><p>Public ACU 回答公开市场证据建议什么。Private ACU 回答在客户自己的任务、验证标准与约束下什么真正有效。客户数据未经许可、匿名化、聚合与治理批准，不进入公共指数。</p><p>长期闭环是：Public Quotes → Private Benchmark → Router → Ledger → Private ACU → Better Router。</p><a class="button button-dark" href="https://eu.jerrypsy.top:8443/pricing" target="_blank" rel="noreferrer">查看 API / 价格入口</a></div></div></section>
  </main>`;
}
function articlesHtml() {
    return `<main id="main" class="page-main"><section class="page-hero"><div class="page-wrap"><div class="page-eyebrow">EDITORIAL / RESEARCH NOTES</div><h1 class="page-title">关于 AI 产能的<br>十个基本判断</h1><p class="page-intro">不使用图库封面，不发布虚构新闻。文章围绕任务原生计量、成本质量前沿、动态路由与私有产能账本展开。</p></div></section><section class="content-section"><div class="page-wrap"><div class="editorial-list">${articles.map((a, i) => `<a class="article-row" href="/articles/${a.slug}/"><span class="article-no">${String(i + 1).padStart(2, '0')}</span><div><div class="article-title">${a.title}</div><div class="article-summary">${a.summary}</div></div><div class="article-meta">${a.category}</div><div class="article-meta">${a.date}</div></a>`).join('')}</div></div></section></main>`;
}
function articleHtml(article) {
    const idx = articles.findIndex(a => a.slug === article.slug);
    const prev = idx > 0 ? articles[idx - 1] : null;
    const next = idx < articles.length - 1 ? articles[idx + 1] : null;
    return `<main id="main" class="article-detail"><section class="article-hero"><div class="page-wrap"><div class="page-eyebrow">${article.category} / ACUindex Editorial</div><h1 class="article-title-large">${article.title}</h1><p class="article-dek">${article.dek}</p><div class="article-meta-line"><span>${article.date}</span><span>清度科技研究组</span><span>方法论观点 · 非新闻稿</span></div></div></section><div class="article-layout"><aside class="article-toc" aria-label="文章目录"><strong>目录</strong>${article.sections.map(s => `<a href="#${s.id}">${s.title}</a>`).join('')}</aside><article class="article-body">${article.sections.map(s => `<h2 id="${s.id}">${s.title}</h2>${s.paragraphs.map(p => `<p>${p}</p>`).join('')}${s.quote ? `<blockquote>${s.quote}</blockquote>` : ''}`).join('')}</article></div><nav class="article-nav" aria-label="上一篇与下一篇">${prev ? `<a href="/articles/${prev.slug}/"><small>上一篇</small>${prev.title}</a>` : '<span></span>'}${next ? `<a href="/articles/${next.slug}/"><small>下一篇</small>${next.title}</a>` : '<a href="/articles/"><small>返回</small>全部文章</a>'}</nav></main>`;
}
function bookDemoHtml() {
    const input = (label, name, type = 'text', required = false, full = false, placeholder = '') => `<div class="field${full ? ' full' : ''}"><label for="${name}">${label}${required ? ' *' : ''}</label>${type === 'textarea' ? `<textarea id="${name}" name="${name}" ${required ? 'required' : ''} placeholder="${placeholder}"></textarea>` : `<input id="${name}" name="${name}" type="${type}" ${required ? 'required' : ''} placeholder="${placeholder}">`}</div>`;
    const select = (label, name, options, required = false) => `<div class="field"><label for="${name}">${label}${required ? ' *' : ''}</label><select id="${name}" name="${name}" ${required ? 'required' : ''}><option value="">请选择</option>${options.map(o => `<option value="${o}">${o}</option>`).join('')}</select></div>`;
    return `<main id="main" class="page-main"><section class="page-hero"><div class="page-wrap"><div class="page-eyebrow">BOOK A DEMO</div><h1 class="page-title">预约一次产能<br>配置与成本测算</h1><p class="page-intro">提交真实使用场景与预算区间。我们将围绕任务类型、质量标准、模型结构与可验证节省空间准备演示。</p></div></section><div class="page-wrap booking-grid"><aside class="booking-copy"><h2>表单不会在前端暴露邮件密钥。</h2><p>预约通过 Serverless API 校验与发送。未配置邮件环境变量时，页面会明确显示开发环境回退，不会伪装成已发送。</p><p>推荐预留 45 分钟。时间按你填写的时区生成 ICS 日历文件。</p></aside><form class="booking-form" id="booking-form"><input class="sr-only" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="form-section"><h3>CONTACT</h3><div class="field-grid">${input('姓名', 'name', 'text', true)}${input('公司', 'company', 'text', true)}${input('职位', 'role', 'text', true)}${input('邮箱', 'email', 'email', true)}${input('手机号或微信', 'contact')}</div></div><div class="form-section"><h3>WORKLOAD</h3><div class="field-grid">${input('团队规模', 'teamSize', 'text', true)}${input('当前主要 AI 使用场景', 'scenario', 'text', true)}${select('月度 AI 预算或 API 支出区间', 'budget', ['¥5,000 以下', '¥5,000–20,000', '¥20,000–100,000', '¥100,000–500,000', '¥500,000 以上'], true)}${input('希望解决的问题', 'problem', 'textarea', true, true, '例如：固定使用强模型、缺少质量验收、API 成本增长或希望建立私有任务评测。')}</div></div><div class="form-section"><h3>SCHEDULE</h3><div class="field-grid">${input('可预约日期', 'date', 'date', true)}${input('可预约时间', 'time', 'time', true)}${select('时区', 'timezone', ['Asia/Shanghai (UTC+8)', 'Asia/Tokyo (UTC+9)', 'Europe/London', 'America/New_York', 'America/Los_Angeles'], true)}${input('备注', 'notes', 'textarea', false, true)}</div></div><div class="form-actions"><button class="button button-dark" type="submit">提交预约</button><span class="form-state">提交即表示同意清度团队仅为本次预约处理所填信息。</span></div><p class="form-error" role="alert" hidden></p><div class="form-success" role="status" hidden><h3>预约信息已受理</h3><p class="success-message"></p><p class="success-id"></p><button class="button download-ics" type="button" hidden>下载 ICS 日历文件</button></div></form></div></main>`;
}
function initHeader() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.main-nav');
    const update = () => header?.classList.toggle('scrolled', window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    toggle?.addEventListener('click', () => { const open = nav?.classList.toggle('open') ?? false; toggle.setAttribute('aria-expanded', String(open)); });
}
function initReveal() {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) {
        els.forEach(e => e.classList.add('visible'));
        return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    } }), { threshold: .12 });
    els.forEach(e => observer.observe(e));
}
function initCalculator() {
    const team = document.querySelector('#team-range');
    const spend = document.querySelector('#spend-range');
    if (!team || !spend)
        return;
    let growth = 'medium', structure = 'mixed';
    const fmt = (n) => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(n);
    const compact = (n) => n >= 1000000 ? `¥${(n / 1000000).toFixed(2)}M` : `¥${Math.round(n / 1000)}K`;
    const setRange = (el, out, text) => { const min = Number(el.min), max = Number(el.max), value = Number(el.value), pct = ((value - min) / (max - min)) * 100; el.style.setProperty('--progress', `${pct}%`); out.style.left = `${pct}%`; out.textContent = text; };
    const update = () => {
        const t = Number(team.value), s = Number(spend.value);
        const base = { claude: .27, openai: .29, mixed: .32 };
        const adj = { low: -.02, medium: 0, high: .02 };
        const rate = Math.max(.18, Math.min(.42, base[structure] + adj[growth]));
        const current = t * s * 12, after = current * (1 - rate), savings = current - after;
        setRange(team, document.querySelector('#team-output'), String(t));
        setRange(spend, document.querySelector('#spend-output'), fmt(s));
        document.querySelector('#current-spend').textContent = `${compact(current)} / 年`;
        document.querySelector('#after-spend').textContent = `${compact(after)} / 年`;
        document.querySelector('#savings-amount').textContent = compact(savings);
        document.querySelector('#savings-badge').textContent = `约 ${Math.round(rate * 100)}% 成本下降`;
        document.querySelector('#savings-rate').textContent = `预计单位任务成本下降 ${Math.max(0, Math.round(rate * 100) - 1)}%`;
    };
    team.addEventListener('input', update);
    spend.addEventListener('input', update);
    document.querySelectorAll('.segmented button').forEach(btn => btn.addEventListener('click', () => { const group = btn.closest('.segmented'); group.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false')); btn.setAttribute('aria-pressed', 'true'); if (group.dataset.segment === 'growth')
        growth = btn.dataset.value;
    else
        structure = btn.dataset.value; update(); }));
    update();
}
function initLiveMetrics() {
    const savings = document.querySelector('#live-savings');
    const tokens = document.querySelector('#live-tokens');
    if (!savings || !tokens || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        return;
    let saved = 84279.01, tokenTotal = 1.2800, tick = 0;
    window.setInterval(() => {
        tick += 1;
        saved += .07 + (tick % 5) * .03;
        tokenTotal += .00001;
        savings.textContent = `¥ ${saved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        tokens.textContent = `${tokenTotal.toFixed(4)}B`;
        [savings, tokens].forEach(el => { el.classList.remove('is-updating'); void el.offsetWidth; el.classList.add('is-updating'); });
    }, 3200);
}
function initHeroParticleFlow() {
    const image = document.querySelector('.hero-source');
    const canvas = document.querySelector('.hero-particles');
    if (!image || !canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        return;
    const start = () => {
        const width = image.naturalWidth, height = image.naturalHeight;
        if (!width || !height)
            return;
        const source = document.createElement('canvas');
        source.width = width;
        source.height = height;
        const sourceContext = source.getContext('2d', { willReadFrequently: true });
        if (!sourceContext)
            return;
        sourceContext.drawImage(image, 0, 0, width, height);
        const pixels = sourceContext.getImageData(0, 0, width, height).data;
        const luma = (x, y) => { const px = Math.max(0, Math.min(width - 1, Math.round(x))), py = Math.max(0, Math.min(height - 1, Math.round(y))), i = (py * width + px) * 4; return pixels[i] * .299 + pixels[i + 1] * .587 + pixels[i + 2] * .114; };
        const inOrb = (x, y) => Math.hypot(x - width * .5, y - height * .475) < width * .425;
        const seed = (particle) => {
            for (let attempt = 0; attempt < 900; attempt += 1) {
                const x = width * (.08 + Math.random() * .84), y = height * (.06 + Math.random() * .82);
                if (inOrb(x, y) && luma(x, y) < 205) {
                    particle.x = x;
                    particle.y = y;
                    particle.vx = 0;
                    particle.vy = 0;
                    particle.life = 0;
                    return;
                }
            }
            particle.x = width * .5;
            particle.y = height * .48;
            particle.vx = 1;
            particle.vy = 0;
            particle.life = 0;
        };
        const tangent = (x, y, vx, vy) => {
            const gx = luma(x + 2, y) - luma(x - 2, y), gy = luma(x, y + 2) - luma(x, y - 2), magnitude = Math.hypot(gx, gy);
            if (magnitude < 5)
                return null;
            let tx = -gy / magnitude, ty = gx / magnitude;
            if (vx * tx + vy * ty < 0) {
                tx = -tx;
                ty = -ty;
            }
            return { x: tx, y: ty };
        };
        const particles = Array.from({ length: 24 }, () => { const particle = { x: 0, y: 0, vx: 0, vy: 0, life: 0 }; seed(particle); return particle; });
        const context = canvas.getContext('2d');
        if (!context)
            return;
        let frame = 0, last = performance.now();
        const resize = () => { const rect = canvas.getBoundingClientRect(), ratio = Math.min(window.devicePixelRatio || 1, 2); canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio); context.setTransform(ratio, 0, 0, ratio, 0, 0); };
        const draw = (now) => {
            const delta = Math.min((now - last) / 1000, .04);
            last = now;
            const rect = canvas.getBoundingClientRect();
            context.clearRect(0, 0, rect.width, rect.height);
            particles.forEach(particle => {
                const direction = tangent(particle.x, particle.y, particle.vx, particle.vy);
                if (!direction || !inOrb(particle.x, particle.y) || particle.life > 11) {
                    seed(particle);
                    return;
                }
                particle.vx = particle.vx * .72 + direction.x * .28;
                particle.vy = particle.vy * .72 + direction.y * .28;
                const velocity = Math.hypot(particle.vx, particle.vy) || 1;
                particle.vx /= velocity;
                particle.vy /= velocity;
                particle.x += particle.vx * 42 * delta;
                particle.y += particle.vy * 42 * delta;
                particle.life += delta;
                context.beginPath();
                context.arc(particle.x / width * rect.width, particle.y / height * rect.height, 1.65, 0, Math.PI * 2);
                context.fillStyle = 'rgba(17,17,17,.78)';
                context.fill();
            });
            frame = requestAnimationFrame(draw);
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });
        frame = requestAnimationFrame(draw);
        window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
    };
    if (image.complete)
        start();
    else
        image.addEventListener('load', start, { once: true });
}
function initTestimonials() {
    const el = document.querySelector('.testimonial-viewport');
    if (!el)
        return;
    let down = false, startX = 0, startScroll = 0;
    el.addEventListener('pointerdown', e => { down = true; startX = e.clientX; startScroll = el.scrollLeft; el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'; });
    el.addEventListener('pointermove', e => { if (down)
        el.scrollLeft = startScroll - (e.clientX - startX); });
    const up = () => { down = false; el.style.cursor = 'grab'; };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('keydown', e => { if (e.key === 'ArrowRight')
        el.scrollBy({ left: 520, behavior: 'smooth' }); if (e.key === 'ArrowLeft')
        el.scrollBy({ left: -520, behavior: 'smooth' }); });
}
function initBooking() {
    const form = document.querySelector('#booking-form');
    if (!form)
        return;
    const error = document.querySelector('.form-error');
    const success = document.querySelector('.form-success');
    const submit = form.querySelector('button[type="submit"]');
    let ics = '';
    let bookingId = '';
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.reportValidity())
            return;
        submit.disabled = true;
        submit.textContent = '提交中…';
        error.hidden = true;
        success.hidden = true;
        try {
            const data = Object.fromEntries(new FormData(form).entries());
            const res = await fetch(`${deploymentBase()}/api/book-demo`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() }, body: JSON.stringify(data) });
            const body = await res.json();
            if (!res.ok || !body.ok)
                throw new Error(body.error || '提交失败');
            ics = body.ics || '';
            bookingId = body.bookingId;
            success.hidden = false;
            success.querySelector('.success-message').textContent = body.emailStatus === 'not_configured' ? '开发环境回退：表单已通过服务端校验，但邮件服务未配置，邮件没有发送。' : '预约提交成功，团队与预约邮箱均已收到确认邮件。';
            success.querySelector('.success-id').textContent = `预约编号：${bookingId}`;
            const dl = success.querySelector('.download-ics');
            dl.hidden = !ics;
            form.reset();
        }
        catch (err) {
            error.hidden = false;
            error.textContent = err instanceof Error ? err.message : '提交失败，请稍后重试。';
        }
        finally {
            submit.disabled = false;
            submit.textContent = '提交预约';
        }
    });
    success.querySelector('.download-ics')?.addEventListener('click', () => { if (!ics)
        return; const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `qingdu-demo-${bookingId}.ics`; a.click(); URL.revokeObjectURL(url); });
}
function render() {
    const root = document.getElementById('root');
    const path = deploymentPath();
    let body = '';
    if (path === '/')
        body = homeHtml();
    else if (path === '/acu-index')
        body = acuIndexHtml();
    else if (path === '/articles')
        body = articlesHtml();
    else if (path === '/book-demo')
        body = bookDemoHtml();
    else {
        const match = path.match(/^\/articles\/([^/]+)$/);
        const article = match ? articles.find(a => a.slug === match[1]) : undefined;
        body = article ? articleHtml(article) : `<main class="error-page" id="main"><h1>页面不存在</h1><a class="button button-dark" href="/">返回首页</a></main>`;
    }
    root.innerHTML = headerHtml(path) + body + (path === '/' ? '' : footerHtml());
    prefixLocalUrls(root);
    initHeader();
    initReveal();
    initCalculator();
    initLiveMetrics();
    initHeroParticleFlow();
    initTestimonials();
    initBooking();
}
render();
