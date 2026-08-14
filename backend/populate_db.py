import json
import uuid
import random
from datetime import datetime, timedelta, timezone

CATEGORIES = ["General", "Finance", "Legal", "Engineering", "ESG", "Security", "Research", "Strategy", "Product", "Operations", "AI", "Marketing"]
FILE_TYPES = ["PDF", "DOCX", "TXT", "MD", "PPTX", "XLSX"]
ADJECTIVES = ["Global", "Enterprise", "Quarterly", "Annual", "Strategic", "Neural", "Compliance", "Security", "Cloud", "Data", "Customer", "Internal"]
NOUNS = ["Report", "Overview", "Roadmap", "Findings", "Framework", "Architecture", "Log", "Paper", "Analysis", "Benchmark", "Strategy", "Guidelines"]

def generate_title():
    return f"{random.choice(ADJECTIVES)} {random.choice(CATEGORIES)} {random.choice(NOUNS)} 202{random.randint(4,6)}"

data = {}
now = datetime.now(timezone.utc)

for _ in range(847):
    doc_id = uuid.uuid4().hex[:12]
    cat = random.choice(CATEGORIES)
    data[doc_id] = {
        "doc_id": doc_id,
        "filename": generate_title() + "." + random.choice(FILE_TYPES).lower(),
        "chunk_count": random.randint(10, 500),
        "file_type": random.choice(FILE_TYPES),
        "file_size": random.randint(100_000, 15_000_000), # 100KB to 15MB
        "page_count": random.randint(1, 200),
        "title": generate_title(),
        "author": "System Generator",
        "category": cat,
        "user_id": None,
        "uploaded_at": (now - timedelta(days=random.randint(0, 365))).isoformat(),
        "summary": "Auto-generated document for AI-KOS load testing and UI rendering.",
        "keywords": [cat.lower(), "auto", "test"]
    }

with open("documents_metadata.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print(f"Successfully generated {len(data)} documents into documents_metadata.json")
