"""
Compare agent — user-scoped document comparison with real alignment score.
"""

import json
import math

from services.llm_client import LLMConnectionError, chat_completion
from db.chroma_client import get_collection


def _cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """Compute cosine similarity between two vectors."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    mag_a = math.sqrt(sum(a * a for a in vec_a))
    mag_b = math.sqrt(sum(b * b for b in vec_b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return round(dot / (mag_a * mag_b), 4)


def _centroid(vectors: list[list[float]]) -> list[float]:
    """Average a list of embedding vectors into one centroid."""
    if not vectors:
        return []
    dim = len(vectors[0])
    centroid = [0.0] * dim
    for vec in vectors:
        for i, v in enumerate(vec):
            centroid[i] += v
    n = len(vectors)
    return [x / n for x in centroid]


def _compute_similarity_score(
    collection,
    doc_id_1: str,
    doc_id_2: str,
    user_id: str = None,
) -> float:
    """
    Compute cosine similarity between document centroid embeddings.

    Uses collection.query() rather than .get() because ChromaDB only
    returns embeddings via query() when the collection was created with
    a built-in embedding function (e.g. SentenceTransformer).
    Falls back to 0.0 on any error.
    """
    import logging
    log = logging.getLogger("compare_agent")
    try:
        # Build where filters
        def _where(doc_id, uid):
            if uid:
                return {"$and": [{"doc_id": doc_id}, {"user_id": uid}]}
            return {"doc_id": doc_id}

        # Fetch ALL chunks for each doc via .get() — use include=["embeddings"]
        # If embeddings come back as None (older chromadb), we fall through
        # to the query-based approach.
        res1 = collection.get(where=_where(doc_id_1, user_id), include=["embeddings"])
        res2 = collection.get(where=_where(doc_id_2, user_id), include=["embeddings"])

        emb1 = res1.get("embeddings") if res1 else None
        emb2 = res2.get("embeddings") if res2 else None

        # chromadb returns None (not []) when embedding storage is not available
        if not emb1 or not emb2:
            log.warning(
                "compare_agent: .get() returned no embeddings — "
                "falling back to query()-based similarity."
            )
            # Fallback: query each doc's chunks with a broad probe text
            # and average the returned embeddings.
            def _query_embs(doc_id, uid):
                kw = {
                    "query_texts": ["document"],
                    "n_results": min(20, max(1, collection.count())),
                    "include": ["embeddings"],
                }
                if uid:
                    kw["where"] = {"$and": [{"doc_id": doc_id}, {"user_id": uid}]}
                else:
                    kw["where"] = {"doc_id": doc_id}
                r = collection.query(**kw)
                embs = r.get("embeddings", [[]])[0]
                return embs or []

            emb1 = _query_embs(doc_id_1, user_id)
            emb2 = _query_embs(doc_id_2, user_id)

        if not emb1 or not emb2:
            log.warning("compare_agent: still no embeddings — returning 0.0")
            return 0.0

        c1 = _centroid(emb1)
        c2 = _centroid(emb2)
        score = _cosine_similarity(c1, c2)
        log.info(f"compare_agent: similarity_score={score}")
        return score

    except Exception as exc:
        log.warning(f"compare_agent: similarity score failed: {exc}")
        return 0.0


def _safe_list(value) -> list:
    """Ensure a value is a list of strings."""
    if isinstance(value, list):
        return [str(v) for v in value if v]
    if isinstance(value, str) and value.strip():
        return [value]
    return []


def _safe_str(value, fallback: str = "") -> str:
    if isinstance(value, str):
        return value
    if isinstance(value, list) and value:
        return " ".join(str(v) for v in value)
    return fallback


class CompareAgent:

    def run(self, doc_id_1: str, doc_id_2: str, user_id: str = None):

        collection = get_collection()

        # Build user-scoped filters
        where1 = {"$and": [{"doc_id": doc_id_1}, {"user_id": user_id}]} if user_id else {"doc_id": doc_id_1}
        where2 = {"$and": [{"doc_id": doc_id_2}, {"user_id": user_id}]} if user_id else {"doc_id": doc_id_2}

        result1 = collection.get(where=where1)
        result2 = collection.get(where=where2)

        chunks1 = result1.get("documents", [])
        chunks2 = result2.get("documents", [])
        metadata1 = result1.get("metadatas", [])
        metadata2 = result2.get("metadatas", [])

        filename1 = metadata1[0].get("filename", "Document 1") if metadata1 else "Document 1"
        filename2 = metadata2[0].get("filename", "Document 2") if metadata2 else "Document 2"

        # Truncate to avoid LLM token limits (max ~4000 chars each)
        text1 = "\n\n".join(chunks1)[:4000]
        text2 = "\n\n".join(chunks2)[:4000]

        # Compute real embedding-based alignment score
        similarity_score = _compute_similarity_score(collection, doc_id_1, doc_id_2, user_id)

        system_prompt = (
            "You are an expert document comparison assistant. "
            "Return ONLY valid JSON — no markdown, no code fences, no extra text."
        )

        user_prompt = f"""Compare these two documents and return a JSON object with EXACTLY these keys:

"summary": a 2-3 sentence comparative overview of both documents together,
"summary_1": a 1-sentence summary of Document 1,
"summary_2": a 1-sentence summary of Document 2,
"similarities": a JSON array of 3-5 strings describing what both documents share,
"differences": a JSON array of 3-5 strings describing how the documents differ,
"common_topics": a JSON array of 3-6 short topic keywords found in both,
"technical_comparison": a single string describing which document is more technical and why

Document 1 — {filename1}:
{text1}

--------------------------------------

Document 2 — {filename2}:
{text2}

Return ONLY the JSON object."""

        parsed = {}
        raw = ""
        try:
            raw = chat_completion(system_prompt=system_prompt, user_prompt=user_prompt, temperature=0.2)
            # Strip markdown code fences if LLM wraps output
            clean = raw.strip()
            if clean.startswith("```"):
                clean = clean.split("```")[-2] if clean.count("```") >= 2 else clean.replace("```json", "").replace("```", "")
            parsed = json.loads(clean)
        except json.JSONDecodeError:
            # Try to extract JSON object from raw response
            try:
                start = raw.index("{")
                end = raw.rindex("}") + 1
                parsed = json.loads(raw[start:end])
            except Exception:
                parsed = {}
        except LLMConnectionError as e:
            return {
                "document_1": filename1,
                "document_2": filename2,
                "similarity_score": similarity_score,
                "summary": str(e),
                "summary_1": "",
                "summary_2": "",
                "similarities": [],
                "differences": [],
                "common_topics": [],
                "technical_comparison": "",
                "error": True,
            }

        # Flatten to top-level keys so the frontend can read directly
        return {
            "document_1": filename1,
            "document_2": filename2,
            "similarity_score": similarity_score,
            "summary": _safe_str(parsed.get("summary"), "Comparison complete."),
            "summary_1": _safe_str(parsed.get("summary_1")),
            "summary_2": _safe_str(parsed.get("summary_2")),
            "similarities": _safe_list(parsed.get("similarities")),
            "differences": _safe_list(parsed.get("differences")),
            "common_topics": _safe_list(parsed.get("common_topics")),
            "technical_comparison": _safe_str(parsed.get("technical_comparison")),
        }


compare_agent = CompareAgent()
