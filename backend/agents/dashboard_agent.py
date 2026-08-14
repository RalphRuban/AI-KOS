"""
Dashboard agent — user-scoped statistics with chart data.
"""

from collections import Counter
from datetime import datetime

from db.chroma_client import get_collection
from db.metadata_store import list_documents
from db.stats_store import _load as load_stats, get_most_searched, get_most_viewed


class DashboardAgent:

    def run(self, user_id: str = None):

        docs = list_documents(user_id=user_id)
        total_docs = len(docs)
        total_chunks = sum(d.get("chunk_count", 0) for d in docs)
        total_storage = sum(d.get("file_size", 0) for d in docs if d.get("file_size"))

        file_type_dist = dict(Counter(d.get("file_type", "Unknown") for d in docs))
        
        cat_dist = Counter(d.get("category") or "General" for d in docs)
        category_distribution = [
            {"name": k, "count": v, "percentage": round(v / max(total_docs, 1) * 100)}
            for k, v in sorted(cat_dist.items(), key=lambda item: item[1], reverse=True)
        ]

        uploads_by_month = Counter()
        for d in docs:
            raw = d.get("uploaded_at")
            if raw:
                try:
                    month_key = raw[:7]
                    uploads_by_month[month_key] += 1
                except (ValueError, IndexError):
                    pass
        uploads_over_time = [
            {"month": k, "count": v}
            for k, v in sorted(uploads_by_month.items())
        ]

        collection = get_collection()

        where = {"user_id": user_id} if user_id else None
        get_kwargs = {"include": ["metadatas"]}
        if where:
            get_kwargs["where"] = where

        result = collection.get(**get_kwargs)
        metadatas = result.get("metadatas", [])

        unique_docs = {}
        for meta in metadatas:
            did = meta.get("doc_id", "Unknown")
            if did not in unique_docs:
                unique_docs[did] = {
                    "doc_id": did,
                    "filename": meta.get("filename", "Unknown"),
                    "uploaded_at": meta.get("uploaded_at"),
                    "file_type": meta.get("file_type", "Unknown"),
                    "file_size": meta.get("file_size"),
                    "page_count": meta.get("page_count"),
                }

        recent_uploads = sorted(
            unique_docs.values(),
            key=lambda x: x.get("uploaded_at") or "1970-01-01T00:00:00",
            reverse=True,
        )[:10]

        stats_data = load_stats()
        
        recent_activity = []
        for upload in recent_uploads[:10]:
            recent_activity.append({
                "type": "upload",
                "title": f"'{upload.get('filename')}' uploaded and indexed",
                "time": upload.get("uploaded_at") or "1970-01-01T00:00:00"
            })
            
        for search in stats_data.get("searches", [])[-10:]:
            if not user_id or search.get("user_id") == user_id:
                recent_activity.append({
                    "type": "search",
                    "title": f"RAG Query: '{search.get('query')}'",
                    "time": search.get("timestamp") or "1970-01-01T00:00:00"
                })
                
        for view in stats_data.get("views", [])[-10:]:
            if not user_id or view.get("user_id") == user_id:
                recent_activity.append({
                    "type": "view",
                    "title": f"Document viewed: '{view.get('filename')}'",
                    "time": view.get("timestamp") or "1970-01-01T00:00:00"
                })

        # Sort combined activity by time descending
        recent_activity.sort(key=lambda x: x["time"], reverse=True)
        
        # Format the time for display
        for act in recent_activity:
            raw = act["time"] or "1970-01-01T00:00:00"
            act["time"] = raw[:16].replace("T", " ") if "T" in raw else raw

        vector_store_size = f"{(total_storage / (1024*1024)):.1f} MB" if total_storage else "0.0 MB"

        most_viewed = get_most_viewed(limit=10)
        most_searched = get_most_searched(limit=10)

        return {
            "total_documents": total_docs,
            "total_chunks": total_chunks,
            "total_storage_bytes": total_storage,
            "vector_store_size": vector_store_size,
            "file_type_distribution": file_type_dist,
            "category_distribution": category_distribution,
            "uploads_over_time": uploads_over_time,
            "recent_uploads": recent_uploads,
            "recent_activity": recent_activity,
            "most_viewed": most_viewed,
            "most_searched": most_searched,
        }


dashboard_agent = DashboardAgent()
