# from fastapi import FastAPI, Request
# from pydantic import BaseModel
# from journal_pipeline import analyze_text, analyze_audio  # Make sure your module name matches
# from supabase import create_client, Client
# import logging

# # ========== SUPABASE CONNECTION ==========
# SUPABASE_URL = "https://cfdtkaiekghgymciyqxd.supabase.co"
# SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZHRrYWlla2doZ3ltY2l5cXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTcxNTEsImV4cCI6MjA1OTI3MzE1MX0.dGDqSh2ZsNsX88U6BuWgyWtGfwa1dxlSZfP_uGdzkyY"
# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# # ========== FASTAPI APP SETUP ==========
# app = FastAPI()
# logging.basicConfig(level=logging.INFO)

# # ========== EMOTION LABEL MAPPING ==========
# emotion_label_mapping = {
#     "LABEL_0": "anger",
#     "LABEL_1": "joy",
#     "LABEL_2": "fear",
#     "LABEL_3": "sadness",
#     "LABEL_4": "surprise",
#     "LABEL_5": "disgust",
#     "LABEL_6": "trust",
#     "LABEL_7": "anticipation",
#     "LABEL_8": "love",
#     "LABEL_9": "optimism",
#     "LABEL_10": "pessimism",
#     "LABEL_11": "contentment",
#     "LABEL_12": "confusion",
#     "LABEL_13": "boredom",
#     "LABEL_14": "excitement",
#     "LABEL_15": "pride",
#     "LABEL_16": "guilt",
#     "LABEL_17": "fear"
# }

# # ========== REQUEST BODY MODEL ==========
# class UserRequest(BaseModel):
#     user_id: str

# # ========== LOGGING MIDDLEWARE ==========
# @app.middleware("http")
# async def log_request(request: Request, call_next):
#     body = await request.body()
#     logging.info(f"[MIDDLEWARE] {request.method} {request.url} - Body: {body.decode('utf-8') if body else 'No Body'}")
#     response = await call_next(request)
#     return response

# # ========== ANALYSIS ENDPOINT ==========
# @app.post("/analyze")
# async def analyze(user: UserRequest):
#     logging.info(f"Starting analysis for user_id: {user.user_id}")

#     # Fetch journal entries for the user
#     entries_resp = supabase.table("journal_entries")\
#         .select("*")\
#         .eq("user_id", user.user_id)\
#         .order("timestamp", desc=True)\
#         .execute()

#     all_entries = entries_resp.data or []
#     logging.info(f"Found {len(all_entries)} journal entries")

#     # Fetch already analyzed timestamps
#     analyzed_resp = supabase.table("ai_analysis")\
#         .select("timestamp")\
#         .eq("user_id", user.user_id)\
#         .execute()

#     analyzed_timestamps = set(entry["timestamp"] for entry in analyzed_resp.data or [])
#     logging.info(f"Already analyzed timestamps count: {len(analyzed_timestamps)}")

#     # Filter unanalyzed entries
#     unanalyzed_entries = [e for e in all_entries if e["timestamp"] not in analyzed_timestamps]
#     logging.info(f"Unanalyzed entries to process: {len(unanalyzed_entries)}")

#     if not unanalyzed_entries:
#         return {"status": "No new journal entries to analyze."}

#     for entry in unanalyzed_entries:
#         timestamp = entry["timestamp"]
#         text_entry = entry.get("text_entry")
#         audio_path = entry.get("audio_entry")

#         logging.info(f"Processing entry at timestamp: {timestamp}")

#         text_label, text_scores = "Unknown", []
#         audio_label, audio_scores = "Unknown", []

#         if text_entry:
#             raw_label, text_scores = analyze_text(text_entry)
#             text_label = emotion_label_mapping.get(raw_label, raw_label)
#             logging.info(f"Text analysis label: {text_label}")

#         if audio_path:
#             raw_label, audio_scores = analyze_audio(audio_path)
#             audio_label = emotion_label_mapping.get(raw_label, raw_label)
#             logging.info(f"Audio analysis label: {audio_label}")

#         # Priority: text > audio
#         day_label = text_label if text_label != "Unknown" else audio_label
#         day_score = max(text_scores + audio_scores) if (text_scores + audio_scores) else 0.0

#         if day_label == "Unknown":
#             logging.warning(f"Skipping entry at {timestamp}: no valid label found")
#             continue

#         analysis_record = {
#             "user_id": user.user_id,
#             "timestamp": timestamp,
#             "text_emotion_label": text_label,
#             "text_scores": text_scores,
#             "audio_emotion_label": audio_label,
#             "audio_scores": audio_scores,
#             "day_label": day_label,
#             "day_score": day_score
#         }

#         supabase.table("ai_analysis").insert(analysis_record).execute()
#         logging.info(f"Inserted analysis record for timestamp: {timestamp}")

#     logging.info("Analysis complete")
#     return {"status": "Analysis complete", "entries_analyzed": len(unanalyzed_entries)}
