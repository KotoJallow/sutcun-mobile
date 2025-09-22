import { apiService } from './api';
import { Product, getProductsByLocation, getProductsByCategory, getDefaultProducts } from '../constants/dummyData';
import { DeliveryTimeSlot, getAvailableDeliverySlots } from '../constants/deliveryTimes';
import { Order } from '../redux/orderSlice';
import { CartItem } from '../redux/cartSlice';
import { Address } from '../redux/userSlice';
import { CONFIG } from '../config/appConfig';
import { db } from '../firebase/firebaseConfig';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';

// Data Service Class
class DataService {
  private isOnline: boolean = true;
  private cache: Map<string, any> = new Map();

  constructor() {
    // Check network connectivity
    this.checkNetworkStatus();
  }

  private checkNetworkStatus() {
    // In a real app, you would use NetInfo or similar
    // For now, we'll assume we're always online
    this.isOnline = true;
  }

  private getCacheKey(service: string, params: any = {}): string {
    return `${service}_${JSON.stringify(params)}`;
  }

  private setCache(key: string, data: any, ttl: number = CONFIG.CACHE_TTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // Product Services
  async getProducts(params?: {
    district?: string;
    neighborhood?: string;
    categoryId?: number;
    page?: number;
    limit?: number;
  }): Promise<Product[]> {
    const cacheKey = this.getCacheKey('products', params);
    
    // Try cache first
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      if (this.isOnline && CONFIG.USE_API) {
        // Use Firestore instead of API
        const productsRef = collection(db, 'products');
        let q = query(productsRef);

        // Apply filters
        if (params?.district) {
          q = query(q, where('district_name', '==', params.district));
        }
        if (params?.neighborhood) {
          q = query(q, where('neighborhood_name', '==', params.neighborhood));
        }
        if (params?.categoryId) {
          q = query(q, where('category_id', '==', params.categoryId));
        }

        // Apply pagination
        if (params?.limit) {
          q = query(q, limit(params.limit));
        }

        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => {
          const data = doc.data();
          const { createdAt, updatedAt, ...productData } = data;
          return {
            ...productData,
            product_id: productData.product_id || parseInt(doc.id),
            /*/ Ensure no timestamp fields are included
            createdAt: undefined,
            updatedAt: undefined, */
          };
        }) as unknown as Product[];

        this.setCache(cacheKey, products);
        return products;
      }
    } catch (error) {
      console.warn('Firestore call failed, falling back to dummy data:', error);
    }

    // Fallback to dummy data
    if (params?.district && params?.neighborhood) {
      return getProductsByLocation(params.district, params.neighborhood);
    } else if (params?.categoryId) {
      return getProductsByCategory(params.categoryId, params.district, params.neighborhood);
    } else {
      return getDefaultProducts();
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    const cacheKey = this.getCacheKey('product', { id });
    
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      if (this.isOnline && CONFIG.USE_API) {
        // Use Firestore instead of API
        const productRef = doc(db, 'products', id.toString());
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const data = productSnap.data();
          const { createdAt, updatedAt, ...productData } = data;
          const product = { 
            ...productData,
            product_id: productData.product_id || parseInt(productSnap.id),
            /*/ Ensure no timestamp fields are included
            createdAt: undefined,
            updatedAt: undefined, */
          } as unknown as Product;
          this.setCache(cacheKey, product);
          return product;
        }
      }
    } catch (error) {
      console.warn('Firestore call failed, falling back to dummy data:', error);
    }

    // Fallback to dummy data
    const allProducts = getDefaultProducts();
    return allProducts.find(product => product.product_id === id) || null;
  }

  // Delivery Services
  async getDeliverySlots(params: {
    district: string;
    neighborhood: string;
    date?: string;
  }): Promise<DeliveryTimeSlot[]> {
    const cacheKey = this.getCacheKey('delivery-slots', params);
    
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      if (this.isOnline && CONFIG.USE_API) {
        console.log('🕐 Fetching delivery slots from Firestore:', params);
  // Use Firestore instead of API
  // Note: This query filters by `district`, `neighborhood`, `date` and orders by `startTime`.
  // Firestore requires a composite index for this combination of where + orderBy. A
  // `firestore.indexes.json` has been added to the project root with the required
  // composite index. You can also create the index from the Firebase Console:
  // https://console.firebase.google.com/v1/r/project/sutcundev/firestore/indexes?create_composite
  const slotsRef = collection(db, 'deliveryTimeSlots');
        let q = query(slotsRef);

        // Apply filters
        if (params.district) {
          q = query(q, where('district', '==', params.district));
        }
        if (params.neighborhood) {
          q = query(q, where('neighborhood', '==', params.neighborhood));
        }
        if (params.date) {
          q = query(q, where('date', '==', params.date));
        }

        // Order by time
        q = query(q, orderBy('startTime', 'asc'));

        const snapshot = await getDocs(q);
        const slots = snapshot.docs.map(doc => {
          const data = doc.data();
          const { createdAt, updatedAt, ...slotData } = data;
          return {
            id: doc.id,
            ...slotData
          };
        }) as DeliveryTimeSlot[];

        this.setCache(cacheKey, slots);
        console.log('✅ Delivery slots fetched:', slots.length);
        return slots;
      }
    } catch (error) {
      console.warn('Firestore call failed, falling back to dummy data:', error);
    }

    // Fallback to dummy data
    return getAvailableDeliverySlots(params.district, params.neighborhood);
  }

  // Category Services
  async getCategories(): Promise<any[]> {
    const cacheKey = this.getCacheKey('categories');
    
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      if (this.isOnline && CONFIG.USE_API) {
        console.log('📦 Fetching categories from Firestore');
        const categoriesRef = collection(db, 'categories');
        const q = query(categoriesRef, orderBy('name', 'asc'));
        
        const snapshot = await getDocs(q);
        const categories = snapshot.docs.map(doc => {
          const data = doc.data();
          const { createdAt, updatedAt, ...categoryData } = data;
          return {
            id: doc.id,
            ...categoryData
          };
        });

        this.setCache(cacheKey, categories);
        console.log('✅ Categories fetched:', categories.length);
        return categories;
      }
    } catch (error) {
      console.warn('Firestore call failed for categories:', error);
    }

    // Fallback to dummy categories (will be removed later)
    return [
      { id: '1', name: 'Dairy', icon: 'milk', category_id: 1 },
      { id: '2', name: 'Fruits', icon: 'apple', category_id: 2 },
      { id: '3', name: 'Vegetables', icon: 'carrot', category_id: 3 },
      { id: '4', name: 'Meat', icon: 'food-drumstick', category_id: 4 },
      { id: '5', name: 'Bakery', icon: 'bread-slice', category_id: 5 },
    ];
  }

  // Order Services
  async createOrder(orderData: {
    userId: string;
    items: CartItem[];
    total: number;
    deliveryAddress: Order['deliveryAddress'];
    deliveryTime: DeliveryTimeSlot;
    paymentMethod: Order['paymentMethod'];
  }): Promise<Order | null> {
    console.log('🔄 Creating order with data:', orderData);
    console.log('🔄 Order items:', orderData.items);
    console.log('🔄 Order total:', orderData.total);
    console.log('🔄 Delivery address:', orderData.deliveryAddress);
    console.log('🔄 Delivery time:', orderData.deliveryTime);
    console.log('🔄 Payment method:', orderData.paymentMethod);
    
    try {
      if (this.isOnline && CONFIG.USE_API) {
        console.log('✅ Online and API enabled, creating order in Firestore');
        // Use Firestore instead of API
        const ordersRef = collection(db, 'orders');
        
        // Clean items to ensure no non-serializable data
        const cleanItems = orderData.items.map(item => ({
          product: {
            product_id: item.product.product_id,
            product_name: item.product.product_name,
            price: item.product.price,
            image: item.product.image,
            category_id: item.product.category_id,
            category_name: item.product.category_name,
            category_icon: item.product.category_icon,
            district_name: item.product.district_name,
            neighborhood_name: item.product.neighborhood_name,
            unit: item.product.unit,
            stock_quantity: item.product.stock_quantity || 0,
            created_at: item.product.created_at || new Date().toISOString(),
          },
          quantity: item.quantity,
        }));
        
        console.log('🔄 Clean items for Firestore:', cleanItems);
        
        // Serialize delivery address to ensure no non-serializable data
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
        
        const serializableDeliveryAddress = serializeDates(orderData.deliveryAddress);
        console.log('🔄 Serialized delivery address:', serializableDeliveryAddress);
        
        const orderDoc = await addDoc(ordersRef, {
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          status: 'pending',
          userId: orderData.userId,
          items: cleanItems,
          total: orderData.total,
          deliveryAddress: serializableDeliveryAddress,
          deliveryTime: orderData.deliveryTime,
          paymentMethod: orderData.paymentMethod,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('✅ Order created in Firestore with ID:', orderDoc.id);

        // Return the created order
        const order: Order = {
          id: orderDoc.id,
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString(),
          status: 'pending',
          userId: orderData.userId,
          items: cleanItems, // Use cleaned items instead of original
          total: orderData.total,
          deliveryAddress: serializableDeliveryAddress, // Use serialized address
          deliveryTime: orderData.deliveryTime,
          paymentMethod: orderData.paymentMethod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return order;
      }
    } catch (error) {
      console.error('Firestore call failed:', error);
      throw new Error('Unable to create order. Please check your internet connection and try again.');
    }

    // No fallback for order creation - orders must be created on server
    if (!CONFIG.USE_API) {
      throw new Error('Order creation is not available in offline mode. Please enable API mode.');
    }

    throw new Error('Unable to create order. Please try again later.');
  }

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<Order[]> {
    const cacheKey = this.getCacheKey('orders', params);
    
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      if (this.isOnline && CONFIG.USE_API) {
        // Use Firestore instead of API
        const ordersRef = collection(db, 'orders');
        let q = query(ordersRef, orderBy('createdAt', 'desc'));

        // Apply filters
        if (params?.status) {
          q = query(q, where('status', '==', params.status));
        }

        // Apply pagination
        if (params?.limit) {
          q = query(q, limit(params.limit));
        }

        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => {
          const data = doc.data();
          const { createdAt, updatedAt, ...orderData } = data;
          return {
            id: doc.id,
            ...orderData,
            createdAt: new Date().toISOString(), // Convert to serializable string
            updatedAt: new Date().toISOString()  // Convert to serializable string
          };
        }) as Order[];

        this.setCache(cacheKey, orders);
        return orders;
      }
    } catch (error) {
      console.error('Firestore call failed:', error);
      throw new Error('Unable to fetch orders. Please check your internet connection and try again.');
    }

    // No fallback for orders - they must come from server
    if (!CONFIG.USE_API) {
      throw new Error('Order history is not available in offline mode. Please enable API mode.');
    }

    throw new Error('Unable to fetch orders. Please try again later.');
  }

  // Address Services
  async getUserAddresses(userId?: string): Promise<Address[]> {
    const cacheKey = this.getCacheKey('user-addresses', { userId });
    
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      if (this.isOnline && CONFIG.USE_API) {
        console.log('📍 Fetching addresses for userId:', userId);
        // Use Firestore instead of API
        const addressesRef = collection(db, 'addresses');
        let q;
        
        // Filter by user ID if provided
        if (userId) {
          q = query(addressesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        } else {
          q = query(addressesRef, orderBy('createdAt', 'desc'));
        }
        
        const snapshot = await getDocs(q);
        console.log('📍 Found', snapshot.docs.length, 'addresses in Firestore');
        
        const addresses = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('📍 Address data:', { id: doc.id, userId: data.userId, title: data.title });
          console.log('📍 Raw address data keys:', Object.keys(data));
          console.log('📍 Raw address data:', data);

          // Convert Firestore Timestamp fields to ISO strings (safe for Redux)
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

          const { createdAt, updatedAt, userId, ...addressData } = data;
          const serializableAddressData = serializeDates(addressData);

          const cleanAddress = {
            id: doc.id,
            ...serializableAddressData,
            // omit createdAt/updatedAt (they were converted if needed but not stored in Redux)
          };

          console.log('📍 Final address object:', cleanAddress);
          return cleanAddress;
        }) as unknown as Address[];

        console.log('📍 Returning', addresses.length, 'addresses');
        this.setCache(cacheKey, addresses);
        return addresses;
      }
    } catch (error) {
      console.warn('Firestore call failed, falling back to local storage:', error);
    }

    // Fallback: Return empty array (in real app, you'd get from local storage)
    return [];
  }

  async addUserAddress(addressData: Omit<Address, 'id'>, userId?: string): Promise<Address | null> {
    try {
      if (this.isOnline && CONFIG.USE_API) {
        // Use Firestore instead of API
        const addressesRef = collection(db, 'addresses');
        const addressDoc = await addDoc(addressesRef, {
          ...addressData,
          userId: userId || 'anonymous',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Ensure the stored document contains its generated id field (some callers expect id inside the doc)
        try {
          await updateDoc(addressDoc, { id: addressDoc.id });
        } catch (e) {
          console.warn('Could not write id field back to address document:', e);
        }

        // Clear cache for this user's addresses (use same cache key shape as getUserAddresses)
        this.cache.delete(this.getCacheKey('user-addresses', { userId }));

        // Return the created address (timestamps generated server-side; return serializable shape)
        const address: Address = {
          id: addressDoc.id,
          ...addressData
        };

        return address;
      }
    } catch (error) {
      console.warn('Firestore call failed, adding local address:', error);
    }

    // Fallback: Create local address
    const localAddress: Address = {
      ...addressData,
      id: Date.now().toString(),
    };

    return localAddress;
  }

  async deleteUserAddress(addressId: string): Promise<boolean> {
    try {
      if (this.isOnline && CONFIG.USE_API) {
        // Use Firestore instead of API
        const addressRef = doc(db, 'addresses', addressId);
        await deleteDoc(addressRef);
        
        // Clear cache
        this.cache.delete(this.getCacheKey('user-addresses'));
        
        console.log('✅ Address deleted from Firestore:', addressId);
        return true;
      }
    } catch (error) {
      console.error('❌ Error deleting address from Firestore:', error);
      return false;
    }
    
    // Fallback: Return false (can't delete without database)
    return false;
  }

  // User Services
  async getUserProfile(userId: string): Promise<any | null> {
    try {
      if (this.isOnline && CONFIG.USE_API) {
        console.log('👤 Fetching user profile from Firestore:', userId);
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          const { createdAt, updatedAt, ...userData } = data;
          const user = {
            id: userSnap.id,
            ...userData
          };
          console.log('✅ User profile fetched:', user);
          return user;
        }
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
    }
    
    return null;
  }

  async updateUserProfile(userId: string, userData: any): Promise<boolean> {
    try {
      if (this.isOnline && CONFIG.USE_API) {
        console.log('👤 Updating user profile in Firestore:', userId);
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          ...userData,
          updatedAt: serverTimestamp()
        });
        
        console.log('✅ User profile updated successfully');
        return true;
      }
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
    }
    
    return false;
  }

  // Utility methods
  clearCache() {
    this.cache.clear();
  }

  setOnlineStatus(isOnline: boolean) {
    this.isOnline = isOnline;
  }
}

// Create data service instance
export const dataService = new DataService();

// Export for use in components
export default dataService;
