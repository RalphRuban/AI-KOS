from fastapi import APIRouter, Depends

from routes.auth import get_current_user
from agents.dashboard_agent import dashboard_agent


router = APIRouter()


@router.get("/dashboard")
def dashboard(
    user: dict = Depends(get_current_user),
):

    return dashboard_agent.run(
        user_id=user["user_id"],
    )
