import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Text,
  Modal,
  FlatList 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomToolbar from '../components/CustomToolbar';
import Colors from '../constants/colors';
import { istanbulDistricts } from '../constants/districts';
import colors from '../constants/colors';

type AddressType = 'ev' | 'iş' | 'diğer';

const AddAddressScreen = ({ navigation } : any) => {
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [buildingNo, setBuildingNo] = useState('');
  const [floor, setFloor] = useState('');
  const [apartmentNo, setApartmentNo] = useState('');
  const [description, setDescription] = useState('');
  const [addressType, setAddressType] = useState<AddressType>('ev');
  const [title, setTitle] = useState('');
  
  const handleSaveAddress = () => {
    // TODO: Adresi kaydet
    navigation.goBack();
  };

  const AddressTypeButton = ({ type, title, iconName }: { type: AddressType, title: string, iconName: string }) => (
    <TouchableOpacity 
      style={[
        styles.addressTypeButton,
        addressType === type && styles.selectedAddressType
      ]}
      onPress={() => setAddressType(type)}
    >
      <View style={[
        styles.iconContainer,
        addressType === type && styles.selectedIconContainer
      ]}>
        <Icon 
          name={iconName} 
          size={24} 
          color={addressType === type ? Colors.primary : '#666'} 
        />
      </View>
      <Text style={[
        styles.addressTypeText,
        addressType === type && styles.selectedAddressTypeText
      ]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderDistrictSelector = () => (
    <View style={styles.rowContainerMargin}>
      <TouchableOpacity 
        style={[styles.cityInput, styles.disabledInput]} 
        disabled={true}
      >
        <Text style={styles.cityText}>İstanbul</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.districtInput}
        onPress={() => setShowDistrictModal(true)}
      >
        <Text style={district ? styles.districtText : styles.placeholderText}>
          {district || 'İlçe seçiniz'}
        </Text>
        <Icon name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderDistrictModal = () => (
    <Modal
      visible={showDistrictModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>İlçe Seçiniz</Text>
            <TouchableOpacity onPress={() => setShowDistrictModal(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={istanbulDistricts}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.districtItem}
                onPress={() => {
                  setDistrict(item);
                  setShowDistrictModal(false);
                }}
              >
                <Text style={styles.districtItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <CustomToolbar 
        title="Yeni Adres Ekle"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.content}>
        {renderDistrictSelector()}
        {renderDistrictModal()}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mahalle / Cadde / Sokak *</Text>
          <TextInput
            style={styles.input}
            value={street}
            onChangeText={setStreet}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Bina No *</Text>
            <TextInput
              style={styles.input}
              value={buildingNo}
              onChangeText={setBuildingNo}
              maxLength={8}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Kat *</Text>
            <TextInput
              style={styles.input}
              value={floor}
              onChangeText={setFloor}
              keyboardType="numeric"
              maxLength={8}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Daire No *</Text>
            <TextInput
              style={styles.input}
              value={apartmentNo}
              onChangeText={setApartmentNo}
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adres Tarifi (Örn: Taksi durağının karşısı)</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adres Detayları</Text>
          <View style={styles.addressTypesContainer}>
            <AddressTypeButton 
              type="ev" 
              title="Ev" 
              iconName="home"
            />
            <AddressTypeButton 
              type="iş" 
              title="İş" 
              iconName="office-building"
            />
            <AddressTypeButton 
              type="diğer" 
              title="Diğer" 
              iconName="map-marker" 
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adres Başlığı</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveAddress}
        >
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  rowContainerMargin: {
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#111827',
  },
  addressInput: {
    height: 100,
    paddingTop: 8,
  },
  addressTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  addressTypeButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.white,
    minHeight: 80,
    justifyContent: 'center',
  },
  selectedAddressType: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedIconContainer: {
    backgroundColor: Colors.primary + '15',
  },
  addressTypeText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedAddressTypeText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: 30,
    backgroundColor: Colors.white,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cityInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  disabledInput: {
    backgroundColor: '#f9fafb',
  },
  districtInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cityText: {
    fontSize: 16,
    color: '#6b7280',
  },
  districtText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  districtItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  districtItemText: {
    fontSize: 16,
    color: '#111827',
  },
});

export default AddAddressScreen;