"""
Hybrid search agent — BM25 + Vector with user scoping and metadata filters.
"""

import re

from db.chroma_client import get_collection
from services.bm25_index import bm25_index


RRF_K = 60


def _normalize_scores(results: list[dict], score_key: str = "score") -> list[dict]:

    if not results:
        return results

    scores = [r[score_key] for r in results]
    min_s, max_s = min(scores), max(scores)
    spread = max_s - min_s

    if spread == 0:
        for r in results:
            r[score_key] = 1.0
    else:
        for r in results:
            r[score_key] = round((r[score_key] - min_s) / spread, 4)

    return results


def _rrf_fusion(vector_results: list[dict], bm25_results: list[dict], k: int = RRF_K) -> list[dict]:

    chunk_scores: dict[str, dict] = {}

    for rank, result in enumerate(vector_results):
        cid = result["chunk_id"]
        if cid not in chunk_scores:
            chunk_scores[cid] = {
                "chunk_id": cid, "document": result["document"],
                "metadata": result["metadata"], "vector_score": 0.0,
                "bm25_score": 0.0, "rrf_score": 0.0,
            }
        chunk_scores[cid]["vector_score"] = 1.0 / (k + rank + 1)

    for rank, result in enumerate(bm25_results):
        cid = result["chunk_id"]
        if cid not in chunk_scores:
            chunk_scores[cid] = {
                "chunk_id": cid, "document": result["document"],
                "metadata": result["metadata"], "vector_score": 0.0,
                "bm25_score": 0.0, "rrf_score": 0.0,
            }
        chunk_scores[cid]["bm25_score"] = 1.0 / (k + rank + 1)

    for cid in chunk_scores:
        chunk_scores[cid]["rrf_score"] = round(
            chunk_scores[cid]["vector_score"] + chunk_scores[cid]["bm25_score"], 6
        )

    return sorted(chunk_scores.values(), key=lambda x: x["rrf_score"], reverse=True)


def _build_snippet(text: str, query: str, max_length: int = 250) -> str:

    query_words = [w.lower() for w in query.split() if len(w) > 2]

    if not query_words:
        trimmed = text[:max_length]
        return trimmed + ("..." if len(text) > max_length else "")

    best_start = 0
    best_overlap = 0
    window_size = min(max_length, len(text))

    for start in range(0, len(text) - window_size + 1, 50):
        window = text[start:start + window_size].lower()
        overlap = sum(1 for w in query_words if w in window)
        if overlap > best_overlap:
            best_overlap = overlap
            best_start = start

    snippet = text[best_start:best_start + max_length]
    if best_start > 0:
        snippet = "..." + snippet
    if best_start + max_length < len(text):
        snippet = snippet + "..."

    for word in query_words:
        snippet = re.compile(re.escape(word), re.IGNORECASE).sub(f"**{word}**", snippet)

    return snippet


class SearchAgent:

    def run(
        self,
        query: str,
        top_k: int = 5,
        doc_id: str = None,
        file_type: str = None,
        date_from: str = None,
        date_to: str = None,
        user_id: str = None,
    ):

        collection = get_collection()

        where_filters = []

        if user_id:
            where_filters.append({"user_id": user_id})

        if doc_id:
            where_filters.append({"doc_id": doc_id})

        if file_type:
            where_filters.append({"file_type": file_type})

        if date_from or date_to:
            date_filter = {}
            if date_from and date_to:
                date_filter = {"$and": [
                    {"uploaded_at": {"$gte": date_from}},
                    {"uploaded_at": {"$lte": date_to}},
                ]}
            elif date_from:
                date_filter = {"uploaded_at": {"$gte": date_from}}
            elif date_to:
                date_filter = {"uploaded_at": {"$lte": date_to}}
            where_filters.append(date_filter)

        query_kwargs = {
            "query_texts": [query],
            "n_results": top_k * 2,
            "include": ["documents", "metadatas", "distances"],
        }

        if where_filters:
            query_kwargs["where"] = (
                where_filters[0] if len(where_filters) == 1
                else {"$and": where_filters}
            )

        vector_raw = collection.query(**query_kwargs)

        v_docs = vector_raw.get("documents", [[]])[0]
        v_metas = vector_raw.get("metadatas", [[]])[0]
        v_dists = vector_raw.get("distances", [[]])[0]

        vector_results = []
        for doc, meta, dist in zip(v_docs, v_metas, v_dists):
            vector_results.append({
                "chunk_id": f"{meta.get('doc_id', '')}_chunk_{meta.get('chunk_index', '')}",
                "document": doc,
                "metadata": meta,
                "score": max(0.0, 1.0 - dist),
            })

        bm25_results = bm25_index.query(
            query_text=query,
            top_k=top_k * 2,
            doc_id=doc_id,
            file_type=file_type,
            date_from=date_from,
            date_to=date_to,
            user_id=user_id,
        )

        vector_results = _normalize_scores(vector_results, "score")
        bm25_results = _normalize_scores(bm25_results, "score")

        merged = _rrf_fusion(vector_results, bm25_results)

        final_results = []
        seen_docs = set()

        for item in merged[:top_k]:
            meta = item["metadata"]
            doc_key = (meta.get("doc_id", ""), meta.get("chunk_index", -1))
            if doc_key in seen_docs:
                continue
            seen_docs.add(doc_key)

            final_results.append({
                "filename": meta.get("filename"),
                "doc_id": meta.get("doc_id"),
                "chunk_index": meta.get("chunk_index"),
                "file_type": meta.get("file_type"),
                "chunk": item["document"],
                "snippet": _build_snippet(item["document"], query),
                "score": round(item["rrf_score"], 4),
                "vector_score": round(item["vector_score"], 4),
                "bm25_score": round(item["bm25_score"], 4),
            })

        return {
            "query": query,
            "results": final_results,
            "total_results": len(final_results),
            "search_mode": "hybrid",
        }


search_agent = SearchAgent()
