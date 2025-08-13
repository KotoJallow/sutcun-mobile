import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AddressBar from '../components/AddressBar';

const HomeScreen= ({ navigation }: any) => {

  const handleAddressPress = () => {
    navigation.navigate('AddressManagement');
  };

  return (
    <View style={{ flex: 1 }}>
      <AddressBar 
        address="Kadıköy, Caferağa"
        onPress={handleAddressPress}
      />
      {/* Diğer içerikler */}
    </View>
  );
}

export default HomeScreen;