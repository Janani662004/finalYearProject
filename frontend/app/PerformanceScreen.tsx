import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { supabase } from "../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#ffffff00",
  backgroundGradientTo: "#ffffff00",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(245, 106, 155, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#f56a9b",
  },
  propsForLabels: {
    fontSize: 12,
  },
};

export default function PerformanceScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<number[]>([]);
  const [dayLabels, setDayLabels] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [weeklyAverage, setWeeklyAverage] = useState<number>(0);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }

      // Fetch user profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Fetch last 7 days of mood data
      const { data: moodEntries, error: moodError } = await supabase
        .from('ai_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true })
        .limit(7);

      if (moodError) throw moodError;

      // Process mood data
      const scores = moodEntries?.map(entry => entry.day_score) || [];
      const labels = moodEntries?.map(entry => 
        new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short' })
      ) || [];

      // Calculate weekly average
      const avg = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0;

      setUserData(userData);
      setMoodData(scores);
      setDayLabels(labels);
      setWeeklyAverage(avg);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f56a9b" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>Back to Dashboard</Text>
      </TouchableOpacity>

      <View style={styles.userCard}>
        <Text style={styles.userName}>{userData?.first_name} {userData?.last_name}</Text>
        <Text style={styles.userDetail}>ID: {userData?.id}</Text>
        <Text style={styles.userDetail}>Department: {userData?.department || 'Not specified'}</Text>
        <Text style={styles.userDetail}>Role: {userData?.role || 'Not specified'}</Text>
      </View>

      <View style={styles.moodCard}>
        <Text style={styles.cardTitle}>Mood Tracker</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: dayLabels,
              datasets: [{ data: moodData.length ? moodData : [0] }]
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        <View style={styles.emojiContainer}>
          {["😢", "😟", "😐", "🙂", "😄"].map((emoji, index) => (
            <Text key={index} style={styles.emoji}>{emoji}</Text>
          ))}
        </View>
        <Text style={styles.averageText}>
          Weekly Average Mood: {weeklyAverage.toFixed(1)} 
          {weeklyAverage > 3 ? " 🙂" : weeklyAverage > 2 ? " 😐" : " 😟"}
        </Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={[styles.card, styles.activitiesCard]}>
          <Text style={styles.cardTitle}>Recommended Activities</Text>
          <View style={styles.activitiesList}>
            <Text style={styles.activity}>• Morning Meditation</Text>
            <Text style={styles.activity}>• Team Building Exercise</Text>
            <Text style={styles.activity}>• Stress Management Workshop</Text>
            <Text style={styles.activity}>• Time Management Training</Text>
          </View>
        </View>

        <View style={[styles.card, styles.personalityCard]}>
          <Text style={styles.cardTitle}>Personality Summary</Text>
          <Text style={styles.personalityText}>
            Demonstrates strong collaborative skills and attention to detail. 
            Works well under pressure and adapts quickly to changing priorities.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  backText: {
    marginLeft: 10,
    fontSize: 16,
  },
  userCard: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  moodCard: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  chartContainer: {
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  emoji: {
    fontSize: 24,
  },
  averageText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  gridContainer: {
    flexDirection: "column",
    padding: 15,
    gap: 15,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activitiesCard: {
    backgroundColor: "rgba(155, 135, 245, 0.1)",
  },
  personalityCard: {
    backgroundColor: "rgba(155, 135, 245, 0.1)",
  },
  activitiesList: {
    gap: 10,
  },
  activity: {
    fontSize: 16,
    color: "#333",
  },
  personalityText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
});