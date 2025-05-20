import { supabase } from './supabase'; // adjust path as needed

export const submitJournalEntry = async ({
  userId,
  textEntry,
  audioUrl,
  emotionLabel,
  entryDate,
}: {
  userId: string;
  textEntry: string;
  audioUrl?: string; // optional, if no audio
  emotionLabel: string;
  entryDate: string; // ideally ISO string or date string
}) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          user_id: userId,
          text_entry: textEntry,
          audio_entry: audioUrl || null,
          emotion_label: emotionLabel,
          timestamp: new Date(entryDate).toISOString(),
        },
      ])
      .select();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
};
