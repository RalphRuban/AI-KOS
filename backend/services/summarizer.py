"""
Summarizes a document from its stored chunks.

Single-pass for short docs (fits comfortably in one prompt).
Map-reduce for longer docs: summarize each chunk (or small batch of
chunks) individually, then summarize the summaries.

Uses improved prompts with better instruction following.
"""

from services.llm_client import LLMConnectionError, chat_completion

MAP_REDUCE_THRESHOLD = 6
BATCH_SIZE = 4


def summarize_document(filename: str, chunks: list[str]) -> str:
    if not chunks:
        return "No content available to summarize."

    try:
        if len(chunks) <= MAP_REDUCE_THRESHOLD:
            full_text = "\n\n".join(chunks)
            return chat_completion(
                system_prompt=(
                    "You are a professional document summarizer. "
                    "Write concise, accurate summaries in 3-6 sentences. "
                    "Preserve key facts, figures, and names. "
                    "Do not add information not present in the source."
                ),
                user_prompt=f"Summarize the following document ('{filename}'):\n\n{full_text}",
                temperature=0.3,
            )

        batch_summaries = []
        for i in range(0, len(chunks), BATCH_SIZE):
            batch = chunks[i : i + BATCH_SIZE]
            batch_text = "\n\n".join(batch)
            batch_summary = chat_completion(
                system_prompt=(
                    "Summarize this excerpt of a larger document in 2-4 sentences. "
                    "Preserve key facts, figures, and technical terms exactly. "
                    "Do not add external information."
                ),
                user_prompt=f"Excerpt from '{filename}':\n\n{batch_text}",
                temperature=0.3,
            )
            batch_summaries.append(batch_summary)

        combined = "\n\n".join(batch_summaries)
        return chat_completion(
            system_prompt=(
                "You combine partial summaries into one coherent 4-7 sentence "
                "summary of the full document. Remove redundancy between parts. "
                "Preserve all key facts, figures, and conclusions. "
                "Ensure the summary flows naturally as a single narrative."
            ),
            user_prompt=f"Partial summaries of '{filename}':\n\n{combined}",
            temperature=0.3,
        )
    except LLMConnectionError as e:
        return f"Summary unavailable: {e}"
