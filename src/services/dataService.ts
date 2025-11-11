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
      const normalizeString = (value: any): string => {
        if (typeof value === 'string') {
          return value;
        }
        if (value === null || value === undefined) {
          return '';
        }
        if (typeof value === 'number') {
          return value.toString();
        }
        if (typeof value === 'object') {
          if (typeof value.name === 'string') {
            return value.name;
          }
          if (typeof value.label === 'string') {
            return value.label;
          }
        }
        return String(value);
      };

      const hashStringToNumber = (input: string): number => {
        let hash = 0;
        for (let i = 0; i < input.length; i += 1) {
          hash = (hash << 5) - hash + input.charCodeAt(i);
          hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
      };

      const resolveNumericId = (value: any, fallback: string): number => {
        if (typeof value === 'number' && Number.isFinite(value)) {
          return value;
        }
        if (typeof value === 'string') {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) {
            return parsed;
          }
        }
        if (value && typeof value === 'object' && 'id' in value) {
          return resolveNumericId((value as any).id, fallback);
        }
        return hashStringToNumber(fallback);
      };

      const matchesLocation = (product: any, district?: string, neighborhood?: string) => {
        if (!district || !neighborhood) {
          return true;
        }

        const productDistrict = normalizeString(
          product.district_name ??
          product.district ??
          product.districtName ??
          product.location?.district
        ).toLowerCase();

        const productNeighborhood = normalizeString(
          product.neighborhood_name ??
          product.neighborhood ??
          product.neighborhoodName ??
          product.location?.neighborhood
        ).toLowerCase();

        return (
          productDistrict === district.toLowerCase() &&
          productNeighborhood === neighborhood.toLowerCase()
        );
      };

      const normalizeProduct = (rawProduct: any, docId: string) => {
        const productId = resolveNumericId(
          rawProduct.product_id ??
          rawProduct.productId ??
          rawProduct.id,
          docId
        );

        const categoryId = resolveNumericId(
          rawProduct.category_id ??
          rawProduct.categoryId ??
          rawProduct.category?.id,
          `${docId}-category`
        );

        const priceValue = typeof rawProduct.price === 'number'
          ? rawProduct.price
          : parseFloat(rawProduct.price ?? '0') || 0;

        const stockValue = typeof rawProduct.stock_quantity === 'number'
          ? rawProduct.stock_quantity
          : parseInt(rawProduct.stock_quantity ?? rawProduct.stockQuantity ?? '0', 10) || 0;

        return {
          ...rawProduct,
          product_id: productId,
          product_name: rawProduct.product_name ?? rawProduct.name ?? rawProduct.title ?? '',
          category_id: categoryId,
          category_name: normalizeString(
            rawProduct.category_name ??
            rawProduct.categoryName ??
            rawProduct.category?.name
          ),
          category_icon: normalizeString(
            rawProduct.category_icon ??
            rawProduct.categoryIcon ??
            rawProduct.category?.icon ??
            'grid'
          ),
          district_name: normalizeString(
            rawProduct.district_name ??
            rawProduct.district ??
            rawProduct.districtName ??
            rawProduct.location?.district
          ),
          neighborhood_name: normalizeString(
            rawProduct.neighborhood_name ??
            rawProduct.neighborhood ??
            rawProduct.neighborhoodName ??
            rawProduct.location?.neighborhood
          ),
          unit: normalizeString(
            rawProduct.unit ??
            rawProduct.unitName ??
            rawProduct.quantityUnit
          ),
          price: priceValue,
          stock_quantity: stockValue,
          image: rawProduct.image ?? rawProduct.imageUrl ?? rawProduct.photo ?? '',
        };
      };

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
        const normalizedProducts = snapshot.docs.map(doc => {
          const data = doc.data();
          const { createdAt, updatedAt, ...productData } = data;
          return normalizeProduct(productData, doc.id);
        }) as unknown as Product[];

        const filteredProducts = normalizedProducts.filter(product =>
          matchesLocation(product, params?.district, params?.neighborhood)
        );

        this.setCache(cacheKey, filteredProducts);
        return filteredProducts;
      }
    } catch (error) {
      console.warn('Firestore call failed, falling back to dummy data:', error);
    }

    // Fallback to dummy data
    if (params?.district && params?.neighborhood) {
      return getProductsByLocation(params.district, params.neighborhood).map(product =>
        ({
          ...product,
          product_id: product.product_id,
        })
      );
    } else if (params?.categoryId) {
      return getProductsByCategory(params.categoryId, params.district, params.neighborhood).map(product =>
        ({
          ...product,
          product_id: product.product_id,
        })
      );
    } else {
      return getDefaultProducts().map(product => ({
        ...product,
        product_id: product.product_id,
      }));
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
    userId?: string;
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
      if (!params?.userId) {
        console.warn('⚠️ [DATA] getOrders called without userId. Preventing fetch of all orders.');
        throw new Error('User ID is required to fetch orders.');
      }

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
            console.warn('⚠️ [DATA] Failed to convert Firestore timestamp to Date:', error);
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

      if (this.isOnline && CONFIG.USE_API) {
        // Use Firestore instead of API
        const ordersRef = collection(db, 'orders');
        let q = query(ordersRef, orderBy('createdAt', 'desc'));

        // Apply filters - IMPORTANT: Filter by userId if provided to prevent showing all users' orders
        if (params?.userId) {
          q = query(q, where('userId', '==', params.userId));
        }
        
        if (params?.status) {
          q = query(q, where('status', '==', params.status));
        }

        // Apply pagination
        if (params?.limit) {
          q = query(q, limit(params.limit));
        }

        const snapshot = await getDocs(q);
        const mappedOrders = snapshot.docs
        .map(doc => {
          const data = doc.data();
          const { createdAt, updatedAt, ...orderData } = data;
          const normalizedCreatedAt = parseDateValue(createdAt) || new Date();
          const normalizedUpdatedAt = parseDateValue(updatedAt) || normalizedCreatedAt;
          return {
            id: doc.id,
            ...orderData,
            createdAt: normalizedCreatedAt.toISOString(),
            updatedAt: normalizedUpdatedAt.toISOString()
          };
        }) as Order[];

        const userOrders = mappedOrders
          .filter(order => order.userId === params.userId)
          .filter(order => !shouldExcludeOrder(order));

        console.log('📋 [DATA] Returning', userOrders.length, 'orders for userId:', params.userId);
        this.setCache(cacheKey, userOrders);
        return userOrders;
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
        
        const allAddresses = snapshot.docs.map(doc => {
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

        // Filter out empty addresses (addresses with empty required fields)
        const validAddresses = allAddresses.filter(address => {
          const isEmpty = !address.street?.trim() || 
                         !address.buildingNo?.trim() || 
                         !address.floor?.trim() || 
                         !address.apartmentNo?.trim();
          return !isEmpty;
        });

        console.log('📍 Returning', validAddresses.length, 'valid addresses (filtered from', allAddresses.length, 'total)');
        this.setCache(cacheKey, validAddresses);
        return validAddresses;
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
