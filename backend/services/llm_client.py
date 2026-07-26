import os
import time

from dotenv import load_dotenv
from google import genai

load_dotenv()


class LLMConnectionError(Exception):
    pass


API_KEY = os.getenv("GEMINI_API_KEY")

MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.1-flash-lite"
)

MAX_RETRIES = 2
RETRY_DELAY = 1


if not API_KEY:
    client = None
else:
    client = genai.Client(
        api_key=API_KEY
    )


def chat_completion(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.2
):

    if client is None:
        raise LLMConnectionError(
            "GEMINI_API_KEY missing"
        )

    last_error = None

    for attempt in range(MAX_RETRIES + 1):

        try:

            config = {
                "temperature": temperature,
            }

            if system_prompt:
                config["system_instruction"] = system_prompt

            response = client.models.generate_content(
                model=MODEL,
                contents=user_prompt,
                config=config,
            )

            return response.text

        except Exception as e:

            last_error = e

            if attempt < MAX_RETRIES:
                time.sleep(
                    RETRY_DELAY * (attempt + 1)
                )

    raise LLMConnectionError(
        f"Gemini API failed after {MAX_RETRIES + 1} attempts: {str(last_error)}"
    )
