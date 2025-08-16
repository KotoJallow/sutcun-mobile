import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

interface OrderCardProps {
  orderNumber: string;
  date: string;
  itemCount: number;
  items: string;
  total: number;
  status: 'delivered' | 'pending' | 'cancelled';
}

const OrderCard: React.FC<OrderCardProps> = ({
  orderNumber,
  date,
  itemCount,
  items,
  total,
  status
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={[styles.statusBadge, 
          status === 'delivered' && styles.deliveredBadge,
          status === 'pending' && styles.pendingBadge,
          status === 'cancelled' && styles.cancelledBadge,
        ]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.itemsContainer}>
          <Text style={styles.itemCount}>{itemCount} items</Text>
          <Text style={styles.items}>{items}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total</Text>
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
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  items: {
    fontSize: 14,
    color: '#666',
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