import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/colors';

interface Address {
  title: string;
  district: string;
  neighborhood: string;
  street: string;
  buildingNo: string;
  floor: string;
  apartmentNo: string;
  description?: string;
}

interface SelectedAddressCardProps {
  address: Address;
}

const SelectedAddressCard: React.FC<SelectedAddressCardProps> = ({ address }) => {
  return (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTitleContainer}>
          <Icon name="map-marker" size={20} color={Colors.primary} />
          <Text style={styles.addressTitle}>Teslimat Adresi</Text>
        </View>
        <View style={styles.addressTypeTag}>
          <Text style={styles.addressTypeText}>{address.title}</Text>
        </View>
      </View>
      
      <View style={styles.addressContent}>
        <Text style={styles.addressMainText}>
          {address.neighborhood}, {address.street}
        </Text>
        <Text style={styles.addressDetailsText}>
          {address.district} • No: {address.buildingNo} • Kat: {address.floor} • Daire: {address.apartmentNo}
        </Text>
        {address.description && (
          <Text style={styles.addressDescriptionText}>
            {address.description}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addressCard: {
    backgroundColor: Colors.white,
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  addressTypeTag: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  addressTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  addressContent: {
    gap: 4,
  },
  addressMainText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    lineHeight: 20,
  },
  addressDetailsText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  addressDescriptionText: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16,
  },
});

export default SelectedAddressCard;