import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/colors';

interface DeliveryTime {
  id: string;
  label: string;
  timeRange: string;
}

interface DeliveryTimeSelectorProps {
  selectedTime: DeliveryTime | null;
  onTimeSelect: (time: DeliveryTime) => void;
}

const DeliveryTimeSelector: React.FC<DeliveryTimeSelectorProps> = ({ selectedTime, onTimeSelect }) => {
  const [showModal, setShowModal] = useState(false);

  // Teslimat saatleri - gerçek uygulamada API'dan gelecek
  const deliveryTimes: DeliveryTime[] = [
    { id: '1', label: 'Yarın', timeRange: '10:00-12:00' },
    { id: '2', label: 'Yarın', timeRange: '12:00-14:00' },

  ];

  const handleTimeSelect = (time: DeliveryTime) => {
    onTimeSelect(time);
    setShowModal(false);
  };

  const renderTimeItem = ({ item }: { item: DeliveryTime }) => (
    <TouchableOpacity
      style={[
        styles.timeItem,
        selectedTime?.id === item.id && styles.selectedTimeItem
      ]}
      onPress={() => handleTimeSelect(item)}
    >
      <View style={styles.timeItemContent}>
        <Text style={[
          styles.timeItemLabel,
          selectedTime?.id === item.id && styles.selectedTimeItemLabel
        ]}>
          {item.label}
        </Text>
        <Text style={[
          styles.timeItemRange,
          selectedTime?.id === item.id && styles.selectedTimeItemRange
        ]}>
          {item.timeRange}
        </Text>
      </View>
      {selectedTime?.id === item.id && (
        <Icon name="check-circle" size={20} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity style={styles.selectorCard} onPress={() => setShowModal(true)}>
        <View style={styles.selectorHeader}>
          <View style={styles.selectorTitleContainer}>
            <Icon name="clock-outline" size={20} color={Colors.primary} />
            <Text style={styles.selectorTitle}>Teslimat Saati</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#6b7280" />
        </View>
        
        <View style={styles.selectorContent}>
          {selectedTime ? (
            <Text style={styles.selectedTimeText}>
              {selectedTime.label} {selectedTime.timeRange}
            </Text>
          ) : (
            <Text style={styles.placeholderText}>
              Teslimat saati seçiniz
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Teslimat Saati Seçiniz</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={deliveryTimes}
              keyExtractor={(item) => item.id}
              renderItem={renderTimeItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
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
    marginBottom: 8,
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
  selectorContent: {
    marginTop: 4,
  },
  selectedTimeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  placeholderText: {
    fontSize: 15,
    color: '#9ca3af',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedTimeItem: {
    backgroundColor: Colors.primary + '08',
  },
  timeItemContent: {
    flex: 1,
  },
  timeItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  selectedTimeItemLabel: {
    color: Colors.primary,
  },
  timeItemRange: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedTimeItemRange: {
    color: Colors.primary,
  },
});

export default DeliveryTimeSelector;