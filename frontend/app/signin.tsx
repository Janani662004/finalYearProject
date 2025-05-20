import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/type"; // adjust path if needed
import { supabase } from "../lib/supabase"; // make sure you’ve set up this supabase client

const SignInScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Hold up!", "Please fill in both email and password.");
      return;
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign-in error:", error.message);
      Alert.alert("Oops!", error.message);
    } else {
      console.log("Signed in:", data);
      navigation.navigate("HomeScreen");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={styles.heading}>Sign In</Text>

      <TouchableOpacity style={styles.buttonGoogle}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter Email ID"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
        <Text style={styles.signUpText}>No Account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonGoogle: {
    backgroundColor: "#DB4437",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonPrimary: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  forgotText: {
    color: "blue",
    textAlign: "right",
    marginBottom: 20,
  },
  signUpText: {
    color: "blue",
    textAlign: "center",
    marginTop: 20,
  },
});

export default SignInScreen;
