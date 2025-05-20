import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { submitJournalEntry } from '../lib/journalentry'; // Your custom submit function

type RouteParams = {
  emotion: string;
  date: string;
};

const JournalEntry = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [textEntry, setTextEntry] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState('');
  const [emotionLabel, setEmotionLabel] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params) {
      const { emotion, date } = route.params as RouteParams;
      setEmotionLabel(emotion);
      setEntryDate(date);
    }
  }, [route.params]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Please grant audio recording permission');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) setAudioUri(uri);
      setRecording(null);
    } catch (error) {
      Alert.alert('Error', 'Could not stop recording properly.');
    }
  };

  const getMimeType = (uri: string) => {
    if (uri.endsWith('.m4a')) return 'audio/mp4';
    if (uri.endsWith('.mp3')) return 'audio/mpeg';
    return 'application/octet-stream';
  };

  const uploadAudioToSupabase = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileExt = uri.split('.').pop();
      const fileName = `audio_${Date.now()}.${fileExt}`;
      const contentType = getMimeType(uri);

      const { error: uploadError } = await supabase.storage
        .from('journal-audio')
        .upload(`audios/${fileName}`, blob, {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('journal-audio')
        .getPublicUrl(`audios/${fileName}`);

      return data.publicUrl;
    } catch (error) {
      Alert.alert('Upload Error', 'Failed to upload audio.');
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Get user info properly (async)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert('Error', 'You must be logged in to submit an entry.');
        setLoading(false);
        return;
      }

      let uploadedAudioUrl = null;
      if (audioUri) {
        uploadedAudioUrl = await uploadAudioToSupabase(audioUri);
        if (!uploadedAudioUrl) {
          setLoading(false);
          return; // Abort if upload failed
        }
      }

      // Call your submit function with correct camelCase keys
      const result = await submitJournalEntry({
        userId: user.id,
        textEntry,
        audioUrl: uploadedAudioUrl ?? undefined,
        emotionLabel,
        entryDate,
      });

      if (result.error) {
        Alert.alert('Submission Error', 'Failed to submit journal entry.');
      } else {
        Alert.alert('Success', 'Journal entry submitted!');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
    }
    setLoading(false);
  };

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

      <Button title={loading ? 'Submitting...' : 'Submit Entry'} onPress={handleSubmit} disabled={loading} />

      {loading && <ActivityIndicator style={{ marginTop: 10 }} size="small" color="#6C63FF" />}

      <Text style={styles.audioText}>
        {audioUri ? `Audio recorded at: ${audioUri}` : 'No audio recorded yet'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold' },
  subHeader: { fontSize: 18, marginVertical: 10, color: '#6C63FF' },
  textInput: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: { marginBottom: 20 },
  audioText: { marginTop: 20, fontStyle: 'italic', color: '#888' },
});

export default JournalEntry;
