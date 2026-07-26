from services.summarizer import summarize_document


class SummaryAgent:

    def run(self, filename, chunks):

        return summarize_document(
            filename,
            chunks
        )


summary_agent = SummaryAgent()