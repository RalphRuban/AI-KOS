from fastapi import APIRouter, Depends, Query

from routes.auth import get_current_user
from agents.recommendation_agent import recommendation_agent


router = APIRouter()


@router.get("/recommendations/{doc_id}")
def recommendations(
    doc_id: str,
    top_k: int = Query(
        default=5,
        ge=1,
        le=20,
        description="Number of similar documents",
    ),
    user: dict = Depends(get_current_user),
):

    return recommendation_agent.run(
        doc_id=doc_id,
        top_k=top_k,
        user_id=user["user_id"],
    )
