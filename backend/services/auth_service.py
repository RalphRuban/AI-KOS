"""
JWT authentication service.

Handles token creation, verification, and password hashing.
Uses PyJWT for token operations and passlib/bcrypt for passwords.
"""

import os
import secrets
from datetime import datetime, timedelta, timezone

import jwt

SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))

TOKEN_EXPIRY_HOURS = int(
    os.getenv("TOKEN_EXPIRY_HOURS", "24")
)

ALGORITHM = "HS256"


def create_access_token(
    user_id: str,
    username: str,
    role: str,
    expires_delta: timedelta = None,
) -> str:

    if expires_delta is None:

        expires_delta = timedelta(
            hours=TOKEN_EXPIRY_HOURS
        )

    expire = datetime.now(timezone.utc) + expires_delta

    payload = {
        "sub": user_id,
        "username": username,
        "role": role,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def verify_token(token: str) -> dict | None:

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        return {
            "user_id": payload.get("sub"),
            "username": payload.get("username"),
            "role": payload.get("role"),
        }

    except jwt.ExpiredSignatureError:

        return None

    except jwt.InvalidTokenError:

        return None
