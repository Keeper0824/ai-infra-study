# AI Infra 实习编码练习路线

这份练习按照实际系统的依赖关系排列，而不是按照书的章节顺序排列：先实现模型和算子，再建立性能模型，随后进入多卡并行、网络、单实例推理服务和分布式推理服务。

全文共 35 题。这里只精选能形成实现、测试、性能分析或系统设计作品的题目，不追求覆盖每个章节实验。参考路径均相对于仓库根目录，也就是本文档所在目录。

综合规划中的“11 个必做模块”不是从这里机械保留 11 道题，而是把多道相关练习合并成模型、运行时、负载、Kernel、profiling、多 Worker 和可靠性 11 个可集成模块。35 题用于按岗位补强；两个月内以 11 个模块和一个最终系统为主。

## 使用方法

- **P0**：建议在投递推理系统、Serving、分布式推理实习前完成。
- **P1**：对具体岗位很有帮助，建议按方向选择。
- **P2**：研究型、硬件型或生产平台型进阶题。
- 先只看题目和验收条件，自己新建实现；完成后再查看“参考答案路径”。
- 参考目录中的代码有些是完整实测，有些是分析器或模拟器。它们是核对思路和结果的参考，不应直接复制成自己的提交。
- 没有多卡或高速网络时，先做 CPU 多进程、事件模拟和离线回放；题目明确要求的真实性边界必须写进报告。

每题至少交付：`README.md`、可重复运行的代码、正确性测试、原始 JSON/JSONL 数据、结果分析。性能题还应给出预热次数、同步位置、样本数、分位数和软硬件环境。

## 阶段一：模型、状态与负载

### 1. 因果依赖与 KV Cache 一致性（P0，CPU，3～5 小时）

实现一个极小的 RNN 和因果 Transformer，分别支持“每步重算历史”和“复用历史状态”。输出依赖图，并统计生成一个新 token 的矩阵工作量、状态容量和读取量。

验收条件：缓存与不缓存的 logits 在给定容差内一致；能解释 RNN 状态定长而 Transformer KV 随序列长度线性增长；测试至少覆盖 1、4、16 token。

参考答案路径：`experiments/ch02/02-01/run.py`，结果说明见 `experiments/ch02/02-01/README.md`。

### 2. 从零实现 Decoder-only Transformer（P0，CPU/GPU，1～2 天）

不要调用现成 Transformer 层，手工实现 Token Embedding、位置编码或 RoPE、Pre-Norm、Causal Self-Attention、MLP、残差连接、LM Head 和自回归生成。第二阶段加入 GQA 和逐层 KV Cache。

验收条件：训练时使用完整因果 mask；Prefill 与逐 token Decode 的最后位置 logits 一致；KV Cache 版本和全量重算版本生成 token 完全一致；能打印每层张量形状和参数量。

参考答案路径：基础模型见 `experiments/ch03/03-08/model.py`，逐层形状与账本见 `experiments/ch02/02-02/run.py`，缓存依赖参考 `experiments/ch02/02-01/run.py`。

### 3. 训练一个小型 Decoder-only 语言模型（P0，CPU/GPU，1～2 天）

在固定文本上完成 next-token/next-byte 训练，保存初始化、训练中和最终 checkpoint。记录训练损失、验证损失、梯度范数、吞吐和峰值内存，并比较至少两个模型宽度和两个随机种子。

验收条件：checkpoint 可以独立恢复；验证集不与训练区间重叠；训练后验证损失低于初始化；报告不能用单个 seed 推断“模型越大一定越好”。

参考答案路径：`experiments/ch03/03-08/model.py`、`experiments/ch03/03-08/run.py`、`experiments/ch03/03-08/analyze.py`，实验协议见 `experiments/ch03/03-08/PROTOCOL.md`。

### 4. 为真实 Decoder 建立逐算子资源账本（P0，CPU，5～8 小时）

读取模型配置，逐层计算 Q/K/V/O 投影、Attention、SwiGLU 和 LM Head 的 FLOPs、权重读取、激活读写、KV 写入与常驻容量。至少分析长 Prefill、Batch=1 Decode、较大 Batch Decode 和命中公共前缀四种场景。

验收条件：容量、读取和新增写入必须分开统计；层级合计与整模型合计守恒；结果能解释 Prefill 与 Decode 的瓶颈差异。

参考答案路径：`experiments/ch02/02-02/run.py`，结果解释见 `experiments/ch02/02-02/README.md`。

### 5. GQA、MQA 与 MLA 的状态/计算权衡（P1，CPU，5～8 小时）

给定层数、Q 头数、KV 头数、Head Dim 和 dtype，计算每 token KV、完整上下文容量、单步历史读取。为 MLA 分别实现 compact 与 expanded 两种账本，并扫描 batch 和上下文长度。

验收条件：结果明确区分“逻辑表示”和“实际执行路径”；图中同时展示容量、读取量和附加计算，不能只说“MLA 更省”。

参考答案路径：`experiments/ch02/02-03/run.py`，说明见 `experiments/ch02/02-03/README.md`。

### 6. Prefill/Decode Roofline 与实测校准（P0，CPU；可选 GPU，5～8 小时）

为相同总 token 量构造“长输入短输出”和“短输入长输出”两类请求，估算矩阵工作、权重读取和 KV 读取；有 GPU 时分别测量 Prefill 和 Decode，并反推出有效算力/带宽。

验收条件：预测与实测使用同一工作口径；能指出 Decode 何时由权重带宽转为 KV 带宽受限；报告中分开峰值上界与实测效率。

参考答案路径：`experiments/ch03/03-01/run.py`、`experiments/ch04/04-03/run.py`，说明见 `experiments/ch03/03-01/README.md`。

### 7. 到达分布与多轮负载回放器（P0，CPU/GPU，1 天）

实现支持固定速率、突发到达、长短请求混合和多轮客户身份的异步负载发生器。记录目标到达、实际派发、首次调度、首 token、逐 token 事件和完成时刻。

验收条件：相同请求集合在不同到达顺序下逐请求输入一致；输出 TTFT、TPOT/ITL、端到端延迟和队列长度分布；不能把计划发送速率当成实际发送速率。

参考答案路径：`experiments/ch03/03-02/README.md`、`experiments/ch03/03-02/multiturn-cache/README.md`、`experiments/ch03/03-02/multiturn-concurrency/README.md`。

## 阶段二：Kernel、编译与运行时

### 8. INT8/低比特矩阵乘与误差分析（P1，GPU，1～2 天）

实现至少两条路径：先反量化再 GEMM，以及 kernel 内直接使用量化权重。支持 per-tensor 和分组 scale，扫描 batch/矩阵形状，记录吞吐、临时内存和数值误差。

验收条件：与 FP32/FP64 参考比较 max abs、RMSE、relative L2；区分量化误差与 kernel 实现误差；报告质量门槛而不只报告速度。

参考答案路径：`experiments/ch04/04-02/run.py`、`experiments/ch04/04-02/analyze.py`，分组缩放参考 `experiments/ch04/04-02/block-scales/README.md`。

### 9. Tiled GEMM 与 RMSNorm 分块归约（P0，CPU/GPU，1～2 天）

先写朴素矩阵乘，再实现二维 tiling、双缓冲或预取；另外实现 RMSNorm 整行归约和拆分归约。扫描 tile size，记录实际流量、占用率和执行时间。

验收条件：所有候选通过独立数值参考；不能用占用率单独解释性能；给出 tile 变大后局部存储、并行度和边界开销的权衡。

参考答案路径：`experiments/ch05/05-01/gpu-tiles/README.md`、`experiments/ch05/05-01/rmsnorm-split/README.md`，入口见 `experiments/ch05/05-01/run.py`。

### 10. 从零实现简化版 FlashAttention（P0，GPU 优先，2～4 天）

实现标准 Attention 作为基线，再实现分块 Q/K/V、在线 Softmax 和不物化完整分数矩阵的版本。先只做 forward，再选做 backward 或 causal/GQA 变体。

验收条件：与高精度基线比较误差；测量峰值内存、读写字节和不同序列长度下的延迟；序列长度扩大时，显存不能按完整注意力分数的平方速度增长。

参考答案路径：后端与访问测量见 `experiments/ch05/05-03/run.py`、`experiments/ch05/05-03/profile.py`、`experiments/ch05/05-03/README.md`；理论对应 `manuscripts/05-算子与运行时.md` 的 5.3.3 节。

### 11. 算子融合、舍入顺序与中间张量（P0，GPU，1～2 天）

选择 `bias + activation + multiply` 或 SwiGLU 子链，实现未融合与融合版本。记录 kernel 数、HBM 流量、峰值临时内存和耗时，并测试不同融合顺序造成的舍入差异。

验收条件：将“数学等价”“浮点逐位相同”“任务质量相同”分开；对每个中间张量说明是否物化；性能比较包含相同的同步边界。

参考答案路径：`experiments/ch05/05-02/run.py`、`experiments/ch05/05-04/run.py`，模型子链见 `experiments/ch05/05-04/v4/README.md`。

### 12. Triton/DSL 分块程序与编译产物（P1，GPU，1～2 天）

用 Triton 或其他 tile DSL 实现矩阵转置或 GEMM，比较至少两种 block/warp 配置。导出中间表示、PTX/汇编或编译日志，解释同一数学程序为何生成不同执行代码。

验收条件：保存编译参数和硬件目标；数值正确；至少分析访存合并、共享内存、寄存器或线程布局中的两项。

参考答案路径：`experiments/ch05/05-05/run.py`、`experiments/ch05/05-05/disassemble.py`、`experiments/ch05/05-05/README.md`。

### 13. 形状特化、自动搜索与复用阈值（P1，GPU，1～2 天）

为多个输入形状搜索 block/warp/stage 配置，保留搜索成本、最佳配置和热态运行时间。计算某配置至少复用多少次，编译/搜索成本才会被运行收益覆盖。

验收条件：训练/搜索形状与留出形状分开；不能只报告最佳样本；给出动态形状分布变化后方案失效的例子。

参考答案路径：`experiments/ch05/05-06/search_schedule.py`、`experiments/ch05/05-06/evaluate.py`、`experiments/ch05/05-07/run.py`。

### 14. CUDA Graph、融合与完整 FFN（P0，GPU，1～2 天）

对固定形状 FFN 比较 eager、融合 eager、CUDA Graph 重放和融合 Graph。分别记录 CPU 提交时间、GPU 时间、输入复制、捕获成本和固定缓冲占用。

验收条件：图捕获不把旧输入永久固化；热态和冷启动分开；能解释 Graph 与融合分别消除了哪类开销。

参考答案路径：`experiments/ch05/05-08/run.py`、`experiments/ch05/05-08/profile.py`、`experiments/ch05/05-08/analyze.py`。

### 15. 在真实推理引擎中替换一个 Kernel（P0，GPU，2～4 天）

在固定版本的推理引擎中替换一个热点 kernel，完成原生/替换路径的交错实验。先做算子级验证，再做完整请求 token 一致性、TTFT、TPOT 和端到端时间比较。

验收条件：保留运行前后源码哈希和配置；输出 token 一致；用 profiler 证明替换路径确实执行；用 Amdahl 定律解释 kernel 加速为何未必改变请求时间。

参考答案路径：`experiments/ch05/05-09/replacement_worker.py`、`experiments/ch05/05-09/run.py`、`experiments/ch05/05-09/analyze_profiles.py`。

## 阶段三：多卡并行精选

### 16. TP/SP/PP 张量切分与流水模拟器（P0，CPU；可选多卡，1～2 天）

实现 Tensor Parallel、Sequence Parallel 和 Pipeline Parallel 的张量形状、每 rank 状态与通信量推导；选做真实多进程 FFN，并比较不同 micro-batch 下的流水空泡。

验收条件：并行输出与单进程参考一致；列出集合通信种类和字节数；区分实例内并行与服务副本。

参考答案路径：`experiments/ch06/06-02/run.py`，实际 JAX 路径见 `experiments/ch06/06-02/jax-tp-sp/README.md`。

### 17. MoE 路由、EP 放置与负载倾斜（P0，CPU/GPU，1～2 天）

实现 Top-k Router、token dispatch/combine 和专家放置模拟。构造均匀、热点和长尾路由，比较 EP 负载、All-to-All 字节与最慢 rank 时间。

验收条件：路由和分派守恒；不能用平均负载代替最大负载；实现一种热点专家复制策略并计入额外容量。

参考答案路径：`experiments/ch06/06-03/route_observer.py`、`experiments/ch06/06-03/parallel_scan.py`、`experiments/ch06/06-03/analyze.py`。

### 18. 通信与计算重叠的真实多进程实验（P0，多进程 CPU 或多 GPU，1～2 天）

让每个 rank 同时执行矩阵乘和异步 AllReduce，比较通信单独、计算单独、串行和重叠四种方式，并扫描消息大小。

验收条件：检查归约结果；记录所有 rank；总时间使用最慢 rank；解释资源竞争为何会使 `max(Tcomp,Tcomm)` 假设失效。

参考答案路径：`experiments/ch06/06-05/run.py`、`experiments/ch06/06-05/analyze.py`、`experiments/ch06/06-05/verify_tensors.py`。

### 19. 并行配置选择器（P0，CPU，1 天）

给定模型、会话数、上下文、完成时限和硬件规格，枚举副本、TP 和 PP/TP 组合，先检查容量，再选择满足期限且 GPU 秒较低的方案。

验收条件：比较所有会话完成时间而非只看单请求；包含通信、取整损失和故障范围；输出方案改变的临界条件。

参考答案路径：`experiments/ch06/06-10/run.py`、`experiments/ch06/06-10/README.md`。

## 阶段四：网络与远程数据路径精选

### 20. 跨服务器流量账本与模型级收益（P0，CPU，1 天）

输入 TP/PP/EP 方案与服务器拓扑，列出跨机张量、路径、字节数和触发时刻，再把有效带宽代入完整 Prefill/Decode 时间。

验收条件：比较先本地归约再跨机与直接跨机；报告瓶颈链路；微基准收益必须换算到模型关键路径。

参考答案路径：`experiments/ch07/07-01/run.py`、`experiments/ch07/07-10/run.py`。

### 21. RPC 分段计时、BDP 与在途并发（P0，两进程/两主机，1～2 天）

实现客户端/服务器 RPC，将编码、排队、发送、服务处理、返回和解码分别打点；扫描载荷、连接复用和 outstanding 数。

验收条件：处理跨主机时钟偏差；计算带宽—时延积；输出达到 90% 带宽所需并发以及端到端关键路径。

参考答案路径：`experiments/ch07/07-04/client.py`、`experiments/ch07/07-04/server.py`、`experiments/ch07/07-04/analyze.py`、`experiments/ch07/07-05/run.py`。

### 22. 数据发布顺序、完成通知与背压（P0，CPU 并发，1～2 天）

实现生产者—传输—消费者状态机，故意制造通知早于数据可见、缓冲提前复用和槽位不释放，再用 event/fence/序号和有限队列修复。

验收条件：压力测试无旧数据、乱序读或死锁；状态机显式表示 allocated、writing、ready、reading、released；背压时内存有界。

参考答案路径：`experiments/ch07/07-07/run.py`、`experiments/ch07/07-07/README.md`。

### 23. 集合通信日志分析与性能归因（P1，CPU，1 天）

解析 nccl-tests 或其他 collective benchmark 日志，规范化消息大小、时间、algbw、busbw 和拓扑，绘制曲线并选择一组模型通信进行代入分析。

验收条件：检测单位错误和不可比运行；不把 busbw 当物理链路吞吐；区分小消息延迟区和大消息带宽区。

参考答案路径：`experiments/ch07/07-03/analyze.py`、`experiments/ch07/07-03/review.py`、`experiments/ch07/07-03/README.md`。

## 阶段五：单实例推理服务精选

### 24. Batch 扫描与 Prefill/Decode 效率（P0，GPU，1～2 天）

固定模型，扫描输入长度、输出长度、batch 和公共前缀；记录逐轮 token 数、上下文量、耗时、吞吐、显存峰值与输出一致性。

验收条件：Prefill 与纯 Decode 轮次分开；客户端时间与 GPU/引擎轮次时间分开；反推出有效算力和带宽。

参考答案路径：`experiments/ch08/08-01/run.py`、`experiments/ch08/08-01/efficiency.py`、`experiments/ch08/08-01/analyze.py`。

### 25. Continuous Batching 与 Chunked Prefill 调度器（P0，CPU 模拟；可选 GPU，2～3 天）

实现等待队列、运行集合、token budget、continuous batching 和 chunked prefill。比较固定 batch、连续 batch、长 Prefill 分块三种策略。

验收条件：每请求状态跨迭代保存；输出 TTFT、最大 ITL、完成时间和吞吐；构造吞吐提高但个别请求 ITL 恶化的反例。

参考答案路径：`experiments/ch08/08-02/run.py`、`experiments/ch08/08-02/analyze.py`，正文算例见 `manuscripts/08-推理优化.md` 的 8.2 节。

### 26. Paged KV、抢占、取消与释放（P0，CPU/GPU，2～3 天）

实现固定 token block 的 KV 分配器、逻辑块表、引用计数和空闲链表；加入请求抢占、换出/重算、取消和结束释放。

验收条件：随机压力测试后无块泄漏和双重释放；取消请求不能继续占用块；支持分支共享和写时复制；导出块生命周期事件。

参考答案路径：`experiments/ch08/08-03/observer.py`、`experiments/ch08/08-03/run.py`、`experiments/ch08/08-03/verify.py`。

### 27. Prefix Cache 与 Agent 多轮历史（P0，CPU/GPU，1～2 天）

实现 token-block 哈希、最长前缀匹配、引用与 LRU 淘汰。用多轮 Agent 消息测试系统提示、工具定义、工具结果和历史改写对命中的影响。

验收条件：缓存命中必须基于 token 身份而不是字符串猜测；命中后输出与重算一致；报告 token 加权命中率与节省的 Prefill 工作。

参考答案路径：`experiments/ch08/08-04/run.py`、`experiments/ch08/08-04/analyze.py`、`experiments/ch08/08-04/README.md`。

### 28. 推测解码最小实现（P1，GPU，2～3 天）

实现草稿模型生成、目标模型并行验证、接受/拒绝、回退采样和动态草稿长度。先做贪心一致性，再选做随机采样的分布正确性。

验收条件：贪心模式与目标模型逐 token 生成完全一致；记录每轮草稿数、接受数、目标验证时间和每输出 token 成本；展示低接受率下的退化。

参考答案路径：实验结果和协议见 `experiments/ch08/08-05/README.md`、`experiments/ch08/08-05/PROTOCOL.md`；算术检查见 `calculations/results/speculative-round-pro6000-aaaa.md`。

### 29. 到达率、Goodput、准入与能耗（P0，GPU；可先模拟，2～3 天）

对多个到达率比较 continuous batching、逐个接纳和限流。计算吞吐、TTFT/TPOT/端到端 SLO 达标率、Goodput、能耗和每合格结果能耗。

验收条件：迟到/错误结果消耗的能量也计入分母；展示吞吐不再增长但 Goodput/能效恶化的过载区；保留完整请求事件。

参考答案路径：`experiments/ch08/08-09/run.py`、`experiments/ch08/08-09/energy.py`、`experiments/ch08/08-09/analyze.py`。

## 阶段六：分布式推理服务精选

### 30. 副本与异构 PD 资源配比搜索（P0，CPU；可选多机 GPU，1～2 天）

实现服务能力计算器；给定到达率、两类 GPU 的 Prefill/Decode 速度、KV 大小和链路带宽，枚举完整副本及 P/D worker 配比。

验收条件：分别检查各资源的稳定性；包含 KV 交接和两端内存；处理 worker 数取整；输出 PD 不值得做的负载边界。

参考答案路径：`experiments/ch09/09-01/run.py`、`experiments/ch09/09-02/run.py`、`experiments/ch09/09-02/README.md`。

### 31. PD 与 AF 分离的交接频次比较（P0，CPU，5～8 小时）

计算 PD 一次性 KV 交接和 AF 每层、每步激活往返的数据量与固定延迟，扫描输出长度、层数、batch、网络延迟和带宽。

验收条件：数据量与消息次数同时计算；支持流水重叠；给出 AF 从可行变为不可行的临界条件。

参考答案路径：`experiments/ch09/09-04/run.py`。

### 32. 热门专家复制与动态放置（P1，GPU；可先离线回放，2～4 天）

采集真实或合成 MoE 路由，按层统计专家热度和共现；实现静态放置、热点复制和动态调整，估算 dispatch/GEMM/combine 以及尾部时间。

验收条件：使用最大 rank 负载评价；复制要计额外权重容量和迁移；路由输出与原路径一致。

参考答案路径：`experiments/ch09/09-06/single-gpu/run.py`、`experiments/ch09/09-06/assignment-observation/run.py`、`experiments/ch09/09-06/phase-attribution/analyze.py`。

### 33. 跨实例共享与多级 KV 池（P0，GPU；可先 CPU 模拟，3～5 天）

实现生产者发布、消费者取回、就绪通知、引用计数、容量限制和回收。基础版使用两个进程；进阶版加入 GPU—主存—SSD 分层、预取和缺页。

验收条件：缓存标识包含必要身份；消费者不能读取未完成块；命中/恢复输出与重算一致；区分页缓存与真实 I/O；进程退出后安全回收。

参考答案路径：`experiments/ch09/09-07/shared-kv/shared_connector.py`、`experiments/ch09/09-07/shared-kv/run_pair.py`、`experiments/ch09/09-08/storage_trace.py`、`experiments/ch09/09-08/agent-policy-replay/run.py`。

### 34. Cache-aware Router 与队列压力（P0，多进程，3～5 天）

实现 Round Robin、Least Queue/Power-of-Two 和 Cache Affinity 三种路由；加入预计 Prefill 节省、远端 KV 取回成本和队列等待，使用 Chat/Agent 多轮回放。

验收条件：真实 worker 归属、缓存 token、队列长度和完成时间均记录；构造“缓存命中高但排队更慢”的场景；处理缓存失效和 worker 重启。

参考答案路径：`experiments/ch09/09-09/run.py`、`experiments/ch09/09-09/queue-pressure/run.py`、`experiments/ch09/09-09/policy-comparison/run.py`、`experiments/ch09/09-09/remote-kv/routing-record-replay/run.py`。

### 35. 启动、扩缩容、故障恢复与综合部署（P0，GPU/多进程，3～5 天）

为 Chat、Agent 和长推理请求设计完整服务：模型加载、JIT/Graph 预热、健康检查、流量切换、缓存预取、扩缩容、正在生成请求的故障处理。至少实测启动与恢复中的一个路径。

验收条件：区分进程启动、服务就绪、首请求完成和积压排空；缓存存在不等于缓存真正命中；失败路径不能发布半成品状态；最终给出副本/PD/共享 KV/路由的组合选择。

参考答案路径：`experiments/ch09/09-10/startup/run.py`、`experiments/ch09/09-10/branch-observation/run.py`、`experiments/ch09/09-10/native-storage-observation/run.py`，综合说明见 `experiments/ch09/09-10/README.md`。

## 建议完成顺序

### 两个月求职精简主线：11 个集成模块

| 模块 | 对应本题库 | 集成结果 |
|---:|---|---|
| 1 | 1、2 | Decoder-only、GQA、Prefill/Decode 与逐层 KV |
| 2 | 4、6 | 资源账本、Roofline 与实测校准 |
| 3 | 7、24、29 | 异步负载、基线 benchmark、SLO 与 Goodput |
| 4 | 25 | Continuous Batching 与 Chunked Prefill |
| 5 | 26、27 | Paged KV、取消/抢占、Prefix Cache |
| 6 | 9 中的 RMSNorm、11 | Triton RMSNorm、fused SiLU mul 与流量对照 |
| 7 | 10 | 简化 FlashAttention forward、在线 Softmax 与显存扫描 |
| 8 | 13、14 的一次对照及 profiler 要求 | CUDA Graph、NSYS、NCU、Roofline 与失败 shape 归因 |
| 9 | 15 | 真实推理路径 kernel 替换 |
| 10 | 34 | 两 Worker 与 Cache-aware Router |
| 11 | 26、29、35 的故障要求 | KV 回收、Worker 故障与正确性/性能回归 |

模块 1 至 5、10、11 是推理系统岗位的最低主线；模块 6 至 9 是 GPU 性能岗位的关键区分度，其中 FlashAttention 保留简化 forward，CUDA Graph 只做一次对照。详细验收以 `研一上最后两个月_AI-Infra_GPGPU_实习求职综合规划.md` 第 4 节为准。

### 完整通用进阶主线（不限两个月）

按顺序完成：2 → 3 → 4 → 6 → 9 → 10 → 14 → 15 → 16 → 18 → 20 → 21 → 22 → 24 → 25 → 26 → 27 → 29 → 30 → 31 → 33 → 34 → 35。

这条进阶主线覆盖模型结构、性能分析、FlashAttention、运行时、多卡通信、调度、Paged KV、Prefix Cache、PD 分离、共享 KV 和缓存路由；不要求在本轮两个月内完成。

### Kernel/编译器方向

重点完成：4、6、8～15、18、23、24。作品集至少保留一个 Triton kernel、一次 profiler 分析和一次真实引擎替换。

### Serving/推理引擎方向

重点完成：2、4、6、7、14、15、24～31、33～35。作品集最好实现一个最小可用的 scheduler + paged KV + prefix cache。

### 分布式/MoE 方向

重点完成：16～23、30～35。作品集最好包含 TP/EP 通信账本、MoE skew 回放和 PD/共享 KV 中至少一个真实多进程原型。

## 最终综合项目

这不是完成练习后再另起一个项目。完成 11 个集成模块时，持续把产物接入同一个“小型 vLLM/SGLang”：手写 Decoder-only 模型或接入现有模型，实现 Prefill/Decode、Paged KV、Continuous Batching、Chunked Prefill、Prefix Cache、SLO 指标和负载发生器；随后加入两个 Worker、Cache-aware Routing，并以可选方式实现 PD 或共享 KV。

最终验收至少包含：

1. 与无缓存基线的 token 一致性测试；
2. 随机取消、抢占和结束后的零 KV 泄漏测试；
3. Batch/长度/到达率扫描；
4. TTFT、TPOT、端到端延迟、吞吐和 Goodput；
5. 简化 FlashAttention 的正确性、显存/长度扫描和一次 profiler 关键路径分析；
6. 两个 Worker 上三种路由策略的同 trace 对照，以及一次过载、Worker 重启或缓存失效故障实验；
7. 一份说明“为什么某优化有效或无效”的量化报告。

综合参考入口：`experiments/ch08/08-02/`、`experiments/ch08/08-03/`、`experiments/ch08/08-04/`、`experiments/ch09/09-07/`、`experiments/ch09/09-09/`。
