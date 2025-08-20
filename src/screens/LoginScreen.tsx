import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import colors from "../constants/colors";

const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Logo placeholder */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>🥛</Text>
        </View>
      </View>

      {/* Welcome */}
      <Text style={styles.title}>Welcome to Sütçün</Text>
      <Text style={styles.subtitle}>Fresh dairy at your doorstep</Text>

      {/* Auth Header */}
      <Text style={styles.sectionTitle}>Login or Sign Up</Text>
      <Text style={styles.sectionSubtitle}>
        Enter your phone number to continue
      </Text>

      {/* Phone Input */}
      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="+90 5XX XXX XX XX"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (phone.trim()) {
            navigation.navigate("OTP", { phone });
          } else {
            alert("Please enter a valid phone number");
          }
        }}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      {/* Info Note */}
      <Text style={styles.note}>
        We'll send a verification code to this number
      </Text>

      {/* Terms */}
      <Text style={styles.terms}>
        By continuing, you agree to our{" "}
        <Text style={styles.link}>Terms of Service</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ccfbf1",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 28,
    color: "#0891b2",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#374151",
  },
  inputWrapper: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  input: {
    fontSize: 15,
    color: "#111827",
  },
  button: {
    backgroundColor: "#14b8a6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  note: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  terms: {
    fontSize: 12,
    textAlign: "center",
    color: "#6b7280",
    lineHeight: 18,
  },
  link: {
    color: "#0ea5e9",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
