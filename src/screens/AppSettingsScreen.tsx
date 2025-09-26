import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomToolbar from '../components/CustomToolbar';
import colors from '../constants/colors';

const AppSettingsScreen = ({ navigation }: any) => {

const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CustomToolbar title="App Settings"
        showBack={true}
        showDelete={false}
        onBackPress={handleBackPress}/>
      <View style={styles.content}>
        <Text style={styles.text}>AppSettingsScreen</Text>
      </View>
    </View>
  );
  
};
export default AppSettingsScreen;

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