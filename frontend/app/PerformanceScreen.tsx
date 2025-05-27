import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { supabase } from "../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#ffffff00",
  backgroundGradientTo: "#ffffff00",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 51, 102, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 51, 102, ${opacity})`,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#003366",
  },
};

const PerformanceScreen = () => {
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<number[]>([]);
  const [dayLabels, setDayLabels] = useState<string[]>([]);
  const [topTextEmotion, setTopTextEmotion] = useState("Loading...");
  const [topAudioEmotion, setTopAudioEmotion] = useState("Loading...");
  const [depressionLevel, setDepressionLevel] = useState("Loading...");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("User fetch error:", error.message);
      else setUserId(data?.user?.id ?? null);
    };
    getUserId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("ai_analysis")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: true })
        .limit(7);

      if (error) {
        console.error("Fetch error:", error.message);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const scores = data.map((entry) => entry.day_score ?? 0);
        setMoodData(scores);

        const labels = data.map((entry) =>
          new Date(entry.timestamp).toLocaleDateString("en-US", { weekday: "short" })
        );
        setDayLabels(labels);

        setTopTextEmotion(data[0]?.text_emotion_label || "Unknown");
        setTopAudioEmotion(data[0]?.audio_emotion_label || "Unknown");

        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        if (avgScore <= 30) setDepressionLevel("⚠️ High Depression Risk");
        else if (avgScore <= 60) setDepressionLevel("😐 Moderate Depression Risk");
        else setDepressionLevel("🙂 Low Depression Risk");
      }

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  return (
    <ImageBackground
      source={require("../assets/fox-bg.png")}
      style={styles.background}
      imageStyle={{ opacity: 0.06 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#003366" />
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>Mood Tracker</Text>

            <LineChart
              data={{
                labels: dayLabels,
                datasets: [{ data: moodData }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />

            <Text style={styles.levelText}>{depressionLevel}</Text>

            <View style={styles.emotions}>
              <Text style={styles.label}>
                <Ionicons name="text" size={16} /> Text Emotion:{" "}
                <Text style={styles.value}>{topTextEmotion}</Text>
              </Text>
              <Text style={styles.label}>
                <Ionicons name="mic" size={16} /> Audio Emotion:{" "}
                <Text style={styles.value}>{topAudioEmotion}</Text>
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    color: "#003366",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
  },
  levelText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
  },
  emotions: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  value: {
    fontWeight: "600",
    color: "#003366",
  },
});

export default PerformanceScreen;
