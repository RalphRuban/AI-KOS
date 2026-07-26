from fastapi import APIRouter, Depends

from routes.auth import get_current_user
from agents.relationship_graph_agent import relationship_graph_agent
from db.stats_store import log_view
from db.metadata_store import get_document


router = APIRouter()


@router.get("/relationships/{doc_id}")
def relationships(
    doc_id: str,
    user: dict = Depends(get_current_user),
):
    doc = get_document(doc_id)
    log_view(doc_id, doc.get("filename", "Unknown") if doc else "Unknown", user["user_id"])
    return relationship_graph_agent.run(doc_id)
