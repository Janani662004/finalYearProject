import { Image, View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("users").select("*").limit(1);
      if (error) {
        Alert.alert("Supabase Error", error.message);
      } else {
        Alert.alert("Success", "Connected to Supabase!");
        console.log("Sample Data:", data);
      }
    };

    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/fox.jpg")} style={styles.foxImage} />
      <Text style={styles.title}>Welcome to FoxTale</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/signin")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
  },
  foxImage: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
