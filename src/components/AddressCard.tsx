import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/colors';

interface AddressCardProps {
  title: string;
  address: string;
  onOptionsPress: () => void;
  isDefault?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({ title, address, onOptionsPress, isDefault = false }) => {
  return (
    <View style={[styles.container, isDefault && styles.defaultContainer]}>
      <View style={styles.leftContent}>
        <View style={styles.titleContainer}>
          <Icon name="home" size={24} color={Colors.primary} style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
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
  defaultContainer: {
    borderWidth: 2,
    borderColor: Colors.primary,
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
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
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