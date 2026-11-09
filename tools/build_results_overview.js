const fs = require('fs');
const path = require('path');

const width = 1920;
const height = 980;
const outputDir = path.resolve(__dirname, '..', 'outputs', 'results-overview');
fs.mkdirSync(outputDir, { recursive: true });

const rows = [
  { name: '基线', color: '#7f8c97' },
  { name: '深层', color: '#648bab' },
  { name: '多尺度', color: '#2f8a85' },
  { name: '组合', color: '#a46c7e' },
];

const columns = [
  { group: '语音任务', label: 'SI-SNR', unit: 'dB', direction: 'high', values: [14.74, 15.61, 15.91, 16.45] },
  { group: '语音任务', label: 'PESQ', unit: '', direction: 'high', values: [3.02, 3.19, 3.26, 3.34] },
  { group: '通信任务', label: 'SI-SNR', unit: 'dB', direction: 'high', values: [16.43, 15.72, 18.30, 12.12] },
  { group: '通信任务', label: 'BER', unit: '%', direction: 'low', values: [7.37, 8.14, 6.87, 32.78] },
  { group: '资源开销', label: '参数量', unit: 'M', direction: 'low', values: [2.63, 7.36, 2.96, 16.11] },
  { group: '资源开销', label: '60 s 推理耗时', unit: 's', direction: 'low', values: [1.01, 1.53, 1.31, 2.26] },
];

const esc = (s) => String(s)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const hexToRgb = (hex) => {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
};

const mix = (a, b, t) => {
  const aa = hexToRgb(a);
  const bb = hexToRgb(b);
  const rgb = aa.map((v, i) => Math.round(v + (bb[i] - v) * t));
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
};

const normalized = columns.map((column) => {
  const min = Math.min(...column.values);
  const max = Math.max(...column.values);
  return column.values.map((value) => {
    const raw = max === min ? 1 : (value - min) / (max - min);
    return column.direction === 'high' ? raw : 1 - raw;
  });
});

const matrixX = 285;
const matrixY = 292;
const cellW = 252;
const cellH = 116;
const gapX = 10;
const gapY = 12;
const matrixWidth = columns.length * cellW + (columns.length - 1) * gapX;

const groupRanges = [
  { name: '语音任务', start: 0, end: 1 },
  { name: '通信任务', start: 2, end: 3 },
  { name: '资源开销', start: 4, end: 5 },
];

let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#ffffff"/>
  <style>
    text { font-family: "Microsoft YaHei", "Noto Sans CJK SC", "PingFang SC", sans-serif; }
    .title { font-size: 46px; font-weight: 700; fill: #222831; }
    .subtitle { font-size: 24px; fill: #66707a; }
    .group { font-size: 25px; font-weight: 700; fill: #c5192d; }
    .column { font-size: 24px; font-weight: 700; fill: #303840; }
    .hint { font-size: 18px; fill: #7a838c; }
    .row { font-size: 27px; font-weight: 600; fill: #303840; }
    .value { font-size: 31px; font-weight: 700; }
    .insight-label { font-size: 22px; font-weight: 700; fill: #c5192d; }
    .insight { font-size: 23px; fill: #343b43; }
    .note { font-size: 18px; fill: #7a838c; }
  </style>

  <text class="title" x="82" y="72">四种模型结构的效果与开销对比</text>
  <text class="subtitle" x="82" y="112">一张图汇总语音、通信与资源指标；颜色越深表示该列相对表现越优</text>
  <line x1="82" y1="140" x2="1838" y2="140" stroke="#c5192d" stroke-width="3"/>
`;

for (const range of groupRanges) {
  const x1 = matrixX + range.start * (cellW + gapX);
  const x2 = matrixX + range.end * (cellW + gapX) + cellW;
  const cx = (x1 + x2) / 2;
  svg += `  <text class="group" x="${cx}" y="190" text-anchor="middle">${esc(range.name)}</text>\n`;
  svg += `  <line x1="${x1 + 16}" y1="207" x2="${x2 - 16}" y2="207" stroke="#e4e7ea" stroke-width="2"/>\n`;
}

columns.forEach((column, col) => {
  const cx = matrixX + col * (cellW + gapX) + cellW / 2;
  const direction = column.direction === 'high' ? '越高越好' : '越低越好';
  const unit = column.unit ? ` / ${column.unit}` : '';
  svg += `  <text class="column" x="${cx}" y="247" text-anchor="middle">${esc(column.label)}</text>\n`;
  svg += `  <text class="hint" x="${cx}" y="274" text-anchor="middle">${esc(direction + unit)}</text>\n`;
});

rows.forEach((row, r) => {
  const y = matrixY + r * (cellH + gapY);
  const cy = y + cellH / 2;
  svg += `  <circle cx="104" cy="${cy}" r="9" fill="${row.color}"/>\n`;
  svg += `  <text class="row" x="126" y="${cy + 10}">${esc(row.name)}</text>\n`;

  columns.forEach((column, c) => {
    const x = matrixX + c * (cellW + gapX);
    const score = normalized[c][r];
    const fill = mix('#edf2f3', '#2f8a85', 0.08 + 0.92 * score);
    const textColor = score > 0.56 ? '#ffffff' : '#263238';
    const best = score > 0.999;
    svg += `  <rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="10" fill="${fill}"${best ? ' stroke="#1f6662" stroke-width="3"' : ''}/>`;
    svg += `\n  <text class="value" x="${x + cellW / 2}" y="${cy + 11}" text-anchor="middle" fill="${textColor}">${column.values[r].toFixed(2)}</text>\n`;
  });
});

const matrixBottom = matrixY + rows.length * cellH + (rows.length - 1) * gapY;
const insightY = matrixBottom + 68;
svg += `
  <line x1="82" y1="${matrixBottom + 34}" x2="1838" y2="${matrixBottom + 34}" stroke="#e1e5e8" stroke-width="2"/>
  <text class="insight-label" x="82" y="${insightY}">结论</text>
  <text class="insight" x="162" y="${insightY}">语音任务：组合模型最佳（16.45 dB，3.34）</text>
  <line x1="692" y1="${insightY - 25}" x2="692" y2="${insightY + 10}" stroke="#d7dbdf" stroke-width="2"/>
  <text class="insight" x="728" y="${insightY}">通信任务：多尺度模型最佳（18.30 dB，6.87%）</text>
  <line x1="1318" y1="${insightY - 25}" x2="1318" y2="${insightY + 10}" stroke="#d7dbdf" stroke-width="2"/>
  <text class="insight" x="1354" y="${insightY}">资源开销：基线最低</text>
  <text class="note" x="82" y="${height - 34}">注：颜色按每列相对表现归一化，仅辅助阅读；单元格均保留原始实验数值。</text>
</svg>
`;

const svgPath = path.join(outputDir, '模型效果与开销总览.svg');
fs.writeFileSync(svgPath, svg, 'utf8');
console.log(svgPath);
