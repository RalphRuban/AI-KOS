from fastapi import APIRouter, Depends
from pydantic import BaseModel

from routes.auth import get_current_user
from agents.compare_agent import compare_agent


router = APIRouter()


class CompareRequest(BaseModel):

    doc_id_1: str
    doc_id_2: str


@router.post("/compare")
def compare(
    request: CompareRequest,
    user: dict = Depends(get_current_user),
):

    return compare_agent.run(
        request.doc_id_1,
        request.doc_id_2,
        user_id=user["user_id"],
    )
