"""
Extracts raw text and metadata from an uploaded file, based on its extension.

Supported: .pdf, .txt, .csv
"""

import os

import pandas as pd
import pdfplumber


class UnsupportedFileTypeError(Exception):
    pass


def extract_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return _extract_pdf(file_path)
    elif ext == ".txt":
        return _extract_txt(file_path)
    elif ext == ".csv":
        return _extract_csv(file_path)
    else:
        raise UnsupportedFileTypeError(
            f"Unsupported file type '{ext}'. Supported: .pdf, .txt, .csv"
        )


def extract_metadata(file_path: str) -> dict:
    """Extract metadata from a file without returning the full text."""
    ext = os.path.splitext(file_path)[1].lower()
    file_size = os.path.getsize(file_path)

    metadata = {
        "file_size": file_size,
        "file_type": ext,
        "page_count": None,
        "title": None,
        "author": None,
        "subject": None,
        "creator": None,
        "creation_date": None,
    }

    if ext == ".pdf":
        try:
            with pdfplumber.open(file_path) as pdf:
                metadata["page_count"] = len(pdf.pages)

                pdf_info = pdf.metadata

                if pdf_info:
                    metadata["title"] = (
                        pdf_info.get("/Title")
                        or pdf_info.get("title")
                        or None
                    )
                    metadata["author"] = (
                        pdf_info.get("/Author")
                        or pdf_info.get("author")
                        or None
                    )
                    metadata["subject"] = (
                        pdf_info.get("/Subject")
                        or pdf_info.get("subject")
                        or None
                    )
                    metadata["creator"] = (
                        pdf_info.get("/Creator")
                        or pdf_info.get("creator")
                        or None
                    )
                    metadata["creation_date"] = (
                        pdf_info.get("/CreationDate")
                        or pdf_info.get("creation_date")
                        or None
                    )
        except Exception:
            pass

    elif ext == ".csv":
        try:
            df = pd.read_csv(file_path)
            metadata["page_count"] = len(df)
        except Exception:
            pass

    elif ext == ".txt":
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                metadata["page_count"] = sum(1 for _ in f)
        except Exception:
            pass

    return metadata


def _extract_pdf(file_path: str) -> str:
    text_parts = []
    with pdfplumber.open(file_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            page_text = page.extract_text() or ""
            if page_text.strip():
                text_parts.append(f"[Page {page_num}]\n{page_text}")
    if not text_parts:
        raise ValueError("No extractable text found in PDF (it may be scanned/image-only).")
    return "\n\n".join(text_parts)


def _extract_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    if not content.strip():
        raise ValueError("TXT file is empty.")
    return content


def _extract_csv(file_path: str) -> str:
    df = pd.read_csv(file_path)
    if df.empty:
        raise ValueError("CSV file has no rows.")
    lines = [f"Columns: {', '.join(df.columns.astype(str))}"]
    for i, row in df.iterrows():
        row_text = "; ".join(f"{col}: {row[col]}" for col in df.columns)
        lines.append(f"Row {i}: {row_text}")
    return "\n".join(lines)
