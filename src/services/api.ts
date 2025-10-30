import axios from 'axios';
import { Product, Offer, CartItem, ShippingDetails } from '../types';

// Set up a base instance for axios
// *** FIX: Add the 'export' keyword here ***
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add a request interceptor to include the auth token if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    // Correctly set the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  // Handle request error
  return Promise.reject(error);
});


// Add a response interceptor for handling common errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., clear token, redirect to login
      console.error("Unauthorized request - potentially expired token.");
      localStorage.removeItem('authToken'); // Clear potentially invalid token
      // Optionally redirect:
      // if (window.location.pathname !== '/login') { // Avoid redirect loop
      //   window.location.href = '/login';
      // }
    }
    // Re-throw the error to be caught by the calling function
    return Promise.reject(error);
  }
);

// Keep the existing api object if preferred, ensuring it uses the exported apiClient
export const api = {
  getProducts: async (category?: string): Promise<Product[]> => {
    const response = await apiClient.get('/products', {
      params: { category: category && category !== 'all' ? category : undefined },
    });
    return response.data;
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
         return undefined;
      }
      throw error;
    }
  },

  getActiveOffer: async (): Promise<Offer> => {
     try {
        const response = await apiClient.get('/offer/active');
        return response.data;
     } catch (error) {
        console.error("Error fetching active offer:", error);
        throw error;
     }
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    if (!query.trim()) {
        return [];
    }
    const response = await apiClient.get('/products/search', {
      params: { q: query },
    });
    return response.data;
  },

  subscribeToNewsletter: async (email: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    return response.data;
  },

  placeOrder: async (orderDetails: {
    cartItems: CartItem[],
    shippingDetails: ShippingDetails,
    subtotal: number,
    shippingCost: number,
    total: number,
    paymentMethod: string
  }): Promise<{ success: boolean, orderId: string }> => {
    const response = await apiClient.post('/orders/place', orderDetails);
    return response.data;
  },

  // === Admin Functions ===
  addProduct: async (productData: Omit<Product, 'id' | 'popularity'>): Promise<Product> => {
    const response = await apiClient.post('/admin/products', productData);
    return response.data;
  },

  updateProduct: async (productId: string, productData: Partial<Product>): Promise<Product | null> => {
    const response = await apiClient.put(`/admin/products/${productId}`, productData);
    return response.data;
  },

  deleteProduct: async (productId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/admin/products/${productId}`);
    return response.data;
  }
};