import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
    { label: "Prefer not to say", value: "prefer_not_to_say" },
  ];

  const selectGender = (value: string, label: string) => {
    setGender(label);
    setGenderModalVisible(false);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const getBirthDateDisplay = () => {
    if (birthDate) {
      return birthDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return "Select your birth date";
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomToolbar
        title="Register"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/*  Name */}
        <Text style={styles.labelName}>
          Full Name <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.modernInputWrapper}>
          <TextInput
            style={styles.modernInput}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Surname */}
        <Text style={styles.label}>
          Surname <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.modernInputWrapper}>
          <TextInput
            style={styles.modernInput}
            placeholder="Surname"
            value={surname}
            onChangeText={setSurname}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Phone Number */}
        <Text style={styles.labelPhone}>
          Phone Number <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.modernInputWrapper}>
          <View style={styles.phoneContainer}>
            <Text style={styles.countryCode}>+90</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="555 123 4567"
              keyboardType="numeric"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        <Text style={styles.note}>
          We'll send a verification code to this number
        </Text>

        {/* Gender */}
        <Text style={styles.label}>
          Gender <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TouchableOpacity 
          style={styles.modernInputWrapper}
          onPress={() => setGenderModalVisible(true)}
        >
          <View style={styles.inputWithIcon}>
            <MaterialCommunityIcons
              name="gender-male-female"
              size={20}
              color="#9CA3AF"
            />
            <Text style={[styles.modernInputWithIcon, { color: gender ? "#111827" : "#9CA3AF" }]}>
              {gender || "Select your gender"}
            </Text>
            <Feather name="chevron-down" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

        {/* Birth Date */}
        <Text style={styles.label}>
          Birth Date <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TouchableOpacity 
          style={styles.modernInputWrapper}
          onPress={showDatePickerModal}
        >
          <View style={styles.inputWithIcon}>
            <Feather name="calendar" size={20} color="#9CA3AF" />
            <Text style={[styles.modernInputWithIcon, { 
              color: birthDate ? "#111827" : "#9CA3AF" 
            }]}>
              {getBirthDateDisplay()}
            </Text>
            <Feather name="chevron-down" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Gender Modal */}
      <Modal
        visible={genderModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setGenderModalVisible(false)}>
                <Feather name="x" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={genderOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectGender(item.value, item.label)}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                  {gender === item.label && (
                    <Feather name="check" size={20} color="#14b8a6" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Native DatePicker */}
      {showDatePicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal
              transparent={true}
              animationType="fade"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.datePickerModalOverlay}>
                <TouchableOpacity 
                  style={styles.datePickerModalBackdrop}
                  onPress={() => setShowDatePicker(false)}
                  activeOpacity={1}
                />
                <View style={styles.datePickerModalContent}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={birthDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="spinner"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    style={styles.datePickerIOS}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              testID="dateTimePicker"
              value={birthDate || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    flexGrow: 1,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
    color: "#111827",
  },
  labelName: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 4,
    color: "#111827",
  },
  labelPhone: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
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
    marginBottom: 8,
    color: "#6B7280",
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
  modernInputWrapper: {
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modernInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "transparent",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  countryCode: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
    marginRight: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "transparent",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modernInputWithIcon: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "transparent",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalItemText: {
    fontSize: 16,
    color: "#111827",
  },
  datePickerContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    height: 300,
  },
  dateColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateColumnTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },
  dateColumnScroll: {
    maxHeight: 250,
  },
  dateItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedDateItem: {
    backgroundColor: "#14b8a6",
  },
  dateItemText: {
    fontSize: 16,
    color: "#111827",
  },
  selectedDateItemText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#111827",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  datePickerModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerModalBackdrop: {
    flex: 1,
  },
  datePickerModalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  datePickerCancel: {
    fontSize: 16,
    color: "#6B7280",
  },
  datePickerDone: {
    fontSize: 16,
    color: "#14b8a6",
    fontWeight: "600",
  },
  datePickerIOS: {
    backgroundColor: "#FFFFFF",
    alignSelf: 'center',
    width: '100%',
  },
});

export default RegisterScreen;
