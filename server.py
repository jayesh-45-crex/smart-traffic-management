"""Nagpur AI Traffic Command Center - single-process local/demo server.

Serves the static website and exposes small JSON APIs used by the dashboard.
The traffic endpoints use the bundled Nagpur junction dataset, so the site is
fully usable without external services. Real YOLO inference can be plugged in
later through the optional AI service hook described in README.md.
"""
from __future__ import annotations

import json
import mimetypes
import os
import statistics
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "deta" / "nagpur-junctions.json"
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8080"))


def load_junctions():
    with DATA_FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        return data
    return data.get("junctions") or data.get("intersections") or []


def num(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def density_value(item):
    raw = item.get("density", item.get("trafficDensity", item.get("congestion")))
    if raw is not None:
        return num(raw)
    status = str(item.get("status", "")).lower()
    return {"high": 80.0, "medium": 55.0, "low": 25.0}.get(status, 0.0)


def traffic_level(value):
    v = num(value)
    if v >= 70:
        return "HIGH"
    if v >= 40:
        return "MEDIUM"
    return "LOW"


def summary():
    junctions = load_junctions()
    densities = []
    for item in junctions:
        densities.append(density_value(item))
    avg = round(statistics.mean(densities), 1) if densities else 0
    high = sum(1 for d in densities if d >= 70)
    medium = sum(1 for d in densities if 40 <= d < 70)
    low = sum(1 for d in densities if d < 40)
    worst = None
    if junctions:
        worst = max(junctions, key=density_value)
    worst_density = density_value(worst or {})
    return {
        "junctions": len(junctions),
        "averageDensity": avg,
        "highDensity": high,
        "mediumDensity": medium,
        "lowDensity": low,
        "worstJunction": (worst or {}).get("name", "N/A"),
        "worstDensity": worst_density,
        "status": traffic_level(avg),
    }


def ai_analysis():
    s = summary()
    if s["worstJunction"] == "N/A":
        recommendation = "No junction data available."
    elif s["worstDensity"] >= 80:
        recommendation = f"Prioritize {s['worstJunction']} and consider +15s green time for the highest-demand approach."
    elif s["worstDensity"] >= 60:
        recommendation = f"Monitor {s['worstJunction']} closely and consider +10s green time if queues continue rising."
    else:
        recommendation = "Traffic is within normal operating range; continue monitoring."
    return {"source": "bundled-junction-dataset", "summary": s, "recommendation": recommendation}


class Handler(BaseHTTPRequestHandler):
    server_version = "NagpurAI/1.0"

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        try:
            if path == "/api/health":
                return self.send_json({"ok": True, "service": "nagpur-ai-traffic", "port": PORT})
            if path == "/api/traffic/summary":
                return self.send_json(summary())
            if path == "/api/ai/analyze":
                return self.send_json(ai_analysis())
            if path == "/api/junctions":
                return self.send_json({"junctions": load_junctions()})
        except Exception as exc:
            return self.send_json({"ok": False, "error": str(exc)}, 500)
        return self.serve_static(path)

    def serve_static(self, path):
        relative = path.lstrip("/") or "index.html"
        target = (ROOT / relative).resolve()
        if ROOT not in target.parents and target != ROOT:
            self.send_error(403)
            return
        if target.is_dir():
            target = target / "index.html"
        if not target.exists() or not target.is_file():
            self.send_error(404, "File not found")
            return
        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        data = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        print(f"[{self.log_date_time_string()}] {fmt % args}")


if __name__ == "__main__":
    print(f"Nagpur AI Traffic running at http://{HOST}:{PORT}/")
    print("API: /api/health  /api/traffic/summary  /api/ai/analyze  /api/junctions")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
