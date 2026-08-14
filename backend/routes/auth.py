"""
Authentication routes.

POST /auth/register  — create new user
POST /auth/login     — get JWT token
GET  /auth/me        — current user info
GET  /auth/users     — list all users (admin only)
DELETE /auth/users/{user_id} — delete user (admin only)
"""

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
import os
import shutil

from db.user_store import (
    authenticate_user,
    create_user,
    delete_user,
    get_user_by_id,
    list_users,
    update_user_avatar,
)
from services.auth_service import (
    create_access_token,
    verify_token,
)

router = APIRouter(prefix="/auth")

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
) -> dict:

    token = credentials.credentials

    # Allow mock token for demo mode fallback
    if token == "mock_jwt_token_aikos_enterprise_2026":
        return {
            "sub": "demo_user",
            "user_id": "demo_user",
            "username": "demo",
            "role": "Enterprise Administrator"
        }

    payload = verify_token(token)

    if payload is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    # Inject user_id for compatibility with routes expecting user['user_id']
    payload["user_id"] = payload.get("sub")

    return payload


async def require_admin(
    user: dict = Depends(get_current_user),
) -> dict:

    if user.get("role") != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return user


class RegisterRequest(BaseModel):

    username: str
    password: str


class LoginRequest(BaseModel):

    username: str
    password: str


@router.post("/register")
def register(request: RegisterRequest):

    result = create_user(
        username=request.username,
        password=request.password,
    )

    if result is None:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists",
        )

    return {
        "message": "User created",
        "user": result,
    }


@router.post("/login")
def login(request: LoginRequest):

    user = authenticate_user(
        username=request.username,
        password=request.password,
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token = create_access_token(
        user_id=user["user_id"],
        username=user["username"],
        role=user["role"],
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@router.get("/me")
def get_me(
    user: dict = Depends(get_current_user),
):

    full_user = get_user_by_id(user["user_id"])

    if full_user is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return full_user


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".png", ".jpg", ".jpeg", ".gif", ".webp"}:
        raise HTTPException(status_code=400, detail="Invalid image format")
        
    user_id = user["user_id"]
    filename = f"{user_id}{ext}"
    saved_path = os.path.join("uploads", "avatars", filename)
    
    with open(saved_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    avatar_url = f"/avatars/{filename}"
    success = update_user_avatar(user_id, avatar_url)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"avatar_url": avatar_url}


@router.get("/users")
def get_users(
    admin: dict = Depends(require_admin),
):

    return {
        "users": list_users(),
    }


@router.delete("/users/{user_id}")
def remove_user(
    user_id: str,
    admin: dict = Depends(require_admin),
):

    success = delete_user(user_id)

    if not success:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or cannot delete admin",
        )

    return {
        "message": "User deleted",
    }
