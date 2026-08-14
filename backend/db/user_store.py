"""
JSON-file based user storage.

Consistent with metadata_store.py approach.
Creates a default admin user on first startup.
"""

import json
import os
import threading
import uuid
from datetime import datetime, timezone

import bcrypt

STORE_PATH = os.getenv("USER_STORE_PATH", "./users.json")
_lock = threading.Lock()


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


def _verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        password.encode("utf-8"),
        hashed.encode("utf-8"),
    )


def _load() -> dict:
    if not os.path.exists(STORE_PATH):
        return {}
    with open(STORE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _save(data: dict) -> None:
    with open(STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def _ensure_admin():
    data = _load()

    admin_exists = any(
        u.get("username") == "admin"
        for u in data.values()
    )

    if not admin_exists:

        user_id = uuid.uuid4().hex[:12]
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")

        data[user_id] = {
            "user_id": user_id,
            "username": "admin",
            "hashed_password": _hash_password(admin_password),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        _save(data)


_ensure_admin()


def create_user(
    username: str,
    password: str,
    role: str = "user",
) -> dict | None:
    with _lock:

        data = _load()

        for u in data.values():
            if u.get("username") == username:
                return None

        user_id = uuid.uuid4().hex[:12]

        record = {
            "user_id": user_id,
            "username": username,
            "hashed_password": _hash_password(password),
            "role": role,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        data[user_id] = record
        _save(data)

        return {
            "user_id": user_id,
            "username": username,
            "role": role,
            "created_at": record["created_at"],
        }


def authenticate_user(
    username: str,
    password: str,
) -> dict | None:
    with _lock:

        data = _load()

        for user in data.values():
            if user.get("username") == username:
                if _verify_password(
                    password,
                    user["hashed_password"],
                ):
                    return {
                        "user_id": user["user_id"],
                        "username": user["username"],
                        "role": user["role"],
                    }
                return None

        return None


def get_user_by_id(user_id: str) -> dict | None:
    with _lock:

        data = _load()
        user = data.get(user_id)

        if user:
            return {
                "user_id": user["user_id"],
                "username": user["username"],
                "role": user["role"],
                "created_at": user.get("created_at"),
                "avatar_url": user.get("avatar_url"),
            }

        return None


def list_users() -> list:
    with _lock:

        data = _load()

        return [
            {
                "user_id": u["user_id"],
                "username": u["username"],
                "role": u["role"],
                "created_at": u.get("created_at"),
                "avatar_url": u.get("avatar_url"),
            }
            for u in data.values()
        ]


def delete_user(user_id: str) -> bool:
    with _lock:

        data = _load()

        if user_id not in data:
            return False

        if data[user_id].get("username") == "admin":
            return False

        del data[user_id]
        _save(data)

        return True

def update_user_avatar(user_id: str, avatar_url: str) -> bool:
    with _lock:
        data = _load()
        if user_id not in data:
            return False
        data[user_id]["avatar_url"] = avatar_url
        _save(data)
        return True
