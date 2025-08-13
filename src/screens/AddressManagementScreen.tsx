import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomToolbar from '../components/CustomToolbar';
import Colors from '../constants/colors';
import Strings from '../constants/strings';

const AddressManagementScreen = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CustomToolbar 
        title={Strings.addressManagement}
        showBack={true}
        onBackPress={handleBackPress}
      />
      {/* Screen content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default AddressManagementScreen;