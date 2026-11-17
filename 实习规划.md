# 实习综合规划

执行周期：2026 年 11 月 16 日至 2027 年 1 月 10 日，共 8 周。

## 1 最终目标

两个月内完成一个可复现的 AI Infra 推理性能项目，形成以下求职证据：

1. 实现一个小型 vLLM/SGLang：Prefill/Decode、Continuous Batching、Chunked Prefill、Paged KV、Prefix Cache、负载发生器和 SLO 指标。
2. 在单块 RTX 5070 Ti 上完成单实例 Serving、过载控制、KV 回收和故障恢复；双逻辑 Worker 路由只作为可选控制面实验，不声称获得多卡并行收益。
3. 能解释并测量 TTFT、TPOT/ITL、端到端延迟、吞吐、Goodput、显存和队列长度。
4. 能实现并分析 Triton RMSNorm、fused SiLU mul 和简化 FlashAttention forward；后者重点验证在线 Softmax、分块与显存复杂度。
5. 能使用 Nsight Systems 和 Nsight Compute 定位 CPU 提交、GPU kernel、带宽、occupancy、stall 和 shape 性能断点。
6. 能完成一次 kernel 集成或真实推理路径替换，并用端到端数据说明收益边界。
7. 能使用 C++ 完成中等算法题，回答 STL、RAII、智能指针、move 和并发基础。
8. 在上海获得 AI Infra、GPU 性能、国产 GPU 适配、FDE 或推理系统方向的有效面试。

不把 MLIR 核心开发、CUTLASS/CuTe 高性能库、多机多卡通信库和完整分布式训练框架列入本轮必做范围。

## 2 当前证据与两个月后的目标

| 能力 | 当前分 | 当前证据 | 1 月 10 日必须新增的证据 |
|---|---:|---|---|
| Python 与工程自动化 | 4.0/5 | RTL 数据管线、Schema、EDA 工具链封装、错误归因 | 一键 benchmark、自动回归、JSON/CSV 结果和日志归因 |
| Linux 调试与实验 | 3.0/5 | EDA 工具运行和项目联调 | 固定环境、最小复现、性能退化定位和 Docker 复现 |
| 体系结构基础 | 3.0/5 | 阅读与研究基础，缺少真实 microbenchmark | Roofline、GPU counter、cache/带宽/延迟实验 |
| PyTorch 与模型工程 | 3.0/5 | AMP/BF16、训练与部署经历 | Decoder-only、GQA、KV Cache、Transformers/vLLM 对照 |
| 大模型推理系统 | 1.5/5 | 缺少源码和 benchmark 证据 | vLLM 请求流、调度实验、Paged KV/Prefix Cache 原型 |
| CUDA 与性能分析 | 1.5/5 | 技能名称多于可复现实验 | Nsight Systems 时间线、两组 NCU 对照、Roofline 分析 |
| Triton 算子 | 1.0/5 | 无独立算子与测试 | RMSNorm、fused SiLU mul、失败 shape、正确性与性能回归 |
| C++ | 1.5/5 | 简历证据不足 | 60 道题、至少 35 道中等题；STL、内存、并发复盘 |
| 算法面试 | 2.0/5 | 竞赛经历不能替代现场稳定编码 | 35 分钟完成中等题并覆盖边界测试 |
| 单卡 Serving 与运行时 | 1.0/5 | 无调度、KV 管理和在线负载证据 | Continuous Batching、Paged KV、Prefix Cache、SLO、过载与恢复 |

既往 EDA 与 RTL 经历用于证明自动化、调试、硬件理解和跨工具链交付，不包装成已有 CUDA 或推理系统经验。新项目必须补齐“真实 GPU 测量、框架路径和性能归因”。

## 3 岗位策略

### 3.1 岗位赛道与投递时点

| 岗位类型 | 难度 | 当前就绪 | 主要考核 | 投递时点 |
|---|---:|---:|---|---|
| AI Infra Benchmark、CI、开发工具 | 3/5 | 3/5 | Python、Linux、测试、日志、性能回归、工程交付 | 立即投 |
| 国产 GPU 适配与 FDE | 3.5/5 | 3/5 | 模型部署、算子支持、最小复现、精度/性能定位、客户问题 | 第 1 周主投 |
| 推理部署与性能评测 | 3.5/5 | 2.5/5 | vLLM、压测、TTFT/TPOT、OOM、容器、故障定位 | 第 2 周主投 |
| 大模型推理引擎 | 4/5 | 1.5/5 | vLLM V1、调度、KV Cache、CUDA Graph、量化、C++ | 第 3 周达闸门后投 |
| Triton 算子优化 | 4/5 | 1/5 | GPU 存储层次、tiling、数值稳定、profiling | 第 5 周达闸门后投 |
| GPGPU 性能架构 | 4/5 | 2/5 | microbenchmark、counter、cache、带宽、延迟、功耗 | 第 5 至 6 周选择性投 |
| CUDA 高性能库 | 5/5 | 1/5 | C++/CUDA、shared memory、warp、CUTLASS/CuTe | 第 6 周后只做冲刺 |
| AI 编译器核心 | 5/5 | 1.5/5 | C++、IR、MLIR/LLVM、图优化、代码生成 | 本轮暂缓 |
| 分布式训练与通信库 | 5/5 | 1/5 | TP/PP/EP、NCCL、通信重叠、集群调试 | 本轮暂缓 |

第一目标不是拿最底层岗位，而是在上海获得生产级 AI Infra、GPU 性能或国产 GPU 适配经历。优先用现有工程证据进入 Benchmark、CI、FDE 和部署，再用两个月项目向推理引擎、Triton 和 GPU 性能岗位升级。

### 3.2 当前可直接投的官方入口

| 岗位 | 直接匹配证据 | 缺口 | 行动 |
|---|---|---|---|
| [NVIDIA AI CI CD Infrastructure 上海](https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite/job/China-Shanghai/Software-Engineering-Intern--AI-CI-CD-Infrastructure---2027_JR2026869) | Python、Linux、测试自动化、日志和错误归因 | CI 平台案例、容器与可观测性 | 立即投，突出 EDA 工具链与失败归因 |
| [NVIDIA AI Infra Development 上海](https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/AI-Infra-Development-Intern---2027_JR2026402) | 数据管线、工作流、评测、工程交付 | 后端和数据系统深度 | 立即投，定位平台工程而非 kernel |
| [NVIDIA Interconnect Hardware Frontend AI Developer 上海](https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite/job/China-Shanghai/AI-Developer-Intern---Interconnect-Hardware-Frontend--2027_JR2027468) | RTL、验证、调试、AI 工具 | LLM 工具评测案例 | 立即投，是既往 EDA 经历最直接的迁移岗位 |
| [Apple AI Tools for Hardware Engineering 上海](https://jobs.apple.com/zh-cn/details/200688936/software-engineering-intern-ai-tools-for-hardware-engineering) | Python、硬件测试、自动化和 AI 工具 | TypeScript、数据库、全栈 | 只有能满足至少 4 个月全职时投 |
| [百度 AI Infra J99641 上海](https://talent.baidu.com/jobs/detail/INTERN/3edba1e5-73f5-4dc3-b71f-5d831301bb2e) | Python、PyTorch、国产 GPU 兴趣、评估基础设施 | vLLM、容器、训推实践 | 能承诺至少 5 个月则第 1 至 2 周投 |

NVIDIA 职位标题中的 2027 不等于已经确认接受 2029 届。投递前必须确认毕业年份、实习性质和时长。

### 3.3 项目达闸门后投的岗位

| 岗位或公司池 | 需要先完成的证据 | 最早行动 |
|---|---|---|
| [NVIDIA Developer Tools 上海](https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite/job/China-Shanghai/Software-Engineering-Intern---2027_JR2026972) | C/C++、NSYS/NCU、GPU counter、性能测试 | 第 4 至 5 周 |
| [NVIDIA AI and DL Kernel Libraries 上海](https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite/job/China-Shanghai/Software-Engineer-Intern--AI-and-DL-Kernel-Libraries---2027_JR2026307) | 两个 kernel、C++/CUDA、真实集成、性能解释 | 第 5 周后冲刺 |
| [NVIDIA LLM Inference 上海和北京](https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/AI-Computing-Software-Development-Intern--LLM-Inference---2027_JR2026173) | vLLM benchmark、请求流、KV/调度和 kernel 集成 | 第 6 周 |
| 哔哩哔哩 AI Infra、UCloud 推理优化 | vLLM/SGLang、TTFT/TPOT、Triton、Attention、KV Cache | 第 3 周先投推理，第 5 周补 kernel 结果 |
| 小红书训推基础架构与部署系统 | 推理 benchmark、C++、容器/K8s、资源调度 | 部署岗第 2 周，训推核心第 4 周 |
| 壁仞、沐曦、天数智芯、燧原 | 模型性能、异构适配、算子验证、FDE 排障 | FDE/性能第 1 至 2 周，框架/算子第 5 周 |
| MiniMax、米哈游、阶跃星辰 | 明确上海 headcount；推理或平台职责 | 核实后按闸门投，不占用未确认名额 |

上表除官方链接外均属于候选池，不代表当前一定开放。每次投递前重新核对职位页和 HR 回复。

### 3.4 上海公司与园区分组

| 区域 | 目标池 | 主要方向 | 行动 |
|---|---|---|---|
| 张江与浦东 | NVIDIA、壁仞、沐曦、燧原、天数智芯 | GPU、推理、开发工具、异构适配、性能 | 主战区；通过官网、公开邮箱、校友和招聘活动联系 |
| 漕河泾与徐汇 | 字节、哔哩哔哩、米哈游；MiniMax、小红书按实际办公点核实 | Agent Infra、基模系统、训推、部署平台 | 只投精确团队，不投游戏客户端和通用 AI 应用 |
| 闵行漕河泾科技绿洲 | 蔚来 AI 基础设施 | 训练工具链、数据消融、平台 | 适合作为工程平台主投，先核实出勤和时长 |
| 徐汇滨江与研究机构 | 浦江实验室等 | 模型部署、评测、系统 | 定向询问，不把机构名称误当成地理片区 |

园区调研只记录公开岗位、二维码、邮箱、岗位编号、发布日期和通勤时间。正式投递走官网或公开渠道，不向前台索取私人联系方式。

### 3.5 公司类型的投递策略

**NVIDIA。** 同时准备三份简历：CI/AI Infra 版突出自动化、测试、失败归因和数据管线；Developer Tools 版突出 C++、counter、microbenchmark 和 profiling；Kernel/Inference 版突出 vLLM、KV、Triton 和真实集成。同一周不无差别海投相近岗位，先投最匹配的 2 至 3 个。

**国产 GPU 公司。** 优先顺序是 FDE/模型适配、性能评测、框架、算子。面试材料必须包含最小复现、环境固定、算子支持检查、精度对照、性能回归和问题闭环。不要把 NVIDIA 上的单次结果直接声称可迁移到国产 GPU。

**互联网与基模公司。** 只投推理引擎、训推基础架构、部署系统、GPU 资源管理和模型性能。平台岗突出工程可靠性、容器、调度和故障恢复；推理岗突出请求流、KV、调度和性能；算子岗突出 Triton、CUDA、NCU 和数值正确性。

**Apple、Microsoft、OpenText、DXC、Gitee。** 只有岗位职责命中 AI 工具、硬件工程、云平台、SRE、性能、开发工具或 GPU 生态时进入候选池。品牌不能替代方向；RAG 应用、售前、项目助理和通用支持不进入主线。

**外地岗位。** 只保留最多 2 个高匹配候补。职责必须明显优于上海候选，或允许远程；不因公司名牺牲方向和可持续实习时间。

### 3.6 三份简历与项目叙事

| 简历版本 | 第一项目证据 | 既往经历怎么写 | 目标岗位 |
|---|---|---|---|
| Infra/FDE 版 | benchmark、自动回归、Docker、日志归因、故障复现 | RTL 数据管线、EDA 工具链、多环境调试 | CI、Benchmark、国产 GPU 适配、FDE、部署 |
| 推理系统版 | vLLM 请求流、TTFT/TPOT、调度、Paged KV、Prefix Cache | PyTorch 训练部署与工程交付 | vLLM/SGLang、推理引擎、训推平台 |
| GPU 性能版 | Triton kernel、NSYS/NCU、Roofline、真实替换 | 硬件理解、RTL、体系结构基础 | Developer Tools、Triton、CUDA、GPGPU 性能 |

所有版本只写已完成、可复现、有绝对值和实验条件的结果。未来计划不写成已具备能力。

### 3.7 投递节奏与漏斗

每周投 5 至 8 个上海精准岗位，外地候补不超过 2 个。每个岗位记录公司、岗位编号、来源、技术方向、城市、年份、时长、投递日期、内推人、状态、下一次跟进和面试反馈。

| 阶段 | 每周动作 | 纠偏条件 |
|---|---|---|
| 简历筛选 | 5 至 8 个精准投递，优先官方入口和有效内推 | 连续 2 周无筛选：重写前 1/3 页和项目证据，不继续扩大岗位量 |
| HR 沟通 | 首次只确认年份、上海、时长和实际职责 | 条件不符立即结束，不进入技术准备 |
| 技术面 | 当天记录所有问题、不会点和追问链 | 同类问题连续失败 2 次：下一周项目优先补该证据 |
| 跟进 | 投递后 5 至 7 天跟进一次 | 一次无回复后归档，不重复催促 |
| Offer 比较 | 方向、导师、真实交付、硬件权限、时长、地点 | 不只比较公司名；优先能形成生产级系统证据的岗位 |

### 3.8 投递闸门

| 岗位 | 最低证据 | 最早时间 |
|---|---|---|
| CI、AI 工具、Benchmark、FDE | Python/Linux 工程、自动测试、最小复现和一次问题定位 | 立即 |
| 推理部署与模型适配 | vLLM 可运行、完整 benchmark、环境和日志 | 第 2 周 |
| 推理引擎 | 请求流、调度器、Paged KV/Prefix Cache 原型和 benchmark | 第 3 周 |
| Triton 算子 | 两个 kernel、正确性、多 shape、NCU、原始数据 | 第 5 周 |
| GPGPU 性能 | microbenchmark、counter、假设、控制变量和结论 | 第 5 周 |
| CUDA 高性能库 | C++/CUDA 基础、真实集成、端到端和 kernel 级证据 | 第 6 周后冲刺 |
| 分布式核心 | 多 GPU 或通信实现证据 | 本轮不强制投 |

### 3.9 对外统一口径与 HR 核验

- 上海线下优先；每周 4 至 5 天，连续 3 至 6 个月。需要 5 个月的岗位只在能够兑现时投。
- 2029 届研一，明确询问是否接受日常实习或独立 headcount。
- 首次只问三个问题：是否接受 2029 届及对应时长；实际工作偏框架、性能、异构适配还是部署测试；面试最看重 C++、GPU 算子还是推理系统。
- HR 回复后再问硬件和软件栈、profiler/多卡权限、导师与交付、面试轮次和编码语言。
- 联系顺序：官网或校招系统、公开招聘邮箱、有效校友或团队内推、招聘平台私信。

## 4 唯一作品集项目：单卡小型 vLLM/SGLang

项目名称：基于单块 RTX 5070 Ti 的小型大模型推理运行时、GPU Kernel 与在线服务优化。

本轮只有一块物理 GPU。TP、PP、EP、NCCL、RDMA、跨机 PD 和远程 KV 性能实验全部移出实践主线，替换为阶段一的模型与状态、阶段二的算子与运行时、阶段五的单实例 Serving。双逻辑 Worker 仅作为 P1 控制面练习，可用两个小模型进程、一个 GPU 执行器加两个逻辑队列或 CPU 回放完成；结果不得描述为多卡并行加速。

执行优先级：14 个 P0 模块构成最终项目；7 个 P1 模块最多选 3 个。若 P0 尚未完成，不启动新的 P1。

### 4.1 项目范围与硬件边界

| 层次 | 必做实现 | 边界 |
|---|---|---|
| 模型与状态 | Decoder-only、GQA、Prefill/Decode、逐层 KV、资源账本 | 训练只用微型模型；服务模型按实测显存选择 |
| 单卡 Kernel | RMSNorm、fused SiLU mul、简化 FlashAttention、Nsight、真实路径替换 | 所有性能数字只代表本机单卡和给定 shape |
| 单实例运行时 | Continuous Batching、Chunked Prefill、Paged KV、取消/抢占/释放、Prefix Cache | 不复刻 vLLM 全部功能 |
| 在线服务 | 异步负载、TTFT、TPOT/ITL、Goodput、准入、过载和恢复 | 客户端、调度器、GPU 时间分开 |
| 选做 | INT8、Triton 编译产物、自动调优、CUDA Graph、推测解码、同卡双逻辑 Worker | 不做多卡通信与跨机吞吐结论 |

### 4.2 仓库结构

```text
mini-llm-serving/
  configs/
  model/decoder.py
  model/train_tiny_lm.py
  analysis/resource_ledger.py
  analysis/roofline.py
  runtime/scheduler.py
  runtime/paged_kv.py
  runtime/prefix_cache.py
  runtime/speculative.py
  serving/api.py
  serving/worker.py
  serving/router.py
  workloads/generator.py
  kernels/triton/rmsnorm.py
  kernels/triton/silu_mul.py
  kernels/triton/flash_attention.py
  kernels/triton/int8_matmul.py
  benchmarks/offline.py
  benchmarks/online.py
  profiling/nsys/
  profiling/ncu/
  fault_injection/
  tests/
  results/raw/
  results/csv/
  results/figures/
  report/
  Dockerfile
  README.md
```

### 4.3 固定实验矩阵

| 变量 | 主实验值 | 规则 |
|---|---|---|
| 模型 | 选择能为 KV、profiling 和并发保留显存余量的模型 | 固定 model revision 和 tokenizer；先测显存再定规模 |
| 输入长度 | 128、512、2048、4096 | OOM 时保留至少三档，并记录失败边界 |
| 输出长度 | 32、128、256 | 分开观察 TTFT 与 Decode |
| 并发 | 1、2、4、8、16；按饱和点停止 | 过载时记录排队、拒绝、失败和取消 |
| 到达过程 | 低负载、接近饱和、突发、过载 | 记录目标到达与实际派发时间 |
| 公共前缀 | 0%、50%、90% token 重合 | 比较命中率与节省的 Prefill 工作 |
| dtype | FP16 或 BF16；INT8 为 P1 对照 | 主线先固定一种浮点格式 |
| 重复 | 预热后至少 5 轮 | 报告中位数、P95/P99、范围和样本数 |

每次运行保存 GPU、驱动、CUDA、PyTorch、vLLM、Triton、模型 revision、启动参数、随机种子和源代码 commit。GPU 计时前后同步；冷启动与稳态分开；不把 CPU 模拟数据与 GPU 实测数据混在一张结论表中。

### 4.4 单卡精选集成模块

| 集成模块 | 进入总项目的产物 | 验收条件 | 参考答案路径 |
| :--- | :------- | :--- | :----- |
| 1. Decoder-only、GQA 与逐层 KV（P0） | `model/decoder.py`、Prefill/Decode 接口、无缓存基线 | 缓存与全量重算 token 一致；形状和参数量可审计 | `experiments/ch03/03-08/model.py`、`experiments/ch02/02-01/run.py` |
| 2. 微型 Decoder 训练与恢复（P1） | 训练脚本、checkpoint、损失/吞吐/显存曲线 | 验证区间独立；checkpoint 可恢复；至少两个宽度和随机种子 | `experiments/ch03/03-08/run.py`、`experiments/ch03/03-08/analyze.py` |
| 3. 资源账本与 GQA/MQA/MLA 权衡（P0） | FLOPs、权重/KV/激活流量和容量报告 | 容量、读取、新增写入分开；逻辑表示与实际路径分开 | `experiments/ch02/02-02/run.py`、`experiments/ch02/02-03/run.py` |
| 4. Prefill/Decode Roofline（P0） | 瓶颈预测、实测算力/带宽和误差分析 | 预测与实测同口径；解释瓶颈随 batch/长度变化 | `experiments/ch03/03-01/run.py`、`experiments/ch04/04-03/run.py` |
| 5. 异步负载发生器（P0） | 固定速率、突发、长短混合和多轮 workload | 计划与实际派发分开；记录逐请求事件、队列和 SLO | `experiments/ch03/03-02/run.py`、`experiments/ch03/03-02/README.md` |
| 6. INT8/低比特矩阵乘（P1） | 反量化后 GEMM、kernel 内量化路径、误差报告 | 区分量化误差和实现误差；报告临时显存与 shape 退化 | `experiments/ch04/04-02/run.py`、`experiments/ch04/04-02/analyze.py` |
| 7. Tiled GEMM 与 RMSNorm 归约（P0） | 朴素/分块 GEMM、RMSNorm、tile 扫描 | 独立数值参考通过；解释 tile、寄存器、占用率和边界开销 | `experiments/ch05/05-01/run.py`、`experiments/ch05/05-01/rmsnorm-split/README.md` |
| 8. 简化 FlashAttention forward（P0） | 标准 Attention、分块 Q/K/V、在线 Softmax | 高精度对照通过；显存不按完整分数矩阵平方增长 | `experiments/ch05/05-03/run.py`、`experiments/ch05/05-03/profile.py` |
| 9. 算子融合与舍入顺序（P0） | fused SiLU mul、未融合基线、HBM 流量账本 | 同步边界一致；区分数学等价、逐位相同和容差相同 | `experiments/ch05/05-02/run.py`、`experiments/ch05/05-04/run.py` |
| 10. Triton 分块与编译产物（P1） | 两种 block/warp 配置、IR/PTX/编译日志 | 数值正确；解释访存、线程布局、寄存器或 shared memory | `experiments/ch05/05-05/run.py`、`experiments/ch05/05-05/disassemble.py` |
| 11. Shape 特化与自动搜索（P1） | 配置搜索器、留出 shape、复用阈值 | 搜索与测试 shape 分开；计算编译成本何时回本 | `experiments/ch05/05-06/search_schedule.py`、`experiments/ch05/05-06/evaluate.py` |
| 12. CUDA Graph 与完整 FFN（P1） | eager、融合 eager、Graph、融合 Graph 对照 | 冷/热态分开；输入不被捕获固化；记录固定缓冲成本 | `experiments/ch05/05-08/run.py`、`experiments/ch05/05-08/profile.py` |
| 13. 真实推理路径 Kernel 替换（P0） | 原生/替换交错实验、token 与端到端对照 | profiler 证明新路径执行；用 Amdahl 解释收益边界 | `experiments/ch05/05-09/replacement_worker.py`、`experiments/ch05/05-09/run.py` |
| 14. Batch 与 Prefill/Decode 扫描（P0） | 单卡 batch/长度/公共前缀结果矩阵 | Prefill 与 Decode 分开；客户端与 GPU/引擎时间分开 | `experiments/ch08/08-01/run.py`、`experiments/ch08/08-01/efficiency.py` |
| 15. V0 分阶段调度与 V1 统一调度对照（P0） | V0 Prefill/Decode 调度器、V1 `SchedulerOutput`、token budget、事件时间线 | 同一 trace 对比 TTFT、ITL、吞吐与饥饿；V1 接入总项目 | `../../Downloads/nanovllm/docs/M05_scheduler.md`、`experiments/ch08/08-02/run.py`、`experiments/ch08/08-02/analyze.py` |
| 16. 经典 Paged KV 与 V1 KVCacheManager（P0） | V0 风格 BlockSpaceManager、V1 `BlockPool/KVCacheManager/BlockTable`、生命周期事件 | 两套管理接口均零泄漏；最终用 recompute 抢占接入 V1 | `../../Downloads/nanovllm/docs/M03_paged_kv.md`、`experiments/ch08/08-03/observer.py`、`experiments/ch08/08-03/verify.py` |
| 17. V1 Prefix Cache 与 Agent 多轮历史（P0） | 链式 `BlockHash`、最长完整块前缀、引用计数和 LRU | 命中输出与重算一致；报告 token 加权命中率 | `../../Downloads/nanovllm/docs/M07_prefix_caching.md`、`experiments/ch08/08-04/run.py`、`experiments/ch08/08-04/analyze.py` |
| 18. 推测解码最小实现（P1） | draft/target、并行验证、接受/拒绝、回退 | 贪心模式 token 一致；展示低接受率下的退化 | `experiments/ch08/08-05/PROTOCOL.md`、`experiments/ch08/08-05/README.md` |
| 19. Goodput、准入、过载与能耗（P0） | 到达率扫描、SLO、限流、Goodput 和能耗结果 | 找出吞吐不增而 Goodput/能效下降的过载区 | `experiments/ch08/08-09/run.py`、`experiments/ch08/08-09/energy.py` |
| 20. 同卡双逻辑 Worker 与 Cache-aware Router（P1） | 两队列/两小进程、Round-Robin、最短队列、缓存感知路由 | 同 trace 对照；明确共享 GPU 干扰，不声称并行加速 | `experiments/ch09/09-09/policy-comparison/run.py`、`experiments/ch09/09-09/policy-comparison/analyze.py` |
| 21. 故障、资源回收与 CI（P0） | OOM/取消/缓存失效/进程重启注入、正确性和性能回归 | 恢复后无 KV 泄漏；能复现一次精度失败和性能退化 | `experiments/ch09/09-10/startup/run.py`、`experiments/ch05/05-09/analyze_profiles.py`、`experiments/ch08/08-09/analyze.py` |

### 4.5 详细编码题目

每题至少提交 `README.md`、可运行代码、正确性测试、原始 JSON/JSONL/CSV 和结论。性能题必须记录预热、同步、重复次数、软硬件环境和失败 shape。

工具标注规则：“必用”表示验收材料中必须出现该工具的命令或产物；“推荐”表示遇到性能或正确性问题时优先使用，不强制为每题单独生成报告。NSYS 用于端到端时间线，NCU 用于单 Kernel counter，不用二者互相替代。

#### 1. Decoder-only、GQA 与逐层 KV（P0，CPU/单卡，1～2 天）

不调用现成 Transformer 层，手工实现 Embedding、RoPE、Pre-Norm、Causal Self-Attention、SwiGLU、残差、LM Head 和自回归生成；随后加入 GQA 与逐层 KV Cache。

工具要求：必用 `PyTorch`、`pytest`；推荐 `torch.profiler` 检查算子路径，使用 `torch.cuda.max_memory_allocated()` 或 `nvidia-smi` 核对显存。

验收条件：训练路径使用完整因果 mask；Prefill 与逐 token Decode 的最后位置 logits 在容差内一致；缓存版与全量重算版生成 token 完全一致；打印各层张量形状和参数量。

参考答案路径：`experiments/ch03/03-08/model.py`、`experiments/ch02/02-01/run.py`、`experiments/ch02/02-02/run.py`。

#### 2. 微型 Decoder 训练与恢复（P1，CPU/单卡，1～2 天）

在固定小语料上完成 next-token 或 next-byte 训练，保存初始化、中间和最终 checkpoint；比较至少两个模型宽度和两个随机种子。

工具要求：必用 `PyTorch`、`pytest`、TensorBoard 或等价本地日志；推荐 `torch.profiler`、`nvidia-smi` 记录训练吞吐和峰值显存。

验收条件：checkpoint 能独立恢复；验证区间不与训练区间重叠；报告损失、梯度范数、吞吐、峰值显存和 seed 差异，不能用单次结果推断规模规律。

参考答案路径：`experiments/ch03/03-08/run.py`、`experiments/ch03/03-08/analyze.py`、`experiments/ch03/03-08/PROTOCOL.md`。

#### 3. 资源账本与 GQA/MQA/MLA 权衡（P0，CPU，1 天）

读取真实模型配置，逐层计算投影、Attention、SwiGLU 和 LM Head 的 FLOPs、权重读取、激活读写、KV 写入与常驻容量；增加 GQA、MQA 和 MLA compact/expanded 对照。

工具要求：必用 Python、NumPy、pandas；推荐用 Jupyter 只做交互核对，最终结果必须由脚本生成 CSV/图表。

验收条件：容量、历史读取和新增写入分开；层级与整模型合计守恒；说明逻辑压缩不等于执行路径一定减少相同流量。

参考答案路径：`experiments/ch02/02-02/run.py`、`experiments/ch02/02-03/run.py`。

#### 4. Prefill/Decode Roofline 与单卡校准（P0，CPU/单卡，1 天）

构造长输入短输出与短输入长输出请求，估算计算量、权重读取和 KV 读取，再用 RTX 5070 Ti 实测 Prefill 和 Decode，反推有效算力与带宽。

工具要求：必用 `torch.utils.benchmark` 或 CUDA Event、NSYS；推荐 NCU 的 Speed of Light、Memory Workload Analysis 与 Roofline 图。

验收条件：估算与实测使用同一工作口径；区分峰值上界与实测效率；指出 Decode 从权重带宽受限转向 KV 带宽受限的条件。

参考答案路径：`experiments/ch03/03-01/run.py`、`experiments/ch04/04-03/run.py`。

#### 5. 异步负载发生器（P0，CPU/单卡，1 天）

实现固定速率、突发到达、长短请求混合和多轮会话的异步 workload，记录目标到达、实际派发、首次调度、首 token、逐 token 和完成时刻。

工具要求：必用 Python `asyncio`、`httpx/aiohttp`、JSONL、pandas；推荐 NSYS 检查客户端、调度器与 GPU 时间线是否存在人为串行化。

验收条件：相同请求集合在不同顺序下输入不变；输出 TTFT、TPOT/ITL、端到端延迟、队列长度和实际到达率；不能把计划速率当成实际速率。

参考答案路径：`experiments/ch03/03-02/run.py`、`experiments/ch03/03-02/analyze.py`、`experiments/ch03/03-02/README.md`。

#### 6. INT8/低比特矩阵乘与误差分析（P1，单卡，1～2 天）

实现先反量化再 GEMM 与 kernel 内使用量化权重两条路径，支持 per-tensor 和分组 scale，扫描 batch 和矩阵形状。

工具要求：必用 `pytest`、`torch.utils.benchmark`、NCU；推荐 Triton 或 CUDA 编译日志检查反量化是否产生额外中间张量和访存。

验收条件：与 FP32/FP64 参考比较 max abs、RMSE 和 relative L2；区分量化误差与 kernel 错误；记录临时显存、吞吐和退化 shape。

参考答案路径：`experiments/ch04/04-02/run.py`、`experiments/ch04/04-02/analyze.py`、`experiments/ch04/04-02/PROTOCOL.md`。

#### 7. Tiled GEMM 与 RMSNorm 分块归约（P0，CPU/单卡，1～2 天）

先写朴素 GEMM，再做二维 tiling；同时实现 RMSNorm 整行与拆分归约，扫描 tile、block、warp 配置。

工具要求：必用 Triton、`pytest`、`torch.utils.benchmark`、NCU；推荐查看编译 IR/PTX，并记录寄存器、occupancy、DRAM/L2 与 stall。

验收条件：所有实现通过独立参考；不能只用 occupancy 解释性能；给出 tile 增大后寄存器、并行度、访存和边界开销的权衡。

参考答案路径：`experiments/ch05/05-01/run.py`、`experiments/ch05/05-01/gpu-tiles/README.md`、`experiments/ch05/05-01/rmsnorm-split/README.md`。

#### 8. 简化 FlashAttention forward（P0，单卡，2～4 天）

以标准 Attention 为基线，实现分块 Q/K/V、在线 Softmax 和不物化完整分数矩阵的 forward；优先完成 causal，GQA 作为扩展。

工具要求：必用 Triton、`pytest`、CUDA Event、NCU；推荐 NSYS 与 `torch.cuda.max_memory_allocated()` 对照 kernel 时间线和峰值显存。

验收条件：与高精度基线比较误差；扫描序列长度并记录延迟、峰值显存和读写字节；显存不能按完整注意力分数矩阵的平方速度增长。

参考答案路径：`experiments/ch05/05-03/run.py`、`experiments/ch05/05-03/profile.py`、`experiments/ch05/05-03/README.md`。

#### 9. 算子融合、舍入顺序与中间张量（P0，单卡，1～2 天）

实现未融合和 fused SiLU mul/SwiGLU 子链，记录 kernel 数、HBM 流量、临时显存和耗时，并改变融合顺序观察浮点差异。

工具要求：必用 NSYS、NCU、`pytest`；NSYS 验证 kernel 数与 launch 间隔，NCU 验证 HBM/L2 流量、寄存器和 occupancy。

验收条件：分别说明数学等价、逐位相同和容差相同；列出每个中间张量是否物化；性能比较具有相同同步边界。

参考答案路径：`experiments/ch05/05-02/run.py`、`experiments/ch05/05-04/run.py`。

#### 10. Triton 分块程序与编译产物（P1，单卡，1～2 天）

用 Triton 实现矩阵转置或 GEMM，比较至少两种 block/warp 配置，并导出 IR、PTX 或编译日志。

工具要求：必用 Triton 编译缓存/调试输出、`ptxas -v` 或等价编译日志；推荐 `cuobjdump`/`nvdisasm` 查看 SASS，并用 NCU 解释最终机器码表现。

验收条件：保存硬件目标和编译参数；数值正确；至少解释访存合并、线程布局、寄存器、shared memory 中的两项。

参考答案路径：`experiments/ch05/05-05/run.py`、`experiments/ch05/05-05/disassemble.py`、`experiments/ch05/05-05/README.md`。

#### 11. Shape 特化、自动搜索与复用阈值（P1，单卡，1～2 天）

为多个 shape 搜索 block/warp/stage 配置，保留搜索成本、最优配置和热态运行时间，并在留出 shape 上验证。

工具要求：必用 Triton autotune 或自写搜索器、`torch.utils.benchmark`、pandas；推荐 NCU 抽查最佳与失败配置，避免只按耗时猜原因。

验收条件：搜索与测试 shape 分离；报告非最佳样本；计算配置至少复用多少次才能覆盖编译/搜索成本，并展示分布变化后的失效案例。

参考答案路径：`experiments/ch05/05-06/search_schedule.py`、`experiments/ch05/05-06/evaluate.py`。

#### 12. CUDA Graph、融合与完整 FFN（P1，单卡，1～2 天）

对固定 shape FFN 比较 eager、融合 eager、CUDA Graph 重放和融合 Graph，分别记录 CPU 提交、GPU 执行、捕获和输入复制。

工具要求：必用 PyTorch CUDA Graph、NSYS、CUDA Event；推荐 `torch.profiler` 检查 graph break、输入复制和 eager fallback。

验收条件：图捕获不固化旧输入；冷启动与稳态分开；说明 Graph 与融合各自消除什么开销以及固定缓冲代价。

参考答案路径：`experiments/ch05/05-08/run.py`、`experiments/ch05/05-08/profile.py`、`experiments/ch05/05-08/analyze.py`。

#### 13. 在真实推理路径替换一个 Kernel（P0，单卡，2～4 天）

在固定版本的推理引擎或 mini Transformer 中替换一个热点 kernel，完成原生/替换路径的交错实验。

工具要求：必用 NSYS、NCU、`pytest`/token 回归测试；推荐 `torch.profiler` 或框架日志证明 dispatch 到替换实现。

验收条件：保存前后源码哈希；输出 token 一致；profiler 证明替换路径实际执行；报告算子时间、端到端时间并用 Amdahl 解释差异。

参考答案路径：`experiments/ch05/05-09/replacement_worker.py`、`experiments/ch05/05-09/run.py`、`experiments/ch05/05-09/analyze_profiles.py`。

#### 14. Batch 与 Prefill/Decode 效率扫描（P0，单卡，1～2 天）

固定模型，扫描输入长度、输出长度、batch 和公共前缀，记录逐轮 token、上下文量、耗时、吞吐和显存。

工具要求：必用 vLLM/自研 benchmark CLI、pandas、`nvidia-smi` 或 `pynvml`；推荐 NSYS 抽查 Prefill、Decode 和 CPU 调度边界。

验收条件：Prefill 与纯 Decode 轮次分开；客户端与 GPU/引擎时间分开；反推出有效算力/带宽并记录 OOM 边界。

参考答案路径：`experiments/ch08/08-01/run.py`、`experiments/ch08/08-01/efficiency.py`、`experiments/ch08/08-01/analyze.py`。

#### 15. V0 分阶段调度与 V1 统一调度对照（P0，CPU/单卡，2～3 天）

先实现经典 V0 基线：分别维护 Prefill 与 Decode 调度路径，显式判断请求当前阶段，在 token/KV 预算内决定先接纳 prompt 还是推进 decoding。保留每轮队列、请求阶段、调度 token 数和完成事件。

再实现 V1 的 `Request` waiting/running/finished 状态、`SchedulerOutput`、token budget 和 continuous batching。每轮统一计算请求尚未计算的 token 数，再由预算截断：

```python
num_new_tokens = request.num_tokens_with_spec - request.num_computed_tokens
num_new_tokens = min(num_new_tokens, token_budget)
```

V1 中 Prefill、Chunked Prefill 和 Decode 共用这一套调度逻辑。Chunked Prefill 是长请求的剩余 token 被本轮预算截断；Decode 是请求仅剩下一步 token。KV 不足时抢占运行队列尾部，释放块并将请求放回 waiting，之后重新计算。最终总项目使用 V1，V0 只保留为历史基线和反例生成器。

工具要求：必用 `pytest`、确定性 trace/replay、JSONL 事件日志、pandas；推荐 Hypothesis 做状态机属性测试，并用时间线图检查队列与调度事件。

验收条件：两套调度器运行完全相同的请求集合、到达顺序和预算；请求状态跨迭代保存；每轮调度 token 总数不超过预算；Chunked Prefill 中间轮不产生输出 token；输出 TTFT、最大 ITL、完成时间、吞吐和队列长度，并解释 V0/V1 各自出现饥饿或尾延迟恶化的条件。

参考答案路径：`../../Downloads/nanovllm/docs/M05_scheduler.md`、`experiments/ch08/08-02/run.py`、`experiments/ch08/08-02/analyze.py`、`experiments/ch08/08-02/verify.py`。

#### 16. 经典 Paged KV 与 V1 KVCacheManager（P0，CPU/单卡，2～3 天）

先实现经典 Paged KV 数据结构：固定大小的逻辑/物理 token block、block table、空闲块队列、引用计数和逻辑位置到物理 slot 的转换；用 V0 风格 `BlockSpaceManager` 接口完成 `can_allocate/allocate/can_append_slots/append_slots/free`。CPU KV swap 只作可选的控制面模拟，不进入单卡总项目。

再实现 V1 的 `BlockPool`、`KVCacheManager` 和 Worker 侧 `BlockTable`，使用 `allocate_slots()`、`free()` 和 `SchedulerOutput` 传递块变化。抢占采用 recompute：释放请求持有的块、重置已计算进度并重新进入 waiting。最终总项目接入 V1 路径。

工具要求：必用 `pytest`、随机 trace/replay、块生命周期审计；推荐 Hypothesis 生成 allocate/append/free/preempt/cancel 序列，GPU 集成后用 Compute Sanitizer 检查越界。

验收条件：两套管理接口使用相同的 allocate/append/free/cancel trace；随机压力测试后空闲块数回到初始值，无泄漏、双重释放和跨请求覆盖；取消或结束请求不再占块；跨 block 和非整块尾部的 slot mapping 正确；导出完整块生命周期并比较两套接口的状态复杂度。

参考答案路径：`../../Downloads/nanovllm/docs/M03_paged_kv.md`、`experiments/ch08/08-03/observer.py`、`experiments/ch08/08-03/run.py`、`experiments/ch08/08-03/verify.py`。

#### 17. V1 Prefix Cache 与 Agent 多轮历史（P0，CPU/单卡，1～2 天）

实现父块哈希与当前完整 token block 组成的链式 `BlockHash`，维护 hash 到物理块的索引、引用计数和 LRU。新请求只复用从开头连续命中的最长完整块前缀；最后一个未填满的 block 不进入 Prefix Cache。用多轮消息测试系统提示、工具定义、工具结果和历史改写。

工具要求：必用 `pytest`、固定 token trace、缓存事件日志、pandas；推荐 Hypothesis 生成前缀命中/改写/淘汰序列，并用火焰图或 `cProfile` 检查哈希管理开销。

验收条件：命中基于 token id 和父哈希而非字符串猜测；相同前缀增加引用计数；单 token 改写从对应 block 起失配；淘汰时清理旧哈希映射；命中输出与全量重算一致；报告 token 加权命中率和节省的 Prefill 工作。

参考答案路径：`../../Downloads/nanovllm/docs/M07_prefix_caching.md`、`experiments/ch08/08-04/run.py`、`experiments/ch08/08-04/analyze.py`、`experiments/ch08/08-04/README.md`。

#### 18. 推测解码最小实现（P1，单卡，2～3 天）

实现 draft 生成、target 并行验证、接受/拒绝、回退和动态草稿长度；先完成贪心一致性，再选做随机采样。

工具要求：必用 `pytest`、CUDA Event、pandas；推荐 NSYS 分解 draft/target/verify 时间，并用 `torch.profiler` 检查验证批次形状。

验收条件：贪心模式与 target 逐 token 结果完全一致；记录每轮草稿数、接受数、验证时间和每输出 token 成本；展示低接受率退化。

参考答案路径：`experiments/ch08/08-05/PROTOCOL.md`、`experiments/ch08/08-05/README.md`。

#### 19. 到达率、Goodput、准入与能耗（P0，单卡，2～3 天）

对多个到达率比较直接接纳、限流和 admission control，计算吞吐、SLO 达标率、Goodput、能耗及每个合格结果的能耗。

工具要求：必用异步负载发生器、pandas、`nvidia-smi --query-gpu` 或 `pynvml` 功耗采样；推荐 Prometheus/Grafana 或等价本地时序图，NSYS 只抽查代表性负载点。

验收条件：迟到或错误结果消耗的能量计入分母；找到吞吐不再增长但 Goodput/能效恶化的过载区；保留完整请求事件。

参考答案路径：`experiments/ch08/08-09/run.py`、`experiments/ch08/08-09/energy.py`、`experiments/ch08/08-09/analyze.py`。

#### 20. 同卡双逻辑 Worker 与 Cache-aware Router（P1，单卡/多进程，1～2 天）

建立两个逻辑队列或两个小模型进程，实现 Round-Robin、最短队列和缓存感知路由；用相同 trace 比较命中、排队和 Goodput。

工具要求：必用 Python multiprocessing/asyncio、`psutil`、`pynvml`、JSONL；推荐 NSYS 的多进程采集和时间同步，定位同卡进程之间的 GPU 竞争。

验收条件：记录两个 Worker 的显存、队列和 GPU 时间；明确共享同一 GPU 的资源竞争；只评价路由逻辑，不声称获得多卡吞吐扩展。

参考答案路径：`experiments/ch09/09-09/policy-comparison/run.py`、`experiments/ch09/09-09/policy-comparison/analyze.py`、`experiments/ch09/09-09/policy-comparison/README.md`。

#### 21. 故障、资源回收与 CI（P0，CPU/单卡，1～2 天）

注入 OOM、请求取消、缓存失效、进程重启和性能阈值退化，建立统一的正确性、资源和性能回归。

工具要求：必用 `pytest`、CI（GitHub Actions 或等价平台）、进程/显存日志和固定 benchmark；推荐 Compute Sanitizer、NSYS、`git bisect` 与超时/故障注入脚本。

验收条件：失败后无 KV 泄漏或半成品状态；进程恢复时区分启动、就绪、首请求和积压排空；自动复现一次精度失败和一次性能退化。

参考答案路径：`experiments/ch09/09-10/startup/run.py`、`experiments/ch09/09-10/startup/analyze.py`、`experiments/ch05/05-09/analyze_profiles.py`、`experiments/ch08/08-09/analyze.py`。

### 4.6 集成顺序与闸门

| 闸门 | 集成结果 | 通过条件 |
|---|---|---|
| A：正确模型 | 模块 1、3、4 | 缓存/无缓存 token 一致；账本守恒；预测与实测口径一致 |
| B：单卡 Kernel | 模块 7、8、9 | 数值正确；覆盖边界 shape；有 Nsight 和显存证据 |
| C：单实例运行时 | 模块 5、14、15、16、17 | 完整请求事件、调度指标、Prefix 命中和零 KV 泄漏 |
| D：真实集成 | 模块 13、19、21 | kernel 确实执行；端到端可解释；过载与故障可恢复 |
| E：岗位选做 | P1 最多三个 | Kernel 岗选 6/10/11/12；Serving 岗选 2/18/20 |

### 4.7 最终验收

1. 14 个 P0 模块均有代码、测试、原始数据、环境和结论；P1 最多完成 3 个。
2. Decoder Prefill/Decode、逐层 KV 与无缓存基线 token 一致。
3. RMSNorm、fused SiLU mul、简化 FlashAttention 通过正确性和 shape 扫描。
4. 至少一份 NSYS、两份 NCU 和一个真实路径 kernel 替换可解释。
5. Continuous Batching、Paged KV、Prefix Cache、取消/抢占和零泄漏测试通过。
6. Batch、长度、到达率、公共前缀与过载扫描覆盖 TTFT、TPOT/ITL、吞吐、Goodput、显存和队列。
7. 完成一次 OOM、缓存失效或进程重启故障实验并验证恢复。
8. 报告明确哪些结论来自真实单卡、CPU 模拟或同卡多进程，不外推多卡收益。

综合参考入口：`experiments/ch02/`、`experiments/ch03/`、`experiments/ch04/`、`experiments/ch05/`、`experiments/ch08/`、`experiments/ch09/09-09/`、`experiments/ch09/09-10/`。完整 35 题题库见 `AI-Infra-实习编码练习路线.md`。

## 5 八周执行计划

### 第 1 周 11 月 16 日至 11 月 22 日

技术：建立项目仓库和环境锁；完成 Decoder-only、GQA、逐层 KV 一致性；完成资源账本、GQA/MQA/MLA 对照和 Prefill/Decode Roofline；跑通 Transformers 与 vLLM 最小请求。

交付：环境清单、模型单测、资源账本、Roofline 预测、仓库 README 骨架。

求职：投 NVIDIA AI CI/CD、AI Infra Development、Interconnect Hardware Frontend；满足 4 个月全职则投 Apple；确认百度 5 个月要求和 2029 届资格。

C++：数组、字符串、哈希、vector、string、map、unordered_map，共 8 至 10 题。

### 第 2 周 11 月 23 日至 11 月 29 日

技术：实现异步负载发生器；完成 Batch、输入/输出长度、公共前缀和到达率扫描；记录 TTFT、TPOT/ITL、吞吐、Goodput、显存、队列和 P50/P95/P99；确定单卡饱和点与 OOM 边界。

交付：workload 配置、请求事件日志、原始 JSON/CSV、两张图、一页异常分析和可复现命令。

求职：主投百度 J99641、上海 FDE、Benchmark、模型适配和部署岗位；更新简历加入 benchmark，但不写未完成的优化结果。

C++：指针、引用、const、new/delete、malloc/free、RAII，共 8 至 10 题。

### 第 3 周 11 月 30 日至 12 月 6 日

技术：先完成 V0 的 Prefill/Decode 分阶段调度与 BlockSpaceManager/Paged KV 基线，再完成 V1 统一 token-budget 调度、KVCacheManager、Chunked Prefill、取消释放和 Prefix Cache；画出两条请求路径及差异。

交付：调度时间线、KV 块生命周期、泄漏压力测试、请求流图。

求职：达到推理引擎投递闸门；投 vLLM/SGLang、推理部署、小红书训推或部署、UCloud 类岗位；所有非官方岗位投前复核。

C++：类、继承、虚函数、智能指针、拷贝和移动，共 8 至 10 题。

### 第 4 周 12 月 7 日至 12 月 13 日

技术：完成 tiled GEMM、Triton RMSNorm 与 fused SiLU mul；覆盖 hidden size、dtype、非整除 shape 和边界输入；建立 PyTorch 与高精度参考。

交付：三个基础路径、单测、tile/shape 扫描、GB/s/流量对照和一个失败 shape 的原因记录。

求职：准备 NVIDIA Developer Tools 和国产 GPU 性能/FDE 面试；如果只有一个可用 kernel，不投高性能库岗位。

C++：模板、lambda、STL 算法、迭代器和异常安全，共 8 至 10 题。

### 第 5 周 12 月 14 日至 12 月 20 日

技术：完成简化 FlashAttention forward：标准 Attention 基线、分块 Q/K/V、在线 Softmax 和不物化完整分数矩阵；用 Nsight Compute 分析 DRAM、L2、occupancy、register 和 stall；CUDA Graph 只做一次热态对照。

交付：FlashAttention 正确性与长度扫描、峰值显存曲线、两份 NCU 对照、性能断点分析和统一回归测试。

求职：达到 Triton/GPGPU 投递闸门；选择性投 NVIDIA Developer Tools、Kernel Libraries、UCloud、沐曦、壁仞和模型性能岗位。

C++：线程、mutex、condition_variable、atomic、生产者消费者，共 8 至 10 题。

### 第 6 周 12 月 21 日至 12 月 27 日

技术：将一个 kernel 接入 mini Transformer 或受控推理路径；做原生/替换交错实验；注入 OOM、取消或缓存失效；补 Docker、配置、正确性和性能回归。

交付：token 一致性、端到端时间、kernel 时间、Amdahl 分析、故障恢复记录和一键复现。

求职：按实际结果更新简历；投 LLM Inference、推理引擎和 kernel 冲刺岗；未达到正确性与复现标准时不投 kernel 核心岗。

C++：内存模型、false sharing、缓存局部性、性能调试；完成两次 35 分钟模拟笔试。

### 第 7 周 12 月 28 日至 1 月 3 日

技术：先补齐所有 P0 闸门；然后按岗位最多选三个 P1。Kernel 岗从 INT8、Triton 编译产物、自动调优、CUDA Graph 中选；Serving 岗从微型训练、推测解码、同卡双逻辑 Worker 路由中选。

交付：每个选做项都必须有正确性、原始数据和一个定量结论；未完成 P0 时本周只补主线，不启动选做。

求职：对前六周岗位跟进一次；从面试反馈决定下一批，不按公司名海投。

C++：图、堆、二分、动态规划混合限时题；整理错题模板。

### 第 8 周 1 月 4 日至 1 月 10 日

技术：冻结功能；补测试、环境、原始数据、图表、README、技术报告和五分钟演示。删除无法复现或没有结论的实验。

交付：公开仓库或可分享压缩包、项目报告、简历版本、五分钟讲稿、十个项目追问答案、两次模拟面试记录。

求职：复盘投递漏斗；补投 3 至 5 个精准岗位；确认寒假和下学期到岗安排。

C++：总题量达到至少 60 道，其中中等题不少于 35 道；重做全部错题。

## 6 面试流程与岗位考核

### 6.1 通用流程

| 环节 | 主要考核 | 准备结果 |
|---|---|---|
| 简历筛选 | 毕业年份、到岗时长、城市、岗位关键词、项目真实性 | 三版简历分别命中推理、GPU 性能、工具链/FDE |
| 笔试或在线编程 | 1 至 3 道算法题，部分岗位要求 C++ | 35 分钟内写出、调通并说明复杂度 |
| 技术一面 | 项目深挖、基础知识、现场编码 | 五分钟项目介绍；每个数字能追溯到数据和命令 |
| 技术二面 | 框架、性能、系统设计、故障定位 | 从现象到 counter、假设、控制变量和结论 |
| 主管面 | 技术判断、取舍、交付能力、岗位匹配 | 明确能做什么、不能做什么、如何验证 |
| HR 面 | 到岗、时长、稳定性、流程安排 | 统一口径：上海、每周 4 至 5 天、连续 3 至 6 个月 |

### 6.2 各方向最低通过标准

| 方向 | 必考内容 | 最低证据 |
|---|---|---|
| 推理引擎 | 请求流；Prefill/Decode；TTFT/TPOT；Continuous Batching；Paged KV；Prefix Cache；Chunked Prefill；CUDA Graph；动态 shape | 能画出 vLLM 请求路径，计算 KV 容量，并解释一次 benchmark 异常 |
| Triton/GPU 性能 | thread/block/warp/SM；存储层次；合并访存；bank conflict；分支发散；occupancy/register；block/warps/stages | 两个 kernel 的正确性、shape 矩阵、NCU 报告和失败案例 |
| Benchmark/FDE | 部署流程；最小复现；回归测试；OOM、精度、动态 shape、不支持算子、编译失败 | 一份完整 issue 报告：环境、复现、日志、定位、修复或绕行、自动验证 |
| GPGPU 架构/性能 | microbenchmark；延迟、吞吐、occupancy；cache、带宽、counter；模拟器与真机差异 | 用一个 kernel 建立“现象—counter—假设—实验—结论”链路 |
| CUDA 高性能库 | C++/CUDA；算子语义；tile、归约、融合；数值稳定；端到端集成 | 能解释 kernel 级收益为何没有等比例转化为端到端收益 |
| 编译器/分布式 | IR、layout、fusion、tiling、codegen；TP/PP/EP/SP/CP；collective | 本轮只要求能判断瓶颈边界，不作为主投方向 |

KV Cache 面试计算统一使用：`2 × layers × kv_heads × head_dim × cached_tokens × bytes_per_element`。回答时必须区分单 token、单请求、整批请求和总显存。

### 6.3 五分钟项目介绍

1. 问题：目标负载、硬件和指标。
2. 基线：模型、版本、shape、dtype、预热、同步和绝对性能。
3. 定位：时间线、counter 和瓶颈证据。
4. 修改：改了哪条数据路径、调度行为或 kernel。
5. 结果：正确性、绝对值、相对值、P95/P99、显存和失败 shape。
6. 边界：结论不能外推到哪里，下一步如何验证。

## 7 近期面经维度与高频自测

### 7.1 公开面经只用于识别考核维度

| 公司/方向 | 公开面经反复出现的维度 | 对应准备 |
|---|---|---|
| 字节跳动 AI Infra | C++、算法、项目深挖、推理框架、GPU 性能、分布式基础 | 推理版简历；vLLM 路径；C++ 限时题 |
| 华为昇腾/推理 | C++、算子与图优化、模型部署、故障定位、硬件理解 | FDE 问题单；算子语义；动态 shape 与精度排查 |
| 沐曦 Infra/FDE | Linux/Python/C++、部署测试、国产 GPU 适配、客户问题闭环 | 最小复现、日志、回归和环境矩阵 |
| 沐曦推理/算子 | CUDA/Triton、显存与带宽、推理性能、kernel 优化 | 两个 kernel；NCU；端到端集成 |
| 寒武纪 | C++、算子开发、性能分析、编译与运行时基础 | microbenchmark；算子正确性；瓶颈判断 |
| 摩尔线程 | GPU 架构、CUDA/C++、算子、模型适配和工具链 | GPGPU 性能链路；工具链/FDE 备用叙事 |
| 科大讯飞推理 | 模型部署、量化、服务性能、工程排障 | benchmark；服务指标；部署问题闭环 |

面经中的具体题目不视为当前岗位题库；只提炼稳定考点，岗位状态和要求以官方页面及 HR 确认为准。

### 7.2 必须脱稿回答的 20 题

| # | 问题 | 合格答案必须包含 |
|---:|---|---|
| 1 | vLLM 中一个请求如何执行？ | 入口、调度、KV block、模型执行、采样、输出 |
| 2 | Prefill 与 Decode 为什么性能特征不同？ | 并行度、算术强度、权重/KV 读取、batch 变化 |
| 3 | 如何计算 KV Cache？ | 完整公式、GQA/MQA 差异、并发与长度 |
| 4 | Continuous Batching 解决什么问题？ | 到达/完成动态性、slot 利用率、调度开销 |
| 5 | CUDA Graph 何时有效，何时失效？ | launch 开销、静态捕获、动态 shape、内存地址约束 |
| 6 | 如何证明 kernel 是 memory-bound？ | 算术强度、Roofline、DRAM/L2、SM 利用率、对照实验 |
| 7 | occupancy 高为什么仍可能很慢？ | 指令依赖、访存延迟、吞吐上限、stall、无效工作 |
| 8 | 为什么某些 shape 突然变慢？ | tile 边界、尾块、对齐、寄存器、编译配置 |
| 9 | Softmax 如何保证数值稳定？ | 减最大值、归约精度、exp、边界输入 |
| 10 | RMSNorm 可融合什么？ | 读取/写回、归约、scale、dtype 转换及融合代价 |
| 11 | 什么是 shared-memory bank conflict？ | bank 映射、访问模式、广播例外、padding/布局修复 |
| 12 | 什么是合并访存？ | warp 地址连续性、事务数、对齐和步长 |
| 13 | `new/delete` 与 `malloc/free` 有何区别？ | 构造析构、类型、失败行为、配对规则 |
| 14 | RAII 和智能指针解决什么？ | 所有权、异常安全、`unique_ptr`/`shared_ptr`/`weak_ptr` |
| 15 | move 语义有什么收益和风险？ | 资源转移、右值引用、移动后有效但未指定状态 |
| 16 | 在线 Softmax 为什么能用于 FlashAttention？ | running max、running sum、重缩放、分块合并、数值稳定 |
| 17 | INT8 结果变差如何区分量化误差和 Kernel 错误？ | 高精度参考、scale 粒度、误差指标、反量化对照、边界 shape |
| 18 | 如何设计可信 benchmark？ | 环境、基线、预热、同步、重复、分位数、原始数据 |
| 19 | 线上回归如何定位？ | 复现、二分、时间线、counter、控制变量、回归测试 |
| 20 | 优化前为什么必须固定基线？ | 可比性、归因、回退、绝对值和统计波动 |

## 8 HR 沟通与投递模板

### 8.1 首次联系

您好，我是上海交通大学电子信息专业 2029 届研一学生，优先考虑上海线下岗位，可每周 4 至 5 天、连续实习 3 至 6 个月。此前有 Python、RTL 数据管线和 EDA 工具链经历，也完成过 PyTorch 混合精度训练与部署；目前在做 vLLM V1 推理性能分析、Triton 算子与 Nsight profiling。想确认：岗位是否接受 2029 届日常实习；工作更偏推理框架、GPU 性能、国产 GPU 适配还是部署测试；面试更侧重 C++、GPU 算子还是推理系统。若条件匹配，我会从官方入口投递。

### 8.2 暂无公开岗位时的询问

您好，我关注贵司在 `[推理引擎/GPU 性能/工具链/FDE]` 方向的工作。目前官网未看到与 2029 届、上海日常实习完全匹配的岗位，想确认团队近期是否有独立实习 headcount、滚动招聘或可由招聘负责人接收简历的渠道。我可每周 4 至 5 天、连续 3 至 6 个月，并可提供 vLLM/Triton/性能分析项目材料。

### 8.3 HR 回复后只确认六项

1. 岗位是日常实习、暑期实习还是转正导向。
2. 是否接受 2029 届；是否限制毕业月份。
3. 城市和实际办公园区；是否要求全程线下。
4. 每周最少天数、最短连续时长和最早到岗日。
5. 团队实际工作及技术面重点；岗位描述是否对应当前团队。
6. 官方投递入口、内推方式、流程节点和反馈周期。

### 8.4 联系顺序

`官方职位页/校招系统 → 官方招聘邮箱或公众号 → 已验证员工内推 → 招聘平台 HR → 园区或校友渠道`。外企和大厂先核毕业年份与实习类型；国产 GPU 公司先核上海团队、国产卡适配场景和岗位归属；园区只作为找公司线索，不能替代官方岗位核验。

## 9 验收与面试前检查

### 9.1 每周验收

- 代码可从干净环境运行；结论有原始 JSON/CSV/日志。
- 有正确性、边界 shape、失败 shape 和性能回归测试。
- 性能数字记录硬件、版本、预热、同步、重复次数和分位数。
- 完成 8 至 10 道 C++ 题并重做错题。
- 完成 5 至 8 个精准岗位的投递、询问或跟进，并更新漏斗。
- 下周只设一个主要技术交付，不新增并行主线。

### 9.2 1 月 10 日最终验收

- [ ] Decoder-only、GQA 和 KV Cache 正确性通过。
- [ ] 资源账本守恒；Prefill/Decode Roofline 的预测与实测使用同一口径。
- [ ] vLLM benchmark 覆盖至少三档输入、两档输出和三档并发。
- [ ] 调度、Paged KV 和 Prefix Cache 原型通过随机压力测试。
- [ ] RMSNorm 与 fused SiLU mul 均有正确性、性能和失败 shape。
- [ ] 简化 FlashAttention forward 通过高精度对照，并完成长度、显存和延迟扫描。
- [ ] 至少一份 NSYS 和两份 NCU 报告可解释。
- [ ] 一个 kernel 接入真实或受控推理路径，并完成 Amdahl 分析。
- [ ] 完成到达率、Goodput、准入与过载扫描，以及一次 OOM、缓存失效或进程重启实验。
- [ ] 14 个 P0 模块全部完成；P1 最多选择 3 个，同卡双逻辑 Worker 不作为必做。
- [ ] 图表可由脚本从原始数据生成；README、环境和复现命令完整。
- [ ] C++ 至少 60 题，其中中等题至少 35 题。
- [ ] 完成两次模拟面试和一次五分钟项目演示录像。
- [ ] 投递表记录岗位、来源、版本、状态、跟进、反馈和下一动作。

### 9.3 每场面试前检查

| 检查项 | 通过条件 |
|---|---|
| 项目真实性 | 简历每个数字都能定位到命令、原始数据和提交 |
| 项目表达 | 五分钟版本和一分钟版本均可脱稿完成 |
| 推理系统 | 能画请求流；解释 Prefill/Decode、KV、调度和缓存 |
| GPU 基础 | 能解释 warp/SM、存储层次、合并访存、bank conflict、occupancy |
| 性能方法 | 能从现象走到 counter、假设、控制变量和回归验证 |
| Triton | 能手写核心索引和 mask；解释 block/warps/stages 的取舍 |
| C++ | RAII、智能指针、move、虚函数、STL、并发基础无明显盲区 |
| 算法 | 最近一周完成一次限时模拟；错题可无提示重写 |
| 岗位条件 | 年份、城市、时长、面试语言和团队方向已核实 |

## 10 简历项目描述模板

只在取得真实结果后填写数字：

- 构建基于 vLLM V1 的推理 benchmark，覆盖输入长度、输出长度和并发矩阵，测量 TTFT、TPOT、吞吐、P95/P99 与显存，并用 Nsight Systems 定位 CPU 提交和 GPU 执行关键路径。
- 实现 Triton RMSNorm 与 fused SiLU mul，使用高精度参考和随机/边界 shape 回归验证；结合 Nsight Compute 分析 DRAM、L2、occupancy、register 与 stall，将指定 shape 的延迟从 `[基线]` 优化至 `[结果]`。
- 实现 Continuous Batching、Chunked Prefill、Paged KV 和 Prefix Cache 最小原型，支持取消、引用计数和写时复制，并通过随机压力测试验证无 KV 泄漏。
- 将 `[kernel]` 接入 `[真实或受控推理路径]`，在输出 token 一致的前提下比较 kernel 与端到端收益，并用 Amdahl 分析解释收益边界。

## 11 风险与强制纠偏

| 风险信号 | 立即动作 |
|---|---|
| 一周仍在搭环境 | 固定一个模型、一个 GPU、一个版本；先交付 CPU 模拟和最小 GPU 基线 |
| 项目范围继续扩张 | 只做 14 个 P0；P1 最多三个；不新增多卡、跨机、PD 或远程 KV 实验 |
| 只有曲线没有原始数据 | 停止新增实验，先补 JSON/CSV、脚本、环境和复现 |
| benchmark 波动大 | 固定环境、预热、同步、重复和交错顺序；报告范围与分位数 |
| 只能调用框架，讲不清源码 | 输出请求/数据路径图，并定位到实际类、函数和关键状态 |
| C++ 题能说不能写 | 全部算法题改用 C++，35 分钟限时，次日无提示重写 |
| 高难岗位连续失败 | 回到 Benchmark、FDE、国产 GPU 适配和部署岗位，达闸门后升级 |
| 年份或时长不符 | 不硬投；询问日常实习、滚动招聘或独立 headcount |
| 上海岗位池不足 | 扩展到昆山/苏州可通勤团队、远程协作和北京/深圳暑期机会，但上海仍优先 |
| 把传闻或未来岗位当事实 | 所有公司扩张、融资、园区和岗位信息都在投递当天重新核验 |
| 第 6 周主线未完成 | 取消扩展，集中完成集成、测试、README、报告和投递材料 |

## 12 参考资料与核验规则

### 12.1 技术资料

| 用途 | 首选资料 |
|---|---|
| vLLM 架构、使用和 benchmark | [vLLM 官方文档](https://docs.vllm.ai/)与仓库当前版本代码；实验记录固定 commit |
| Triton 语义与 kernel 写法 | [Triton 官方教程](https://triton-lang.org/main/getting-started/tutorials/index.html) |
| CUDA 性能方法 | [CUDA C++ Best Practices Guide](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/) |
| Nsight Compute counter | [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/) |
| Nsight Systems 时间线 | [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/) |
| PyTorch 正确性与基线 | [PyTorch 官方文档](https://docs.pytorch.org/docs/stable/index.html) |

### 12.2 岗位资料优先级

1. 公司官方职位页、校招系统、官方招聘账号和招聘邮箱。
2. HR 或团队成员对年份、城市、时长、团队归属的书面确认。
3. 招聘平台和园区名录只用于发现线索，投递前回到官方渠道核验。
4. 公开面经只用于识别考核维度，不证明岗位仍开放，也不证明题目会复现。

文中岗位链接用于建立候选池，不等于岗位持续开放。每次投递当天记录核验日期、官方链接、岗位编号、城市、毕业年份、实习类型、时长要求和联系人结论。
