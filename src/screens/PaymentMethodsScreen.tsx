import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomToolbar from '../components/CustomToolbar';
import colors from '../constants/colors';

const PaymentMethodsScreen = ({ navigation }: any) => {

const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CustomToolbar title="Payment Methods"
        showBack={true}
        showDelete={false}
        onBackPress={handleBackPress}/>
      <View style={styles.content}>
        <Text style={styles.text}>Payment Methods will be listed here.</Text>
      </View>
    </View>
  );
  
};
export default PaymentMethodsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: colors.black,
  },
});