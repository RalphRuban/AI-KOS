import os
import shutil

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from routes.auth import get_current_user
from db.metadata_store import add_document
from services.chunker import chunk_text
from services.embedder import new_doc_id, store_chunks
from services.extractor import (
    UnsupportedFileTypeError,
    extract_metadata,
    extract_text,
)
from services.notifier import notifier

router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
ALLOWED_EXTENSIONS = {".pdf", ".txt", ".csv"}
MAX_FILE_SIZE_MB = 20

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form("General"),
    user: dict = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    doc_id = new_doc_id()
    saved_path = os.path.join(UPLOAD_DIR, f"{doc_id}{ext}")

    try:
        with open(saved_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        size_mb = os.path.getsize(saved_path) / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            os.remove(saved_path)
            raise HTTPException(
                status_code=400,
                detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_FILE_SIZE_MB}MB.",
            )

        text = extract_text(saved_path)
        chunks = chunk_text(text)
        if not chunks:
            raise HTTPException(status_code=400, detail="No usable text extracted from file.")

        file_metadata = extract_metadata(saved_path)

        stored_count = store_chunks(
            doc_id=doc_id,
            filename=file.filename,
            chunks=chunks,
            file_type=ext,
            category=category,
            user_id=user.get("user_id", user.get("sub")),
        )

        record = add_document(
            doc_id=doc_id,
            filename=file.filename,
            chunk_count=stored_count,
            file_type=ext,
            file_size=file_metadata.get("file_size"),
            page_count=file_metadata.get("page_count"),
            title=file_metadata.get("title"),
            author=file_metadata.get("author"),
            category=category,
            user_id=user.get("user_id", user.get("sub")),
        )

        await notifier.broadcast({
            "type": "success",
            "title": "Document Indexed",
            "body": f"'{file.filename}' was successfully uploaded and processed into {stored_count} vector chunks.",
            "color": "#10b981", # emerald
        })

        return {"message": "Upload successful", "document": record}

    except UnsupportedFileTypeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
