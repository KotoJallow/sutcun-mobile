import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomToolbar from '../components/CustomToolbar';
import AddressCard from '../components/AddressCard';
import Colors from '../constants/colors';
import Strings from '../constants/strings';

const DUMMY_ADDRESSES = [
  {
    id: 1,
    title: 'Ev',
    address: 'Topkapı, Hamalı Cadları Çk No:5, 34093 Fatih/İstanbul, Türkiye No: 5/4',
  },
  {
    id: 2,
    title: 'Ev',
    address: 'Büyükşehir, Gonca Sokağı No:14, 34520 Beylikdüzü Osb/Beylikdüzü/Istanbul, Türkiye No: 14/50',
  },
  {
    id: 3,
    title: 'Ev',
    address: 'İstiklal Cad., No:24 No: C8 Blok/48',
  },
  {
    id: 4,
    title: 'İş',
    address: 'Sanayi, Teknopark Bulvarı, No:174C, Kat: 4, Pendik, Istanbul, Türkiye No: No:174C/4C',
  },
];

const AddressManagementScreen = ({ navigation }: any) => {

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleOptionsPress = (addressId: number) => {
    // Adres seçenekleri menüsünü göster (düzenle/sil)
    console.log('Options pressed for address:', addressId);
  };

  const handleAddAddress = () => {
    navigation.navigate('AddAddress');
  };

  return (
    <View style={styles.container}>
      <CustomToolbar 
        title={Strings.addressManagement}
        showBack={true}
        onBackPress={handleBackPress}
      />
      <ScrollView style={styles.scrollView}>
        {DUMMY_ADDRESSES.map((address) => (
          <AddressCard
            key={address.id}
            title={address.title}
            address={address.address}
            onOptionsPress={() => handleOptionsPress(address.id)}
          />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
        <Text style={styles.addButtonText}>Adres Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  addButton: {
    backgroundColor: Colors.primary,
    marginLeft:16,
    marginRight:16,
    marginBottom:30,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddressManagementScreen;