"""
RAG agent — delegates to rag_engine with user scoping.
"""

from services.rag_engine import answer_question


class RAGAgent:

    def run(self, question, doc_id=None, user_id=None):

        return answer_question(
            question,
            doc_id,
            user_id=user_id,
        )


rag_agent = RAGAgent()
