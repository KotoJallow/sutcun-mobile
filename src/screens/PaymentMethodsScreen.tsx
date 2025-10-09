import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomToolbar from '../components/CustomToolbar';
import colors from '../constants/colors';
import Strings from '../constants/strings';

const PaymentMethodsScreen = ({ navigation }: any) => {

const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CustomToolbar title= {Strings.paymentMethods}
        showBack={true}
        showDelete={false}
        onBackPress={handleBackPress}/>
      <View style={styles.content}>
        <Text style={styles.text}>{Strings.PaymentMethodsScreen}</Text>
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