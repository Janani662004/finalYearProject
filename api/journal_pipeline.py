import os
import datetime
import torch
import torchaudio
import torchaudio.transforms as T
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Wav2Vec2Processor, Wav2Vec2ForSequenceClassification
from apscheduler.schedulers.background import BackgroundScheduler
from urllib.parse import urlparse
import requests
from dotenv import load_dotenv
import tempfile


# Load environment variables
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET_NAME = "journal-audio"

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load models
TEXT_MODEL_PATH = r"D:\project\models\reduced_xlnet"
AUDIO_MODEL_PATH = r"D:\project\models\wav2vec2"
tokenizer = AutoTokenizer.from_pretrained(TEXT_MODEL_PATH)
text_model = AutoModelForSequenceClassification.from_pretrained(TEXT_MODEL_PATH).eval()
audio_processor = Wav2Vec2Processor.from_pretrained(AUDIO_MODEL_PATH)
audio_model = Wav2Vec2ForSequenceClassification.from_pretrained(AUDIO_MODEL_PATH).eval()

# Emotion labels
labels = ['admiration', 'amusement', 'anger', 'annoyance', 'approval', 'caring',
          'confusion', 'curiosity', 'desire', 'disappointment', 'disapproval',
          'disgust', 'embarrassment', 'excitement', 'fear', 'gratitude', 'grief',
          'joy', 'love', 'nervousness', 'optimism', 'pride', 'realization',
          'relief', 'remorse', 'sadness', 'surprise', 'neutral']

# Analyze text
def analyze_text(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = text_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    top_idx = torch.argmax(probs, dim=-1).item()
    return labels[top_idx], round(probs[0][top_idx].item(), 3), probs[0].tolist()

# Analyze audio
def analyze_audio(audio_path):
    waveform, sample_rate = torchaudio.load(audio_path)
    if sample_rate != 16000:
        resample = T.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = resample(waveform)
    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)
    inputs = audio_processor(waveform.squeeze(), sampling_rate=16000, return_tensors="pt", padding=True)
    with torch.no_grad():
        outputs = audio_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    top_idx = torch.argmax(probs, dim=-1).item()
    return labels[top_idx], round(probs[0][top_idx].item(), 3), probs[0].tolist()

# Use ffmpeg via torchaudio to convert & save to 16kHz mono wav
def download_and_convert_to_wav(url):
    temp_input = tempfile.NamedTemporaryFile(delete=False)
    temp_output = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception("Failed to download audio.")
    temp_input.write(response.content)
    temp_input.close()

    torchaudio.backend.sox_io_backend.save(
        temp_output.name,
        *torchaudio.load(temp_input.name, normalize=True)
    )

    # Clean input
    os.remove(temp_input.name)
    return temp_output.name

# Public Supabase URL fetch
def get_audio_public_url(audio_url):
    parsed = urlparse(audio_url)
    prefix = f"/storage/v1/object/public/{BUCKET_NAME}/"
    path = parsed.path[len(prefix):] if parsed.path.startswith(prefix) else parsed.path.lstrip('/')
    return supabase.storage.from_(BUCKET_NAME).get_public_url(path)

# Fetch new journal entries
def fetch_journal_entries():
    resp = supabase.table("journal_entries").select("*").eq("processed", False).execute()
    return resp.data or []

# Store AI results
def store_emotion_result(user_id, journal_id, text_label=None, text_score=None, text_scores=None,
                         audio_label=None, audio_score=None, audio_scores=None):
    supabase.table("ai_analysis").insert({
        "user_id": user_id,
        "timestamp": datetime.datetime.now().isoformat(),
        "day_label": text_label or audio_label,
        "day_score": text_score or audio_score,
        "text_emotion_label": text_label,
        "text_scores": text_scores,
        "audio_emotion_label": audio_label,
        "audio_scores": audio_scores,
    }).execute()
    supabase.table("journal_entries").update({"processed": True}).eq("id", journal_id).execute()

# Pipeline
def pipeline_run():
    entries = fetch_journal_entries()
    for e in entries:
        user_id, journal_id = e["user_id"], e["id"]
        text_label = text_score = text_scores = None
        audio_label = audio_score = audio_scores = None

        if e.get("text_entry", "").strip():
            text_label, text_score, text_scores = analyze_text(e["text_entry"])

        if e.get("audio_entry"):
            try:
                audio_url = get_audio_public_url(e["audio_entry"])
                if audio_url:
                    wav_path = download_and_convert_to_wav(audio_url)
                    audio_label, audio_score, audio_scores = analyze_audio(wav_path)
                    os.remove(wav_path)
            except Exception as ex:
                print(f"[ERROR] Audio processing failed for entry {journal_id}: {ex}")

        if text_label or audio_label:
            store_emotion_result(user_id, journal_id, text_label, text_score, text_scores,
                                 audio_label, audio_score, audio_scores)

# FastAPI
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

# Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(pipeline_run, "interval", minutes=3)
scheduler.start()

@app.on_event("startup")
def on_startup():
    pipeline_run()
