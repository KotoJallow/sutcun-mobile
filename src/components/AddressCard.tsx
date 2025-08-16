import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/colors';

interface AddressCardProps {
  title: string;
  address: string;
  onOptionsPress: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ title, address, onOptionsPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.titleContainer}>
          <Icon name="home" size={24} color={Colors.primary} style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.address}>{address}</Text>
      </View>
      <TouchableOpacity onPress={onOptionsPress} style={styles.optionsButton}>
        <Icon name="dots-vertical" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  optionsButton: {
    padding: 4,
  },
});

export default AddressCard;