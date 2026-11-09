const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'outputs', 'poster-edit', 'assets');
fs.mkdirSync(outDir, { recursive: true });

const rows = [
  { name: '基线', color: '#7f8c97' },
  { name: '深层', color: '#648bab' },
  { name: '多尺度', color: '#2f8a85' },
  { name: '组合', color: '#a46c7e' },
];

const effectColumns = [
  { group: '语音任务', label: 'SI-SNR', unit: 'dB', direction: 'high', values: [14.74, 15.61, 15.91, 16.45] },
  { group: '语音任务', label: 'PESQ', unit: '', direction: 'high', values: [3.02, 3.19, 3.26, 3.34] },
  { group: '通信任务', label: 'SI-SNR', unit: 'dB', direction: 'high', values: [16.43, 15.72, 18.30, 12.12] },
  { group: '通信任务', label: 'BER', unit: '%', direction: 'low', values: [7.37, 8.14, 6.87, 32.78] },
];

const costColumns = [
  { label: '参数量', unit: 'M', direction: 'low', values: [2.63, 7.36, 2.96, 16.11] },
  { label: '60 s 语音推理耗时', unit: 's', direction: 'low', values: [1.01, 1.53, 1.31, 2.26] },
];

const esc = (s) => String(s)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const rgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16));
const mix = (a, b, t) => {
  const aa = rgb(a);
  const bb = rgb(b);
  const c = aa.map((v, i) => Math.round(v + (bb[i] - v) * t));
  return `rgb(${c.join(',')})`;
};

const scoresFor = (columns) => columns.map((column) => {
  const min = Math.min(...column.values);
  const max = Math.max(...column.values);
  return column.values.map((value) => {
    const raw = max === min ? 1 : (value - min) / (max - min);
    return column.direction === 'high' ? raw : 1 - raw;
  });
});

function effectSvg() {
  const width = 1920;
  const height = 438;
  const matrixX = 245;
  const matrixY = 112;
  const cellW = 397;
  const cellH = 62;
  const gapX = 10;
  const gapY = 8;
  const scores = scoresFor(effectColumns);
  let out = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="#ffffff"/>
<style>
text { font-family: "Microsoft YaHei", "Noto Sans CJK SC", sans-serif; }
.group { font-size: 27px; font-weight: 700; fill: #c5192d; }
.column { font-size: 23px; font-weight: 700; fill: #303840; }
.hint { font-size: 16px; fill: #7a838c; }
.row { font-size: 24px; font-weight: 600; fill: #303840; }
.value { font-size: 25px; font-weight: 700; }
.note { font-size: 19px; fill: #3e464d; }
</style>
<text class="group" x="647" y="28" text-anchor="middle">语音任务</text>
<text class="group" x="1461" y="28" text-anchor="middle">通信任务</text>
<line x1="245" y1="41" x2="1049" y2="41" stroke="#e0e4e7" stroke-width="2"/>
<line x1="1059" y1="41" x2="1863" y2="41" stroke="#e0e4e7" stroke-width="2"/>
<text class="hint" x="40" y="77">颜色越深表示该列表现越优</text>
`;

  effectColumns.forEach((column, c) => {
    const cx = matrixX + c * (cellW + gapX) + cellW / 2;
    const dir = column.direction === 'high' ? '越高越好' : '越低越好';
    out += `<text class="column" x="${cx}" y="72" text-anchor="middle">${esc(column.label)}</text>`;
    out += `<text class="hint" x="${cx}" y="98" text-anchor="middle">${esc(dir + (column.unit ? ` / ${column.unit}` : ''))}</text>`;
  });

  rows.forEach((row, r) => {
    const y = matrixY + r * (cellH + gapY);
    const cy = y + cellH / 2;
    out += `<circle cx="52" cy="${cy}" r="8" fill="${row.color}"/>`;
    out += `<text class="row" x="72" y="${cy + 8}">${esc(row.name)}</text>`;
    effectColumns.forEach((column, c) => {
      const x = matrixX + c * (cellW + gapX);
      const score = scores[c][r];
      const fill = mix('#edf2f3', '#2f8a85', 0.08 + 0.92 * score);
      const fg = score > 0.56 ? '#ffffff' : '#263238';
      const best = score > 0.999;
      out += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="7" fill="${fill}"${best ? ' stroke="#1f6662" stroke-width="3"' : ''}/>`;
      out += `<text class="value" x="${x + cellW / 2}" y="${cy + 9}" text-anchor="middle" fill="${fg}">${column.values[r].toFixed(2)}</text>`;
    });
  });

  out += `<line x1="40" y1="399" x2="1880" y2="399" stroke="#e0e4e7" stroke-width="2"/>`;
  out += `<text class="note" x="40" y="427"><tspan font-weight="700" fill="#c5192d">结论</tspan><tspan dx="18">语音任务由组合模型领先（16.45 dB，3.34）；通信任务由多尺度模型领先（18.30 dB，6.87%）。</tspan></text>`;
  out += '</svg>';
  return out;
}

function costSvg() {
  const width = 1058;
  const height = 452;
  const matrixX = 220;
  const matrixY = 105;
  const cellW = 390;
  const cellH = 64;
  const gapX = 14;
  const gapY = 10;
  const scores = scoresFor(costColumns);
  let out = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="#ffffff"/>
<style>
text { font-family: "Microsoft YaHei", "Noto Sans CJK SC", sans-serif; }
.title { font-size: 28px; font-weight: 700; fill: #c5192d; }
.column { font-size: 22px; font-weight: 700; fill: #303840; }
.hint { font-size: 16px; fill: #7a838c; }
.row { font-size: 23px; font-weight: 600; fill: #303840; }
.value { font-size: 25px; font-weight: 700; }
.note { font-size: 18px; fill: #3e464d; }
</style>
<text class="title" x="34" y="34">资源开销</text>
<text class="hint" x="1024" y="34" text-anchor="end">颜色越深表示开销越低</text>
<line x1="34" y1="48" x2="1024" y2="48" stroke="#e0e4e7" stroke-width="2"/>
`;
  costColumns.forEach((column, c) => {
    const cx = matrixX + c * (cellW + gapX) + cellW / 2;
    out += `<text class="column" x="${cx}" y="77" text-anchor="middle">${esc(column.label)}</text>`;
    out += `<text class="hint" x="${cx}" y="99" text-anchor="middle">越低越好 / ${esc(column.unit)}</text>`;
  });
  rows.forEach((row, r) => {
    const y = matrixY + r * (cellH + gapY);
    const cy = y + cellH / 2;
    out += `<circle cx="42" cy="${cy}" r="8" fill="${row.color}"/>`;
    out += `<text class="row" x="62" y="${cy + 8}">${esc(row.name)}</text>`;
    costColumns.forEach((column, c) => {
      const x = matrixX + c * (cellW + gapX);
      const score = scores[c][r];
      const fill = mix('#edf2f3', '#2f8a85', 0.08 + 0.92 * score);
      const fg = score > 0.56 ? '#ffffff' : '#263238';
      const best = score > 0.999;
      out += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="7" fill="${fill}"${best ? ' stroke="#1f6662" stroke-width="3"' : ''}/>`;
      out += `<text class="value" x="${x + cellW / 2}" y="${cy + 9}" text-anchor="middle" fill="${fg}">${column.values[r].toFixed(2)}</text>`;
    });
  });
  out += `<line x1="34" y1="410" x2="1024" y2="410" stroke="#e0e4e7" stroke-width="2"/>`;
  out += `<text class="note" x="34" y="440">基线开销最低；多尺度接近基线，组合模型开销最高。</text>`;
  out += '</svg>';
  return out;
}

fs.writeFileSync(path.join(outDir, '效果指标总览.svg'), effectSvg(), 'utf8');
fs.writeFileSync(path.join(outDir, '资源开销总览.svg'), costSvg(), 'utf8');
console.log(outDir);
