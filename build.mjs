import { execFileSync } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
execFileSync('tsc', ['--project', 'tsconfig.json'], { stdio: 'inherit' });

const routes = [
  ['/', '清度科技｜AI 产能配置基础设施', '释放每一滴 Token 的最大产能。清度科技在质量达标前提下，为每项任务寻找最低成本的合格路径。'],
  ['/acu-index/', 'ACU 指数｜清度科技', 'ACU 是任务族原生的 AI 产能计量单位。了解 ACU、ACU/USD、USD/ACU、Public ACU 与 Private ACU。'],
  ['/articles/', '文章｜清度科技', '清度科技关于 AI 产能、任务级路由、成本质量有效前沿与 ACU 方法论的行业观点。'],
  ['/book-demo/', '预约演示｜清度科技', '预约清度科技 AI 产能配置与成本优化演示。'],
  ['/articles/token-is-not-capacity/', '为什么 Token 不是 AI 产能｜清度科技', 'Token 是资源消耗单位，不是合格工作产出的计量单位。'],
  ['/articles/acu-per-dollar/', '每一美元究竟买到了多少 AI 能力｜清度科技', '以 ACU/USD 与 USD/ACU 衡量每一美元获得的有效 AI 产能。'],
  ['/articles/demand-side-ai-infra/', 'AI Infra 的下半场：需求侧基础设施正在出现｜清度科技', 'AI 上半场解决智能供给，下半场开始解决智能如何被配置到真实生产。'],
  ['/articles/dynamic-capacity-routing/', '从固定模型调用到动态产能配置｜清度科技', '从固定强模型调用走向质量、成本、时延与风险约束下的任务级产能配置。'],
  ['/articles/benchmark-and-enterprise-capacity/', '为什么 Benchmark 不能直接代表企业产能｜清度科技', '公开 Benchmark 是市场先验，企业真实工作负载决定生产后验。'],
  ['/articles/public-and-private-acu/', 'Public ACU 与 Private ACU：从市场先验到企业生产后验｜清度科技', 'Public ACU 提供公共市场参考，Private ACU 描述企业自身工作负载上的生产表现。'],
  ['/articles/efficient-frontier/', '从跨市场高频价差套利到算力量化：寻找 AI 产能的有效价格｜清度科技', '从名义报价走向有效价格，在质量约束下比较同一任务的不同 AI 执行路径。'],
  ['/articles/private-capacity-ledger/', '每一次调用如何形成企业私有产能账本｜清度科技', '把任务、成本和最终结果连接起来，让 AI 调用从消费记录变成生产数据。'],
  ['/articles/strongest-is-not-best-value/', '为什么最强模型不等于最高性价比｜清度科技', 'Frontier model 定义能力上限，生产系统需要的是与任务要求匹配的单位经济性。'],
  ['/articles/fine-grained-compute-allocation/', '从煤炭、石油、电力到算力：计算资源如何从粗放消费走向精细调度｜清度科技', '从资源供给到计量、定价与调度，理解 AI 产能配置基础设施的长期演化。']
];

const template = await readFile(path.join(root, 'src', 'shell.html'), 'utf8');
for (const [route, title, description] of routes) {
  const outDir = route === '/' ? path.join(root, 'public') : path.join(root, 'public', route);
  await mkdir(outDir, { recursive: true });
  const canonical = `https://acucompute.com${route}`;
  const html = template
    .replaceAll('__TITLE__', title)
    .replaceAll('__DESCRIPTION__', description)
    .replaceAll('__CANONICAL__', canonical);
  await writeFile(path.join(outDir, 'index.html'), html);
}
console.log(`Built ${routes.length} routes.`);
