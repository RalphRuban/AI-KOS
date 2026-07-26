"""
Recommendation agent — finds similar documents using centroid embeddings,
metadata similarity, keyword overlap, and LLM-powered reasoning.
"""

import json

import numpy as np

from services.llm_client import LLMConnectionError, chat_completion
from db.chroma_client import get_collection
from db.metadata_store import get_document


class RecommendationAgent:

    def run(self, doc_id: str, top_k: int = 5, user_id: str = None):

        collection = get_collection()

        where_filters = [{"doc_id": doc_id}]
        if user_id:
            where_filters.append({"user_id": user_id})

        where = where_filters[0] if len(where_filters) == 1 else {"$and": where_filters}

        result = collection.get(
            where=where,
            include=["documents", "metadatas", "embeddings"],
        )

        if not result["documents"]:
            return {"recommendations": []}

        all_embeddings = np.array(result["embeddings"])

        centroid = np.mean(all_embeddings, axis=0)

        search_filters = []
        if user_id:
            search_filters.append({"user_id": user_id})

        search_kwargs = {
            "query_embeddings": [centroid.tolist()],
            "n_results": top_k + 10,
            "include": ["metadatas", "distances"],
        }

        if search_kwargs:
            if search_filters:
                search_kwargs["where"] = (
                    search_filters[0] if len(search_filters) == 1
                    else {"$and": search_filters}
                )

        similar = collection.query(**search_kwargs)

        source_meta = get_document(doc_id)

        source_keywords = set()
        if source_meta and source_meta.get("keywords"):
            kw = source_meta["keywords"]
            if isinstance(kw, dict):
                entities = kw.get("entities", [])
                topics = kw.get("topics", [])
                source_keywords = {
                    e.get("name", "").lower()
                    for e in entities
                    if e.get("name")
                } | set(t.lower() for t in topics)

        source_title = (source_meta or {}).get("title", "") or ""
        source_author = (source_meta or {}).get("author", "") or ""
        source_file_type = (source_meta or {}).get("file_type", "") or ""

        recommendations = []

        for meta, distance in zip(
            similar["metadatas"][0],
            similar["distances"][0],
        ):

            if meta.get("doc_id") == doc_id:
                continue

            vector_score = round(1 - distance, 3)

            candidate_meta = get_document(meta.get("doc_id", ""))

            metadata_score = self._compute_metadata_similarity(
                source_title, source_author, source_file_type,
                (candidate_meta or {}).get("title", "") or "",
                (candidate_meta or {}).get("author", "") or "",
                (candidate_meta or {}).get("file_type", "") or "",
            )

            keyword_score = self._compute_keyword_overlap(
                source_keywords,
                self._get_candidate_keywords(candidate_meta),
            )

            combined_score = round(
                vector_score * 0.6
                + metadata_score * 0.2
                + keyword_score * 0.2,
                3,
            )

            recommendations.append({
                "doc_id": meta.get("doc_id"),
                "filename": meta.get("filename"),
                "vector_score": vector_score,
                "metadata_score": round(metadata_score, 3),
                "keyword_score": round(keyword_score, 3),
                "score": combined_score,
                "title": (candidate_meta or {}).get("title"),
                "author": (candidate_meta or {}).get("author"),
            })

        recommendations.sort(key=lambda r: r["score"], reverse=True)
        recommendations = recommendations[:top_k]

        recommendations = self._enrich_with_llm(
            result["documents"],
            recommendations,
        )

        return {"recommendations": recommendations}

    def _compute_metadata_similarity(
        self,
        src_title, src_author, src_type,
        cand_title, cand_author, cand_type,
    ) -> float:

        score = 0.0
        total = 0.0

        if src_author and cand_author:
            total += 1.0
            if src_author.lower() == cand_author.lower():
                score += 1.0

        if src_type and cand_type:
            total += 1.0
            if src_type == cand_type:
                score += 1.0

        if src_title and cand_title:
            total += 1.0
            src_words = set(src_title.lower().split())
            cand_words = set(cand_title.lower().split())
            if src_words and cand_words:
                overlap = len(src_words & cand_words) / len(src_words | cand_words)
                score += overlap

        return score / total if total > 0 else 0.0

    def _compute_keyword_overlap(
        self,
        source_keywords: set,
        candidate_keywords: set,
    ) -> float:

        if not source_keywords or not candidate_keywords:
            return 0.0

        intersection = source_keywords & candidate_keywords
        union = source_keywords | candidate_keywords

        return len(intersection) / len(union) if union else 0.0

    def _get_candidate_keywords(self, candidate_meta) -> set:

        if not candidate_meta:
            return set()

        kw = candidate_meta.get("keywords")
        if not kw:
            return set()

        if isinstance(kw, dict):
            entities = kw.get("entities", [])
            topics = kw.get("topics", [])
            return {
                e.get("name", "").lower()
                for e in entities
                if e.get("name")
            } | set(t.lower() for t in topics)

        return set()

    def _enrich_with_llm(
        self,
        source_chunks: list[str],
        recommendations: list[dict],
    ) -> list[dict]:

        if not recommendations:
            return recommendations

        doc_text = "\n\n".join(source_chunks[:5])

        candidates_text = "\n".join(
            f"- {r['filename']} (score: {r['score']}, author: {r.get('author', 'N/A')})"
            for r in recommendations
        )

        system_prompt = (
            "You are a document recommendation assistant. "
            "Explain why each candidate is relevant to the source document. "
            "Return ONLY valid JSON."
        )

        user_prompt = f"""Source document content:
{doc_text}

Candidate recommendations:
{candidates_text}

For each candidate, provide a brief reason why it's relevant.
Return JSON with key "insights" as a list of objects with "filename" and "reason"."""

        try:
            raw = chat_completion(system_prompt=system_prompt, user_prompt=user_prompt, temperature=0.2)
            insights = json.loads(raw).get("insights", [])
        except (json.JSONDecodeError, LLMConnectionError):
            insights = []

        for rec in recommendations:
            match = next((i for i in insights if i.get("filename") == rec["filename"]), None)
            if match:
                rec["reason"] = match.get("reason", "")

        return recommendations


recommendation_agent = RecommendationAgent()
