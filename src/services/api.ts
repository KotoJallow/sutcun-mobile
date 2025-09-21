// API Configuration
const API_BASE_URL = 'https://api.sutcun.com'; // Replace with actual API URL

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ProductApiResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderApiResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// API Service Class
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Product API methods
  async getProducts(params?: {
    district?: string;
    neighborhood?: string;
    categoryId?: number;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<ProductApiResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.district) queryParams.append('district', params.district);
    if (params?.neighborhood) queryParams.append('neighborhood', params.neighborhood);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ProductApiResponse>(endpoint);
  }

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories');
  }

  // Order API methods
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<OrderApiResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    
    return this.request<OrderApiResponse>(endpoint);
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Delivery API methods
  async getDeliverySlots(params: {
    district: string;
    neighborhood: string;
    date?: string;
  }): Promise<ApiResponse<DeliveryTimeSlot[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('district', params.district);
    queryParams.append('neighborhood', params.neighborhood);
    if (params.date) queryParams.append('date', params.date);

    const endpoint = `/delivery-slots?${queryParams.toString()}`;
    return this.request<DeliveryTimeSlot[]>(endpoint);
  }

  // User API methods
  async updateUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserAddresses(): Promise<ApiResponse<Address[]>> {
    return this.request<Address[]>('/user/addresses');
  }

  async addUserAddress(addressData: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    return this.request<Address>('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateUserAddress(addressId: string, addressData: Partial<Address>): Promise<ApiResponse<Address>> {
    return this.request<Address>(`/user/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  async deleteUserAddress(addressId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/user/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }
}

// Create API service instance
export const apiService = new ApiService(API_BASE_URL);

// Export types for use in other files
export interface CreateOrderRequest {
  items: CartItem[];
  total: number;
  deliveryAddress: Order['deliveryAddress'];
  deliveryTime: DeliveryTimeSlot;
  paymentMethod: Order['paymentMethod'];
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

// Import types from other files
import { Product } from '../constants/dummyData';
import { CartItem } from '../redux/cartSlice';
import { Order } from '../redux/orderSlice';
import { DeliveryTimeSlot } from '../constants/deliveryTimes';
import { Address } from '../redux/userSlice';
import { User } from '../redux/userSlice';
