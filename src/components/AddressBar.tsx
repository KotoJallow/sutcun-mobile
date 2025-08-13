import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';

interface AddressBarProps {
  address: string;
  onPress?: () => void;
}

const AddressBar = ({ address, onPress }: AddressBarProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <MaterialIcons name="location-on" size={24} color={Colors.primary} />
        <View style={styles.textContainer}>
          <Text style={styles.deliverText}>Deliver to</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText} numberOfLines={1}>
              {address}
            </Text>
            <MaterialIcons 
              name="keyboard-arrow-down" 
              size={20} 
              color="#000" 
            />
          </View>
        </View>
      </View>
      <Text style={styles.changeButton}>CHANGE</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 8,
    flex: 1,
  },
  deliverText: {
    fontSize: 12,
    color: Colors.gray,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    flexShrink: 1,
  },
  changeButton: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AddressBar;