"""
Analysis agent that runs summary, keywords, and relationship extraction
in parallel, then builds a knowledge graph from the results.
"""

from concurrent.futures import ThreadPoolExecutor

from agents.summary_agent import summary_agent
from agents.keyword_agent import keyword_agent
from agents.graph_agent import graph_agent
from services.relationship_extractor import extract_relationships


class AnalysisAgent:

    def run(self, filename, chunks):

        with ThreadPoolExecutor(max_workers=3) as executor:

            summary_future = executor.submit(
                summary_agent.run,
                filename,
                chunks,
            )

            keywords_future = executor.submit(
                keyword_agent.run,
                filename,
                chunks,
            )

            relationships_future = executor.submit(
                extract_relationships,
                filename,
                chunks,
            )

            summary = summary_future.result()
            keywords = keywords_future.result()
            relationships = relationships_future.result()

        entities = keywords.get("entities", [])

        graph = graph_agent.run(entities)

        return {
            "summary": summary,
            "keywords": keywords,
            "graph": graph,
            "relationships": relationships,
        }


analysis_agent = AnalysisAgent()
