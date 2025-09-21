import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/colors';
import { RootState } from '../redux/store';
import { 
  DeliveryTimeSlot, 
  formatDeliveryDate 
} from '../constants/deliveryTimes';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useDeliverySlots } from '../hooks/useApi';

interface DeliveryTimeSelectorProps {
  selectedTime: DeliveryTimeSlot | null;
  onTimeSelect: (time: DeliveryTimeSlot) => void;
}

const DeliveryTimeSelector: React.FC<DeliveryTimeSelectorProps> = ({ selectedTime, onTimeSelect }) => {
  const [showModal, setShowModal] = useState(false);
  const { addresses } = useSelector((state: RootState) => state.user);
  
  // Get delivery location
  const getDeliveryLocation = () => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        return {
          district: defaultAddress.district,
          neighborhood: defaultAddress.neighborhood,
        };
      }
    }
    // Default to Beylikdüzü/Kavaklı if no address
    return {
      district: 'Beylikdüzü',
      neighborhood: 'Kavaklı',
    };
  };

  const location = getDeliveryLocation();
  const { data: deliveryTimes, loading, error, refetch } = useDeliverySlots(location);

  const handleTimeSelect = (time: DeliveryTimeSlot) => {
    onTimeSelect(time);
    setShowModal(false);
  };

  const renderTimeItem = ({ item }: { item: DeliveryTimeSlot }) => (
    <TouchableOpacity
      style={[
        styles.timeItem,
        selectedTime?.id === item.id && styles.selectedTimeItem
      ]}
      onPress={() => handleTimeSelect(item)}
    >
      <View style={styles.timeItemContent}>
        <Text style={[
          styles.timeItemDate,
          selectedTime?.id === item.id && styles.selectedTimeItemText
        ]}>
          {formatDeliveryDate(item.date, item.dayOfWeek)}
        </Text>
        <Text style={[
          styles.timeItemLabel,
          selectedTime?.id === item.id && styles.selectedTimeItemText
        ]}>
          {item.label}
        </Text>
        <Text style={[
          styles.timeItemRange,
          selectedTime?.id === item.id && styles.selectedTimeItemText
        ]}>
          {item.timeRange}
        </Text>
      </View>
      {selectedTime?.id === item.id && (
        <Icon name="check-circle" size={24} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Time</Text>
      
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.selectorContent}>
          <Icon name="clock-outline" size={20} color={Colors.primary} />
          <View style={styles.selectorText}>
            {selectedTime ? (
              <>
                <Text style={styles.selectedDate}>
                  {formatDeliveryDate(selectedTime.date, selectedTime.dayOfWeek)}
                </Text>
                <Text style={styles.selectedTime}>
                  {selectedTime.label} • {selectedTime.timeRange}
                </Text>
              </>
            ) : (
              <Text style={styles.placeholderText}>Select delivery time</Text>
            )}
          </View>
          <Icon name="chevron-down" size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Time</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={deliveryTimes || []}
              keyExtractor={(item) => item.id}
              renderItem={renderTimeItem}
              style={styles.timeList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => {
                if (loading) {
                  return <LoadingSpinner text="Loading delivery slots..." />;
                }
                if (error) {
                  return (
                    <ErrorMessage 
                      message={error} 
                      onRetry={refetch}
                      retryText="Retry"
                    />
                  );
                }
                return (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No delivery slots available</Text>
                    <Text style={styles.emptySubtext}>Try selecting a different address</Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  selectorButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorText: {
    flex: 1,
    marginLeft: 12,
  },
  selectedDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  selectedTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  timeList: {
    maxHeight: 400,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedTimeItem: {
    backgroundColor: Colors.primary + '10',
  },
  timeItemContent: {
    flex: 1,
  },
  timeItemDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  timeItemLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  timeItemRange: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedTimeItemText: {
    color: Colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default DeliveryTimeSelector;