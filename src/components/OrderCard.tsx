import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import Strings from '../constants/strings';

interface OrderCardProps {
  orderNumber: string;
  date: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  statusLabel: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  orderNumber,
  date,
  items,
  total,
  status,
  statusLabel
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>{Strings.orderNumber} #{orderNumber}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={[styles.statusBadge, 
          status === 'delivered' && styles.deliveredBadge,
          status === 'pending' && styles.pendingBadge,
          status === 'cancelled' && styles.cancelledBadge,
        ]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        {items.length === 0 ? (
          <Text style={styles.emptyItems}>{Strings.noItems}</Text>
        ) : (
          items.map((item, index) => (
            <View key={`${item.name}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemBullet}>•</Text>
              <Text style={styles.itemText}>
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                <Text style={styles.itemMultiplier}> x </Text>
                <Text style={styles.itemName}>{item.name}</Text>
              </Text>
            </View>
          ))
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>{Strings.total}</Text>
        <Text style={styles.totalAmount}>₺{total.toFixed(2)}</Text>
      </View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  deliveredBadge: {
    backgroundColor: '#e6f4ea',
  },
  pendingBadge: {
    backgroundColor: '#fff8e1',
  },
  cancelledBadge: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  content: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemBullet: {
    fontSize: 14,
    color: '#14b8a6',
    marginRight: 6,
  },
  itemText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  itemMultiplier: {
    fontSize: 14,
    color: '#6b7280',
  },
  itemName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  emptyItems: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default OrderCard;