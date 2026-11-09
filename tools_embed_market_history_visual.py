from __future__ import annotations

import csv
import json
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT / "创业板指中证红利比值_沪深300指数_全历史.csv"
HTML_PATH = ROOT / "chinext-dividend-full-history.html"


def main() -> None:
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as file:
        rows = list(csv.DictReader(file))

    weekly: dict[tuple[int, int], dict[str, str]] = {}
    for row in rows:
        day = date.fromisoformat(row["日期"])
        iso = day.isocalendar()
        weekly[(iso.year, iso.week)] = row

    sampled = [weekly[key] for key in sorted(weekly)]
    ratio_rows = [[row["日期"], round(float(row["创业板指/中证红利"]), 6)] for row in sampled]
    hs300_rows = [[row["日期"], round(float(row["沪深300收盘"]), 2)] for row in sampled]

    html = HTML_PATH.read_text(encoding="utf-8")
    html = html.replace("__RATIO_ROWS__", json.dumps(ratio_rows, ensure_ascii=False, separators=(",", ":")))
    html = html.replace("__HS300_ROWS__", json.dumps(hs300_rows, ensure_ascii=False, separators=(",", ":")))
    HTML_PATH.write_text(html, encoding="utf-8")

    print(json.dumps({
        "daily_rows": len(rows),
        "weekly_rows": len(sampled),
        "start": sampled[0]["日期"],
        "end": sampled[-1]["日期"],
        "html_bytes": HTML_PATH.stat().st_size,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
