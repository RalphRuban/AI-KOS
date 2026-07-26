from fastapi import APIRouter, Depends
from pydantic import BaseModel

from routes.auth import get_current_user
from agents.orchestrator import orchestrator


router = APIRouter()


class ChatRequest(BaseModel):

    question: str
    doc_id: str | None = None


@router.post("/chat")
def chat(
    request: ChatRequest,
    user: dict = Depends(get_current_user),
):

    return orchestrator.process(
        task="chat",
        question=request.question,
        doc_id=request.doc_id,
        user_id=user["user_id"],
    )
