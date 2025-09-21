// Configuration file to control data source
export const CONFIG = {
  // Set to true to use API calls, false to use dummy data
  USE_API: true,
  
  // API Configuration
  API_BASE_URL: 'https://api.sutcun.com', // Replace with your actual API URL
  
  // Cache settings
  CACHE_TTL: 300000, // 5 minutes in milliseconds
  
  // Feature flags
  FEATURES: {
    ENABLE_OFFLINE_MODE: true,
    ENABLE_CACHING: true,
    ENABLE_ERROR_RETRY: true,
  }
};

// Helper function to check if API should be used
export const shouldUseAPI = () => CONFIG.USE_API;

// Helper function to get API base URL
export const getApiBaseUrl = () => CONFIG.API_BASE_URL;
