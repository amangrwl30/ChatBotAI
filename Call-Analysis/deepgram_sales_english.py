from deepgram import DeepgramClient, PrerecordedOptions
from openai import OpenAI
import os

# Keys
DEEPGRAM_API_KEY = "7bc2b50c57b82cb02d427e8ad2e0bcdcc2941b8e"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

AUDIO_URL = {
    "url": "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav"
}# Replace with your actual audio URL

# Initialize clients
deepgram = DeepgramClient(DEEPGRAM_API_KEY)
client = OpenAI(api_key=OPENAI_API_KEY)

def fetch_transcript():
    options = PrerecordedOptions(
        model="nova-2",
            language="en-GB",
            smart_format=True,
            diarize=True,
            sentiment=True

    )
    response = deepgram.listen.prerecorded.v("1").transcribe_url(AUDIO_URL, options)
    return response.to_dict()

def build_prompt(transcript: str) -> str:
    return f"""
You are an expert sales manager. Analyze the following call transcript and rate the salesperson on these attributes on a scale from 1 to 10:

1. Tone
2. Clarity
3. Persuasiveness
4. Engagement
5. Sales Potential
6. Confidence
7. Product Knowledge
8. Objection Handling
9. Call to Action Clarity

Also provide:
- An overall score (average)
- 2 points on what was done well
- 2 areas for improvement

Call Transcript:
\"\"\"
{transcript}
\"\"\"
Return your response in the following JSON format:
{{
  "scores": {{
    "Tone": int,
    "Clarity": int,
    "Persuasiveness": int,
    "Engagement": int,
    "Sales Potential": int,
    "Confidence": int,
    "Product Knowledge": int,
    "Objection Handling": int,
    "Call to Action Clarity": int,
    "Overall Score": int
  }},
  "what_went_well": ["...", "..."],
  "what_to_improve": ["...", "..."]
}}
"""

def analyze_with_gpt4(transcript_text: str) -> str:
    chat_completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a professional sales call evaluator."},
            {"role": "user", "content": build_prompt(transcript_text)}
        ],
        temperature=0.4
    )
    return chat_completion.choices[0].message.content

def main():
    print("🎙️ Transcribing with Deepgram...")
    transcript_data = fetch_transcript()
    transcript_text = transcript_data["results"]["channels"][0]["alternatives"][0]["transcript"]

    print("🧠 Analyzing via GPT-4o...")
    analysis = analyze_with_gpt4(transcript_text)

    print("\n📊 GPT-4o Evaluation:\n")
    print(analysis)

if __name__ == "__main__":
    main()
