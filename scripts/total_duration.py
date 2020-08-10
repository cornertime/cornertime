#!/usr/bin/env python3
# usage: python3 scripts/total_duration.py < reports.txt
# with reports.txt containing punishment reports with header & footer intact one after another

import base64
import json
import sys


HEADER = b"-----BEGIN CORNERTIME PUNISHMENT REPORT-----"
FOOTER = b"-----END CORNERTIME PUNISHMENT REPORT-----"


def parse_reports(reports: str):
    for report_str in reports.split(HEADER):
        report_str = report_str.strip()
        if not report_str:
            continue

        report_b64, trailing = report_str.split(FOOTER, 1)
        yield json.loads(base64.decodestring(report_b64.strip()))


def get_total_duration(reports: str):
    return sum(report["totalDuration"] for report in parse_reports(reports))


if __name__ == "__main__":
    seconds = get_total_duration(sys.stdin.buffer.read())
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    print(f"{hours}h {minutes}min {seconds}s")