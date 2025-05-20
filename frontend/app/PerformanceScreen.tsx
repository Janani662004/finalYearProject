import React from "react";
import { View, Text, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card } from "../src/components/ui/card";
import { Ionicons } from "@expo/vector-icons";

const PerformanceScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-[#ffecd2] to-[#fcb69f] p-4">
      <Card className="p-4 rounded-2xl bg-white shadow-lg">
        <Text className="text-lg font-semibold mb-2 text-[#ff7e5f]">Moods</Text>
        <LineChart
          data={{
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [{ data: [1, 4, 2, 3, 5, 3, 4] }],
          }}
          width={320}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#ff9a9e",
            backgroundGradientTo: "#fad0c4",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          bezier
        />
      </Card>

      <Card className="p-4 mt-4 rounded-2xl bg-white shadow-lg">
        <Text className="text-lg font-semibold mb-2 text-[#ff7e5f]">Weekly Summary</Text>
        <Text className="text-base text-gray-600">AI-generated insights here...</Text>
      </Card>

      <Card className="p-4 mt-4 rounded-2xl bg-white shadow-lg">
        <Text className="text-lg font-semibold mb-2 text-[#ff7e5f]">Reflection</Text>
        <View className="flex-row items-center gap-2">
          <Ionicons name="happy" size={24} color="#FFD700" />
          <Text className="text-2xl font-bold text-yellow-500">Peaceful</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="sad" size={24} color="#FF4500" />
          <Text className="text-lg text-red-400">Stressed</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="moon" size={24} color="#32CD32" />
          <Text className="text-lg text-green-500">Tired</Text>
        </View>
      </Card>

      <Card className="p-4 mt-4 rounded-2xl bg-white shadow-lg">
        <Text className="text-lg font-semibold mb-2 text-[#ff7e5f]">Sleep</Text>
        <LineChart
          data={{
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [{ data: [6, 7, 5, 8, 6, 7, 6] }],
          }}
          width={320}
          height={220}
          yAxisLabel="hrs"
          chartConfig={{
            backgroundGradientFrom: "#ff9a9e",
            backgroundGradientTo: "#fad0c4",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          }}
          bezier
        />
      </Card>
    </ScrollView>
  );
};

export default PerformanceScreen;
