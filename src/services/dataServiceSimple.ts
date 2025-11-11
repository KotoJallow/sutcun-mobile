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
        deliveryTime: {
          ...orderData.deliveryTime,
        },
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
      
      const allAddresses = snapshot.docs.map(doc => {
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
      
      // Filter out empty addresses (addresses with empty required fields)
      const validAddresses = allAddresses.filter(address => {
        const isEmpty = !address.street?.trim() || 
                       !address.buildingNo?.trim() || 
                       !address.floor?.trim() || 
                       !address.apartmentNo?.trim();
        return !isEmpty;
      });
      
      console.log('📍 [SIMPLE] Filtered to', validAddresses.length, 'valid addresses');
      return validAddresses;
      
    } catch (error) {
      console.error('❌ [SIMPLE] Failed to fetch addresses:', error);
      return [];
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    console.log('📋 [SIMPLE] Fetching orders for userId:', userId);
    
    try {
      const ACTIVE_STATUSES = new Set(['pending', 'confirmed', 'preparing', 'out_for_delivery']);

      const toLowerString = (value: any) => {
        if (typeof value === 'string') {
          return value.toLowerCase();
        }
        if (value === null || value === undefined) {
          return '';
        }
        return String(value).toLowerCase();
      };

      const parseDateValue = (value: any): Date | null => {
        if (!value) {
          return null;
        }
        if (value instanceof Date) {
          return Number.isNaN(value.getTime()) ? null : value;
        }
        if (typeof value === 'object' && typeof value.toDate === 'function') {
          try {
            const date = value.toDate();
            return Number.isNaN(date.getTime()) ? null : date;
          } catch (error) {
            console.warn('⚠️ [SIMPLE] Failed to convert Firestore timestamp to Date:', error);
            return null;
          }
        }
        if (typeof value === 'number') {
          const date = new Date(value);
          return Number.isNaN(date.getTime()) ? null : date;
        }
        if (typeof value === 'string') {
          const trimmed = value.trim();
          if (!trimmed) {
            return null;
          }
          const turkishDatePattern = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/;
          const match = turkishDatePattern.exec(trimmed);
          if (match) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);
            if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
              const date = new Date(year < 100 ? 2000 + year : year, month - 1, day);
              return Number.isNaN(date.getTime()) ? null : date;
            }
          }
          const parsed = new Date(trimmed);
          return Number.isNaN(parsed.getTime()) ? null : parsed;
        }
        return null;
      };

      const extractStartTime = (deliveryTime: any): { hours: number; minutes: number } => {
        const mapLabelToStart = (label?: string) => {
          if (!label) return undefined;
          const normalized = label.toLowerCase();
          if (normalized.includes('sabah') || normalized.includes('morning')) return '09:00';
          if (normalized.includes('öğleden') || normalized.includes('afternoon')) return '13:00';
          if (normalized.includes('akşam') || normalized.includes('evening')) return '18:00';
          if (normalized.includes('gece') || normalized.includes('night')) return '21:00';
          return undefined;
        };

        const candidates: Array<string | undefined> = [];
        if (deliveryTime) {
          if (typeof deliveryTime.timeRange === 'string') candidates.push(deliveryTime.timeRange);
          if (typeof deliveryTime.timerange === 'string') candidates.push(deliveryTime.timerange);
          if (typeof deliveryTime.time_range === 'string') candidates.push(deliveryTime.time_range);
          if (typeof deliveryTime.startTime === 'string') candidates.push(deliveryTime.startTime);
          if (typeof deliveryTime.start_time === 'string') candidates.push(deliveryTime.start_time);
          candidates.push(mapLabelToStart(deliveryTime.label));
        }

        const timeString = candidates.find(candidate => typeof candidate === 'string' && candidate.trim().length > 0);
        if (!timeString) {
          return { hours: 0, minutes: 0 };
        }

        const normalized = timeString.replace('–', '-').trim();
        const parts = normalized.includes('-')
          ? normalized.split('-').map(part => part.trim())
          : [normalized];

        const [start] = parts;
        if (!start || !start.includes(':')) {
          return { hours: 0, minutes: 0 };
        }

        const [hourStr, minuteStr] = start.split(':');
        const hours = parseInt(hourStr, 10);
        const minutes = parseInt(minuteStr ?? '0', 10);

        return {
          hours: Number.isNaN(hours) ? 0 : hours,
          minutes: Number.isNaN(minutes) ? 0 : minutes,
        };
      };

      const computeDeliveryDate = (orderData: any): Date | null => {
        if (!orderData) {
          return null;
        }

        const deliveryTime = orderData.deliveryTime || orderData.deliverySlot || orderData.slot;
        const dateCandidates = [
          deliveryTime?.date,
          deliveryTime?.dateString,
          deliveryTime?.date_string,
          orderData.deliveryDate,
          orderData.delivery_date,
          orderData.date,
          orderData.createdAt,
          orderData.created_at,
        ];

        const dateValue = dateCandidates.reduce<Date | null>((selected, candidate) => {
          if (selected) return selected;
          return parseDateValue(candidate);
        }, null);

        if (!dateValue) {
          return null;
        }

        const { hours, minutes } = extractStartTime(deliveryTime);
        dateValue.setHours(hours, minutes, 0, 0);
        return dateValue;
      };

      const shouldExcludeOrder = (orderData: any) => {
        const status = toLowerString(orderData.status);
        if (!ACTIVE_STATUSES.has(status)) {
          return false;
        }
        const deliveryDate = computeDeliveryDate(orderData);
        if (!deliveryDate) {
          return false;
        }
        return deliveryDate.getTime() < Date.now();
      };

      const ordersRef = collection(db, 'orders');
      // Filter orders by userId
      const q = query(ordersRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      console.log('📋 [SIMPLE] Found', snapshot.docs.length, 'orders for user:', userId);
      
      return snapshot.docs
        .map(doc => {
          const data = doc.data();
          const deliveryTimeData = data.deliveryTime;
          const deliveryTime = typeof deliveryTimeData === 'object' && deliveryTimeData !== null
            ? deliveryTimeData
            : {
                date: data.deliveryDate || data.date || null,
                timeRange: data.deliveryTimeRange || null,
                label: typeof deliveryTimeData === 'string' ? deliveryTimeData : null,
              };

          const items = Array.isArray(data.items) ? data.items.map((item: any) => {
            const quantity = item.quantity || item.qty || item.count || 1;
            const productName = item.productName || item.product_name || item.name || '';
            const product = item.product || {
              product_id: item.productId || null,
              product_name: productName,
              price: item.price,
              category_id: item.categoryId || item.category_id,
              category_name: item.categoryName || item.category_name,
            };

            return {
              product,
              quantity,
            };
          }) : [];

          const createdAtDate = parseDateValue(data.createdAt) || new Date();
          const updatedAtDate = parseDateValue(data.updatedAt) || createdAtDate;

          return {
            id: doc.id,
            orderNumber: data.orderNumber || '',
            date: createdAtDate.toISOString(),
            status: data.status || 'pending',
            userId: data.userId || userId, // Include userId
            items,
            total: data.total || 0,
            deliveryAddress: data.deliveryAddress || {},
            deliveryTime,
            paymentMethod: data.paymentMethod || 'cash_on_delivery',
            createdAt: createdAtDate.toISOString(),
            updatedAt: updatedAtDate.toISOString()
          };
        })
        .filter(order => order.userId === userId)
        .filter(order => !shouldExcludeOrder(order));
      
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
  // NOTE: This function is deprecated - we no longer create empty addresses
  // Users should add their address through the AddAddress screen
  async ensureDefaultEmptyAddress(userId: string): Promise<void> {
    console.log('🏠 [DEFAULT] Skipping empty address creation - users should add address via AddAddress screen');
    // Do nothing - we don't want to create empty addresses
    return;
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
