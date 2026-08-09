type ArticleSection = { id: string; title: string; paragraphs: string[]; quote?: string };
type Article = { slug: string; title: string; summary: string; date: string; category: string; dek: string; sections: ArticleSection[] };

const deploymentBase = (): string => {
  const pathname = window.location.pathname;
  return pathname === '/acu/index' || pathname.startsWith('/acu/index/') ? '/acu/index' : '';
};

const deploymentPath = (): string => {
  const base = deploymentBase();
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  return base && pathname.startsWith(base) ? (pathname.slice(base.length) || '/') : pathname;
};

function prefixLocalUrls(root: HTMLElement): void {
  const base = deploymentBase();
  if (!base) return;
  root.querySelectorAll<HTMLElement>('[href], [src]').forEach((element) => {
    for (const attr of ['href', 'src']) {
      const value = element.getAttribute(attr);
      if (value?.startsWith('/') && !value.startsWith('//') && !value.startsWith(base)) element.setAttribute(attr, `${base}${value}`);
    }
  });
}

const articles: Article[] = [
  {
    slug: "token-is-not-capacity", title: "为什么 Token 不是 AI 产能", category: "基础概念", date: "2026.08.07",
    summary: "Token 能精确描述资源消耗，却不能直接说明企业获得了多少合格工作产出。",
    dek: "当模型进入生产系统，投入单位与产出单位之间的差异开始决定真实成本。",
    sections: [
      { id: "billing-vs-output", title: "计费单位与产出单位不是一回事", paragraphs: [
        "过去几年，大模型产业建立了一套非常成熟的 Token 计费体系。模型公司按照输入 Token、输出 Token、缓存 Token 或推理 Token 收费，开发者也可以非常精确地知道一次请求消耗了多少资源。这套体系对于计算成本核算非常有效，因此 Token 会长期存在，并继续成为 AI 服务的重要资源单位。",
        "但资源单位和产出单位不是一回事。一家软件公司调用模型，并不是为了获得更多 Token，而是为了得到能够通过测试的代码；一家文档处理企业真正需要的是正确提取出来的字段，而不是更长的输出文本；客服系统购买的是符合业务要求的有效回答；Agent 系统最终关心的，则是整个任务是否真正完成。Token 描述的是生产过程中消耗了多少计算资源，却并不直接描述这些计算最终产生了多少有效工作。",
        "这一区别在模型之间进行比较时尤其明显。一百万 Token 从不同模型中产生，并不意味着一百万单位相同的生产力。某个模型可能一次完成任务，另一个模型虽然单价较低，却需要多次重试，最后仍然要升级到更强模型；同样数量的 Token 用于代码修复、摘要和复杂推理时，也显然不能被理解成同样数量的业务产出。如果只比较 Token 单价，就会把失败、重试、校验和人工复核等成本留在计量体系之外。",
      ]},
      { id: "missing-output-meter", title: "AI 缺少的是产出计量", paragraphs: [
        "传统工业体系很早就区分了投入和产出。制造企业不会只统计消耗了多少原材料，而不统计生产了多少合格产品；能源系统也不会只统计燃烧了多少煤或天然气，而完全忽略最终产生了多少电力。真正的生产效率必须同时知道投入和产出，否则成本本身没有经济意义。",
        "AI 今天的问题在于，我们已经拥有极其精细的投入计量，却仍然缺少统一的产出计量。GPU-hour、Token、API 账单都可以精确记录资源消耗，Benchmark 则提供模型能力的公共证据，但企业仍然很难直接回答一个最现实的问题：这一笔 AI 预算最终完成了多少合格工作？",
        "ACU 的出发点正是在这里。它并不试图创造一个覆盖所有人工智能能力的通用“智商分数”，而是从具体任务类别出发，在能够定义验收标准的场景中，把经过验证的任务结果作为有效产出的计量对象。代码修复、文档抽取、推理和 Agent 工作流可以拥有不同的任务定义和验证标准，没有必要被强行压缩成一个完全相同的单位。",
      ]},
      { id: "from-token-to-capacity", title: "从 Token 账单走向任务产能", paragraphs: [
        "当任务产出能够被计量以后，Token 的角色反而会变得更加清晰。它仍然是成本输入，是计算完整任务成本不可缺少的数据，但它不再被误认为最终产品。企业可以进一步计算完成一单位有效任务究竟需要多少成本，也可以比较相同预算在不同模型、供应商和执行路径下能够获得多少合格产出。",
        "这意味着 AI 成本管理的基本口径会逐渐从“消耗了多少 Token”，扩展到“这些 Token 最终完成了多少工作”。Token 是资源，产能是结果。只有把两者区分开，AI 才真正开始拥有生产效率这个概念。",
      ]},
    ]
  },
  {
    slug: "acu-per-dollar", title: "每一美元究竟买到了多少 AI 能力", category: "方法论", date: "2026.08.05",
    summary: "真正需要比较的不是每百万 Token 的标价，而是每一美元最终换回多少合格结果。",
    dek: "ACU/USD 与 USD/ACU 把模型能力、任务成功和完整成本放进同一个单位经济性口径。",
    sections: [
      { id: "nominal-vs-effective-cost", title: "名义价格不是任务成本", paragraphs: [
        "今天比较大模型价格，最常见的方法仍然是看每百万 Token 的输入和输出价格。但对于真正进入生产环境的企业来说，模型单价只是成本的一部分。更重要的问题不是某个模型标价多少钱，而是企业花出去的一美元最终换回了多少合格结果。",
        "这也是为什么低价模型不一定真的便宜，高价模型也不一定真的昂贵。假设模型 A 的单次调用成本只有模型 B 的三分之一，但在某类任务中，A 的第一次成功率明显较低。失败之后需要重新请求，第二次失败以后可能还需要调用 B。这样一来，A 的名义价格虽然很低，完整任务成本却可能并没有明显优势。反过来，一个单次价格较高的模型，如果可以显著提高首次成功率、减少重试和人工审核，在高价值任务中的最终成本反而可能更低。",
        "因此，模型价格必须放在任务结果中理解。",
      ]},
      { id: "acu-usd", title: "ACU/USD 与 USD/ACU", paragraphs: [
        "这也是 ACU/USD 与 USD/ACU 所试图回答的问题。ACU/USD 关注单位预算可以获得多少有效 AI 产能；USD/ACU 则反过来观察完成一单位有效产出所需要的完整成本。两者不是新的模型排行榜，而是一种单位经济性口径。",
        "这里的“完整成本”非常重要。企业真正承担的成本通常不仅包括输入和输出 Token，还可能包含推理、工具调用、重试、验证、Fallback 和必要的系统开销。在某些高风险场景中，还需要考虑人工复核以及错误进入下游业务可能造成的额外成本。只有把这些因素放在同一个成本边界里，“便宜”和“昂贵”才开始具有真实意义。",
        "这会改变企业选择模型的方式。如果只看模型排行榜，采购决策很容易变成寻找一个全局最强模型；如果只看 API 价格，又容易变成寻找一个全局最便宜模型。但真实的生产系统并不存在一个脱离任务而独立成立的“最佳模型”。同一个模型可能在复杂推理上非常经济，在摘要任务中却明显过度配置；另一个低成本模型可以处理大量普通任务，却不应该承担高风险最终输出。",
      ]},
      { id: "productivity", title: "从模型价格走向生产率", paragraphs: [
        "企业真正需要的是一条成本—质量曲线。对于不同任务，在不同模型和执行方式之间，会形成不同的质量与成本组合。生产系统的目标通常不是无限提高质量，而是在满足业务要求的前提下寻找更好的单位经济性。",
        "这和制造业中的生产率概念非常接近。企业不会因为某台机器性能最高，就让所有产品都经过这台机器；它会关心不同设备在不同工序中的单位产出成本。AI 进入大规模生产以后，也会逐渐从“模型能力排名”转向“任务产能价格”。今天的大模型市场已经拥有大量价格，但这些价格主要描述供给侧：GPU 多少钱、Token 多少钱、模型访问权多少钱。企业最终关心的却是需求侧：同样预算下，最多能完成多少符合要求的代码、文档、推理、响应和工作流。",
        "真正值得长期观察的，不只是 Token 越来越便宜，而是一美元能够购买的有效 AI 产能，究竟有没有持续提高。",
      ]},
    ]
  },
  {
    slug: "demand-side-ai-infra", title: "AI Infra 的下半场：需求侧基础设施正在出现", category: "行业观察", date: "2026.08.03",
    summary: "AI 上半场解决智能供给，下半场开始解决越来越丰富的智能应该如何进入生产并被配置。",
    dek: "当底层供给迅速扩张，新的基础设施开始吸收模型选择、成本与质量之间的复杂性。",
    sections: [
      { id: "supply-side", title: "AI 上半场解决智能供给", paragraphs: [
        "过去几年，AI 基础设施投资主要围绕一个核心问题展开：怎样生产更多智能。GPU、数据中心、基础模型、推理框架和模型 API 构成了这一阶段的产业主线。模型能力不断提高，推理成本持续下降，过去无法由机器完成的任务开始进入 AI 的能力范围。当智能供给本身仍然稀缺时，价值自然集中在供给侧：谁拥有更好的芯片、更大的集群、更强的模型和更高效的推理系统，谁就能够生产更多智能。",
        "但随着模型供给迅速增加，企业正在遇到另一个问题。今天一家企业可以同时接入多个世界级模型，也可以使用不同 Agent、工具和推理方式，却仍然很难回答一个简单的问题：当前这项任务究竟应该使用哪一种智能？这是 AI Infra 从供给侧向需求侧延伸的开始。",
      ]},
      { id: "abundance-and-selection", title: "供给繁荣之后，选择成为新问题", paragraphs: [
        "互联网历史中出现过类似的结构变化。早期互联网的信息供给有限，Yahoo 所代表的门户模式非常合理：用户首先需要一个入口进入互联网。但当网页数量迅速增长以后，问题发生了变化。真正稀缺的东西逐渐不再是信息本身，而是从几乎无限的信息中找到最相关结果的能力。Google 的价值并不来自拥有互联网上的所有网页，而是建立了一层横跨大量内容供给之上的检索和排序基础设施。",
        "AI 与互联网当然不是同一种市场，但两者存在一个相似的结构规律：当底层供给越来越丰富、越来越异质以后，上层用户会逐渐需要新的抽象层吸收选择成本。今天开发者通常仍然直接选择模型。GPT、Claude、Gemini、DeepSeek、Qwen 或其他模型的名称被直接写入业务逻辑，失败、重试、模型切换和质量判断也由应用团队自行管理。在模型数量较少时，这样做完全可行；但当模型、Agent、工具、Runtime 和价格持续变化以后，人工理解整个智能供应市场的成本会不断提高。",
      ]},
      { id: "demand-side-infra", title: "需求侧基础设施的出现", paragraphs: [
        "这时，AI 基础设施面对的问题开始从“哪里有智能”转向“应该怎样使用智能”。企业真正知道的并不是模型市场每一天的全部变化，而是自己的业务要求：这是什么任务，需要达到什么质量，预算是多少，时延上限是多少，哪些供应商允许使用，什么风险不可接受。至于这些条件最终应该映射到哪个模型、什么运行方式和什么执行路径，更适合交给一层专门的基础设施处理。",
        "这意味着未来的 AI 接口可能逐渐从 model-native 向 task-native 迁移。业务层表达任务和约束，底层系统负责理解不断变化的智能供给。从这个角度看，所谓 AI 的“下半场”并不是说模型、芯片和算力不再重要。相反，供给侧仍然会继续高速发展。所谓下半场，是产业价值链开始从“生产智能”继续向“使用智能”延伸。过去解决的是有没有足够好的智能，接下来越来越重要的问题是这些智能如何被正确配置到生产活动中。",
        "这也是清度所定义的 AI 产能配置基础设施。它不是重新训练一个基础模型，而是在模型供应和业务结果之间建立一层需求侧基础设施：把任务、质量、成本和智能供给连接起来，让不断丰富的模型市场真正转化成企业可以使用的生产能力。如果未来智能供给继续增长，这一层不会因为模型越来越强而消失；恰恰相反，智能越丰富，配置智能的问题才越值得被单独解决。",
      ]},
    ]
  },
  {
    slug: "dynamic-capacity-routing", title: "从固定模型调用到动态产能配置", category: "产能配置", date: "2026.08.01",
    summary: "固定强模型在早期合理，但随着任务、价格和模型市场变化，选择逐渐成为持续资源配置问题。",
    dek: "产能配置不是寻找最便宜模型，而是在质量、成本、时延和风险约束下匹配任务与智能供给。",
    sections: [
      { id: "why-fixed", title: "固定模型调用为何合理", paragraphs: [
        "今天大量 AI 产品仍然采用固定模型调用。开发者选择一个可靠的强模型，把绝大多数请求发送给它，只有少数特殊场景才使用其他模型。这种方式有非常现实的工程优势：实现简单、责任边界清晰、质量稳定，也不需要持续维护复杂的模型策略。在 AI 应用的早期阶段，这通常是正确选择。",
        "问题出现在调用规模扩大以后。真实企业工作负载并不是一种任务。一个产品中可能同时存在摘要、分类、代码修改、文档抽取、客服回答、复杂推理和多步骤 Agent 工作流。不同任务对模型能力的要求差异巨大，但固定模型策略把这些差异全部忽略了。同一个高能力模型被用于所有请求，相当于把最高等级的生产资源配置给了大量并不需要这种能力的任务。",
        "这种浪费在请求量较小时并不明显，但当调用量达到几十万甚至数百万次以后，就会转化为持续的结构性成本。",
      ]},
      { id: "static-rules", title: "静态规则为什么会失效", paragraphs: [
        "另一种常见方法是人工编写静态规则。例如，摘要使用模型 A，复杂推理使用模型 B，代码使用模型 C。相比完全固定模型，这已经向前走了一步，但仍然存在一个问题：模型市场本身是动态的。",
        "新模型会不断发布，已有模型会升级，API 价格会变化，模型在不同任务上的表现也可能发生漂移。企业自己的任务结构同样不是静态的。过去有效的规则，并不保证半年以后仍然有效。如果每一次模型变化都要求开发者重新比较整个市场、重新编写业务代码，人工规则最终会变成新的运维成本。",
        "因此，模型选择越来越像一个持续资源配置问题，而不是一次性工程决策。这里真正需要优化的不是模型名称本身，而是任务要求与智能供给之间的匹配。一个生产请求首先存在质量、成本、时延、可靠性、风险和数据政策等约束。在这些约束成立以后，系统才有意义比较不同执行方式的经济性。",
      ]},
      { id: "capacity-allocation", title: "从 Model Routing 到产能配置", paragraphs: [
        "这也是为什么简单的“永远选择最便宜模型”并不成立。如果质量不足导致大量重试和升级，低价第一跳可能产生更高的完整成本。反过来，“永远选择最强模型”同样不是资源配置，因为它实际上放弃了配置问题。真正的产能配置需要同时考虑结果和成本。",
        "对于部分简单任务，低成本路径可能已经足够；对于中等难度任务，可能存在更经济的执行与校验组合；对于高风险任务，直接使用高能力模型反而是更合理的选择。不同业务具有不同的质量门槛，因此所谓最优路径本身就是任务相关、客户相关和时间相关的。",
        "这也是“产能配置”与简单 Model Routing 的区别。Router 可以完成最终的模型选择，但它只是整个问题的一部分。更基础的问题是如何理解任务需求，如何比较不同路径的完整经济性，以及如何让真实生产结果持续改变后续判断。当这些环节被连接以后，模型选择就从静态配置变成了一个反馈系统。AI 供应市场越动态，企业越不应该把资源选择永久写死在应用代码中；动态产能配置真正解决的，是让业务需求保持稳定，而让底层智能供应持续竞争。",
      ]},
    ]
  },
  {
    slug: "benchmark-and-enterprise-capacity", title: "为什么 Benchmark 不能直接代表企业产能", category: "评测", date: "2026.07.29",
    summary: "公开 Benchmark 提供统一证据，但它测试的分布并不等于任何一家企业的真实生产分布。",
    dek: "Benchmark 更适合作为市场先验，而不是对企业工作负载的直接承诺。",
    sections: [
      { id: "benchmark-boundary", title: "Benchmark 只代表它测试的分布", paragraphs: [
        "AI 行业高度依赖 Benchmark，这是合理的。如果没有公开评测，我们很难系统比较不同模型在代码、数学、推理和长上下文等任务上的能力，也很难观察模型能力整体的进步速度。Benchmark 提供了统一的数据集、验证标准和公开结果，是 AI 市场形成公共认知不可缺少的一层基础设施。",
        "但 Benchmark 有一个天然边界：它只能代表它所测试的任务分布。一个代码修复 Benchmark 有自己的代码仓库、语言比例、任务结构和验证方式；一个推理 Benchmark 也有固定的问题形式、难度和标准答案。它们可以很好地回答“在这套公开任务上不同模型表现怎样”，却不能直接回答另一件事：“在某一家企业自己的工作负载上，它们表现怎样”。",
      ]},
      { id: "transfer-gap", title: "从公开评测到企业工作负载", paragraphs: [
        "这两者之间存在真实的迁移差距。一家企业可能拥有特殊的代码框架、内部工具和工程规范，另一家公司则处理大量具有固定模板但扫描质量很差的文档。相同模型在两个企业中的实际生产表现可能完全不同。提示词结构、上下文长度、工具权限、Agent Runtime、验证方式和质量标准，都可能进一步改变模型排序。",
        "因此，把 Benchmark 排名直接转换成企业采购排名，往往会产生过度简化。这在代码任务中尤其明显。今天很多公开代码能力结果实际上测量的并不只是一个裸模型，而是模型与 Agent scaffold、工具调用、搜索方式、上下文构建和补丁流程组成的完整运行系统。如果只留下模型名称和一个最终分数，就会丢失大量影响实际生产能力的信息。",
      ]},
      { id: "public-prior", title: "Public ACU 是先验，不是承诺", paragraphs: [
        "对于企业来说，Benchmark 更合理的角色是市场先验。一家刚开始使用 AI 的公司不可能提前测试市场上的所有模型，因此公共 Benchmark、公开价格和其他可追溯数据非常重要。它们可以帮助企业建立第一版认知，缩小候选范围，并形成初步采购和配置判断。",
        "但当企业自己的真实数据逐渐积累以后，决策依据就应该开始改变。生产任务会告诉企业哪些模型在自己的环境中真正有效，哪些公开优势能够迁移，哪些优势会消失，以及哪些模型在特定任务中拥有更好的完整成本。如果真实生产结果与公共排名不一致，那么生产系统最终应该相信自己的数据，而不是机械坚持排行榜。",
        "这正是 Public ACU 与 Private ACU 分开的原因。Public ACU 描述公共市场证据，Private ACU 描述特定企业真实工作负载中的生产表现。前者让系统可以开始，后者让系统越来越了解客户自己。Benchmark 并不会因此失去价值，它会回到一个更准确的位置：公共能力证据，而不是企业生产结果的承诺。",
      ]},
    ]
  },
  {
    slug: "public-and-private-acu", title: "Public ACU 与 Private ACU：从市场先验到企业生产后验", category: "ACU 方法论", date: "2026.07.26",
    summary: "Public ACU 提供可追溯的公共市场参考，Private ACU 描述企业自身工作负载上的真实生产表现。",
    dek: "同一个模型对不同企业的经济价值并不相同，公共先验与私有后验必须分层理解。",
    sections: [
      { id: "workload-dependence", title: "为什么同一模型对不同企业价值不同", paragraphs: [
        "同一个模型对于不同企业的经济价值并不相同。这是 AI 产能计量与很多传统商品计量之间最重要的区别之一。一千瓦时电力进入不同企业以后，物理意义不会发生变化；但同一个模型进入不同企业的生产环境以后，实际成功率、成本和质量却可能明显不同。",
        "原因在于 AI 生产高度依赖工作负载。一家企业的代码库、文档格式、业务规则、Prompt、上下文、工具权限和验收标准都具有自己的分布。因此，任何公共模型指数都只能提供市场层面的参考，而不能直接等同于某一家公司的生产表现。",
      ]},
      { id: "public-acu", title: "Public ACU：公共市场先验", paragraphs: [
        "Public ACU 来源于公开 Benchmark、公开价格、模型信息和可以追溯的方法论。它的作用类似市场公共参考：帮助企业了解不同模型在标准任务中的相对能力和单位经济性，为模型初筛、采购比较和第一版资源配置提供依据。",
        "公共层的核心要求是可解释和可追溯。一个公开产能指标应该能够说明自己测量了什么任务、依据什么数据、对应什么成本口径，并明确不同数据的置信度与适用边界。它的价值不是宣称对所有企业都绝对正确，而是提供一个所有参与者都可以理解的共同起点。",
      ]},
      { id: "private-acu", title: "Private ACU：企业生产后验", paragraphs: [
        "Private ACU 解决的是另一个问题。当企业开始真实使用 AI 以后，生产过程会不断产生自己的证据：哪些任务成功，哪些失败，实际成本是多少，哪些场景经常需要额外处理，某个模型在特定业务中的可靠性是否高于公共市场预期。随着这些数据积累，企业开始形成自己的 AI 生产函数。",
        "这时，同一个模型在不同客户中的价值可能出现明显差异。公共 Benchmark 上排名更高的模型，未必在一家企业的内部文档上具有最高生产率；另一个公共排名略低的模型，可能因为更适合特定任务结构而拥有更低的单位任务成本。企业真正应该采购和配置的，不是“全球平均最好的模型”，而是在自己的目标函数下更合适的智能供给。",
        "因此，可以把 Public ACU 理解为 Prior，把 Private ACU 理解为 Posterior。在缺少客户数据时，公共市场证据承担更重要的作用；随着真实生产样本增加，客户自己的结果应该逐渐成为更重要的判断依据。公共市场需要透明的方法论，企业生产数据则需要明确的数据隔离和治理边界。不同企业可以购买同样的模型，但它们不一定拥有相同的 AI 生产效率；差异最终可能来自谁更了解自己的工作负载，以及谁拥有更准确的私有产能曲线。",
      ]},
    ]
  },
  {
    slug: "efficient-frontier", title: "从跨市场高频价差套利到算力量化：寻找 AI 产能的有效价格", category: "算力量化", date: "2026.07.23",
    summary: "算力量化借鉴的不是某个交易策略，而是把异质供给转化为可比较有效价格的市场方法。",
    dek: "量化交易比较同一资产在哪里成交，算力量化比较同一任务在哪里执行。",
    sections: [
      { id: "from-quotes-to-effective-price", title: "从盘口报价到有效价格", paragraphs: [
        "清度思考“算力量化”的一个重要方法论来源，是跨市场量化交易。在跨平台高频价差套利中，最基础的问题并不是预测某一种资产明天会上涨还是下跌，而是观察同一个经济对象在不同市场中的相对价格。当多个交易场所同时存在时，屏幕上经常可以看到不同报价，但真正能够执行的价差并不等于两个数字直接相减。",
        "一笔交易是否真的有经济价值，还取决于手续费、流动性、成交概率、时延以及执行风险。一个看起来更便宜的报价，如果无法以足够数量成交，或者成交后的完整成本更高，就并不是真正意义上的低价。因此，量化交易的一个核心工作，是把不同市场中表面上不可直接比较的信号转换到统一口径下，并持续寻找有效价格，而不是名义价格。",
      ]},
      { id: "task-execution-price", title: "同一任务，也存在不同执行价格", paragraphs: [
        "AI 市场正在出现一个非常相似的问题。同一个业务任务今天可以由多个模型、多个供应商以及多种运行方式完成。它们拥有不同的 API 价格，也拥有不同的能力、时延和成功概率。如果只比较每百万 Token 的价格，就相当于在金融市场中只比较盘口报价，却不考虑最终是否能够有效成交。",
        "模型 A 可能单次调用价格更低，但在某一类任务中经常失败；模型 B 名义价格较高，却能够显著减少重试；模型 C 的公开能力很强，但在一家企业自己的数据上未必具有相同优势。因此，真正值得比较的不是 Token 报价，而是完成一个合格任务所付出的有效价格。",
        "这就是我们所说的算力量化。量化交易试图回答的是：同一个资产应该在哪里成交。算力量化试图回答的是：同一个任务应该在哪里执行。两者并不是同一个技术问题，但共享非常相似的经济学框架：首先需要定义统一的比较对象，然后区分名义价格和完整执行价格，在多个供给来源之间持续比较相对价值，最后根据真实执行结果不断修正下一次决策。",
      ]},
      { id: "quality-constrained-relative-value", title: "算力量化：在质量约束下寻找相对价值", paragraphs: [
        "AI 比金融市场多了一层重要复杂性：不同模型产生的结果并不是天然同质的。同一只股票在两个交易所仍然代表同一种资产，但两个模型生成的答案可能具有完全不同的质量。因此，算力量化成立的前提不是找到全市场最低价格，而是先定义业务能够接受的质量边界。只有在结果达到要求以后，成本比较才有意义。",
        "这也解释了为什么清度关注成本—质量有效前沿，而不是简单的最低模型价格。对于某一类任务，如果存在另一条路径能够提供不低于当前要求的质量，同时拥有更低完整成本，那么原有路径就存在资源配置改善空间。反过来，如果低价路径无法达到业务要求，那么它根本不属于可以比较的有效供给。从这个角度看，ACU/USD 和 USD/ACU 可以被理解为 AI 世界中的有效价格口径之一。它们试图把模型能力、任务结果和完整成本放进同一个经济坐标系，让不同智能供给开始具有可比较性。",
        "量化投资真正重要的并不是某一个具体策略，而是一种看待市场的方法：资源本身不需要被长期绑定给某一个供应商；只要存在多个异质供给，就应该持续比较它们在统一目标下的相对价值。过去，这种方法被用于资本市场；今天，越来越丰富的模型、Agent 和算力供给，也正在形成另一个可以被量化配置的市场。清度把这件事称为算力量化。",
      ]},
    ]
  },
  {
    slug: "private-capacity-ledger", title: "每一次调用如何形成企业私有产能账本", category: "数据闭环", date: "2026.07.20",
    summary: "只有把任务、成本与最终结果连接起来，AI 调用日志才会从消费记录变成生产数据。",
    dek: "真实执行持续形成企业自己的产能证据，并逐渐把公共先验转化为客户专属后验。",
    sections: [
      { id: "logs-vs-ledger", title: "调用日志为什么还不是产能账本", paragraphs: [
        "今天企业已经拥有大量 AI 调用日志。一次请求用了哪个模型、消耗多少 Token、花了多少钱、响应时间多久，这些数据通常都可以被完整记录。但绝大多数日志描述的仍然是资源消费，而不是生产结果。",
        "如果一家公司只知道某个月调用了两百万次模型、消耗了多少 Token、支付了多少 API 费用，它可以进行财务核算，却仍然很难知道这些钱究竟产生了多少有效工作。要让调用日志真正具有产能意义，需要把成本和结果连接起来。",
      ]},
      { id: "consumption-to-production", title: "从消费数据到生产数据", paragraphs: [
        "对于代码任务，最终补丁有没有通过测试；对于文档任务，关键字段有没有正确提取；对于客服任务，回答是否符合业务要求；对于 Agent 工作流，整项任务是否完成。只有当这些结果与执行成本同时被记录，一次 AI 调用才从消费数据变成生产数据。",
        "这也是企业私有产能账本的基本意义。传统账单回答的是“花了多少钱”，产能账本需要进一步回答“这些钱买到了什么”。当这个过程持续发生以后，企业可以逐渐看到自己的 AI 生产结构。例如，某一类任务在模型 A 上拥有较高成功率，但成本也很高；模型 B 成本较低，却在特定输入上经常失败；模型 C 适合绝大多数普通任务，但高风险任务应该交给其他路径。这些关系并不会完整出现在任何公共 Benchmark 中，它们只能从企业自己的真实执行中产生。",
        "因此，每一次生产调用都不仅是成本，也是新的观测数据。",
      ]},
      { id: "private-acu-feedback", title: "生产反馈如何形成 Private ACU", paragraphs: [
        "新客户刚接入系统时，可以依赖 Public ACU 和公共 Benchmark 作为第一版先验。随着真实生产任务增加，企业自己的成功、失败、质量和成本数据逐渐积累，Private ACU 开始形成。生产系统由此从“根据公共市场选择模型”逐渐变成“根据这家企业自己的生产历史配置智能”。",
        "这也是数据闭环真正有价值的地方。如果路由系统永远只根据公共排行榜做决策，那么无论使用多久，它对客户的理解都不会真正增加。只有当执行结果能够返回到产能体系中，系统才可能逐渐形成客户专属的资源配置能力。",
        "从企业管理角度看，这同样意味着 AI 成本中心会发生变化。今天财务部门看到的是模型供应商账单，研发团队看到的是 API 请求，业务部门看到的是结果。这三个视角彼此分离，因此很难形成统一的生产效率指标。产能账本试图把它们连接起来：一次调用既有成本，也有任务和结果。当企业开始拥有足够长期的数据以后，它可以进一步观察自己的单位 AI 产能是否持续改善。今天的系统擅长告诉企业用了多少智能，未来的系统还需要告诉企业，这些智能到底完成了多少工作。",
      ]},
    ]
  },
  {
    slug: "strongest-is-not-best-value", title: "为什么最强模型不等于最高性价比", category: "模型经济学", date: "2026.07.17",
    summary: "Frontier model 定义能力上限，但生产系统真正需要的是与任务要求相匹配的能力。",
    dek: "“全局最强”和“当前任务足够好”是两个不同问题，模型采购最终会回到单位任务经济性。",
    sections: [
      { id: "strongest-default", title: "最强模型是一种合理默认", paragraphs: [
        "过去几年，“使用最强模型”通常是一种非常合理的工程策略。在模型能力差距巨大的阶段，很多任务只有少数 frontier models 可以可靠完成。对于早期 AI 产品来说，为了节省有限成本引入复杂的多模型系统，不一定值得。强模型提供了更稳定的质量，也降低了开发团队判断任务难度的负担。",
        "但模型市场正在发生变化。Frontier model 继续提高能力上限的同时，大量成本更低的模型也在快速进步。过去只有最强模型能够完成的任务，逐渐进入更多模型的能力范围。模型之间也越来越难用一个统一排行榜描述：有些模型擅长代码，有些模型拥有更好的长上下文能力，有些模型在普通任务上的单位成本极低。",
        "在这种市场中，“哪个模型最强”仍然是重要问题，但它不再能够直接回答企业应该怎样使用模型。",
      ]},
      { id: "local-sufficiency", title: "局部充分与全局最强", paragraphs: [
        "生产系统与排行榜的目标并不一样。排行榜通常寻找一个统一指标，把不同任务压缩成一个可比较分数；生产系统面对的却是一组具体业务，每个任务都有自己的质量阈值。一个简单分类任务如果已经可以被某个低成本模型稳定完成，那么继续使用更强模型并不会自动创造额外业务价值。",
        "这可以理解为“局部充分”和“全局最强”的区别。一个模型不需要在所有维度都排名第一，只需要在当前任务上足够好。达到业务门槛以后，继续购买更高能力是否值得，要由任务价值和风险决定。",
        "当然，这并不意味着所有任务都应该下放给便宜模型。高风险任务完全可能需要直接调用最强能力，高价值代码、关键业务决策和复杂推理中的少量质量差异可能具有非常高的经济价值。真正的性价比从来不是“价格最低”，而是能力与任务要求之间的匹配。",
      ]},
      { id: "models-as-resources", title: "模型将越来越像生产资源", paragraphs: [
        "随着这种变化继续发生，模型可能越来越像一种生产资源，而不是应用必须长期绑定的产品身份。今天很多产品会明确强调自己基于某一个模型构建。未来更成熟的 AI 系统可能更关心任务最终有没有达到要求，而不是每一次请求具体使用了哪个供应商。不同模型可以根据质量、价格和任务结构持续竞争，应用层则保持相对稳定。",
        "这与计算资源的发展非常相似。最高性能的计算机当然可以执行普通任务，但没有人因此认为所有工作都应该运行在最昂贵的机器上。资源调度存在的原因并不是高端资源无法完成低端工作，而是不同工作负载对于性能的要求和不同资源的经济性不同。AI 也一样。Frontier models 会继续非常重要，因为它们定义智能能力的上限，并承担其他模型无法完成的任务。但“谁拥有最强模型”和“谁能够最有效地使用整个模型市场”会逐渐成为两个不同的竞争维度。",
        "智能越丰富，配置能力越重要。真正优秀的 AI 生产系统不会永远选择最强，也不会永远选择最便宜，而是在真正需要更强能力的时候，为更强的能力付费。",
      ]},
    ]
  },
  {
    slug: "fine-grained-compute-allocation", title: "从煤炭、石油、电力到算力：计算资源如何从粗放消费走向精细调度", category: "基础设施", date: "2026.07.14",
    summary: "重要资源从扩大供给走向规模化生产后，计量、定价、调度与成本治理通常会逐渐出现。",
    dek: "AI 已经拥有 GPU-hour、Token 和 API 价格，下一步是建立连接成本与有效产出的需求侧计量和配置体系。",
    sections: [
      { id: "resource-maturity", title: "资源成熟之后，计量与调度都会出现", paragraphs: [
        "工业史不仅是一部发现新资源的历史，也是一部不断把资源标准化、计量化、价格化和调度化的历史。煤炭推动了早期工业革命，石油后来成为全球工业体系最重要的商品之一。但石油真正成为现代经济基础设施，并不仅因为人类能够从地下开采原油。围绕石油逐渐形成的质量标准、计量单位、运输网络、库存体系和基准价格，使不同地区、不同品质和不同供应商的资源能够进入统一市场。",
        "电力进一步展示了这种基础设施演化。发电只是第一步。现代电力系统真正复杂的部分，还包括计量、电网、负荷管理、峰谷价格和跨区域调度。用户最终并不需要关心某一个电子来自哪一家发电厂，而是希望稳定获得符合要求的电力。供给侧负责生产，电网负责配置。",
        "计算资源也经历了类似过程。早期企业直接购买服务器，后来 CPU 时间、GPU-hour、FLOPS、吞吐量、实例规格和云服务逐渐形成。企业不再需要直接理解每一台物理服务器，而是通过云平台购买标准化计算资源。再往后，FinOps 出现，企业开始进一步管理资源利用率、弹性配置和单位业务成本。每一种重要资源在发展的早期，产业首先关心供给够不够；只有当供给规模足够大以后，计量和配置问题才会真正成为基础设施。",
      ]},
      { id: "ai-price-gap", title: "AI 已经有价格，但还没有完整的产能价格", paragraphs: [
        "AI 今天正在跨过类似节点。过去几年，最重要的问题毫无疑问是生产更多智能。更大的模型、更强的 GPU、更低的推理成本，让 AI 的能力边界迅速扩张，这仍然会继续。",
        "但另一方面，AI 已经出现大量价格：GPU 租赁价格、Token 价格、API 账单、模型订阅费，以及各种公开 Benchmark。我们可以非常清楚地知道购买一小时 H100 需要多少钱，也可以知道一百万 Token 需要多少钱，却仍然很难直接回答一个更接近生产的问题：这一美元最终可以买到多少合格 AI 工作？",
        "这说明 AI 的价格体系目前仍然主要停留在供给侧。GPU-hour 描述算力，Token 描述模型计算消耗，Benchmark 描述能力证据，但企业需要的是另一层计量：在自己的任务和质量要求下，这些投入究竟产生了多少有效产出。只有当这件事能够被测量，真正的精细调度才开始成立。",
      ]},
      { id: "fine-grained-allocation", title: "从粗放消费到精细调度", paragraphs: [
        "如果企业不知道什么叫一个合格结果，就无法区分真正的成本优化和单纯降低模型质量；如果不知道单位任务成本，就无法判断某个低价模型是否因为失败和重试反而更加昂贵；如果没有长期生产数据，也无法知道公共 Benchmark 与自己的工作负载之间究竟存在多大差异。",
        "因此，AI 从粗放消费走向精细调度，需要同时出现三层基础设施。第一层是公共市场参考，让不同智能供给开始具有可比较的能力与价格语言；第二层是企业自己的私有产能数据，让每家公司了解真实工作负载中的生产效率；第三层是产能配置，让不同模型、Agent 和执行方式根据任务需要持续竞争。ACU、Public ACU、Private ACU、ACU/USD 和产能账本，本质上都围绕这一件事展开：把 AI 从“用了多少资源”，进一步推向“这些资源产生了多少有效产能”。",
        "这并不是要把 AI 变成石油，也不是认为 AI、能源和金融市场拥有完全相同的结构。历史类比真正有意义的地方在于另一点：当一种资源逐渐成为经济体系的重要生产资料以后，产业通常不会永远停留在扩大供给阶段。随着规模增长，计量、价格、配置和成本治理会自然变得越来越重要。过去十年，人类解决了怎样生产越来越多的计算和智能；接下来一个长期问题，是怎样把这些计算和智能用得更好。如果算力正在成为这个时代最重要的生产资源之一，那么从粗放消费走向精细调度，更可能是一种基础设施成熟的结果。",
      ]},
    ]
  },
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



function headerHtml(path: string): string {
  const current = (prefix: string) => path.startsWith(prefix) ? ' aria-current="page"' : '';
  return `
  <header class="site-header">
    <div class="header-inner">
      <a class="brand-lockup" href="/" aria-label="清度科技首页"><span class="brand-box">ACUindex</span><span>清度</span></a>
      <button class="mobile-toggle" aria-expanded="false" aria-label="打开导航菜单"><span></span><span></span></button>
      <nav class="main-nav" aria-label="主导航">
        <a href="/acu-index/"${current('/acu-index')}>ACU 指数</a>
        <a href="https://eu.jerrypsy.top/acu-router/" target="_blank" rel="noreferrer">成本优化器</a>
        <a href="https://eu.jerrypsy.top:8443/dashboard/overview" target="_blank" rel="noreferrer">控制台</a>
        <a href="/articles/"${current('/articles')}>理论</a>
        <a class="contact-button" href="/book-demo/"${current('/book-demo')}>联系我们</a>
      </nav>
    </div>
  </header>`;
}

function footerHtml(): string {
  return `<footer class="site-footer"><div class="footer-inner"><span>© ${new Date().getFullYear()} 清度科技 / ACUindex</span><div class="footer-links"><a href="/acu-index/">方法论</a><a href="/articles/">文章</a><a href="https://eu.jerrypsy.top:8443/pricing" target="_blank" rel="noreferrer">API / 价格</a><a href="/book-demo/">预约演示</a></div></div></footer>`;
}

function diagramFrame(svg: string, alt: string): string {
  return `<div class="reveal diagram-figure" role="img" aria-label="${alt}">${svg}</div>`;
}

function misallocationSvg(): string {
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

function frontierSvg(): string {
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

function capacityLoopSvg(): string {
  const node = (x:number,w:number,label:string,dark=false) => `<rect x="${x}" y="145" width="${w}" height="58" rx="10" class="${dark ? 'node-dark' : 'node-light'}"/><text x="${x+w/2}" y="181" text-anchor="middle" class="${dark ? 'node-text-dark' : 'node-text'}">${label}</text>`;
  return `<svg class="diagram-svg loop-svg" viewBox="0 0 1440 720" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><marker id="arrow-loop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>
    <g transform="translate(75 0)">${node(55,130,'任务识别')}${node(260,130,'任务画像')}${node(465,150,'清度路由器',true)}${node(700,130,'执行调用')}${node(900,130,'质量验证')}${node(1105,130,'能力账本')}</g>
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

function homeHtml(): string {
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
      </div>
    </div></section>

    <section class="screen ecosystem"><div class="screen-inner"><div class="reveal">
      <div class="logo-strip-frame" tabindex="0" aria-label="支持接入的平台、模型与开发工具 Logo"><img class="logo-strip" src="/assets/figures/logo-strip.png" alt="为一线开发者：清度支持接入的平台、模型与开发工具"></div>
    </div></div></section>

    <section class="screen diagram-screen misallocation"><div class="screen-inner">
      <div class="reveal diagram-heading"><div class="section-kicker">1. AI 产能的错配</div><h2 class="section-title">加速从固定模型调用，到精细化配置 Token 的 AI 使用范式跃迁。</h2></div>
      ${diagramFrame(misallocationSvg(),'不同任务类型被集中导向最强模型，右侧成本向上，体现固定强模型造成的产能错配。')}
    </div></section>

    <section class="screen diagram-screen frontier"><div class="screen-inner">
      <div class="reveal diagram-heading"><div class="section-kicker">2. 找到最低成本的合格路径</div><h2 class="section-title">同样的任务，以更低的成本完成。</h2></div>
      ${diagramFrame(frontierSvg(),'成本质量有效前沿：在合格输出标准下，清度路线以 1.0× 成本达到目标，最强模型对应 3.2× 成本。')}
    </div></section>

    <section class="screen diagram-screen loop"><div class="screen-inner">
      <div class="reveal diagram-heading"><div class="section-kicker">3. 构建私有产能闭环</div><h2 class="section-title">每一次调用，都让下一次路由更智能。</h2><p class="section-subtitle">清度将真实执行转化为私有产能账本，使未来的资源分配更加精准。</p></div>
      ${diagramFrame(capacityLoopSvg(),'任务识别、任务画像、清度路由器、执行调用、质量验证、能力账本构成的私有产能闭环。')}
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


function acuIndexHtml(): string {
  const defs = [
    ['ACU','任务族原生的 AI 产能计量单位。基础实现中，一次被验证的任务完成等于一单位对应任务族 ACU。'],
    ['ACU / USD','每 1 美元获得多少有效 AI 产能；用于比较单位预算的生产率。'],
    ['USD / ACU','获得 1 单位有效 AI 产能所需的完整成本；包含重试、验证和必要开销。'],
    ['Public ACU','由公开 Benchmark、公开价格和公开模型运行信息形成的市场参考先验。'],
    ['Private ACU','由客户真实任务、验收标准、执行反馈和生产账本形成的客户专属后验。'],
    ['Router','在质量、成本、时延、风险、可靠性和客户约束下选择路径，并管理校验与 Fallback。']
  ];
  const groups = instrumentGroups.map(group => `<div class="index-group"><div class="index-group-head"><h2>${group.title}</h2><span>${group.subtitle}</span></div><div class="instrument-list">${group.items.map(item => `<div class="instrument-row"><div class="instrument-symbol">${item[0]}</div><div class="instrument-desc">${item[1]}</div><span class="state-tag ${item[2].includes('reference') ? 'reference' : ''}">${item[2]}</span><span class="instrument-time">Last checked: ${item[3]}</span></div>`).join('')}</div></div>`).join('');
  return `<main id="main" class="page-main">
    <section class="page-hero"><div class="page-wrap"><div class="page-eyebrow">ACU Index / Public Reference</div><h1 class="page-title">为 AI 产能建立<br>可比较的计量口径</h1><p class="page-intro">ACU 是任务族原生的 AI 产能单位，不是通用智能分数，也不是 Token 单价。当前页面为 Demo-stage methodology 与产品入口，不提供结算指数。</p></div></section>
    <section class="content-section"><div class="page-wrap split-grid"><div class="content-label">UNIT &amp; BOUNDARY</div><div class="content-body"><h2>先定义任务、验证与成本边界，再讨论指数。</h2><p>ACU 把公开 Benchmark 结果翻译为任务族报价，同时保留模型—运行时身份、验证器类型、成本模式、置信度与数据模式。缺失值保持缺失，不被当作 0。</p><div class="definition-grid">${defs.map(d => `<div class="definition"><div class="definition-symbol">${d[0]}</div><p>${d[1]}</p></div>`).join('')}</div></div></div></section>
    <section class="content-section"><div class="page-wrap"><div class="page-eyebrow">INSTRUMENTS / STATUS</div>${groups}</div></section>
    <section class="content-section"><div class="page-wrap split-grid"><div class="content-label">PUBLIC → PRIVATE</div><div class="content-body"><h2>质量-价格模型：数学提供先验，统计提供后验。</h2><p>Public ACU 回答公开市场证据建议什么。Private ACU 回答在客户自己的任务、验证标准与约束下什么真正有效。客户数据未经许可、匿名化、聚合与治理批准，不进入公共指数。</p><p>长期闭环是：Public Quotes → Private Benchmark → Router → Ledger → Private ACU → Better Router。</p><a class="button button-dark" href="https://eu.jerrypsy.top:8443/pricing" target="_blank" rel="noreferrer">查看 API / 价格入口</a></div></div></section>
  </main>`;
}

function articlesHtml(): string {
  return `<main id="main" class="page-main"><section class="page-hero"><div class="page-wrap"><div class="page-eyebrow">EDITORIAL / RESEARCH NOTES</div><h1 class="page-title">关于 AI 产能的<br>十个基本判断</h1><p class="page-intro">超越 Token 之路：从 AI 产能的计量、定价到配置，讨论如何从 Token 消耗出发，建立可衡量、可比较、可优化的有效产能体系。</p></div></section><section class="content-section"><div class="page-wrap"><div class="editorial-list">${articles.map((a,i) => `<a class="article-row" href="/articles/${a.slug}/"><span class="article-no">${String(i+1).padStart(2,'0')}</span><div><div class="article-title">${a.title}</div><div class="article-summary">${a.summary}</div></div><div class="article-meta">${a.category}</div><div class="article-meta">${a.date}</div></a>`).join('')}</div></div></section></main>`;
}

function articleHtml(article: Article): string {
  const idx = articles.findIndex(a => a.slug === article.slug);
  const prev = idx > 0 ? articles[idx-1] : null;
  const next = idx < articles.length-1 ? articles[idx+1] : null;
  return `<main id="main" class="article-detail"><section class="article-hero"><div class="page-wrap"><div class="page-eyebrow">${article.category} / ACUindex Editorial</div><h1 class="article-title-large">${article.title}</h1><p class="article-dek">${article.dek}</p><div class="article-meta-line"><span>${article.date}</span><span>清度科技研究组</span><span>方法论观点 · 非新闻稿</span></div></div></section><div class="article-layout"><aside class="article-toc" aria-label="文章目录"><strong>目录</strong>${article.sections.map(s => `<a href="#${s.id}">${s.title}</a>`).join('')}</aside><article class="article-body">${article.sections.map(s => `<h2 id="${s.id}">${s.title}</h2>${s.paragraphs.map(p => `<p>${p}</p>`).join('')}${s.quote ? `<blockquote>${s.quote}</blockquote>` : ''}`).join('')}</article></div><nav class="article-nav" aria-label="上一篇与下一篇">${prev ? `<a href="/articles/${prev.slug}/"><small>上一篇</small>${prev.title}</a>` : '<span></span>'}${next ? `<a href="/articles/${next.slug}/"><small>下一篇</small>${next.title}</a>` : '<a href="/articles/"><small>返回</small>全部文章</a>'}</nav></main>`;
}

function bookDemoHtml(): string {
  const input = (label:string,name:string,type='text',required=false,full=false,placeholder='') => `<div class="field${full ? ' full' : ''}"><label for="${name}">${label}${required ? ' *' : ''}</label>${type === 'textarea' ? `<textarea id="${name}" name="${name}" ${required ? 'required' : ''} placeholder="${placeholder}"></textarea>` : `<input id="${name}" name="${name}" type="${type}" ${required ? 'required' : ''} placeholder="${placeholder}">`}</div>`;
  const select = (label:string,name:string,options:string[],required=false) => `<div class="field"><label for="${name}">${label}${required ? ' *' : ''}</label><select id="${name}" name="${name}" ${required ? 'required' : ''}><option value="">请选择</option>${options.map(o => `<option value="${o}">${o}</option>`).join('')}</select></div>`;
  return `<main id="main" class="page-main"><section class="page-hero"><div class="page-wrap"><div class="page-eyebrow">BOOK A DEMO</div><h1 class="page-title">预约一次产能<br>配置与成本测算</h1><p class="page-intro">提交真实使用场景与预算区间。我们将围绕任务类型、质量标准、模型结构与可验证节省空间准备演示。</p></div></section><div class="page-wrap booking-grid"><aside class="booking-copy"><h2>表单不会在前端暴露邮件密钥。</h2><p>预约通过 Serverless API 校验与发送。未配置邮件环境变量时，页面会明确显示开发环境回退，不会伪装成已发送。</p><p>推荐预留 45 分钟。时间按你填写的时区生成 ICS 日历文件。</p></aside><form class="booking-form" id="booking-form"><input class="sr-only" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="form-section"><h3>CONTACT</h3><div class="field-grid">${input('姓名','name','text',true)}${input('公司','company','text',true)}${input('职位','role','text',true)}${input('邮箱','email','email',true)}${input('手机号或微信','contact')}</div></div><div class="form-section"><h3>WORKLOAD</h3><div class="field-grid">${input('团队规模','teamSize','text',true)}${input('当前主要 AI 使用场景','scenario','text',true)}${select('月度 AI 预算或 API 支出区间','budget',['¥5,000 以下','¥5,000–20,000','¥20,000–100,000','¥100,000–500,000','¥500,000 以上'],true)}${input('希望解决的问题','problem','textarea',true,true,'例如：固定使用强模型、缺少质量验收、API 成本增长或希望建立私有任务评测。')}</div></div><div class="form-section"><h3>SCHEDULE</h3><div class="field-grid">${input('可预约日期','date','date',true)}${input('可预约时间','time','time',true)}${select('时区','timezone',['Asia/Shanghai (UTC+8)','Asia/Tokyo (UTC+9)','Europe/London','America/New_York','America/Los_Angeles'],true)}${input('备注','notes','textarea',false,true)}</div></div><div class="form-actions"><button class="button button-dark" type="submit">提交预约</button><span class="form-state">提交即表示同意清度团队仅为本次预约处理所填信息。</span></div><p class="form-error" role="alert" hidden></p><div class="form-success" role="status" hidden><h3>预约信息已受理</h3><p class="success-message"></p><p class="success-id"></p><button class="button download-ics" type="button" hidden>下载 ICS 日历文件</button></div></form></div></main>`;
}

function initHeader(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  const toggle = document.querySelector<HTMLButtonElement>('.mobile-toggle');
  const nav = document.querySelector<HTMLElement>('.main-nav');
  const update = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  update(); window.addEventListener('scroll', update, { passive: true });
  toggle?.addEventListener('click', () => { const open = nav?.classList.toggle('open') ?? false; toggle.setAttribute('aria-expanded', String(open)); });
}

function initReveal(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { (entry.target as HTMLElement).classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
  els.forEach(e => observer.observe(e));
}

function initCalculator(): void {
  const team = document.querySelector<HTMLInputElement>('#team-range');
  const spend = document.querySelector<HTMLInputElement>('#spend-range');
  if (!team || !spend) return;
  let growth = 'medium', structure = 'mixed';
  const fmt = (n:number) => new Intl.NumberFormat('zh-CN',{style:'currency',currency:'CNY',maximumFractionDigits:0}).format(n);
  const compact = (n:number) => n >= 1_000_000 ? `¥${(n/1_000_000).toFixed(2)}M` : `¥${Math.round(n/1000)}K`;
  const setRange = (el:HTMLInputElement, out:HTMLElement, text:string) => { const min=Number(el.min), max=Number(el.max), value=Number(el.value), pct=((value-min)/(max-min))*100; el.style.setProperty('--progress',`${pct}%`); out.style.left=`${pct}%`; out.textContent=text; };
  const update = () => {
    const t=Number(team.value), s=Number(spend.value); const base:{[k:string]:number}={claude:.27,openai:.29,mixed:.32}; const adj:{[k:string]:number}={low:-.02,medium:0,high:.02}; const rate=Math.max(.18,Math.min(.42,base[structure]+adj[growth])); const current=t*s*12, after=current*(1-rate), savings=current-after;
    setRange(team,document.querySelector<HTMLElement>('#team-output')!,String(t)); setRange(spend,document.querySelector<HTMLElement>('#spend-output')!,fmt(s));
    document.querySelector('#current-spend')!.textContent=`${compact(current)} / 年`; document.querySelector('#after-spend')!.textContent=`${compact(after)} / 年`; document.querySelector('#savings-amount')!.textContent=compact(savings); document.querySelector('#savings-badge')!.textContent=`约 ${Math.round(rate*100)}% 成本下降`; document.querySelector('#savings-rate')!.textContent=`预计单位任务成本下降 ${Math.max(0,Math.round(rate*100)-1)}%`;
  };
  team.addEventListener('input',update); spend.addEventListener('input',update);
  document.querySelectorAll<HTMLButtonElement>('.segmented button').forEach(btn => btn.addEventListener('click',() => { const group=btn.closest<HTMLElement>('.segmented')!; group.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed','false')); btn.setAttribute('aria-pressed','true'); if (group.dataset.segment === 'growth') growth=btn.dataset.value!; else structure=btn.dataset.value!; update(); }));
  update();
}

function initLiveMetrics(): void {
  const savings=document.querySelector<HTMLElement>('#live-savings');
  const tokens=document.querySelector<HTMLElement>('#live-tokens');
  if(!savings||!tokens||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let saved=84_279.01, tokenTotal=1.2800, tick=0;
  window.setInterval(()=>{
    tick+=1;
    saved+=.07+(tick%5)*.03;
    tokenTotal+=.00001;
    savings.textContent=`¥ ${saved.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
    tokens.textContent=`${tokenTotal.toFixed(4)}B`;
    [savings,tokens].forEach(el=>{el.classList.remove('is-updating');void el.offsetWidth;el.classList.add('is-updating');});
  },3200);
}

function initTestimonials(): void {
  const el=document.querySelector<HTMLElement>('.testimonial-viewport'); if (!el) return; let down=false,startX=0,startScroll=0;
  el.addEventListener('pointerdown',e=>{down=true;startX=e.clientX;startScroll=el.scrollLeft;el.setPointerCapture(e.pointerId);el.style.cursor='grabbing';});
  el.addEventListener('pointermove',e=>{if(down)el.scrollLeft=startScroll-(e.clientX-startX);});
  const up=()=>{down=false;el.style.cursor='grab';}; el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  el.addEventListener('keydown',e=>{if(e.key==='ArrowRight')el.scrollBy({left:520,behavior:'smooth'});if(e.key==='ArrowLeft')el.scrollBy({left:-520,behavior:'smooth'});});
}

function initBooking(): void {
  const form=document.querySelector<HTMLFormElement>('#booking-form'); if(!form)return; const error=document.querySelector<HTMLElement>('.form-error')!; const success=document.querySelector<HTMLElement>('.form-success')!; const submit=form.querySelector<HTMLButtonElement>('button[type="submit"]')!; let ics=''; let bookingId='';
  form.addEventListener('submit',async e=>{e.preventDefault(); if(!form.reportValidity())return; submit.disabled=true;submit.textContent='提交中…';error.hidden=true;success.hidden=true;
    try{const data=Object.fromEntries(new FormData(form).entries());const res=await fetch(`${deploymentBase()}/api/book-demo`,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()},body:JSON.stringify(data)});const body=await res.json();if(!res.ok||!body.ok)throw new Error(body.error||'提交失败');ics=body.ics||'';bookingId=body.bookingId;success.hidden=false;success.querySelector('.success-message')!.textContent=body.emailStatus==='not_configured'?'开发环境回退：表单已通过服务端校验，但邮件服务未配置，邮件没有发送。':'预约提交成功，团队与预约邮箱均已收到确认邮件。';success.querySelector('.success-id')!.textContent=`预约编号：${bookingId}`;const dl=success.querySelector<HTMLButtonElement>('.download-ics')!;dl.hidden=!ics;form.reset();}catch(err){error.hidden=false;error.textContent=err instanceof Error?err.message:'提交失败，请稍后重试。';}finally{submit.disabled=false;submit.textContent='提交预约';}
  });
  success.querySelector<HTMLButtonElement>('.download-ics')?.addEventListener('click',()=>{if(!ics)return;const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`qingdu-demo-${bookingId}.ics`;a.click();URL.revokeObjectURL(url);});
}

function render(): void {
  const root=document.getElementById('root')!;
  const path=deploymentPath();
  let body='';
  if(path==='/') body=homeHtml();
  else if(path==='/acu-index') body=acuIndexHtml();
  else if(path==='/articles') body=articlesHtml();
  else if(path==='/book-demo') body=bookDemoHtml();
  else { const match=path.match(/^\/articles\/([^/]+)$/); const article=match?articles.find(a=>a.slug===match[1]):undefined; body=article?articleHtml(article):`<main class="error-page" id="main"><h1>页面不存在</h1><a class="button button-dark" href="/">返回首页</a></main>`; }
  root.innerHTML=headerHtml(path)+body+(path==='/'?'':footerHtml());
  prefixLocalUrls(root);
  initHeader();initReveal();initCalculator();initLiveMetrics();initTestimonials();initBooking();
}

render();
