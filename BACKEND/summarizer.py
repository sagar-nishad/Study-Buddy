from google import genai
from google.genai import types
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs
from config import CFG

client = genai.Client(api_key = CFG.geminai_key)


def extract_video_id(url: str) -> str:
    parsed_url = urlparse(url)
    if "youtube.com" in parsed_url.netloc:
        return parse_qs(parsed_url.query).get("v", [None])[0]
    elif "youtu.be" in parsed_url.netloc:
        return parsed_url.path.lstrip("/").split("/")[0]
    return "__invalid__url__"


def fetch_transcript(video_id: str) -> str:
    try:
        segments = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join(segment["text"] for segment in segments)
    except Exception as e:
        return f"__error__: Failed to fetch transcript: {str(e)}"


def generate_summary(transcript: str) -> str:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            system_instruction=(
                "You are an expert educational assistant. Your job is to read the transcript of a lecture "
                "and generate well-organized study notes. Extract important points, definitions, and explanations. "
                "Summarize key concepts clearly and concisely. Use bullet points, headings, and examples where helpful. "
                "Make sure the notes are easy to revise from and suitable for a student preparing for exams."
            )
        ),
        contents=transcript,
    )
    return response.text


def summarize_youtube_lecture(link: str) -> str:
    video_id = extract_video_id(link)
    if video_id == "__invalid__url__":
        return "❌ Invalid YouTube URL provided."
    
    transcript = fetch_transcript(video_id)
    if transcript.startswith("__error__"):
        return transcript  
    summary = """ 
------------------------------------------------------------------------------------------------
     
                                  ---------------


                                    long summary 



                                  -------------
------------------------------------------------------------------------------------------------

"""
    
    # return summary
    return generate_summary(transcript[:10000])

