from fastapi import APIRouter, Depends

from routes.auth import get_current_user
from agents.orchestrator import orchestrator
from db.chroma_client import get_collection
from db.metadata_store import update_document
from db.stats_store import log_view


router = APIRouter()


@router.get("/keywords/{doc_id}")
def keywords(
    doc_id: str,
    user: dict = Depends(get_current_user),
):

    collection = get_collection()

    result = collection.get(
        where={
            "$and": [
                {"doc_id": doc_id},
                {"user_id": user["user_id"]},
            ]
        }
    )

    chunks = result.get("documents", [])
    metadatas = result.get("metadatas", [])

    filename = (
        metadatas[0].get("filename", "Unknown")
        if metadatas
        else "Unknown"
    )

    log_view(doc_id, filename, user["user_id"])

    keyword_result = orchestrator.process(
        task="keywords",
        filename=filename,
        chunks=chunks,
    )

    update_document(doc_id, keywords=keyword_result)

    return keyword_result
