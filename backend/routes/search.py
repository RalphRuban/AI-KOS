from fastapi import APIRouter, Depends, Query

from routes.auth import get_current_user
from agents.search_agent import search_agent
from db.stats_store import log_search

router = APIRouter()


@router.get("/search")
def semantic_search(
    q: str = Query(..., description="Search query"),
    top_k: int = Query(
        default=5,
        ge=1,
        le=20,
        description="Number of results",
    ),
    doc_id: str = Query(
        default=None,
        description="Filter by document ID",
    ),
    file_type: str = Query(
        default=None,
        description="Filter by file type (.pdf, .txt, .csv)",
    ),
    date_from: str = Query(
        default=None,
        description="Filter results after this date (ISO format)",
    ),
    date_to: str = Query(
        default=None,
        description="Filter results before this date (ISO format)",
    ),
    user: dict = Depends(get_current_user),
):
    log_search(query=q, doc_id=doc_id, user_id=user["user_id"])
    return search_agent.run(
        query=q,
        top_k=top_k,
        doc_id=doc_id,
        file_type=file_type,
        date_from=date_from,
        date_to=date_to,
        user_id=user["user_id"],
    )
