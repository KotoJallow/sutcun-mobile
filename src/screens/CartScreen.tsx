import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomToolbar from '../components/CustomToolbar';
import CartItem from '../components/CartItem';
import SelectedAddressCard from '../components/SelectedAddressCard';
import DeliveryTimeSelector from '../components/DeliveryTimeSelector';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import Colors from '../constants/colors';
import { RootState } from '../redux/store';
import { increment, decrement, clearCart, removeFromCart } from '../redux/cartSlice';
import { DeliveryTimeSlot } from '../constants/deliveryTimes';
import { createOrder, clearCurrentOrder, addOrderFromFirestore } from '../redux/orderSlice';
import { useCreateOrder, useDeliverySlots } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { simpleDataService } from '../services/dataServiceSimple';

const CartScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { items, total, groupedItems } = useSelector((state: RootState) => state.cart);
  const { addresses } = useSelector((state: RootState) => state.user);
  const user = useSelector((state: RootState) => state.user);
  
  // Teslimat saati state'i - tip tanımını yukarı taşıdım
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<DeliveryTimeSlot | null>(null);
  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false);

  // API mutation for creating orders
  const { mutate: createOrderApi, loading: isCreatingOrder } = useCreateOrder();
  
  // Get delivery slots from Firebase
  const defaultAddress = addresses.find(addr => addr.isDefault);
  const { data: deliverySlots, loading: slotsLoading } = useDeliverySlots({
    district: defaultAddress?.district || 'Beylikdüzü',
    neighborhood: defaultAddress?.neighborhood || 'Kavaklı'
  });

  // Teslimat saatlerini filtrele - 3 saatten az kalanları çıkar
  const filteredDeliverySlots = useMemo(() => {
    if (!deliverySlots) return [];

    const now = new Date();
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    console.log('🕐 Current time:', now.toLocaleString('tr-TR'));
    console.log('🕐 Three hours later:', threeHoursLater.toLocaleString('tr-TR'));
    console.log('📦 Total delivery slots:', deliverySlots.length);

    const filtered = deliverySlots.filter((slot: DeliveryTimeSlot) => {
      try {
        // Tarih formatı: "07.10.2025" veya "7.10.2025"
        const dateParts = slot.date.split('.');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10);

        // Saat formatı: "10:00-12:00"
        const timeRange = slot.timeRange.split('-');
        const startTime = timeRange[0].trim();
        const [hours, minutes] = startTime.split(':').map(num => parseInt(num, 10));

        // Teslimat başlangıç zamanını oluştur
        const deliveryStartTime = new Date(year, month - 1, day, hours, minutes);

        console.log(`📅 Slot: ${slot.date} ${slot.timeRange}`);
        console.log(`   Delivery start time: ${deliveryStartTime.toLocaleString('tr-TR')}`);
        console.log(`   Is valid: ${deliveryStartTime > threeHoursLater}`);

        // Teslimat başlangıç zamanı, şu andan 3 saat sonradan daha ilerideyse göster
        return deliveryStartTime > threeHoursLater;
      } catch (error) {
        console.error('❌ Error parsing slot:', slot, error);
        return false;
      }
    });

    console.log('✅ Filtered delivery slots:', filtered.length);
    return filtered;
  }, [deliverySlots]);

  // Get default address for delivery
  const getDefaultAddress = () => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        return {
      id: defaultAddress.id,
      title: defaultAddress.title,
      district: defaultAddress.district,
      neighborhood: defaultAddress.neighborhood,
      street: defaultAddress.street,
      buildingNo: defaultAddress.buildingNo,
      floor: defaultAddress.floor,
      apartmentNo: defaultAddress.apartmentNo,
      description: defaultAddress.description,
      icon: defaultAddress.icon,
      isDefault: defaultAddress.isDefault,
        };
      }
    }
    // Fallback address
    return {
    id: 'local-default',
    title: 'Default',
      district: 'Beylikdüzü',
      neighborhood: 'Kavaklı',
      street: 'Default Street',
      buildingNo: '1',
      floor: '1',
      apartmentNo: '1',
      description: 'Default address',
    icon: '',
    isDefault: true,
    };
  };

  const handleIncrement = (productId: number) => {
    dispatch(increment(productId));
  };

  const handleDecrement = (productId: number) => {
    dispatch(decrement(productId));
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear your cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          onPress: () => dispatch(clearCart()),
          style: "destructive"
        }
      ]
    );
  };

  const handleDeliveryTimeSelect = (time: DeliveryTimeSlot) => {
    setSelectedDeliveryTime(time);
  };

  const handleCreateOrder = () => {
    if (!selectedDeliveryTime) {
      Alert.alert('Uyarı', 'Lütfen teslimat saati seçiniz.');
      return;
    }
    setShowOrderConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    // Validation checks
    if (!selectedDeliveryTime) {
      Alert.alert('Error', 'Please select a delivery time');
      return;
    }

    if (!items || items.length === 0) {
      Alert.alert('Error', 'Your cart is empty. Please add items before placing an order.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated. Please log in again.');
      return;
    }

    const deliveryAddress = getDefaultAddress();
    
    // Validate delivery address
    if (!deliveryAddress || !deliveryAddress.id || deliveryAddress.id === 'local-default') {
      Alert.alert('Error', 'Please add a valid delivery address before placing an order.');
      return;
    }

    console.log('🛒 Starting order creation with:', { 
      items: items.length, 
      total, 
      deliveryAddress: deliveryAddress.id, 
      selectedDeliveryTime: selectedDeliveryTime.label,
      userId: user.id 
    });
    
    try {
      // Try to create order using simplified service
      console.log('📞 Calling simpleDataService.createOrder...');
      const apiOrder = await simpleDataService.createOrder({
        userId: user.id, // Include userId
        items,
        total,
        deliveryAddress,
        deliveryTime: selectedDeliveryTime,
        paymentMethod: 'cash_on_delivery',
      });
      console.log('✅ Simple order created:', apiOrder);

      if (apiOrder) {
        // Order is already saved to Firestore, add to Redux for viewing
        console.log('✅ Order saved to Firestore successfully');
        
        // Add order to Redux state so user can see it in Orders screen
        dispatch(addOrderFromFirestore(apiOrder));
        
        // Success flow
        setShowOrderConfirmModal(false);
        
        Alert.alert(
          'Order Confirmed!', 
          'Your order has been placed successfully. You can track it in the Orders section.',
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(clearCart());
                dispatch(clearCurrentOrder());
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        throw new Error('Order creation returned null/undefined');
      }
    } catch (error) {
      // Enhanced error handling with specific error messages
      console.error('❌ Order creation failed:', error);
      
      let errorMessage = 'Unable to create order. Please try again.';
      let errorTitle = 'Order Failed';
      
      // Determine specific error type and message
      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase();
        
        if (errorStr.includes('network') || errorStr.includes('connection')) {
          errorTitle = 'Connection Error';
          errorMessage = 'Please check your internet connection and try again.';
        } else if (errorStr.includes('firestore') || errorStr.includes('firebase')) {
          errorTitle = 'Database Error';
          errorMessage = 'There was an issue saving your order. Please try again.';
        } else if (errorStr.includes('address') || errorStr.includes('delivery')) {
          errorTitle = 'Address Error';
          errorMessage = 'Please check your delivery address and try again.';
        } else if (errorStr.includes('items') || errorStr.includes('cart')) {
          errorTitle = 'Cart Error';
          errorMessage = 'There was an issue with your cart items. Please refresh and try again.';
        } else if (errorStr.includes('user') || errorStr.includes('auth')) {
          errorTitle = 'Authentication Error';
          errorMessage = 'Please log in again and try placing your order.';
        } else {
          errorTitle = 'Order Error';
          errorMessage = `Order creation failed: ${error.message}`;
        }
      }
      
      // Log detailed error information for debugging
      console.error('❌ Detailed error info:', {
        error: error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        orderData: {
          itemsCount: items.length,
          total,
          deliveryAddressId: deliveryAddress.id,
          userId: user?.id,
          deliveryTime: selectedDeliveryTime.label
        }
      });
      
      Alert.alert(
        errorTitle,
        errorMessage,
        [
          { text: 'OK' },
          { 
            text: 'Retry', 
            onPress: () => {
              // Allow user to retry the order
              handleConfirmOrder();
            }
          }
        ]
      );
    }
  };

  const OrderConfirmModal = () => {
    // Toplam ürün sayısını hesapla (her ürünün miktarını topla)
    const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return (
      <Modal
        visible={showOrderConfirmModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Icon name="check-circle" size={60} color={Colors.primary} />
              </View>
              <Text style={styles.modalTitle}>Siparişi Onayla</Text>
              <Text style={styles.modalSubtitle}>
                Sipariş detaylarını kontrol edin
              </Text>
            </View>

            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Icon name="package-variant" size={20} color="#6b7280" />
                <Text style={styles.summaryLabel}>Ürün Sayısı</Text>
                <Text style={styles.summaryValue}>{totalItemCount} ürün</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Icon name="map-marker" size={20} color="#6b7280" />
                <Text style={styles.summaryLabel}>Teslimat Adresi</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {getDefaultAddress().neighborhood}
                </Text>
              </View>
              
              {selectedDeliveryTime && (
                <View style={styles.summaryRow}>
                  <Icon name="clock-outline" size={20} color="#6b7280" />
                  <Text style={styles.summaryLabel}>Teslimat Saati</Text>
                  <Text style={styles.summaryValue}>
                    {selectedDeliveryTime.date} - {selectedDeliveryTime.label} {selectedDeliveryTime.timeRange}
                  </Text>
                </View>
              )}
              
              <View style={styles.summaryRow}>
                <Icon name="credit-card" size={20} color="#6b7280" />
                <Text style={styles.summaryLabel}>Ödeme</Text>
                <Text style={styles.summaryValue}>Kapıda Ödeme</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Toplam Tutar</Text>
                <Text style={styles.totalValue}>{total.toFixed(2)} TL</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowOrderConfirmModal(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmButton, isCreatingOrder && styles.confirmButtonDisabled]}
                onPress={handleConfirmOrder}
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? (
                  <LoadingSpinner size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Siparişi Onayla</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <CustomToolbar
        title="Cart"
        showBack={true}
        showDelete={true}
        onBackPress={handleBackPress}
        onDeletePress={handleDeletePress}
      />
      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedItems).map((categoryName) => (
          <View key={categoryName} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{categoryName}</Text>
            {groupedItems[categoryName].map((item) => (
              <CartItem
                key={item.product.product_id}
                product={item.product}
                quantity={item.quantity}
                onIncrement={() => handleIncrement(item.product.product_id)}
                onDecrement={() => handleDecrement(item.product.product_id)}
              />
            ))}
          </View>
        ))}
        
        {items.length > 0 && (
          <>
            <SelectedAddressCard address={getDefaultAddress()} />
            <DeliveryTimeSelector
              selectedTime={selectedDeliveryTime}
              onTimeSelect={handleDeliveryTimeSelect}
              deliverySlots={filteredDeliverySlots}
              loading={slotsLoading}
            />
            <PaymentMethodSelector />
          </>
        )}
      </ScrollView>
      
      {items.length > 0 && (
        <View style={styles.bottomSection}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Toplam Tutar:</Text>
            <Text style={styles.totalAmount}>{total.toFixed(2)} TL</Text>
          </View>
          
          <TouchableOpacity
            style={styles.orderButton}
            onPress={handleCreateOrder}
          >
            <Icon name="shopping" size={20} color={Colors.white} />
            <Text style={styles.orderButtonText}>Siparişi Oluştur</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <OrderConfirmModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
    marginTop: 16,
  },
  categorySection: {
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  bottomSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  orderButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  orderButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  orderSummary: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  summaryLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'right',
    flex: 1,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    backgroundColor: '#f9fafb',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'right',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default CartScreen;