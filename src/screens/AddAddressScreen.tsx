import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Text,
  Image,
  Modal,
  FlatList 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomToolbar from '../components/CustomToolbar';
import Colors from '../constants/colors';
import { istanbulDistricts } from '../constants/districts';

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
  
  const handleSaveAddress = () => {
    // TODO: Adresi kaydet
    navigation.goBack();
  };

  const AddressTypeButton = ({ type, title, icon }: { type: AddressType, title: string, icon: any }) => (
    <TouchableOpacity 
      style={[
        styles.addressTypeButton,
        addressType === type && styles.selectedAddressType
      ]}
      onPress={() => setAddressType(type)}
    >
      <Image source={icon} style={styles.addressTypeIcon} />
      <Text style={[
        styles.addressTypeText,
        addressType === type && styles.selectedAddressTypeText
      ]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderDistrictSelector = () => (
    <View style={styles.rowContainer}>
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
      animationType="slide"
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
            placeholder="Örn: Kayabaşı, Fenertepe Caddesi"
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Bina No *</Text>
            <TextInput
              style={styles.input}
              value={buildingNo}
              onChangeText={setBuildingNo}
              placeholder="14/b"
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginHorizontal: 8 }]}>
            <Text style={styles.label}>Kat *</Text>
            <TextInput
              style={styles.input}
              value={floor}
              onChangeText={setFloor}
              placeholder="3"
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Daire No *</Text>
            <TextInput
              style={styles.input}
              value={apartmentNo}
              onChangeText={setApartmentNo}
              placeholder="5"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adres Tarifi (Örn: Taksi durağının karşısı)</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Adres tarifi giriniz"
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
              icon="home"
            />
            <AddressTypeButton 
              type="iş" 
              title="İş" 
              icon="home"
            />
            <AddressTypeButton 
              type="diğer" 
              title="Diğer" 
              icon="home" 
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSaveAddress}
      >
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 16,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addressInput: {
    height: 120,
  },
  addressTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  addressTypeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: Colors.white,
  },
  selectedAddressType: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  addressTypeIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  addressTypeText: {
    fontSize: 14,
    color: '#666',
  },
  selectedAddressTypeText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
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
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
  },
  districtInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cityText: {
    fontSize: 16,
    color: '#666',
  },
  districtText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  districtItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  districtItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AddAddressScreen;