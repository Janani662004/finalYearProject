import os
import datetime
import torch
import torch.nn.functional as F
import torchaudio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from transformers import (
    AutoTokenizer, 
    AutoModelForSequenceClassification,
    Wav2Vec2Processor, 
    Wav2Vec2ForSequenceClassification
)
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

load_dotenv()

# ------------------ Setup ------------------

SUPABASE_URL = os.getenv("SUPABASE_URL", "your_supabase_url")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your_supabase_key")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Models
TEXT_MODEL_PATH = r"D:\project\models\reduced_xlnet"
AUDIO_MODEL_PATH = r"D:\project\models\wav2vec2"

# Load text model
tokenizer = AutoTokenizer.from_pretrained(TEXT_MODEL_PATH)
text_model = AutoModelForSequenceClassification.from_pretrained(TEXT_MODEL_PATH)
text_model.eval()

# Load audio model
audio_processor = Wav2Vec2Processor.from_pretrained(AUDIO_MODEL_PATH)
audio_model = Wav2Vec2ForSequenceClassification.from_pretrained(AUDIO_MODEL_PATH)
audio_model.eval()

# Common emotion labels for both models (adjust if different)
labels = ['admiration', 'amusement', 'anger', 'annoyance', 'approval', 'caring',
          'confusion', 'curiosity', 'desire', 'disappointment', 'disapproval',
          'disgust', 'embarrassment', 'excitement', 'fear', 'gratitude', 'grief',
          'joy', 'love', 'nervousness', 'optimism', 'pride', 'realization',
          'relief', 'remorse', 'sadness', 'surprise', 'neutral']

# ------------------ Emotion Detection Logic ------------------

def analyze_text(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = text_model(**inputs)
        probs = F.softmax(outputs.logits, dim=-1)
        top_idx = torch.argmax(probs, dim=-1).item()
        score = round(probs[0][top_idx].item(), 3)
        label = labels[top_idx]
        return label, score, probs[0].tolist()

def analyze_audio(audio_path):
    waveform, sample_rate = torchaudio.load(audio_path)
    if sample_rate != 16000:
        waveform = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)(waveform)
    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)

    inputs = audio_processor(waveform.squeeze(), sampling_rate=16000, return_tensors="pt", padding=True)
    with torch.no_grad():
        outputs = audio_model(**inputs)
        probs = F.softmax(outputs.logits, dim=-1)
        top_idx = torch.argmax(probs, dim=-1).item()
        score = round(probs[0][top_idx].item(), 3)
        label = labels[top_idx]
        return label, score, probs[0].tolist()

# ------------------ Supabase Pipeline ------------------

def fetch_journal_entries():
    response = supabase.table("journal_entries").select("*").eq("processed", False).execute()
    return response.data if response.data else []

def store_emotion_result(user_id, journal_id, text_label=None, text_score=None, text_scores=None,
                         audio_label=None, audio_score=None, audio_scores=None):
    timestamp = datetime.datetime.now().isoformat()
    data = {
        "user_id": user_id,
        "timestamp": timestamp,
        "day_label": text_label or audio_label,
        "day_score": text_score or audio_score,
        "text_emotion_label": text_label,
        "text_scores": text_scores,
        "audio_emotion_label": audio_label,
        "audio_scores": audio_scores,
    }
    supabase.table("ai_analysis").insert(data).execute()
    supabase.table("journal_entries").update({"processed": True}).eq("id", journal_id).execute()

def pipeline_run():
    print("🚀 Running emotion analysis pipeline...")
    entries = fetch_journal_entries()
    print(f"📝 Found {len(entries)} new journal entries.")

    for entry in entries:
        user_id = entry["user_id"]
        journal_id = entry["id"]
        text_entry = entry.get("text_entry", "")
        audio_path = entry.get("audio_entry", "")  # Assuming stored as file path in DB

        text_label = text_score = text_scores = None
        audio_label = audio_score = audio_scores = None

        if text_entry.strip():
            text_label, text_score, text_scores = analyze_text(text_entry)

        if audio_path and os.path.exists(audio_path):
            audio_label, audio_score, audio_scores = analyze_audio(audio_path)

        if text_label or audio_label:
            store_emotion_result(user_id, journal_id, text_label, text_score, text_scores,
                                 audio_label, audio_score, audio_scores)
            print(f"✅ Analyzed journal {journal_id}")

# ------------------ FastAPI App ------------------

app = FastAPI()

class JournalRequest(BaseModel):
    text: str

@app.post("/live_emotion_detect")
def live_emotion_detect(payload: JournalRequest):
    try:
        label, score, _ = analyze_text(payload.text)
        return {"emotion": label, "confidence": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------ Scheduler Setup ------------------

scheduler = BackgroundScheduler()

def scheduled_pipeline():
    print("⏰ Scheduled pipeline triggered!")
    pipeline_run()

scheduler.add_job(scheduled_pipeline, 'interval', minutes=5)
scheduler.start()

@app.on_event("startup")
def startup_event():
    pipeline_run()
