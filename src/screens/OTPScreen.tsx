import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const CELL_COUNT = 6;

export default function OTPScreen({ route, navigation }: any) {
  const { phone } = route.params;
  const recaptchaVerifier = useRef(null);
  const [code, setCode] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");

  const ref = useBlurOnFulfill({ code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
  if (phone) sendVerification();
}, [phone]);

  const sendVerification = async () => {
    try {
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(
        phone,
        recaptchaVerifier.current!
      );
      setVerificationId(id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const confirmCode = async () => {
    if (!verificationId) {
      Alert.alert("Error", "No verification ID. Try resending the code first.");
      return;
    }
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      navigation.replace("Main");
    } catch (err: any) {
      Alert.alert("Verification Failed", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />
      <View style={styles.card}>
        <Text style={styles.title}>Enter the 6-digit code</Text>
        <Text style={styles.subtitle}>
          We've sent a code to your phone number
        </Text>

        <CodeField
          ref={ref}
          {...props}
          value={code}
          onChangeText={setCode}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : "")}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.verifyButton} onPress={confirmCode}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={sendVerification}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8888",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  codeFieldRoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  cell: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#e6f8f8",
    justifyContent: "center",
    alignItems: "center",
  },
  focusCell: {
    borderColor: "#20e0d6",
    borderWidth: 2,
  },
  cellText: { fontSize: 24, fontWeight: "bold", color: "#333" },
  verifyButton: {
    backgroundColor: "#20e0d6",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  resendText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 10,
  },
});
