import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import API from '../src/utils/axiosConfig';

type JournalEntry = {
  _id: string;
  date: string;
  emotion?: string;
  content: string;
};

export default function JournalHistoryScreen() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await API.get('/journals');
        setJournals(response.data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching journals:', error.message);
        } else {
          console.error('Unknown error:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  const renderItem = ({ item }: { item: JournalEntry }) => (
    <View style={styles.card}>
      <Text style={styles.date}>
        {new Date(item.date).toLocaleDateString()} - {item.emotion || 'Unknown'}
      </Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={journals}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#3498db',
  },
  content: {
    fontSize: 16,
  },
});
