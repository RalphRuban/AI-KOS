"""
Splits extracted text into overlapping chunks suitable for embedding.

Uses LangChain's RecursiveCharacterTextSplitter, which tries to break on
paragraph/sentence boundaries first and only falls back to hard character
cuts when necessary — better retrieval quality than naive fixed-size splits.

Chunk size is expressed in characters (not tokens) for simplicity; ~500
tokens ≈ ~2000 characters for English text, which is what CHUNK_SIZE
approximates below.
"""

from langchain_text_splitters import RecursiveCharacterTextSplitter
CHUNK_SIZE = 2000  # ~500 tokens
CHUNK_OVERLAP = 200  # ~50 tokens


def chunk_text(text: str) -> list[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_text(text)
    return [c.strip() for c in chunks if c.strip()]
