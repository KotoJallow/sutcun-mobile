import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import colors from "../constants/colors";
import CustomToolbar from "../components/CustomToolbar";
import Strings from '../constants/strings';

const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState("");

  // Phone input handler to remove +90 if user tries to enter it
  const handlePhoneChange = (text: string) => {
    // Remove any non-numeric characters
    const numericOnly = text.replace(/[^0-9]/g, '');
    setPhone(numericOnly);
  };

  const handleTermsPress = () => {
    Linking.openURL('https://www.google.com'); // Terms of service URL'ini buraya ekleyin
  };

  const handlePrivacyPress = () => {
    Linking.openURL('https://www.google.com'); // Privacy policy URL'ini buraya ekleyin
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomToolbar
        title={Strings.login}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
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
        <Text style={styles.title}>{Strings.welcomeMessage}</Text>
        <Text style={styles.subtitle}>{Strings.freshDairy}</Text>

        {/* Auth Header */}
        <Text style={styles.sectionSubtitle}>
          {Strings.enterPhone}
        </Text>

        {/* Phone Input */}
        <Text style={styles.label}>{Strings.phoneNumber}</Text>
        <View style={styles.inputWrapper}>
          <View style={styles.phoneInputContainer}>
            <Text style={styles.prefixText}>+90</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="5XX XXX XX XX"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={handlePhoneChange}
              maxLength={10}
            />
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (phone.trim()) {
              // phone numarasının başına +90 ekleyerek gönder
              const fullPhoneNumber = `+90${phone}`;
              navigation.navigate("OTP", { phone: fullPhoneNumber });
            } else {
              alert(Strings.enterValidPhone);
            }
          }}
        >
          <Text style={styles.buttonText}>{Strings.continue}</Text>
        </TouchableOpacity>

        {/* Info Note */}
        <Text style={styles.note}>
          {Strings.verificationNote}
        </Text>

        {/* Terms */}
        <Text style={styles.terms}>
          {Strings.termsText}{" "}
          <Text style={styles.link} onPress={handleTermsPress}>
            {Strings.termsService}
          </Text> {Strings.and}{" "}
          <Text style={styles.link} onPress={handlePrivacyPress}>
            {Strings.privacyPolicy}
          </Text> {Strings.acceptTerms}
        </Text>
      </KeyboardAvoidingView>
    </View>
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
    marginTop: 20,
    marginBottom: 15,
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixText: {
    fontSize: 15,
    color: '#111827',
    marginRight: 8,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
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
