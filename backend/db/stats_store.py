"""
JSON-file stats store for tracking document views and searches.
"""

import json
import os
import threading
from datetime import datetime, timezone

STORE_PATH = os.getenv("STATS_STORE_PATH", "./stats.json")
_lock = threading.Lock()


def _load() -> dict:
    if not os.path.exists(STORE_PATH):
        return {"views": [], "searches": []}
    with open(STORE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _save(data: dict) -> None:
    with open(STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


MAX_RECORDS = 1000


def _trim(events: list) -> list:
    if len(events) > MAX_RECORDS:
        return events[-MAX_RECORDS:]
    return events


def log_view(doc_id: str, filename: str, user_id: str) -> None:
    with _lock:
        data = _load()
        data["views"].append({
            "doc_id": doc_id,
            "filename": filename,
            "user_id": user_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })
        data["views"] = _trim(data["views"])
        _save(data)


def log_search(query: str, doc_id: str | None, user_id: str) -> None:
    with _lock:
        data = _load()
        data["searches"].append({
            "query": query,
            "doc_id": doc_id,
            "user_id": user_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })
        data["searches"] = _trim(data["searches"])
        _save(data)


def get_most_viewed(limit: int = 10) -> list:
    with _lock:
        data = _load()
        counts = {}
        filenames = {}
        for v in data["views"]:
            did = v["doc_id"]
            counts[did] = counts.get(did, 0) + 1
            filenames[did] = v.get("filename", "Unknown")
        sorted_docs = sorted(counts.items(), key=lambda x: x[1], reverse=True)
        return [
            {"doc_id": did, "filename": filenames.get(did, "Unknown"), "count": cnt}
            for did, cnt in sorted_docs[:limit]
        ]


def get_most_searched(limit: int = 10) -> list:
    with _lock:
        data = _load()
        counts = {}
        for s in data["searches"]:
            q = s["query"]
            counts[q] = counts.get(q, 0) + 1
        sorted_queries = sorted(counts.items(), key=lambda x: x[1], reverse=True)
        return [
            {"query": q, "count": cnt}
            for q, cnt in sorted_queries[:limit]
        ]
