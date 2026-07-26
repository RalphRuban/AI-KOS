"""
JSON-file metadata store for uploaded documents.

Stores document metadata with user ownership for multi-user support.
"""

import json
import os
import threading
from datetime import datetime, timezone

STORE_PATH = os.getenv("METADATA_STORE_PATH", "./documents_metadata.json")
_lock = threading.Lock()


def _load() -> dict:
    if not os.path.exists(STORE_PATH):
        return {}
    with open(STORE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _save(data: dict) -> None:
    with open(STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def add_document(
    doc_id: str,
    filename: str,
    chunk_count: int,
    file_type: str,
    file_size: int = None,
    page_count: int = None,
    title: str = None,
    author: str = None,
    user_id: str = None,
) -> dict:
    with _lock:
        data = _load()
        record = {
            "doc_id": doc_id,
            "filename": filename,
            "chunk_count": chunk_count,
            "file_type": file_type,
            "file_size": file_size,
            "page_count": page_count,
            "title": title,
            "author": author,
            "user_id": user_id,
            "uploaded_at": datetime.now(timezone.utc).isoformat(),
            "summary": None,
            "keywords": None,
        }
        data[doc_id] = record
        _save(data)
        return record


def list_documents(user_id: str = None) -> list:
    with _lock:
        data = _load()
        docs = list(data.values())
        if user_id:
            docs = [d for d in docs if d.get("user_id") == user_id]
        return docs


def get_document(doc_id: str) -> dict | None:
    with _lock:
        data = _load()
        return data.get(doc_id)


def update_document(doc_id: str, **fields) -> dict | None:
    with _lock:
        data = _load()
        if doc_id not in data:
            return None
        data[doc_id].update(fields)
        _save(data)
        return data[doc_id]


def delete_document(doc_id: str) -> bool:
    with _lock:
        data = _load()
        if doc_id not in data:
            return False
        del data[doc_id]
        _save(data)
        return True
