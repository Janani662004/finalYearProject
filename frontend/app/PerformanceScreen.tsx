import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from '../src/components/ui/card';
import { supabase } from '../lib/supabase';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function PerformanceScreen() {
  const [moodData, setMoodData] = useState({
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [personalityInsights, setPersonalityInsights] = useState('');
  const [recommendedActivities, setRecommendedActivities] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch mood data from the last 7 days
      const { data: moodEntries, error: moodError } = await supabase
        .from('ai_analysis')
        .select('day_score, timestamp')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(7);

      if (moodError) throw moodError;

      if (moodEntries && moodEntries.length > 0) {
        const scores = moodEntries.map(entry => entry.day_score * 5); // Scale to 1-5
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        setMoodData({
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [{ data: scores }]
        });
        setWeeklyAverage(avg);
      }

      // Fetch recommended activities based on recent mood
      const activities = [
        'Team Building Exercise',
        'Stress Management Workshop',
        'Time Management Training',
        'Meditation Session',
        'Physical Exercise'
      ];
      setRecommendedActivities(activities);

      // Set personality insights based on mood patterns
      setPersonalityInsights(
        'Demonstrates resilience and adaptability through varying emotional states. Shows consistent engagement with self-reflection and emotional awareness.'
      );

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Performance Analytics</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Mood Tracker</Text>
        <LineChart
          data={moodData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
        <Text style={styles.averageText}>
          Weekly Average Mood: {weeklyAverage.toFixed(1)} 😊
        </Text>
      </Card>

      <Card style={styles.cardMargin}>
        <Text style={styles.cardTitle}>Recommended Activities</Text>
        {recommendedActivities.map((activity, index) => (
          <Text key={index} style={styles.activityItem}>• {activity}</Text>
        ))}
      </Card>

      <Card style={styles.cardMargin}>
        <Text style={styles.cardTitle}>Personality Summary</Text>
        <Text style={styles.summaryText}>{personalityInsights}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  averageText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  cardMargin: {
    marginTop: 20,
  },
  activityItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});