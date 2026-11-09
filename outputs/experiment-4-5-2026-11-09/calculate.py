"""Reproduce the quoted teaching model; standard library only, no measurements."""
import csv
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
d = 4096
P, R = 165.2e12, 1.008e12
devices = {'RTX 4090': (P, R), 'H100 SXM': (989.4e12, 3.35e12)}

def row(m):
    f, v = 2*m*d*d, 2*d*d + 4*m*d
    return dict(M=m, FLOPs=f, bytes=v, intensity=f/v,
                compute_us=f/P*1e6, memory_us=v/R*1e6,
                compute_2x_us=f/(2*P)*1e6,
                memory_2x_us=v/(2*R)*1e6)

rows = [row(m) for m in range(1, 257)]
with (OUT/'q-projection.csv').open('w', newline='', encoding='utf-8-sig') as f:
    writer = csv.DictWriter(f, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)

crossings = {}
for name, p, r in [('baseline', P, R), ('compute_2x', 2*P, R), ('bandwidth_2x', P, 2*R)]:
    ridge = p/r
    crossing = ridge*d/(d-2*ridge)
    crossings[name] = dict(ridge=ridge, M=crossing, first_compute_integer=math.floor(crossing)+1)

comparisons = []
for name, (p, r) in devices.items():
    for m in [1, 256]:
        q = row(m)
        c, t = q['FLOPs']/p*1e6, q['bytes']/r*1e6
        comparisons.append(dict(device=name, M=m, compute_us=c, memory_us=t,
                                lower_bound_us=max(c,t), dominant='matrix' if c>t else 'memory'))
        # Check against the repository's independently maintained projection outputs.
        device_id = 'rtx4090' if name == 'RTX 4090' else 'h100-sxm'
        reference = json.loads((ROOT/f'calculations/results/projection-qwen3-8b-{device_id}-b{m}.json').read_text(encoding='utf-8'))['summary']
        assert q['FLOPs'] == reference['matrix_flops']
        assert q['bytes'] == reference['cold_memory_payload_bytes']
        assert math.isclose(max(c,t)/1e6, reference['roofline_lower_bound_seconds'])

config = json.loads((ROOT/'calculations/configs/models/qwen3-8b/config.json').read_text())
layers, ff, vocab = config['num_hidden_layers'], config['intermediate_size'], config['vocab_size']
kv_width = config['num_key_value_heads']*config['head_dim']
w_layer = 2*d*d + 2*d*kv_width + 3*d*ff
linear_token = 2*layers*w_layer
head = 2*d*vocab
decode_attention = 4*layers*8192*d
n = 4096
prefill_pairs = n*(n+1)//2
prefill_attention = 4*layers*d*prefill_pairs
work = dict(W_layer=w_layer, linear_per_token=linear_token, head=head,
            decode_attention=decode_attention, decode_total=linear_token+decode_attention+head,
            prefill_pairs=prefill_pairs, prefill_linear=n*linear_token,
            prefill_attention=prefill_attention,
            prefill_total=n*linear_token+prefill_attention+head)
report = dict(crossings=crossings, comparison=comparisons, qwen3_8b=work)
(OUT/'results.json').write_text(json.dumps(report, indent=2), encoding='utf-8')

text = '''# 实验 4-5：复算与解释

这是解析下界模型，不是 kernel 实测。Q 投影取 d=4096，输入/权重/输出为 BF16，片上 FP32 累加，输入和权重各读一次、输出写一次；无稀疏、无跨调用缓存复用。

## Q 投影

F(M)=2Md²；V(M)=2d²+4Md bytes；I(M)=Md/(d+2M)。M 是一次 GEMM 的输入行数；decode 中通常等于请求 batch，prefill 中可来自一条或多条请求的输入 token。

I 与硬件无关。提升算力或带宽改变 Roofline 交点，不改变 I(M) 曲线。

| 方案 | P/R (FLOPs/byte) | 连续转折 M* | 计算项开始较长的整数行数 |
|---|---:|---:|---:|
'''
for label, key in [('原配置','baseline'), ('仅矩阵算力翻倍','compute_2x'), ('仅带宽翻倍','bandwidth_2x')]:
    c = crossings[key]
    text += f"| {label} | {c['ridge']:.3f} | {c['M']:.3f} | {c['first_compute_integer']} |\n"
text += '''
算力翻倍后，1～256 行内仍是内存项较长；带宽翻倍后，从 86 行开始计算项较长。

## 同一 Q 投影的两种加速器

采用项目已有精度匹配配置：RTX 4090 为 165.2 TFLOP/s、1.008 TB/s；H100 SXM 为 989.4 TFLOP/s、3.35 TB/s。均为 BF16 输入、FP32 累加、稠密矩阵。注意产品宣传中的稀疏峰值不能直接用于此处。

| 设备 | M | 矩阵时间 μs | 内存时间 μs | max 下界 μs | 较长项 |
|---|---:|---:|---:|---:|---|
'''
for c in comparisons:
    text += f"| {c['device']} | {c['M']} | {c['compute_us']:.3f} | {c['memory_us']:.3f} | {c['lower_bound_us']:.3f} | {c['dominant']} |\n"
text += '''
H100 在 M=256 时仍由内存项主导，因为算力相对带宽更充裕。瓶颈名称不同不代表更慢；其绝对耗时仍较小。上述四组结果已与仓库现有 projection 结果交叉核对。

## 加入注意力与专家矩阵的资源表

以下是分别建模的算子，不能把 Qwen3-8B 的稠密 FFN 当成 MoE。MoE 示例独立取 d=4096、专家中间宽度 h=1536、top-8。

| 工作 | 矩阵工作量 | 主要内存服务量 | 其他资源与依赖 |
|---|---|---|---|
| Q 投影 | 2Md² | 2d²+4Md | 为后续 QK 提供 Q |
| decode QK+PV | 4BLHq·dh | 理想 KV 读取 4BLHkv·dh bytes | softmax 另占指数/归约等资源；QK→softmax→PV |
| prefill QK+PV，无前缀 | 4Hq·dh·N(N+1)/2（每条序列每层） | 取决于融合与分块；若 FP32 scores 和 probabilities 分别写回再读，二者合计额外约 16Hq·N(N+1)/2 bytes | 逻辑因果有效量，不等于实际 tile 执行量；融合可避免完整中间矩阵写回 |
| MoE 三次专家投影 | 6dh·Σm_e | 专家权重 6dh·U bytes；另加输入/中间值/输出 | U 为有输入的不同专家数，m_e 为专家 e 的输入行数；门控激活、路由、dispatch/combine 另计 |

所有表达式以 FMA=2 计数。decode KV 按 BF16、GQA 每个 KV 头跨查询组理想复用一次计，只是 KV 项下界，不包含 Q、输出和分块重读。

上下文 L 增长时，decode 的 QK/PV 和 KV 读取都按 L 增长；线性投影在固定 batch 下不随 L 变化。上述 GQA 配置 Hq/Hkv=32/8=4，F_attention/V_KV≈4 FLOPs/byte，远低于两设备交点，因此理想 KV 下界通常偏向带宽约束。

MoE 的 Σm_e=B·topk。以 B=8 为例，完全集中为 U=8、每专家 m_e=8；完全分散为 U=64、每专家 m_e=1。两种情况专家矩阵有效 FLOPs 都是 2.416 GFLOPs，专家权重读取分别约 0.302 GB、2.416 GB。只按权重计，算术强度分别为 8、1 FLOPs/byte。实际强度还要计入其他流量。它说明：总 batch 相同，专家输入行数分布仍能改变权重复用、小矩阵效率与多设备负载。全部专家的常驻容量不随当前 U 改变。

资源汇总时，矩阵时间对共享该单元的工作求和，内存流量对共享接口的工作求和；再加上阶段依赖。QK、softmax、PV 存在依赖，不能仅用全局 max(总矩阵时间, 总内存时间) 代替完整执行时间。未知 softmax、路由或通信速率时，应保留为未建模项。

## 后续段落：Qwen3-8B decode 与 prefill 工作量

读取项目固定模型配置：36 层、d=4096、FFN=12288、32 个 Q 头、8 个 KV 头、头维度 128、词表 151936。

'''
text += f'''每层线性矩阵参数 W_layer={w_layer:,}。Q/O 各 d²，K/V 各 d×1024，FFN 的 gate/up/down 各 d×12288。

| 项目 | 8K decode，1 个新 token | 4096-token prefill，无前缀 |
|---|---:|---:|
| 36 层线性投影 | {linear_token/1e9:.9f} GFLOPs | {n*linear_token/1e12:.9f} TFLOPs |
| 有效 QK+PV | {decode_attention/1e9:.9f} GFLOPs | {prefill_attention/1e12:.9f} TFLOPs |
| 最后位置输出头 | {head/1e9:.9f} GFLOPs | {head/1e12:.9f} TFLOPs |
| 合计 | {work['decode_total']/1e9:.9f} GFLOPs | {work['prefill_total']/1e12:.9f} TFLOPs |

decode 的每个 query 访问 8192 个位置。prefill 的第 j 个位置只看 1～j，故位置对数为 4096×4097/2={prefill_pairs:,}。每对、每头 QK 约 2dh 操作，PV 约 2dh 操作，共 4dh；乘查询头数得到 4×4096。8 个 KV 头意味着 K/V 权重和 KV 存储较小，不会把 32 个查询头的注意力工作减成 8 个头。

prefill 只算最后位置的输出头，是此处为了生成下一个 token 的约定；若要求所有位置 logits，需计算 N 次输出头。上表仅矩阵运算，不包括 softmax、归一化、RoPE、SiLU、数据搬移及 kernel 启动，也不保证实际因果分块完全跳过上三角。

## 来源与复现

- 模型：`calculations/configs/models/qwen3-8b/config.json`。
- 精度与硬件口径：`calculations/results/projection-qwen3-8b-rtx4090-b256.json`、`calculations/results/projection-qwen3-8b-h100-sxm-b256.json`，内含官方来源与精度定位。
- [NVIDIA Ada 官方白皮书](https://images.nvidia.cn/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf)
- [NVIDIA H100 官方产品页](https://www.nvidia.com/en-us/data-center/h100/)；本文计算使用项目固定白皮书值 989.4 TFLOP/s。
- 执行 calculate.py 生成 CSV/JSON/本说明，再用 Windows PowerShell 执行 plot.ps1 生成图。
'''
(OUT/'说明.md').write_text(text, encoding='utf-8')
print(json.dumps(report, indent=2))
