"""
AI-KOS Lite — FastAPI entrypoint.

Run locally:
    uvicorn main:app --reload --port 8000

Run via Docker:
    docker compose up
"""

import logging
import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import (
    auth,
    upload,
    documents,
    chat,
    summarize,
    keywords,
    graph,
    analysis,
    search,
    compare,
    recommendations,
    dashboard,
    relationships,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai-kos-lite")

app = FastAPI(
    title="AI-KOS Lite API",
    description="Mini Enterprise Knowledge Assistant — RAG over uploaded documents.",
    version="2.0.0",
)


@app.on_event("startup")
def startup():

    if not os.getenv("GEMINI_API_KEY"):

        logger.warning(
            "GEMINI_API_KEY is not set — AI features may fail."
        )

    else:

        logger.info(
            f"AI model configured: "
            f"{os.getenv('GEMINI_MODEL', 'gemini-3.1-flash-lite')}"
        )

    try:

        from services.bm25_index import bm25_index

        bm25_index.build()

        logger.info("BM25 index initialized for hybrid search.")

    except Exception as e:

        logger.warning(f"BM25 index init failed: {e}")


# -----------------------------
# CORS
# -----------------------------
# TODO: Lock down allow_origins for production (e.g. ["https://example.com"])
# Wildcard "*" with allow_credentials=True is permissive and may cause issues
# in browsers for credentials-based requests.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Register Routes
# -----------------------------

app.include_router(
    auth.router,
    tags=["Authentication"]
)

app.include_router(
    upload.router,
    tags=["Upload"]
)

app.include_router(
    documents.router,
    tags=["Documents"]
)

app.include_router(
    chat.router,
    tags=["Chat"]
)

app.include_router(
    summarize.router,
    tags=["Summary"]
)

app.include_router(
    keywords.router,
    tags=["Keywords"]
)

app.include_router(
    graph.router,
    tags=["Graph"]
)

app.include_router(
    analysis.router,
    tags=["Analysis"]
)

app.include_router(
    compare.router,
    tags=["Compare"]
)

app.include_router(
    recommendations.router,
    tags=["Recommendations"]
)

app.include_router(
    search.router,
    tags=["Hybrid Search"]
)

app.include_router(
    dashboard.router,
    tags=["Dashboard"]
)

app.include_router(
    relationships.router,
    tags=["Knowledge Graph"]
)


# -----------------------------
# Default APIs
# -----------------------------

@app.get("/")
def root():

    return {
        "message": "AI-KOS Lite API is running.",
        "version": "2.0.0",
        "docs": "/docs",
        "auth": "Register at /auth/register, login at /auth/login",
        "features": [
            "Authentication (JWT)",
            "Upload",
            "Documents",
            "Chat (RAG with Citations & Confidence)",
            "Summary",
            "Keywords",
            "Graph (with Centrality & Communities)",
            "Analysis (with Relationship Extraction)",
            "Hybrid Search (BM25 + Vector + Filters)",
            "Compare Documents",
            "Recommendations",
            "Dashboard",
            "Knowledge Graph Relationships"
        ]
    }


@app.get("/health")
def health_check():

    return {
        "status": "ok",
        "service": "ai-kos-lite-backend",
        "version": "2.0.0"
    }
