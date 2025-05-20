import psycopg2
import select
import time
from supabase import create_client, Client
from transformers import XLNetTokenizer, XLNetForSequenceClassification, Wav2Vec2Processor, Wav2Vec2ForSequenceClassification
import torch
import torchaudio
import numpy as np
from datetime import datetime

# ========== SUPABASE SETUP ==========
url = "https://cfdtkaiekghgymciyqxd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZHRrYWlla2doZ3ltY2l5cXhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY5NzE1MSwiZXhwIjoyMDU5MjczMTUxfQ.-XBNHaPzvLgfU8jneukdfdoHG-GUjBi514vSD5c8jzI"
supabase = create_client(url, key)


def run_pipeline():
    print("🚀 Running journal pipeline...")

    # Get all journal entries
    entries_response = supabase.table("journal_entries").select("*").execute()
    entries = entries_response.data

    # Get existing analysis records to avoid reprocessing
    analysis_response = supabase.table("ai_analysis").select("user_id", "timestamp").execute()
    existing_analysis = {(item["user_id"], item["timestamp"]) for item in analysis_response.data}

    # Process only new entries
    for entry in entries:
        user_id = entry["user_id"]
        timestamp = entry["timestamp"]

        # Skip if this entry already has an analysis
        if (user_id, timestamp) in existing_analysis:
            continue

        text_entry = entry.get("text_entry")
        audio_path = entry.get("audio_entry")

        text_label, text_scores = "Unknown", []
        audio_label, audio_scores = "Unknown", []

        # Analyze text if available
        if text_entry:
            text_label, text_scores = analyze_text(text_entry)

        # Analyze audio if available
        if audio_path:
            audio_label, audio_scores = analyze_audio(audio_path)

        # Determine final label & score
        day_label = text_label if text_label != "Unknown" else audio_label
        all_scores = text_scores + audio_scores
        day_score = max(all_scores) if all_scores else 0.0

        # Skip entry if nothing useful is found
        if text_label == "Unknown" and audio_label == "Unknown":
            print(f"⚠️ Skipping entry for user {user_id} – both labels Unknown")
            continue

        # Insert processed result into ai_analysis
        data = {
            "user_id": user_id,
            "timestamp": timestamp,
            "text_emotion_label": text_label,
            "text_scores": text_scores,
            "audio_emotion_label": audio_label,
            "audio_scores": audio_scores,
            "day_label": day_label,
            "day_score": day_score
        }

        print("🔄 Inserting into ai_analysis:", data)
        supabase.table("ai_analysis").insert(data).execute()
        print(f"✅ Entry for user {user_id} at {timestamp} processed.")

# 📡 Optional: Run continuously if needed
def listen_for_new_entries(poll_interval=10):
    import time
    while True:
        run_pipeline()
        time.sleep(poll_interval)

# ✅ Run it once
if __name__ == "__main__":
    run_pipeline()