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
import { auth, db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setAddresses } from '../redux/userSlice';
import { RootState } from '../redux/store';
import LoadingSpinner from '../components/LoadingSpinner';
import { dataService } from '../services/dataService';
import { simpleDataService } from '../services/dataServiceSimple';
import { setOrders } from '../redux/orderSlice';
import Strings from '../constants/strings';

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

  const loadUserDataFromFirestore = async (phoneNumber: string | null) => {
    if (!phoneNumber) {
      console.warn('No phone number provided to loadUserDataFromFirestore');
      return false;
    }
    
    try {
      // Use phone number as entered by user (no normalization)
      const phoneToSearch = phoneNumber.trim();
      
      console.log('🔍 [OTP] Searching for user with phone:', phoneToSearch);
      
      // First, check if user exists (simple check)
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phone', '==', phoneToSearch));
      const userSnapshot = await getDocs(q);
      
      if (!userSnapshot.empty) {
        // ✅ USER EXISTS - Load complete user data
        console.log('✅ [OTP] User exists, loading complete data');
        
        const completeUserData = await simpleDataService.loadCompleteUserData(phoneToSearch);
        
        if (completeUserData) {
          const { user: userData, addresses, orders } = completeUserData;
          
          console.log('✅ [OTP] Complete user data loaded:', {
            userId: userData.id,
            addressesCount: addresses.length,
            ordersCount: orders.length
          });
          
          // Update Redux with complete user data
          dispatch(setUser({
            id: userData.id,
            ...userData,
            isVerified: true,
          }));
          
          // Set all addresses in Redux
          dispatch(setAddresses(addresses));
          
          // Set all orders in Redux
          dispatch(setOrders(orders));
          
          console.log('✅ [OTP] Existing user data loaded successfully');
          return true; // User exists
        }
      }
      
      // ❌ USER DOESN'T EXIST - Do normal flow (no comprehensive loading)
      console.log('❌ [OTP] No existing user found, proceeding with normal flow');
      return false; // User doesn't exist
      
    } catch (error) {
      console.error('❌ [OTP] Error checking user existence:', error);
      return false;
    }
  };

  const confirmCode = async () => {
    if (!verificationId) {
      Alert.alert("Hata", Strings.noVerificationId);
      return;
    }
    
    try {
      setIsVerifying(true);
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const userCredential = await signInWithCredential(auth, credential);
      
      // Update user verification status
      dispatch(setUser({ ...user, isVerified: true }));
      
      // ALWAYS check if user exists in Firestore first (regardless of registration flag)
      console.log('🔍 [OTP] User state phone:', user.phone);
      console.log('🔍 [OTP] Route params phone:', phone);
      
      // Use route params phone if user.phone is null/undefined
      const phoneToCheck = user.phone || phone;
      console.log('🔍 [OTP] Phone to check:', phoneToCheck);
      
      const userExists = await loadUserDataFromFirestore(phoneToCheck);
      
      if (userExists) {
        // User exists - data already loaded, go to main
        console.log('👤 Existing user logged in successfully');
        navigation.replace("Main");
      } else {
        // User doesn't exist - this is a new registration
        if (isRegistration) {
          try {
            console.log('🆕 Creating new user in Firestore');
            
            // Use phone number as entered by user (no normalization)
            const phoneToStore = phone.trim();
            
            const userDoc = await addDoc(collection(db, 'users'), {
              name: user.name,
              surname: user.surname,
              phone: phoneToStore,
              gender: user.gender,
              age: user.age,
              isVerified: true,
              address: null,
              addressId: null, // No primary address yet
              addresses: [], // Empty addresses array
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });

            console.log('✅ New user saved to Firestore:', userDoc.id);

            // Update Redux with Firestore user ID and serializable timestamps
            dispatch(setUser({ 
              ...user, 
              id: userDoc.id, 
              phone: phoneToStore,
              isVerified: true,
              addressId: null,
              addresses: []
            }));
            
            // Show welcome message and go to main
            Alert.alert(
              Strings.welcome, 
              Strings.firstTimeMessage,
              [{ text: Strings.ok, onPress: () => navigation.replace("Main") }]
            );
          } catch (firestoreError) {
            console.error('❌ Error saving new user to Firestore:', firestoreError);
            // Still navigate to main
            navigation.replace("Main");
          }
        } else {
          // This shouldn't happen, but handle gracefully
          console.log('⚠️ User not found but not marked as registration');
          navigation.replace("Main");
        }
      }
    } catch (err: any) {
      Alert.alert(Strings.verificationError, err.message);
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
        <LoadingSpinner text={Strings.sendingCode} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>{Strings.otpTitle}</Text>
          <Text style={styles.subtitle}>
            {Strings.otpSubtitle}
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
              <Text style={styles.verifyButtonText}>{Strings.verify}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={sendVerification} disabled={isLoading}>
            <Text style={styles.resendText}>{Strings.resendCode}</Text>
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
