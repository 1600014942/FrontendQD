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
  ['/articles/token-is-not-capacity/', '为什么 Token 不是 AI 产能｜清度科技', 'Token 是计费单位，不是可验证工作产出的计量单位。'],
  ['/articles/acu-per-dollar/', '每一美元究竟买到了多少 AI 能力｜清度科技', '以 ACU/USD 与 USD/ACU 重新理解 AI 采购效率。'],
  ['/articles/demand-side-ai-infra/', 'AI Infra 的需求侧正在出现｜清度科技', '从供给侧算力价格走向需求侧有效产能。'],
  ['/articles/dynamic-capacity-routing/', '从固定模型调用到动态产能配置｜清度科技', '动态路由需要任务识别、质量约束、校验与回退。'],
  ['/articles/benchmark-and-enterprise-capacity/', '为什么 Benchmark 不能直接代表企业产能｜清度科技', '公开 benchmark 是先验，客户真实任务是后验。'],
  ['/articles/public-and-private-acu/', 'Public ACU 与 Private ACU｜清度科技', '公开市场参考与客户专属后验的边界。'],
  ['/articles/efficient-frontier/', '模型能力、成本与质量之间的有效前沿｜清度科技', '在质量、成本、时延和置信度约束下寻找非支配路径。'],
  ['/articles/private-capacity-ledger/', '每一次调用如何形成企业私有产能账本｜清度科技', '把执行结果转化为持续改进的私有能力证据。'],
  ['/articles/strongest-is-not-best-value/', '为什么最强模型不等于最高性价比｜清度科技', '模型选择应由任务与约束决定，而不是品牌或总榜排名。'],
  ['/articles/fine-grained-compute-allocation/', '计算资源如何从粗放消费走向精细调度｜清度科技', '从固定采购走向任务级产能配置。']
];

const template = await readFile(path.join(root, 'src', 'shell.html'), 'utf8');
for (const [route, title, description] of routes) {
  const outDir = route === '/' ? path.join(root, 'public') : path.join(root, 'public', route);
  await mkdir(outDir, { recursive: true });
  const canonical = `https://eu.jerrypsy.top/acu/index${route}`;
  const html = template
    .replaceAll('__TITLE__', title)
    .replaceAll('__DESCRIPTION__', description)
    .replaceAll('__CANONICAL__', canonical);
  await writeFile(path.join(outDir, 'index.html'), html);
}
console.log(`Built ${routes.length} routes.`);
