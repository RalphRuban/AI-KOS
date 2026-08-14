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
        # POPULATE DUMMY DATA
        import uuid, random
        from datetime import datetime, timedelta, timezone
        
        data = {}
        CATEGORIES = ["General", "Finance", "Legal", "Engineering", "ESG", "Security", "Research", "Strategy", "Product", "Operations", "AI", "Marketing"]
        FILE_TYPES = ["PDF", "DOCX", "TXT", "MD", "PPTX", "XLSX"]
        ADJECTIVES = ["Global", "Enterprise", "Quarterly", "Annual", "Strategic", "Neural", "Compliance", "Security", "Cloud", "Data", "Customer", "Internal"]
        NOUNS = ["Report", "Overview", "Roadmap", "Findings", "Framework", "Architecture", "Log", "Paper", "Analysis", "Benchmark", "Strategy", "Guidelines"]
        
        now = datetime.now(timezone.utc)
        for _ in range(847):
            doc_id = uuid.uuid4().hex[:12]
            cat = random.choice(CATEGORIES)
            title = f"{random.choice(ADJECTIVES)} {random.choice(CATEGORIES)} {random.choice(NOUNS)} 202{random.randint(4,6)}"
            data[doc_id] = {
                "doc_id": doc_id,
                "filename": title + "." + random.choice(FILE_TYPES).lower(),
                "chunk_count": random.randint(10, 500),
                "file_type": random.choice(FILE_TYPES),
                "file_size": random.randint(100_000, 15_000_000),
                "page_count": random.randint(1, 200),
                "title": title,
                "author": "System Generator",
                "category": cat,
                "user_id": None,
                "uploaded_at": (now - timedelta(days=random.randint(0, 365))).isoformat(),
                "summary": "Auto-generated document for AI-KOS load testing and UI rendering.",
                "keywords": [cat.lower(), "auto", "test"]
            }
        
        with open(STORE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return data

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
    category: str = "General",
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
            "category": category,
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
