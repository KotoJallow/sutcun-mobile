import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomToolbar from '../components/CustomToolbar';
import AddressCard from '../components/AddressCard';
import Colors from '../constants/colors';
import Strings from '../constants/strings';
import colors from '../constants/colors';
import { RootState } from '../redux/store';
import { setDefaultAddress, removeAddress } from '../redux/userSlice';

const AddressManagementScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state: RootState) => state.user);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleOptionsPress = (addressId: string) => {
    Alert.alert(
      'Address Options',
      'What would you like to do with this address?',
      [
        {
          text: 'Set as Default',
          onPress: () => dispatch(setDefaultAddress(addressId))
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Address',
              'Are you sure you want to delete this address?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => dispatch(removeAddress(addressId)) }
              ]
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
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
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No addresses saved yet</Text>
            <Text style={styles.emptySubtext}>Add your first address to get started</Text>
          </View>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              title={address.title}
              address={`${address.district}, ${address.neighborhood}, ${address.street} No:${address.buildingNo}, Kat: ${address.floor}, Daire: ${address.apartmentNo}`}
              onOptionsPress={() => handleOptionsPress(address.id)}
              isDefault={address.isDefault}
            />
          ))
        )}
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
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
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