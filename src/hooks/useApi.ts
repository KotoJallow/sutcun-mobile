import { useState, useEffect, useCallback } from 'react';
import dataService from '../services/dataService';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Specific hooks for different data types
export function useProducts(params?: {
  district?: string;
  neighborhood?: string;
  categoryId?: number;
  page?: number;
  limit?: number;
}) {
  return useApi(
    () => dataService.getProducts(params),
    [params?.district, params?.neighborhood, params?.categoryId, params?.page, params?.limit]
  );
}

export function useProduct(id: number) {
  return useApi(
    () => dataService.getProductById(id),
    [id]
  );
}

export function useDeliverySlots(params: {
  district: string;
  neighborhood: string;
  date?: string;
}) {
  return useApi(
    () => dataService.getDeliverySlots(params),
    [params.district, params.neighborhood, params.date]
  );
}

export function useOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useApi(
    () => dataService.getOrders(params),
    [params?.page, params?.limit, params?.status]
  );
}

export function useUserAddresses() {
  return useApi(() => dataService.getUserAddresses());
}

// Hook for mutations (create, update, delete operations)
export function useMutation<T, P>(
  mutationFn: (params: P) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 useMutation: Calling mutation function with params:', params);
      const result = await mutationFn(params);
      console.log('✅ useMutation: Mutation successful, result:', result);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('❌ useMutation: Mutation failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return {
    data,
    loading,
    error,
    mutate,
  };
}

// Specific mutation hooks
export function useCreateOrder() {
  return useMutation(dataService.createOrder);
}

export function useAddAddress() {
  return useMutation(dataService.addUserAddress);
}

export function useDeleteAddress() {
  return useMutation(dataService.deleteUserAddress);
}

export function useCategories() {
  return useApi(() => dataService.getCategories());
}

export function useUserProfile(userId: string) {
  return useApi(() => dataService.getUserProfile(userId), [userId]);
}

export function useUpdateUserProfile() {
  return useMutation(dataService.updateUserProfile);
}
