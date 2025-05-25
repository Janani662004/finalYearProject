# def pipeline_run():
#     print("🚀 Running emotion analysis pipeline...")
#     entries = fetch_journal_entries()
#     print(f"📝 Found {len(entries)} new journal entries.")

#     for entry in entries:
#         print(f"🔍 Processing entry ID: {entry['id']} for user ID: {entry['user_id']}")
#         text = entry.get("text_entry", "")
#         user_id = entry["user_id"]
#         journal_id = entry["id"]
        
#         if not text.strip():
#             print("⛔ Skipping empty text.")
#             continue

#         label, score = analyze_emotion(text)
#         print(f"📊 Emotion detected: {label} ({score})")
#         store_emotion_result(user_id, journal_id, label, score)
#         print(f"✅ Stored result for journal {journal_id}")
