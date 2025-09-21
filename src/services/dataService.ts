import { apiService } from './api';
import { Product, getProductsByLocation, getProductsByCategory, getDefaultProducts } from '../constants/dummyData';
import { DeliveryTimeSlot, getAvailableDeliverySlots } from '../constants/deliveryTimes';
import { Order } from '../redux/orderSlice';
import { CartItem } from '../redux/cartSlice';
import { Address } from '../redux/userSlice';
import { CONFIG } from '../config/appConfig';

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
        const response = await apiService.getProducts(params);
        if (response.success) {
          this.setCache(cacheKey, response.data.products);
          return response.data.products;
        }
      }
    } catch (error) {
      console.warn('API call failed, falling back to dummy data:', error);
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
      if (this.isOnline) {
        const response = await apiService.getProductById(id);
        if (response.success) {
          this.setCache(cacheKey, response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.warn('API call failed, falling back to dummy data:', error);
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
      if (this.isOnline) {
        const response = await apiService.getDeliverySlots(params);
        if (response.success) {
          this.setCache(cacheKey, response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.warn('API call failed, falling back to dummy data:', error);
    }

    // Fallback to dummy data
    return getAvailableDeliverySlots(params.district, params.neighborhood);
  }

  // Order Services
  async createOrder(orderData: {
    items: CartItem[];
    total: number;
    deliveryAddress: Order['deliveryAddress'];
    deliveryTime: DeliveryTimeSlot;
    paymentMethod: Order['paymentMethod'];
  }): Promise<Order | null> {
    try {
      if (this.isOnline) {
        const response = await apiService.createOrder(orderData);
        if (response.success) {
          return response.data;
        }
      }
    } catch (error) {
      console.warn('API call failed, creating local order:', error);
    }

    // Fallback: Create local order (this would be stored locally)
    const localOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      status: 'pending',
      items: orderData.items,
      total: orderData.total,
      deliveryAddress: orderData.deliveryAddress,
      deliveryTime: orderData.deliveryTime,
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return localOrder;
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
      if (this.isOnline) {
        const response = await apiService.getOrders(params);
        if (response.success) {
          this.setCache(cacheKey, response.data.orders);
          return response.data.orders;
        }
      }
    } catch (error) {
      console.warn('API call failed, falling back to local storage:', error);
    }

    // Fallback: Return empty array (in real app, you'd get from local storage)
    return [];
  }

  // Address Services
  async getUserAddresses(): Promise<Address[]> {
    const cacheKey = this.getCacheKey('user-addresses');
    
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      if (this.isOnline) {
        const response = await apiService.getUserAddresses();
        if (response.success) {
          this.setCache(cacheKey, response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.warn('API call failed, falling back to local storage:', error);
    }

    // Fallback: Return empty array (in real app, you'd get from local storage)
    return [];
  }

  async addUserAddress(addressData: Omit<Address, 'id'>): Promise<Address | null> {
    try {
      if (this.isOnline) {
        const response = await apiService.addUserAddress(addressData);
        if (response.success) {
          // Clear cache
          this.cache.delete(this.getCacheKey('user-addresses'));
          return response.data;
        }
      }
    } catch (error) {
      console.warn('API call failed, adding local address:', error);
    }

    // Fallback: Create local address
    const localAddress: Address = {
      ...addressData,
      id: Date.now().toString(),
    };

    return localAddress;
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
