import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AddressBar from '../components/AddressBar';
import ImageSlider from '../components/ImageSlider';

const HomeScreen = ({ navigation }: any) => {
  const sliderImages = [
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
  ];

  const handleAddressPress = () => {
    navigation.navigate('AddressManagement');
  };

  const handleSliderPress = () => {
    // Handle slider press
    console.log('Slider pressed');
  };

  return (
    <View style={{ flex: 1 }}>
      <AddressBar 
        address="Kadıköy, Caferağa"
        onPress={handleAddressPress}
      />
      <ImageSlider 
        images={sliderImages}
        onPress={handleSliderPress}
      />
    </View>
  );
};

export default HomeScreen;