import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomToolbar from '../components/CustomToolbar';
import AddressCard from '../components/AddressCard';
import Colors from '../constants/colors';
import Strings from '../constants/strings';
import colors from '../constants/colors';
import { clearCart } from '../redux/cartSlice'; // Import clearCart action
import { RootState } from '../redux/store';
import { setDefaultAddress, removeAddress } from '../redux/userSlice';
import { useDeleteAddress } from '../hooks/useApi';

const AddressManagementScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state: RootState) => state.user);
  const { items } = useSelector((state: RootState) => state.cart); // Get cart items
  const { mutate: deleteAddressApi, loading: isDeleting } = useDeleteAddress();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSetDefaultAddress = (addressId: string) => {
    if (items.length > 0) {
      Alert.alert(
        'Sepet Sıfırlanacak',
        'Varsayılan adres değiştirildiğinde sepetinizdeki ürünler silinecektir. Devam etmek istiyor musunuz?',
        [
          {
            text: 'İptal',
            style: 'cancel'
          },
          {
            text: 'Devam Et',
            style: 'destructive',
            onPress: () => {
              dispatch(setDefaultAddress(addressId));
              dispatch(clearCart());
            }
          }
        ]
      );
    } else {
      dispatch(setDefaultAddress(addressId));
    }
  };

  const handleOptionsPress = (addressId: string) => {
    Alert.alert(
      'Adres Seçenekleri',
      'Bu adres için ne yapmak istersiniz?',
      [
        {
          text: 'Varsayılan Yap',
          onPress: () => handleSetDefaultAddress(addressId)
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Adresi Sil',
              'Bu adresi silmek istediğinize emin misiniz?',
              [
                { text: 'İptal', style: 'cancel' },
                { 
                  text: 'Sil', 
                  style: 'destructive', 
                  onPress: async () => {
                    try {
                      console.log('🗑️ Deleting address:', addressId);
                      const success = await deleteAddressApi(addressId);
                      if (success) {
                        // Only remove from Redux if database deletion succeeded
                        dispatch(removeAddress(addressId));
                        console.log('✅ Address deleted successfully');
                      } else {
                        Alert.alert('Hata', 'Adres silme işlemi başarısız oldu. Lütfen tekrar deneyin.');
                      }
                    } catch (error) {
                      console.error('❌ Error deleting address:', error);
                      Alert.alert('Hata', 'Adres silme işlemi başarısız oldu. Lütfen tekrar deneyin.');
                    }
                  }
                }
              ]
            );
          }
        },
        { text: 'İptal', style: 'cancel' }
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
            <Text style={styles.emptyText}>Henüz kaydedilmiş adres yok</Text>
            <Text style={styles.emptySubtext}>İlk adresinizi eklemek için aşağıdaki butona tıklayın</Text>
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