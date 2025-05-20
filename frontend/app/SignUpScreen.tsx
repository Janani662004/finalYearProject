import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { signUpUser } from '../lib/SignUpUser';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation<any>();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
    institute: ''
  });

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    const result = await signUpUser(formData);
    if (result.success) {
      Alert.alert("✅ Signup successful!");
      navigation.navigate('HomeScreen');
    } else {
      Alert.alert("Signup failed", result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      {Object.keys(formData).map((key) => (
        <TextInput
          key={key}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          value={(formData as any)[key]}
          onChangeText={(text) => handleChange(key, text)}
          secureTextEntry={key === 'password'}
          style={styles.input}
        />
      ))}
      <Button title="Sign Up" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center'
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  }
});
