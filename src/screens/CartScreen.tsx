import React, { useState } from 'react';
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

interface DeliveryTime {
  id: string;
  label: string;
  timeRange: string;
}

const CartScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  
  // Teslimat saati state'i - tip tanımını yukarı taşıdım
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<DeliveryTime | null>(null);
  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false);

  // Mockup data - Gerçek uygulamada Redux'tan gelecek
  const selectedAddress = {
    title: 'Evim',
    district: 'Başakşehir',
    neighborhood: 'Kayabaşı',
    street: 'Fenertepe Caddesi',
    buildingNo: '14/b',
    floor: '3',
    apartmentNo: '5',
    description: 'Taksi durağının karşısı'
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

  const handleDeliveryTimeSelect = (time: DeliveryTime) => {
    setSelectedDeliveryTime(time);
  };

  const handleCreateOrder = () => {
    if (!selectedDeliveryTime) {
      Alert.alert('Uyarı', 'Lütfen teslimat saati seçiniz.');
      return;
    }
    setShowOrderConfirmModal(true);
  };

  const handleConfirmOrder = () => {
    setShowOrderConfirmModal(false);
    Alert.alert('Başarılı', 'Siparişiniz başarıyla oluşturuldu!', [
      {
        text: 'Tamam',
        onPress: () => {
          dispatch(clearCart());
          navigation.goBack();
        }
      }
    ]);
  };

  const OrderConfirmModal = () => (
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
              <Text style={styles.summaryValue}>{items.length} ürün</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Icon name="map-marker" size={20} color="#6b7280" />
              <Text style={styles.summaryLabel}>Teslimat Adresi</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {selectedAddress.neighborhood}
              </Text>
            </View>
            
            {selectedDeliveryTime && (
              <View style={styles.summaryRow}>
                <Icon name="clock-outline" size={20} color="#6b7280" />
                <Text style={styles.summaryLabel}>Teslimat Saati</Text>
                <Text style={styles.summaryValue}>
                  {selectedDeliveryTime.label} {selectedDeliveryTime.timeRange}
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
              style={styles.confirmButton}
              onPress={handleConfirmOrder}
            >
              <Text style={styles.confirmButtonText}>Siparişi Onayla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
        {items.map((item) => (
          <CartItem
            key={item.product.product_id}
            product={item.product}
            quantity={item.quantity}
            onIncrement={() => handleIncrement(item.product.product_id)}
            onDecrement={() => handleDecrement(item.product.product_id)}
          />
        ))}
        
        {items.length > 0 && (
          <>
            <SelectedAddressCard address={selectedAddress} />
            <DeliveryTimeSelector
              selectedTime={selectedDeliveryTime}
              onTimeSelect={handleDeliveryTimeSelect}
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
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default CartScreen;