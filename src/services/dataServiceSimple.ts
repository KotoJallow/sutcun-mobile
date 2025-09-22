import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, getDoc, doc } from 'firebase/firestore';
import { CartItem } from '../redux/cartSlice';
import { Order } from '../redux/orderSlice';
import { DeliveryTimeSlot } from '../constants/deliveryTimes';
import { Address } from '../redux/userSlice';

// Simplified Data Service for Order Creation
class SimpleDataService {
  async createOrder(orderData: {
    userId: string;
    items: CartItem[];
    total: number;
    deliveryAddress: Address;
    deliveryTime: DeliveryTimeSlot;
    paymentMethod: string;
  }): Promise<Order | null> {
    console.log('🔄 [SIMPLE] Creating order with data:', {
      userId: orderData.userId,
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
        userId: orderData.userId, // Include userId
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
        userId: orderData.userId, // Include userId
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

  async getUserOrders(userId: string): Promise<Order[]> {
    console.log('📋 [SIMPLE] Fetching orders for userId:', userId);
    
    try {
      const ordersRef = collection(db, 'orders');
      // Filter orders by userId
      const q = query(ordersRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      console.log('📋 [SIMPLE] Found', snapshot.docs.length, 'orders for user:', userId);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          orderNumber: data.orderNumber || '',
          date: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          status: data.status || 'pending',
          userId: data.userId || userId, // Include userId
          items: data.items || [],
          total: data.total || 0,
          deliveryAddress: data.deliveryAddress || {},
          deliveryTime: data.deliveryTime || {},
          paymentMethod: data.paymentMethod || 'cash_on_delivery',
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
      });
      
    } catch (error) {
      console.error('❌ [SIMPLE] Failed to fetch orders:', error);
      return [];
    }
  }

  // Comprehensive user data loading
  async loadCompleteUserData(phoneNumber: string): Promise<{
    user: any;
    addresses: Address[];
    orders: Order[];
  } | null> {
    console.log('👤 [COMPLETE] Loading complete user data for phone:', phoneNumber);
    
    try {
      // Use phone number as entered by user (no normalization)
      const phoneToSearch = phoneNumber.trim();
      
      console.log('👤 [COMPLETE] Searching for user with phone:', phoneToSearch);
      
      // 1. Find user by phone number
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('phone', '==', phoneToSearch));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        console.log('❌ [COMPLETE] No user found with phone:', phoneNumber);
        return null;
      }
      
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      
      // Serialize user data
      const serializeDates = (obj: any) => {
        const out: any = {};
        for (const key of Object.keys(obj)) {
          const val = (obj as any)[key];
          if (val && typeof val.toDate === 'function') {
            try {
              out[key] = val.toDate().toISOString();
            } catch (e) {
              out[key] = val;
            }
          } else {
            out[key] = val;
          }
        }
        return out;
      };
      
      const serializableUserData = serializeDates(userData);
      const user = {
        id: userDoc.id,
        ...serializableUserData,
        isVerified: true
      };
      
      console.log('✅ [COMPLETE] User found:', user.id);
      
      // 2. Load user addresses
      console.log('📍 [COMPLETE] Loading addresses for user:', user.id);
      const addresses = await this.getUserAddresses(user.id);
      
      // 3. Load user orders
      console.log('📋 [COMPLETE] Loading orders for user:', user.id);
      const orders = await this.getUserOrders(user.id);
      
      console.log('✅ [COMPLETE] Complete user data loaded:', {
        userId: user.id,
        addressesCount: addresses.length,
        ordersCount: orders.length
      });
      
      return {
        user,
        addresses,
        orders
      };
      
    } catch (error) {
      console.error('❌ [COMPLETE] Failed to load complete user data:', error);
      return null;
    }
  }

  // Ensure user has default empty address
  async ensureDefaultEmptyAddress(userId: string): Promise<void> {
    console.log('🏠 [DEFAULT] Ensuring default empty address for user:', userId);
    
    try {
      const addressesRef = collection(db, 'addresses');
      const q = query(addressesRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log('🏠 [DEFAULT] No addresses found, creating default empty address');
        
        const defaultAddress = {
          title: 'Default Address',
          district: 'Beylikdüzü',
          neighborhood: 'Kavaklı',
          street: '',
          buildingNo: '',
          floor: '',
          apartmentNo: '',
          description: 'Please update your address',
          icon: 'home',
          isDefault: true,
          userId: userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await addDoc(addressesRef, defaultAddress);
        console.log('✅ [DEFAULT] Default empty address created');
      } else {
        console.log('🏠 [DEFAULT] User already has addresses:', snapshot.docs.length);
      }
      
    } catch (error) {
      console.error('❌ [DEFAULT] Failed to ensure default address:', error);
    }
  }

  // Refresh complete user data (useful for pull-to-refresh)
  async refreshCompleteUserData(userId: string): Promise<{
    user: any;
    addresses: Address[];
    orders: Order[];
  } | null> {
    console.log('🔄 [REFRESH] Refreshing complete user data for userId:', userId);
    
    try {
      // Get user data first
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        console.log('❌ [REFRESH] User not found:', userId);
        return null;
      }
      
      const userData = userDoc.data();
      const user = {
        id: userId,
        ...userData,
        isVerified: true
      };
      
      // Load fresh addresses and orders
      const addresses = await this.getUserAddresses(userId);
      const orders = await this.getUserOrders(userId);
      
      console.log('✅ [REFRESH] Complete user data refreshed:', {
        userId,
        addressesCount: addresses.length,
        ordersCount: orders.length
      });
      
      return { user, addresses, orders };
      
    } catch (error) {
      console.error('❌ [REFRESH] Failed to refresh user data:', error);
      return null;
    }
  }
}

export const simpleDataService = new SimpleDataService();
