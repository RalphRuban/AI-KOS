"""
Extracts key entities/topics from a document via a structured LLM prompt.

Uses the LLM via services.llm_client with improved prompts and
few-shot examples for better extraction quality.
"""

import json

from services.llm_client import LLMConnectionError, chat_completion

MAX_CHUNKS_FOR_EXTRACTION = 8

SYSTEM_PROMPT = """You are an expert entity and topic extractor. Your job is to identify the most important named entities and topics from a document.

Rules:
1. Return ONLY valid JSON — no markdown fences, no preamble, no explanation.
2. Extract entities that are specific, meaningful, and directly referenced in the text.
3. Each entity must have a clear type classification.
4. Topics should be broad themes, not specific entities.
5. Rank by importance — most important first.
6. Extract at most 12 entities and 8 topics.

Entity types: person, organization, location, technology, concept, event, other"""

FEW_SHOT_EXAMPLE = """
Example input:
"Google announced Gemini 2.0, its latest AI model, at a press conference in Mountain View. CEO Sundar Pichai described it as the company's most capable model. The model competes with OpenAI's GPT-4 and Anthropic's Claude. Developers can access it through the Gemini API."

Example output:
{
  "entities": [
    {"name": "Google", "type": "organization", "relevance": "Company that developed Gemini 2.0"},
    {"name": "Gemini 2.0", "type": "technology", "relevance": "Latest AI model being announced"},
    {"name": "Sundar Pichai", "type": "person", "relevance": "CEO who presented the announcement"},
    {"name": "Mountain View", "type": "location", "relevance": "Location of the press conference"},
    {"name": "OpenAI", "type": "organization", "relevance": "Competitor company"},
    {"name": "GPT-4", "type": "technology", "relevance": "Competing AI model"},
    {"name": "Anthropic", "type": "organization", "relevance": "Competitor company"},
    {"name": "Claude", "type": "technology", "relevance": "Competing AI model"},
    {"name": "Gemini API", "type": "technology", "relevance": "Developer access point for the model"}
  ],
  "topics": ["artificial intelligence", "product launches", "tech industry competition", "developer tools"]
}"""


def extract_keywords(filename: str, chunks: list[str]) -> dict:
    if not chunks:
        return {"entities": [], "topics": []}

    sample_text = "\n\n".join(chunks[:MAX_CHUNKS_FOR_EXTRACTION])

    user_prompt = f"""{FEW_SHOT_EXAMPLE}

Now extract from this document:

Document: {filename}

{sample_text}

Return ONLY valid JSON matching the format above."""

    try:
        raw = chat_completion(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            temperature=0.1,
        ).strip()
    except LLMConnectionError as e:
        return {"entities": [], "topics": [], "error": str(e)}

    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.startswith("json"):
            raw = raw[4:]

    try:
        parsed = json.loads(raw)

        if "entities" not in parsed:
            parsed["entities"] = []
        if "topics" not in parsed:
            parsed["topics"] = []

    except json.JSONDecodeError:
        parsed = {"entities": [], "topics": [], "_raw": raw}

    return parsed
