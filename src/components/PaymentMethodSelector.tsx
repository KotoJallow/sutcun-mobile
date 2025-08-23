import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/colors';

interface PaymentMethodSelectorProps {
  // Şu an için props gerekmiyor çünkü sadece kapıda ödeme var
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = () => {
  return (
    <View style={styles.selectorCard}>
      <View style={styles.selectorHeader}>
        <View style={styles.selectorTitleContainer}>
          <Icon name="credit-card-outline" size={20} color={Colors.primary} />
          <Text style={styles.selectorTitle}>Ödeme Yöntemi</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.paymentOption} disabled={true}>
        <View style={styles.paymentOptionContent}>
          <View style={styles.paymentIconContainer}>
            <Icon name="cash" size={24} color={Colors.primary} />
          </View>
          <View style={styles.paymentTextContainer}>
            <Text style={styles.paymentMethodTitle}>Kapıda Ödeme</Text>
            <Text style={styles.paymentMethodDescription}>
              Nakit veya kart ile kapıda öde
            </Text>
          </View>
        </View>
        <View style={styles.selectedIndicator}>
          <Icon name="check-circle" size={20} color={Colors.primary} />
        </View>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Icon name="information-outline" size={16} color="#6b7280" />
        <Text style={styles.infoText}>
          Şu anda sadece kapıda ödeme seçeneği mevcuttur
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorCard: {
    backgroundColor: Colors.white,
    margin: 16,
    marginTop: 0,
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
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectorTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary + '08',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentTextContainer: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedIndicator: {
    marginLeft: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
    flex: 1,
  },
});

export default PaymentMethodSelector;