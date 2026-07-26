"""
Extracts entity relationships from document text using LLM.

Produces structured nodes and edges representing how entities
in a document relate to each other.
"""

import json

from services.llm_client import LLMConnectionError, chat_completion


MAX_CHUNKS_FOR_RELATIONSHIPS = 10

SYSTEM_PROMPT = """You are an expert relationship extractor. Your job is to identify how entities in a document relate to each other.

Rules:
1. Return ONLY valid JSON — no markdown fences, no explanation.
2. Each relationship must have a clear, specific relation type (not just "related_to").
3. Only extract relationships that are explicitly stated or strongly implied in the text.
4. Use consistent entity names across all relationships.
5. Common relation types: works_at, created, located_in, uses, manages, competes_with, part_of, depends_on, acquired_by, founded_by, based_on, operates_in, develops, publishes, owns"""

FEW_SHOT_EXAMPLE = """
Example input:
"Dr. Sarah Chen leads the AI research division at TechCorp in San Francisco. The team developed Project Nova using PyTorch. TechCorp competes with DataInc, which is headquartered in New York."

Example output:
{
  "nodes": [
    {"name": "Dr. Sarah Chen", "type": "person"},
    {"name": "TechCorp", "type": "organization"},
    {"name": "AI research division", "type": "department"},
    {"name": "San Francisco", "type": "location"},
    {"name": "Project Nova", "type": "technology"},
    {"name": "PyTorch", "type": "technology"},
    {"name": "DataInc", "type": "organization"},
    {"name": "New York", "type": "location"}
  ],
  "edges": [
    {"source": "Dr. Sarah Chen", "relation": "leads", "target": "AI research division"},
    {"source": "AI research division", "relation": "part_of", "target": "TechCorp"},
    {"source": "TechCorp", "relation": "located_in", "target": "San Francisco"},
    {"source": "AI research division", "relation": "developed", "target": "Project Nova"},
    {"source": "Project Nova", "relation": "built_with", "target": "PyTorch"},
    {"source": "TechCorp", "relation": "competes_with", "target": "DataInc"},
    {"source": "DataInc", "relation": "located_in", "target": "New York"}
  ]
}"""


def extract_relationships(filename, chunks):

    sample = chunks[:MAX_CHUNKS_FOR_RELATIONSHIPS]

    text = "\n\n".join(sample)

    user_prompt = f"""{FEW_SHOT_EXAMPLE}

Now extract relationships from this document:

Document: {filename}

{text}

Return ONLY valid JSON matching the format above."""

    try:
        raw = chat_completion(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            temperature=0.1,
        )

        if raw.startswith("```"):
            raw = raw.strip("`")
            if raw.startswith("json"):
                raw = raw[4:]

        return json.loads(raw)

    except (json.JSONDecodeError, LLMConnectionError):

        return {
            "nodes": [],
            "edges": [],
        }
