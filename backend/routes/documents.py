from fastapi import APIRouter, Depends, HTTPException

from routes.auth import get_current_user
from db.chroma_client import get_collection
from db.metadata_store import delete_document, list_documents

router = APIRouter()


@router.get("/documents")
def get_documents(
    user: dict = Depends(get_current_user),
):
    docs = list_documents(user_id=user["user_id"])
    total_chunks = sum(d["chunk_count"] for d in docs)
    return {
        "documents": docs,
        "stats": {
            "total_documents": len(docs),
            "total_chunks": total_chunks,
        },
    }


@router.delete("/documents/{doc_id}")
def remove_document(
    doc_id: str,
    user: dict = Depends(get_current_user),
):
    removed = delete_document(doc_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Document not found")

    collection = get_collection()
    collection.delete(where={"doc_id": doc_id})

    return {"message": f"Document {doc_id} deleted"}
