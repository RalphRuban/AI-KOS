"""
Compare agent — user-scoped document comparison.
"""

import json

from services.llm_client import LLMConnectionError, chat_completion
from db.chroma_client import get_collection


class CompareAgent:

    def run(self, doc_id_1: str, doc_id_2: str, user_id: str = None):

        collection = get_collection()

        where_filters_1 = [{"doc_id": doc_id_1}]
        where_filters_2 = [{"doc_id": doc_id_2}]

        if user_id:
            where_filters_1.append({"user_id": user_id})
            where_filters_2.append({"user_id": user_id})

        result1 = collection.get(
            where=where_filters_1[0] if len(where_filters_1) == 1
            else {"$and": where_filters_1}
        )
        result2 = collection.get(
            where=where_filters_2[0] if len(where_filters_2) == 1
            else {"$and": where_filters_2}
        )

        chunks1 = result1.get("documents", [])
        chunks2 = result2.get("documents", [])
        metadata1 = result1.get("metadatas", [])
        metadata2 = result2.get("metadatas", [])

        filename1 = metadata1[0].get("filename", "Document 1") if metadata1 else "Document 1"
        filename2 = metadata2[0].get("filename", "Document 2") if metadata2 else "Document 2"

        text1 = "\n\n".join(chunks1)
        text2 = "\n\n".join(chunks2)

        system_prompt = "You are an expert document comparison assistant. Return ONLY valid JSON."

        user_prompt = f"""
Compare these two documents.

Document 1: {filename1}
{text1}

--------------------------------------

Document 2: {filename2}
{text2}

Provide:
1. summary_1: Summary of Document 1
2. summary_2: Summary of Document 2
3. similarities: List of similarities
4. differences: List of differences
5. common_topics: List of common topics
6. technical_comparison: Which is more technical and why?

Return JSON with these keys."""

        try:
            raw = chat_completion(system_prompt=system_prompt, user_prompt=user_prompt, temperature=0.2)
            parsed = json.loads(raw)
        except (json.JSONDecodeError, LLMConnectionError):
            parsed = {"raw_response": raw if "raw" in dir() else ""}

        return {
            "document_1": filename1,
            "document_2": filename2,
            "comparison": parsed,
        }


compare_agent = CompareAgent()
