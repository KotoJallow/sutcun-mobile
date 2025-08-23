import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";
import {
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import colors from "../constants/colors";
import CustomToolbar from "../components/CustomToolbar";

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomToolbar
        title="Register"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Personal Information</Text>
        <Text style={styles.subheading}>
          Please fill in your details to create an account
        </Text>

        {/*  Name */}
        <Text style={styles.label}>
          Full Name <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputWrapper}>
          <FontAwesome name="user" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Surname */}
        <Text style={styles.label}>
          Surname <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputWrapper}>
          <FontAwesome name="user" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="Enter your surname"
            value={surname}
            onChangeText={setSurname}
          />
        </View>

        {/* Phone Number */}
        <Text style={styles.label}>
          Phone Number <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputWrapper}>
          <Feather name="phone" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        <Text style={styles.note}>
          We'll send a verification code to this number
        </Text>

        {/* Gender */}
        <Text style={styles.label}>
          Gender <Text style={styles.optional}>(optional)</Text>
        </Text>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            name="gender-male-female"
            size={16}
            color="#9CA3AF"
          />
          <TextInput
            style={styles.input}
            placeholder="Select your gender"
            value={gender}
            onChangeText={setGender}
          />
        </View>

        {/* Age */}
        <Text style={styles.label}>
          Age <Text style={styles.optional}>(optional)</Text>
        </Text>
        <View style={styles.inputWrapper}>
          <Feather name="calendar" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        {/* Terms Agreement */}
        <View style={styles.checkboxContainer}>
          <Switch
            value={agreed}
            onValueChange={setAgreed}
            trackColor={{ false: "#ccc", true: "#14b8a6" }}
            thumbColor={agreed ? "#fff" : "#f4f3f4"}
          />
          <Text style={styles.checkboxLabel}>
            I agree to the Terms of Service and Privacy Policy
          </Text>
        </View>

        {/* Create Account Button */}
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create Account →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.white,
    flexGrow: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subheading: {
    color: "#6B7280",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
    color: "#111827",
  },
  required: {
    color: "#EF4444",
  },
  optional: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  note: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 13,
    color: "#374151",
    flex: 1,
  },
  createButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegisterScreen;
