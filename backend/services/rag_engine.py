"""
Core RAG Engine with user scoping.

Flow:
PDF Document
    |
Text Chunking
    |
SentenceTransformer Embeddings
    |
ChromaDB Retrieval
    |
Gemini LLM Generation
    |
Final Answer with Citations
"""

import os
import re

from db.chroma_client import get_collection
from services.llm_client import (
    LLMConnectionError,
    chat_completion,
)


TOP_K = int(os.getenv("RAG_TOP_K", "5"))
TOP_K_BROAD = 8


SYSTEM_PROMPT = """You are AI-KOS Lite, an Enterprise Knowledge Assistant.

Rules:

1. Answer ONLY using the supplied document context.
2. Never invent facts.
3. If the answer is not available in the documents, reply exactly:
   "I couldn't find that information in the uploaded documents."
4. For every claim in your answer, cite the source using [Source N] notation.
   Example: "The project uses Python 3.11 [Source 1] and FastAPI [Source 2]."
5. If multiple sources support the same claim, cite all of them: [Source 1, Source 3].
6. Think step by step before answering to ensure accuracy."""


def _compute_confidence(distances: list[float]) -> dict:

    if not distances:
        return {"score": 0.0, "level": "low"}

    scores = [max(0.0, 1.0 - d) for d in distances]
    avg_score = sum(scores) / len(scores)

    if len(scores) > 1:
        consistency = 1.0 - (max(scores) - min(scores))
    else:
        consistency = 0.5

    high_score_ratio = sum(1 for s in scores if s > 0.6) / len(scores)

    confidence = round(min(1.0, max(0.0,
        avg_score * 0.6 + consistency * 0.2 + high_score_ratio * 0.2
    )), 3)

    level = "high" if confidence > 0.7 else "medium" if confidence > 0.4 else "low"

    return {"score": confidence, "level": level}


def _extract_citations(answer_text: str, sources: list[dict]) -> list[dict]:

    pattern = r"\[Source\s+(\d+(?:,\s*\d+)*)\]"
    matches = re.findall(pattern, answer_text)

    citations = []
    seen = set()

    for match in matches:
        indices = [int(x.strip()) - 1 for x in match.split(",")]
        for idx in indices:
            if 0 <= idx < len(sources):
                key = (idx, sources[idx].get("doc_id", ""))
                if key not in seen:
                    seen.add(key)
                    citations.append({
                        "source_index": idx + 1,
                        "filename": sources[idx].get("filename", ""),
                        "doc_id": sources[idx].get("doc_id", ""),
                        "chunk_index": sources[idx].get("chunk_index"),
                    })

    return citations


def _get_snippet(chunk_text: str, query: str, max_length: int = 200) -> str:

    query_words = set(query.lower().split())

    if not query_words:
        return chunk_text[:max_length]

    sentences = re.split(r'(?<=[.!?])\s+', chunk_text)

    best_sentence = ""
    best_overlap = 0

    for sentence in sentences:
        overlap = sum(1 for w in query_words if w in sentence.lower())
        if overlap > best_overlap:
            best_overlap = overlap
            best_sentence = sentence

    if best_sentence:
        if len(best_sentence) > max_length:
            return best_sentence[:max_length] + "..."
        return best_sentence

    return chunk_text[:max_length] + ("..." if len(chunk_text) > max_length else "")


def answer_question(
    question: str,
    doc_id: str | None = None,
    user_id: str | None = None,
) -> dict:

    collection = get_collection()

    top_k = TOP_K if doc_id else TOP_K_BROAD

    where_filters = []

    if user_id:
        where_filters.append({"user_id": user_id})

    if doc_id:
        where_filters.append({"doc_id": doc_id})

    query_kwargs = {
        "query_texts": [question],
        "n_results": top_k,
        "include": ["documents", "metadatas", "distances"],
    }

    if where_filters:
        if len(where_filters) == 1:
            query_kwargs["where"] = where_filters[0]
        else:
            query_kwargs["where"] = {"$and": where_filters}

    results = collection.query(**query_kwargs)

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    if not documents:
        return {
            "answer": "I couldn't find any relevant content in the uploaded documents.",
            "sources": [],
            "citations": [],
            "confidence": {"score": 0.0, "level": "low"},
        }

    context_blocks = []
    sources = []

    for i, (doc_text, meta, distance) in enumerate(zip(documents, metadatas, distances)):

        filename = meta.get("filename", "Unknown")
        document_id = meta.get("doc_id", "")
        chunk_index = meta.get("chunk_index", None)

        snippet = _get_snippet(doc_text, question)

        context_blocks.append(
            f"""[Source {i + 1} | Document: {filename} | Chunk: {chunk_index}]\n\n{doc_text}"""
        )

        sources.append({
            "filename": filename,
            "doc_id": document_id,
            "chunk_index": chunk_index,
            "excerpt": snippet,
            "score": round(max(0.0, 1.0 - distance), 3),
        })

    context = "\n\n---\n\n".join(context_blocks)

    user_prompt = f"""Context:\n\n{context}\n\n\nQuestion:\n\n{question}\n\n\nAnswer the question using the sources above. Cite each claim with [Source N]."""

    confidence = _compute_confidence(distances)

    try:
        answer_text = chat_completion(SYSTEM_PROMPT, user_prompt, temperature=0.2)
    except LLMConnectionError as e:
        return {
            "answer": str(e),
            "sources": [],
            "citations": [],
            "confidence": confidence,
            "error": True,
        }

    citations = _extract_citations(answer_text, sources)

    seen = set()
    unique_sources = []
    for source in sources:
        if source["doc_id"] not in seen:
            seen.add(source["doc_id"])
            unique_sources.append(source)

    return {
        "answer": answer_text,
        "sources": unique_sources,
        "citations": citations,
        "confidence": confidence,
    }
