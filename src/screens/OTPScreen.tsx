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
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { RootState } from '../redux/store';
import LoadingSpinner from '../components/LoadingSpinner';

const CELL_COUNT = 6;

export default function OTPScreen({ route, navigation }: any) {
  const { phone, isRegistration = false } = route.params;
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const recaptchaVerifier = useRef(null);
  const [code, setCode] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
  if (phone) sendVerification();
}, [phone]);

  const sendVerification = async () => {
    try {
      setIsLoading(true);
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(
        phone,
        recaptchaVerifier.current!
      );
      setVerificationId(id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCode = async () => {
    if (!verificationId) {
      Alert.alert("Error", "No verification ID. Try resending the code first.");
      return;
    }
    try {
      setIsVerifying(true);
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      
      // Update user verification status
      dispatch(setUser({ ...user, isVerified: true }));
      
      // Navigate based on registration status
      if (isRegistration) {
        // For new users, show default address message and go to main
        Alert.alert(
          'Welcome!', 
          'Since this is your first time, we\'ll show products from Beylikdüzü/Kavaklı. You can add your address later.',
          [{ text: 'OK', onPress: () => navigation.replace("Main") }]
        );
      } else {
        // For existing users, go directly to main
        navigation.replace("Main");
      }
    } catch (err: any) {
      Alert.alert("Verification Failed", err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />
      
      {isLoading ? (
        <LoadingSpinner text="Sending verification code..." />
      ) : (
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

          <TouchableOpacity 
            style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]} 
            onPress={confirmCode}
            disabled={isVerifying || code.length !== 6}
          >
            {isVerifying ? (
              <LoadingSpinner size="small" color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={sendVerification} disabled={isLoading}>
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      )}
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
  verifyButtonDisabled: {
    backgroundColor: "#ccc",
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
