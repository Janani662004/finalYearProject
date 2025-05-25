import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  JournalEntryScreen: { date: string; emotion: string; time: string };
};

const emotions = [
  { emoji: '😢', label: 'sad' },
  { emoji: '🤩', label: 'excited' },
  { emoji: '😊', label: 'happy' },
  { emoji: '😡', label: 'angry' },
  { emoji: '😌', label: 'calm' },
];

const JournalScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selectedDate, setSelectedDate] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedEmotion, setSelectedEmotion] = useState('');

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    if (event.type === 'dismissed') return;
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  // *** Here's the corrected formatTime function replacing your old one ***
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hrs = hours % 12 || 12;
    const mins = minutes < 10 ? `0${minutes}` : minutes; // fix for minutes under 10
    return `${hrs}:${mins} ${ampm}`;
  };

  const handleJournalEntry = () => {
    if (!selectedDate || !selectedEmotion) {
      alert('Please select a date and emotion!');
      return;
    }

    navigation.navigate('JournalEntryScreen', {
      date: selectedDate,
      emotion: selectedEmotion,
      time: formatTime(time),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Journal</Text>

      <Calendar
        onDayPress={handleDateSelect}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#6C63FF',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#6C63FF',
          todayTextColor: '#6C63FF',
          arrowColor: '#6C63FF',
        }}
      />

      <View style={styles.emotionContainer}>
        <Text style={styles.label}>How are you feeling?</Text>
        <View style={styles.emojiRow}>
          {emotions.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.emotionCircle,
                selectedEmotion === item.label && styles.emotionSelected,
              ]}
              onPress={() => setSelectedEmotion(item.label)}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.buttonText}>
          {`Time: ${formatTime(time)} (Tap to change)`}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <TouchableOpacity
        style={styles.journalButton}
        onPress={handleJournalEntry}
      >
        <Text style={styles.journalButtonText}>Go to Journal Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default JournalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 20,
    alignSelf: 'center',
  },
  emotionContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  emotionCircle: {
    backgroundColor: '#EDEAFF',
    padding: 12,
    borderRadius: 30,
  },
  emotionSelected: {
    backgroundColor: '#6C63FF',
  },
  emoji: {
    fontSize: 26,
  },
  button: {
    backgroundColor: '#EFEFFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: '500',
  },
  journalButton: {
    backgroundColor: '#6C63FF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  journalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
