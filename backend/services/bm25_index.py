"""
BM25 index for hybrid search with user scoping.
"""

import re
import threading

from rank_bm25 import BM25Okapi

from db.chroma_client import get_collection


_tokenizer = re.compile(r"\b\w+\b", re.IGNORECASE)


def _tokenize(text: str) -> list[str]:
    return _tokenizer.findall(text.lower())


class BM25Index:

    def __init__(self):
        self._bm25 = None
        self._chunk_ids = []
        self._documents = []
        self._metadatas = []
        self._lock = threading.Lock()
        self._built = False

    def build(self):
        with self._lock:
            collection = get_collection()
            result = collection.get(include=["documents", "metadatas"])

            self._documents = result.get("documents", [])
            self._metadatas = result.get("metadatas", [])
            self._chunk_ids = result.get("ids", [])

            if not self._documents:
                self._bm25 = None
                self._built = True
                return

            self._bm25 = BM25Okapi([_tokenize(doc) for doc in self._documents])
            self._built = True

    def _ensure_built(self):
        if not self._built:
            self.build()

    def query(
        self,
        query_text: str,
        top_k: int = 10,
        doc_id: str = None,
        file_type: str = None,
        date_from: str = None,
        date_to: str = None,
        user_id: str = None,
    ) -> list[dict]:

        self._ensure_built()

        if self._bm25 is None or not self._documents:
            return []

        query_tokens = _tokenize(query_text)
        if not query_tokens:
            return []

        scores = self._bm25.get_scores(query_tokens)

        indexed_results = []

        for i, score in enumerate(scores):
            meta = self._metadatas[i]

            if user_id and meta.get("user_id") != user_id:
                continue
            if doc_id and meta.get("doc_id") != doc_id:
                continue
            if file_type and meta.get("file_type") != file_type:
                continue
            if date_from:
                uploaded = meta.get("uploaded_at", "")
                if uploaded and uploaded < date_from:
                    continue
            if date_to:
                uploaded = meta.get("uploaded_at", "")
                if uploaded and uploaded > date_to:
                    continue

            indexed_results.append({"index": i, "score": float(score)})

        indexed_results.sort(key=lambda x: x["score"], reverse=True)

        return [
            {
                "chunk_id": self._chunk_ids[item["index"]],
                "document": self._documents[item["index"]],
                "metadata": self._metadatas[item["index"]],
                "score": item["score"],
            }
            for item in indexed_results[:top_k]
        ]

    def invalidate(self):
        with self._lock:
            self._built = False
            self._bm25 = None
            self._documents = []
            self._metadatas = []
            self._chunk_ids = []


bm25_index = BM25Index()
