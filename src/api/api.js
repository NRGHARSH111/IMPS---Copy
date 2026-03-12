// Central Axios API Configuration
import axios from 'axios';

// Create Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - Add authentication token if available
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data || '');
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          error.message = data?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          error.message = 'Unauthorized. Please login again.';
          break;
        case 403:
          error.message = 'Access forbidden. You do not have permission.';
          break;
        case 404:
          error.message = 'Resource not found.';
          break;
        case 500:
          error.message = 'Server error. Please try again later.';
          break;
        case 502:
        case 503:
          error.message = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          error.message = data?.message || `Request failed with status ${status}`;
      }
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// Mock data for development when backend is not ready
const mockData = {
  // Mock account lookup response
  accountLookup: {
    success: true,
    data: {
      accountName: 'Ajay Krishna Javali',
      accountBalance: '50,000.00',
      remitterMmid: '987654321',
      remitterMobile: '9876543210',
      withdrawableAmount: '49,000.00'
    }
  },
  
  // Mock IFSC lookup responses
  ifscLookup: {
    'SBIN0000001': {
      success: true,
      data: {
        bankName: 'STATE BANK OF INDIA',
        branchName: 'KOLKATA MAIN',
        beneficiaryMmid: '123456789',
        beneficiaryMobileNo: '9021699203'
      }
    },
    'SBIN0000002': {
      success: true,
      data: {
        bankName: 'STATE BANK OF INDIA',
        branchName: 'MUMBAI MAIN',
        beneficiaryMmid: '123456789',
        beneficiaryMobileNo: '9021699203'
      }
    },
    'HDFC0000001': {
      success: true,
      data: {
        bankName: 'HDFC BANK',
        branchName: 'DELHI MAIN',
        beneficiaryMmid: '123456789',
        beneficiaryMobileNo: '9021699203'
      }
    },
    'HDFC0000002': {
      success: true,
      data: {
        bankName: 'HDFC BANK',
        branchName: 'BANGALORE MAIN',
        beneficiaryMmid: '123456789',
        beneficiaryMobileNo: '9021699203'
      }
    },
    'ICIC0000001': {
      success: true,
      data: {
        bankName: 'ICICI BANK',
        branchName: 'BANGALORE CITY',
        beneficiaryMmid: '123456789',
        beneficiaryMobileNo: '9021699203'
      }
    },
    'PNB0000001': {
      success: true,
      data: {
        bankName: 'PUNJAB NATIONAL BANK',
        branchName: 'CHANDIGARH',
        beneficiaryMmid: '123456789',
        beneficiaryMobileNo: '9021699203'
      }
    },
    'PNB0000002': {
      success: true,
      data: {
        bankName: 'PUNJAB NATIONAL BANK',
        branchName: 'DELHI',
        beneficiaryMmid: '123456789',
        beneficiaryMobileNo: '9021699203'
      }
    }
  },
  
  // Mock save transaction response
  saveTransaction: {
    success: true,
    data: {
      transactionId: `TXN${Date.now()}`,
      status: 'SUCCESS',
      message: 'Transaction saved successfully'
    }
  }
};

// Helper function to determine if we should use mock data
const shouldUseMock = () => {
  return import.meta.env.VITE_USE_MOCK_API !== 'false';
};

// Helper function to simulate network delay
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions with Mock Fallback

/**
 * Fetch Remitter Details based on account number
 * @param {string} accountNumber - The complete account number
 * @returns {Promise} Response with account details
 */
export const fetchRemitterDetails = async (accountNumber) => {
  try {
    if (shouldUseMock()) {
      // Mock implementation
      console.log('Using mock data for account lookup:', accountNumber);
      await delay(1000); // Simulate network delay
      return mockData.accountLookup;
    }
    
    // Real API call
    const response = await api.get(`/account/lookup?accountNumber=${accountNumber}`);
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error('Error fetching remitter details:', error);
    
    // Fallback to mock if real API fails
    if (!shouldUseMock()) {
      console.log('Real API failed, falling back to mock data');
      await delay(500);
      return mockData.accountLookup;
    }
    
    throw error;
  }
};

/**
 * Fetch Bank/Branch Details based on IFSC code
 * @param {string} ifscCode - The IFSC code (11 characters)
 * @returns {Promise} Response with bank details
 */
export const fetchBankDetails = async (ifscCode) => {
  try {
    if (shouldUseMock()) {
      // Mock implementation
      console.log('Using mock data for IFSC lookup:', ifscCode);
      await delay(1000); // Simulate network delay
      
      const mockResponse = mockData.ifscLookup[ifscCode.toUpperCase()];
      if (mockResponse) {
        return mockResponse;
      } else {
        return {
          success: false,
          message: 'Invalid IFSC code - Bank details not found'
        };
      }
    }
    
    // Real API call
    const response = await api.get(`/bank/ifsc/${ifscCode}`);
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error('Error fetching bank details:', error);
    
    // Fallback to mock if real API fails
    if (!shouldUseMock()) {
      console.log('Real API failed, falling back to mock data');
      await delay(500);
      
      const mockResponse = mockData.ifscLookup[ifscCode.toUpperCase()];
      if (mockResponse) {
        return mockResponse;
      } else {
        return {
          success: false,
          message: 'Invalid IFSC code - Bank details not found'
        };
      }
    }
    
    throw error;
  }
};

/**
 * Save transaction data to backend
 * @param {Object} transactionData - Complete transaction details
 * @returns {Promise} Response with transaction status
 */
export const saveTransaction = async (transactionData) => {
  try {
    if (shouldUseMock()) {
      // Mock implementation
      console.log('Using mock data for save transaction:', transactionData);
      await delay(1500); // Simulate network delay
      return mockData.saveTransaction;
    }
    
    // Real API call
    const response = await api.post('/save-transaction', transactionData);
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error('Error saving transaction:', error);
    
    // Fallback to mock if real API fails
    if (!shouldUseMock()) {
      console.log('Real API failed, falling back to mock data');
      await delay(500);
      return mockData.saveTransaction;
    }
    
    throw error;
  }
};

// Additional utility functions

/**
 * Check if API server is available
 * @returns {Promise<boolean>} True if server is reachable
 */
export const checkApiHealth = async () => {
  try {
    if (shouldUseMock()) {
      return true; // Mock is always "available"
    }
    
    await api.get('/health');
    return true;
  } catch (error) {
    console.log('API Health check failed:', error.message);
    return false;
  }
};

/**
 * Get current API mode
 * @returns {string} 'MOCK' or 'REAL'
 */
export const getApiMode = () => {
  return shouldUseMock() ? 'MOCK' : 'REAL';
};

// Export the axios instance for advanced usage
export default api;
