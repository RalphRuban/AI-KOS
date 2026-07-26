"""
Singleton Chroma client + collection accessor.

Chroma runs embedded/local (PersistentClient) — zero external setup,
data persists to disk under CHROMA_DIR between container restarts.

Embeddings run locally via SentenceTransformer — no API key, no quota,
no per-call cost. The collection's embedding_function embeds both stored
chunks (on .add) and queries (on .query) automatically and consistently,
so callers never need to embed anything by hand.
"""

import os

import chromadb
from chromadb.utils import embedding_functions

CHROMA_DIR = os.getenv("CHROMA_DIR", "./chroma_store")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
COLLECTION_NAME = "ai_kos_lite_chunks"

_client = None
_collection = None


def get_chroma_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(path=CHROMA_DIR)
    return _client


def get_collection():
    """Returns the single Chroma collection used for all document chunks.

    Every chunk is stored with metadata: {filename, doc_id, chunk_index}
    so retrieval results can always be traced back to their source document.
    """
    global _collection
    if _collection is None:
        client = get_chroma_client()
        local_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=EMBEDDING_MODEL
        )
        _collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            embedding_function=local_ef,
        )
    return _collection
