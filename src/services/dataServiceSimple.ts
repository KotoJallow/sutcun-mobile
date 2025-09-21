import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy } from 'firebase/firestore';
import { CartItem } from '../redux/cartSlice';
import { Order } from '../redux/orderSlice';
import { DeliveryTimeSlot } from '../constants/deliveryTimes';
import { Address } from '../redux/userSlice';

// Simplified Data Service for Order Creation
class SimpleDataService {
  async createOrder(orderData: {
    items: CartItem[];
    total: number;
    deliveryAddress: Address;
    deliveryTime: DeliveryTimeSlot;
    paymentMethod: string;
  }): Promise<Order | null> {
    console.log('🔄 [SIMPLE] Creating order with data:', {
      itemsCount: orderData.items.length,
      total: orderData.total,
      addressId: orderData.deliveryAddress.id,
      deliveryTime: orderData.deliveryTime.label
    });
    
    try {
      const ordersRef = collection(db, 'orders');
      
      // Create simple order document
      const orderDoc = await addDoc(ordersRef, {
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        status: 'pending',
        items: orderData.items.map(item => ({
          productId: item.product.product_id,
          productName: item.product.product_name,
          price: item.product.price,
          quantity: item.quantity
        })),
        total: orderData.total,
        deliveryAddress: {
          id: orderData.deliveryAddress.id,
          title: orderData.deliveryAddress.title,
          district: orderData.deliveryAddress.district,
          neighborhood: orderData.deliveryAddress.neighborhood,
          street: orderData.deliveryAddress.street,
          buildingNo: orderData.deliveryAddress.buildingNo,
          floor: orderData.deliveryAddress.floor,
          apartmentNo: orderData.deliveryAddress.apartmentNo
        },
        deliveryTime: orderData.deliveryTime.label,
        paymentMethod: orderData.paymentMethod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ [SIMPLE] Order created with ID:', orderDoc.id);
      
      // Return simplified order
      return {
        id: orderDoc.id,
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        status: 'pending',
        items: orderData.items,
        total: orderData.total,
        deliveryAddress: orderData.deliveryAddress,
        deliveryTime: orderData.deliveryTime,
        paymentMethod: orderData.paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ [SIMPLE] Order creation failed:', error);
      throw error;
    }
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    console.log('📍 [SIMPLE] Fetching addresses for userId:', userId);
    
    try {
      const addressesRef = collection(db, 'addresses');
      const q = query(addressesRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      console.log('📍 [SIMPLE] Found', snapshot.docs.length, 'addresses');
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          district: data.district || '',
          neighborhood: data.neighborhood || '',
          street: data.street || '',
          buildingNo: data.buildingNo || '',
          floor: data.floor || '',
          apartmentNo: data.apartmentNo || '',
          description: data.description || '',
          icon: data.icon || 'home',
          isDefault: data.isDefault || false
        };
      });
      
    } catch (error) {
      console.error('❌ [SIMPLE] Failed to fetch addresses:', error);
      return [];
    }
  }
}

export const simpleDataService = new SimpleDataService();
