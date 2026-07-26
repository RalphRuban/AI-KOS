# AI-KOS
# AI-KOS Lite

AI-KOS Lite is an enterprise knowledge assistant that allows users to upload documents and interact with them using AI.

The system uses Retrieval-Augmented Generation (RAG), ChromaDB, Sentence Transformers, and Google Gemini to provide document understanding, semantic search, summaries, comparisons, and analytics.

---

# Current Features

## Document Upload

- Upload PDF documents
- Automatic chunking
- ChromaDB storage
- Metadata storage

Endpoint

POST /upload

---

## Document Listing

GET /documents

Returns all uploaded documents.

---

## AI Chat

POST /chat

Chat with uploaded documents using RAG.

---

## Document Summary

POST /summarize/{doc_id}

Generates an AI summary.

---

## Keyword Extraction

GET /keywords/{doc_id}

Extracts important keywords.

---

## Knowledge Graph

GET /graph/{doc_id}

Extracts entities and relationships.

---

## Document Analysis

GET /analysis/{doc_id}

Performs AI analysis.

---

## Document Comparison

POST /compare

Compares two uploaded documents.

Returns

- Summary
- Similarities
- Differences
- Common Topics
- Technical comparison

---

## Recommendations

GET /recommendations/{doc_id}

Finds similar documents using vector similarity.

---

## Semantic Search

GET /search

Vector search using Sentence Transformers.

---

## Dashboard

GET /dashboard

Displays

- Total Documents
- Total Chunks
- File Types
- Recent Uploads

---

## Relationship Graph

GET /relationships/{doc_id}

Displays extracted document relationships.

---

# Tech Stack

Backend

- FastAPI

Database

- ChromaDB

Embeddings

- sentence-transformers
- all-MiniLM-L6-v2

LLM

- Google Gemini 3.1 Flash Lite

Language

- Python 3.13

---

# Project Structure

backend/

agents/

routes/

services/

db/

uploads/

chroma_store/

documents_metadata.json

main.py

requirements.txt

---

# Environment Variables

Create a .env file

```
GEMINI_API_KEY=YOUR_API_KEY

GEMINI_MODEL=gemini-3.1-flash-lite

EMBEDDING_MODEL=all-MiniLM-L6-v2

CHROMA_DIR=./chroma_store

UPLOAD_DIR=./uploads

METADATA_STORE_PATH=./documents_metadata.json

RAG_TOP_K=5
```

---

# Installation

```
pip install -r requirements.txt
```

Run

```
python -m uvicorn main:app --reload --port 8000
```

Swagger

```
http://localhost:8000/docs
```

---

# Current Status

| Feature | Status |
|----------|--------|
| Upload | Implemented |
| Chat (with Citations & Confidence) | Implemented |
| Summary | Implemented |
| Keywords | Implemented |
| Analysis | Implemented |
| Compare | Implemented |
| Recommendations | Implemented |
| Semantic Search | Implemented |
| Dashboard | Implemented |
| Relationship Graph | Implemented |
| Authentication (JWT) | Implemented |
| Document Deletion | Implemented |
| Knowledge Graph (Centrality & Communities) | Implemented |

---

# Known Limitations

Current dashboard shows

- Unknown file type for older uploaded documents
- uploaded_at is null for documents uploaded before metadata updates

Older Chroma records should be re-indexed.

---

# Phase 2 Implementation

The following Phase 2 features have been implemented:

## Metadata Improvements

- Store upload timestamps
- Store MIME type
- Store file size
- Store page count
- Store author
- Store document title

---

## Semantic Search Improvements

- Hybrid Search (BM25 + Vector)
- Metadata filtering
- Date filtering
- File type filtering
- Search highlighting

---

## Recommendation Engine

Improved recommendations using

- Metadata similarity
- Centroid embeddings
- Keyword overlap

---

## Dashboard Improvements

Charts

- Uploads over time
- File type distribution
- Storage usage
- Most searched documents
- Most viewed documents

---

## Knowledge Graph

- Centrality scores
- Community detection
- Entity type distribution

---

## AI Improvements

- Citation support
- Source highlighting
- Confidence score
- Better prompt engineering

---

## Authentication

- User Login
- JWT Authentication
- Multi-user support
- Roles
- Permissions

---

## Document Management

- Document deletion endpoint

---

# Future Work

## Database

Replace JSON metadata with

- PostgreSQL
or

- MongoDB

---

## Knowledge Graph

- Neo4j
- Interactive graph visualization

---

## Frontend

Develop React frontend including

- Upload UI
- Chat interface
- Dashboard
- Document viewer
- Graph visualization
- Search page

---

## Production

- Docker
- Docker Compose
- Nginx
- HTTPS
- CI/CD
- GitHub Actions
- Logging
- Monitoring

---

# Suggested Roadmap

Phase 1 - Backend Core

- Upload
- Chat
- Summary
- Keywords
- Analysis
- Compare
- Search
- Dashboard

Phase 2 - Enterprise Features (Implemented)

- Authentication
- Hybrid Search
- Dashboard Analytics
- Metadata Extraction
- Knowledge Graph Improvements
- AI Citations & Confidence
- Document Management

Phase 3 - Scale & Deploy

- Frontend
- PostgreSQL
- Neo4j
- Multi-user Workspace
- Team Collaboration
- AI Agents
- Knowledge Graph Visualization
- Enterprise Deployment

---

# Author

Prototype developed as part of the AI-KOS Lite project.

This repository represents Version 2 of the backend and serves as the foundation for future enterprise-scale development.
