from __future__ import annotations

import csv
import json
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parent
OUT_SVG = ROOT / "创业板指中证红利比值_沪深300指数_近10年.svg"
OUT_CSV = ROOT / "创业板指中证红利比值_沪深300指数_近10年.csv"


def fetch_daily_close(secid: str, start: str, end: str) -> dict[str, float]:
    params = {
        "secid": secid,
        "fields1": "f1,f2,f3,f4,f5,f6",
        "fields2": "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61",
        "klt": "101",
        "fqt": "0",
        "beg": start,
        "end": end,
    }
    url = "http://push2his.eastmoney.com/api/qt/stock/kline/get?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = json.load(response)

    data = payload.get("data") or {}
    klines = data.get("klines") or []
    if not klines:
        raise RuntimeError(f"未获取到行情数据: {secid}")

    result: dict[str, float] = {}
    for row in klines:
        fields = row.split(",")
        result[fields[0]] = float(fields[2])  # f53: 收盘点位
    return result


def render_svg(rows: list[tuple[str, float, float, float, float]]) -> None:
    width, height = 1400, 760
    left, right, top, bottom = 105, 105, 85, 105
    plot_w = width - left - right
    plot_h = height - top - bottom
    dates = [date.fromisoformat(row[0]) for row in rows]
    ratios = [row[4] for row in rows]
    hs300_values = [row[2] for row in rows]
    d0, d1 = dates[0].toordinal(), dates[-1].toordinal()
    r0, r1 = min(ratios), max(ratios)
    padding = max((r1 - r0) * 0.08, 0.01)
    ymin, ymax = r0 - padding, r1 + padding
    h0, h1 = min(hs300_values), max(hs300_values)
    hpadding = max((h1 - h0) * 0.08, 50)
    hmin, hmax = h0 - hpadding, h1 + hpadding

    def x(day: date) -> float:
        return left + (day.toordinal() - d0) / (d1 - d0) * plot_w

    def y_ratio(value: float) -> float:
        return top + (ymax - value) / (ymax - ymin) * plot_h

    def y_hs300(value: float) -> float:
        return top + (hmax - value) / (hmax - hmin) * plot_h

    ratio_path = " ".join(
        ("M" if i == 0 else "L") + f"{x(day):.2f},{y_ratio(value):.2f}"
        for i, (day, value) in enumerate(zip(dates, ratios))
    )
    hs300_path = " ".join(
        ("M" if i == 0 else "L") + f"{x(day):.2f},{y_hs300(value):.2f}"
        for i, (day, value) in enumerate(zip(dates, hs300_values))
    )

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" fill="#ffffff"/>',
        '<style>text{font-family:"Microsoft YaHei","Noto Sans CJK SC",sans-serif;fill:#374151}.title{font-size:25px;font-weight:700}.axis{font-size:14px}.note{font-size:12px;fill:#6b7280}</style>',
        f'<text class="title" x="{width / 2}" y="42" text-anchor="middle">创业板指 / 中证红利比值与沪深300指数（近10年）</text>',
        f'<line x1="{width - 390}" y1="62" x2="{width - 350}" y2="62" stroke="#d94841" stroke-width="3"/><text class="axis" x="{width - 342}" y="67">创业板指 / 中证红利</text>',
        f'<line x1="{width - 195}" y1="62" x2="{width - 155}" y2="62" stroke="#2563a6" stroke-width="3"/><text class="axis" x="{width - 147}" y="67">沪深300（右轴）</text>',
    ]

    for i in range(7):
        value = ymin + (ymax - ymin) * i / 6
        py = y_ratio(value)
        parts.append(f'<line x1="{left}" y1="{py:.2f}" x2="{left + plot_w}" y2="{py:.2f}" stroke="#e5e7eb" stroke-width="1"/>')
        parts.append(f'<text class="axis" x="{left - 14}" y="{py + 5:.2f}" text-anchor="end">{value:.2f}</text>')
        hs_value = hmin + (hmax - hmin) * i / 6
        parts.append(f'<text class="axis" x="{left + plot_w + 14}" y="{py + 5:.2f}" text-anchor="start" fill="#1d4f91">{hs_value:.0f}</text>')

    for year in range(dates[0].year + 1, dates[-1].year + 1):
        tick = date(year, 1, 1)
        if dates[0] <= tick <= dates[-1]:
            px = x(tick)
            parts.append(f'<line x1="{px:.2f}" y1="{top}" x2="{px:.2f}" y2="{top + plot_h}" stroke="#eef0f3" stroke-width="1"/>')
            parts.append(f'<text class="axis" x="{px:.2f}" y="{top + plot_h + 28}" text-anchor="middle">{year}-01</text>')

    parts.extend([
        f'<line x1="{left}" y1="{y_ratio(ratios[0]):.2f}" x2="{left + plot_w}" y2="{y_ratio(ratios[0]):.2f}" stroke="#d94841" stroke-width="1" stroke-dasharray="7 6" opacity="0.45"/>',
        f'<path d="{ratio_path}" fill="none" stroke="#d94841" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>',
        f'<path d="{hs300_path}" fill="none" stroke="#2563a6" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>',
        f'<circle cx="{x(dates[-1]):.2f}" cy="{y_ratio(ratios[-1]):.2f}" r="5" fill="#b91c1c"/>',
        f'<circle cx="{x(dates[-1]):.2f}" cy="{y_hs300(hs300_values[-1]):.2f}" r="5" fill="#1d4f91"/>',
        f'<text class="axis" x="{x(dates[-1]) - 12:.2f}" y="{y_ratio(ratios[-1]) - 13:.2f}" text-anchor="end" fill="#7f1d1d">比值 {ratios[-1]:.3f}</text>',
        f'<text class="axis" x="{x(dates[-1]) - 12:.2f}" y="{y_hs300(hs300_values[-1]) - 13:.2f}" text-anchor="end" fill="#1d4f91">沪深300 {hs300_values[-1]:.2f}</text>',
        f'<text class="axis" x="{width / 2}" y="{height - 48}" text-anchor="middle">日期</text>',
        f'<text class="axis" x="28" y="{top + plot_h / 2}" text-anchor="middle" transform="rotate(-90 28 {top + plot_h / 2})">比值（收盘点位之比）</text>',
        f'<text class="axis" x="{width - 25}" y="{top + plot_h / 2}" text-anchor="middle" transform="rotate(90 {width - 25} {top + plot_h / 2})" fill="#1d4f91">沪深300收盘点位</text>',
        f'<text class="note" x="{left}" y="{height - 16}">数据：东方财富历史行情；红线为创业板指/中证红利比值（左轴），蓝线为沪深300原始收盘点位（右轴），未计算比值。</text>',
        '</svg>',
    ])
    OUT_SVG.write_text("\n".join(parts), encoding="utf-8")


def main() -> None:
    end_day = date.today()
    start_day = end_day - timedelta(days=10 * 365 + 3)
    middle_day = end_day - timedelta(days=5 * 365 + 2)
    start = start_day.strftime("%Y%m%d")
    middle = middle_day.strftime("%Y%m%d")
    before_middle = (middle_day - timedelta(days=1)).strftime("%Y%m%d")
    end = end_day.strftime("%Y%m%d")

    chinext = fetch_daily_close("0.399006", start, before_middle)
    chinext.update(fetch_daily_close("0.399006", middle, end))
    hs300 = fetch_daily_close("1.000300", start, before_middle)
    hs300.update(fetch_daily_close("1.000300", middle, end))
    dividend = fetch_daily_close("1.000922", start, before_middle)
    dividend.update(fetch_daily_close("1.000922", middle, end))
    common_dates = sorted(set(chinext) & set(hs300) & set(dividend))
    if not common_dates:
        raise RuntimeError("两个指数没有可对齐的共同交易日")

    rows = [
        (d, chinext[d], hs300[d], dividend[d], chinext[d] / dividend[d])
        for d in common_dates
        if dividend[d] != 0
    ]

    with OUT_CSV.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["日期", "创业板指收盘", "沪深300收盘", "中证红利收盘", "创业板指/中证红利"])
        writer.writerows(
            (d, f"{c:.2f}", f"{h:.2f}", f"{v:.2f}", f"{r:.6f}")
            for d, c, h, v, r in rows
        )

    ratios = [row[4] for row in rows]
    hs300_values = [row[2] for row in rows]
    render_svg(rows)

    print(json.dumps({
        "svg": str(OUT_SVG),
        "csv": str(OUT_CSV),
        "observations": len(rows),
        "start": rows[0],
        "end": rows[-1],
        "ratio_min": min(ratios),
        "ratio_max": max(ratios),
        "hs300_min": min(hs300_values),
        "hs300_max": max(hs300_values),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
