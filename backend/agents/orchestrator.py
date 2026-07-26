"""
Orchestrator — routes tasks to the correct agent.
"""

from agents.rag_agent import rag_agent
from agents.summary_agent import summary_agent
from agents.keyword_agent import keyword_agent
from agents.graph_agent import graph_agent
from agents.analysis_agent import analysis_agent
from agents.compare_agent import compare_agent
from agents.recommendation_agent import recommendation_agent
from agents.search_agent import search_agent
from agents.dashboard_agent import dashboard_agent
from agents.relationship_graph_agent import relationship_graph_agent


class Orchestrator:

    def __init__(self):

        self._tasks = {
            "chat": self._handle_chat,
            "summary": self._handle_summary,
            "keywords": self._handle_keywords,
            "graph": self._handle_graph,
            "analysis": self._handle_analysis,
            "compare": self._handle_compare,
            "recommendations": self._handle_recommendations,
            "search": self._handle_search,
            "dashboard": self._handle_dashboard,
            "relationships": self._handle_relationships,
        }

    def process(self, task, **kwargs):

        handler = self._tasks.get(task)

        if handler is None:
            return {"error": f"Unknown task: {task}"}

        return handler(**kwargs)

    def _handle_chat(self, question=None, doc_id=None, user_id=None, **_):
        return rag_agent.run(question, doc_id, user_id=user_id)

    def _handle_summary(self, filename=None, chunks=None, **_):
        return summary_agent.run(filename, chunks)

    def _handle_keywords(self, filename=None, chunks=None, **_):
        return keyword_agent.run(filename, chunks)

    def _handle_graph(self, entities=None, **_):
        return graph_agent.run(entities)

    def _handle_analysis(self, filename=None, chunks=None, **_):
        return analysis_agent.run(filename, chunks)

    def _handle_compare(self, doc_id_1=None, doc_id_2=None, user_id=None, **_):
        return compare_agent.run(doc_id_1, doc_id_2, user_id=user_id)

    def _handle_recommendations(self, doc_id=None, top_k=5, user_id=None, **_):
        return recommendation_agent.run(doc_id, top_k, user_id=user_id)

    def _handle_search(self, query=None, top_k=5, user_id=None, **_):
        return search_agent.run(query, top_k, user_id=user_id)

    def _handle_dashboard(self, user_id=None, **_):
        return dashboard_agent.run(user_id=user_id)

    def _handle_relationships(self, doc_id=None, **_):
        return relationship_graph_agent.run(doc_id)


orchestrator = Orchestrator()
