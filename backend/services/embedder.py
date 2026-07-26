"""
Embeds chunks and stores them in Chroma with source metadata.
"""

import uuid

from db.chroma_client import get_collection


def store_chunks(
    doc_id: str,
    filename: str,
    chunks: list[str],
    file_type: str = None,
    user_id: str = None,
) -> int:
    """Embeds and stores chunks in Chroma. Returns the number stored."""
    if not chunks:
        return 0

    collection = get_collection()
    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]

    from datetime import datetime, timezone

    uploaded_at = datetime.now(timezone.utc).isoformat()

    metadatas = [
        {
            "doc_id": doc_id,
            "filename": filename,
            "chunk_index": i,
            "file_type": file_type,
            "uploaded_at": uploaded_at,
            "user_id": user_id,
        }
        for i in range(len(chunks))
    ]

    collection.add(ids=ids, documents=chunks, metadatas=metadatas)

    from services.bm25_index import bm25_index
    bm25_index.invalidate()

    return len(chunks)


def new_doc_id() -> str:
    return uuid.uuid4().hex[:12]
