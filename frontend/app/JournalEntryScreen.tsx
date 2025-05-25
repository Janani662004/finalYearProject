import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

type RouteParams = {
  emotion: string;
  date: string;
};

const JournalEntryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [textEntry, setTextEntry] = useState('');
  const [audioUri, setAudioUri] = useState('');
  const [emotionLabel, setEmotionLabel] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (route.params) {
      const { emotion, date } = route.params as RouteParams;
      console.log('📦 Received route params:', emotion, date);
      setEmotionLabel(emotion);
      setEntryDate(date);
    } else {
      console.warn('⚠️ No route params found!');
    }
  }, [route.params]);

  const startRecording = async () => {
    try {
      console.log('🎙️ Requesting permissions..');
      await Audio.requestPermissionsAsync();

      console.log('⏺️ Starting recording..');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('🟢 Recording started');
    } catch (err) {
      console.error('❌ Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('⏹️ Stopping recording..');
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        setAudioUri(uri);
        console.log('✅ Recording saved at', uri);
      }
      setRecording(null);
    } catch (err) {
      console.error('❌ Error stopping recording:', err);
    }
  };

  const uploadAudioToSupabase = async (uri: string) => {
    const fileName = `audio_${Date.now()}.m4a`;
    const fileType = 'audio/x-m4a';

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('journal-audio')
        .upload(`audios/${fileName}`, blob, {
          contentType: fileType,
          upsert: true,
        });

      if (uploadError) {
        console.error('❌ Upload failed:', uploadError);
        return null;
      }

      const { data: audioUrl } = supabase.storage
        .from('journal-audio')
        .getPublicUrl(`audios/${fileName}`);

      console.log('🔗 Uploaded Audio URL:', audioUrl?.publicUrl);
      return audioUrl?.publicUrl;
    } catch (err) {
      console.error('❌ Error uploading audio blob:', err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!entryDate || !emotionLabel) {
      Alert.alert('Missing Data', 'Entry date or emotion label is missing.');
      return;
    }

    setIsSubmitting(true);
    try {
      const {
        data: { user },
        error: userFetchError,
      } = await supabase.auth.getUser();

      if (userFetchError || !user) {
        throw new Error('⚠️ User not authenticated');
      }

      let audioUrl = '';
      if (audioUri) {
        const uploadedUrl = await uploadAudioToSupabase(audioUri);
        if (!uploadedUrl) {
          throw new Error('❌ Failed to upload audio');
        }
        audioUrl = uploadedUrl;
      }

      const { error } = await supabase.from('journal_entries').insert([
        {
          user_id: user.id,
          text_entry: textEntry,
          audio_entry: audioUrl,
          emotion_label: emotionLabel,
          timestamp: entryDate,
        },
      ]);

      if (error) {
        console.error('❌ Insert failed:', error);
        Alert.alert('Error', 'Failed to save journal entry.');
      } else {
        console.log('✅ Journal entry saved!');
        Alert.alert('Success', 'Journal entry submitted!');
        navigation.goBack();
      }
    } catch (err: any) {
      console.error('❌ handleSubmit Error:', err.message);
      Alert.alert('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!entryDate || !emotionLabel) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❗ Missing entry date or emotion label.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journal Entry for {entryDate}</Text>
      <Text style={styles.subHeader}>Emotion: {emotionLabel}</Text>

      <TextInput
        style={styles.textInput}
        value={textEntry}
        onChangeText={setTextEntry}
        placeholder="Write your journal entry..."
        multiline
      />

      <View style={styles.buttonContainer}>
        <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? stopRecording : startRecording}
        />
      </View>

      <Button title="Submit Entry" onPress={handleSubmit} disabled={isSubmitting} />

      {isSubmitting && <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 20 }} />}

      <Text style={styles.audioText}>
        {audioUri ? `Audio: ${audioUri}` : 'No audio recorded yet'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    marginVertical: 10,
    color: '#6C63FF',
  },
  textInput: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  audioText: {
    marginTop: 20,
    fontStyle: 'italic',
    color: '#888',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default JournalEntryScreen;
