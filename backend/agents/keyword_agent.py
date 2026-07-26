from services.entity_extractor import extract_keywords


class KeywordAgent:

    def run(self, filename, chunks):

        return extract_keywords(
            filename,
            chunks
        )


keyword_agent = KeywordAgent()