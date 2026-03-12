// API Service Layer - Centralized API management

import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, DEFAULT_HEADERS } from '../constants/apiConstants';

// Error Handler
const handleApiError = (error, defaultMessage = ERROR_MESSAGES.UNKNOWN) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return { success: false, message: data?.message || ERROR_MESSAGES.BAD_REQUEST };
      case HTTP_STATUS.UNAUTHORIZED:
        return { success: false, message: ERROR_MESSAGES.UNAUTHORIZED };
      case HTTP_STATUS.FORBIDDEN:
        return { success: false, message: ERROR_MESSAGES.FORBIDDEN };
      case HTTP_STATUS.NOT_FOUND:
        return { success: false, message: ERROR_MESSAGES.NOT_FOUND };
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return { success: false, message: ERROR_MESSAGES.SERVER_ERROR };
      case HTTP_STATUS.BAD_GATEWAY:
        return { success: false, message: ERROR_MESSAGES.NETWORK_ERROR };
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return { success: false, message: ERROR_MESSAGES.SERVER_ERROR };
      default:
        return { success: false, message: data?.message || defaultMessage };
    }
  } else if (error.request) {
    // Request was made but no response received
    return { success: false, message: ERROR_MESSAGES.NETWORK_ERROR };
  } else {
    // Something else happened
    return { success: false, message: error.message || defaultMessage };
  }
};

// Generic API Request Handler
const apiRequest = async (endpoint, options = {}) => {
  try {
    const config = {
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers
      },
      ...options
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    config.signal = controller.signal;

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = {
        status: response.status,
        data: await response.json().catch(() => ({}))
      };
      throw error;
    }

    const data = await response.json();
    return { success: true, data };
    
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, message: 'Request timeout. Please try again.' };
    }
    return handleApiError(error);
  }
};

// Transaction Services
export const transactionService = {
  // Save IMPS Transaction
  saveTransaction: async (transactionData) => {
    return await apiRequest(API_ENDPOINTS.TRANSACTION.SAVE, {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
  }
};

// Account Services
export const accountService = {
  // Lookup Account Details
  lookupAccount: async (accountNumber) => {
    return await apiRequest(API_ENDPOINTS.ACCOUNT.LOOKUP, {
      method: 'GET'
    });
  }
};

// Bank Services
export const bankService = {
  // Lookup IFSC Code Details
  lookupIfsc: async (ifscCode) => {
    const endpoint = API_ENDPOINTS.BANK.IFSC_LOOKUP.replace(':ifscCode', ifscCode);
    return await apiRequest(endpoint, {
      method: 'GET'
    });
  },
  
  // Get Bank Details
  getBankDetails: async (bankCode) => {
    const endpoint = API_ENDPOINTS.BANK.DETAILS.replace(':bankCode', bankCode);
    return await apiRequest(endpoint, {
      method: 'GET'
    });
  }
};

// Mock Services for Development (when backend is not available)
export const mockServices = {
  // Mock Account Lookup
  mockAccountLookup: async (accountNumber) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            accountName: 'Ajay Krishna Javali',
            accountBalance: '50,000.00',
            remitterMmid: '987654321',
            remitterMobile: '9876543210',
            withdrawableAmount: '49,000.00'
          }
        });
      }, 1000);
    });
  },
  
  // Mock IFSC Lookup
  mockIfscLookup: async (ifscCode) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockIfscDatabase = {
          'SBIN0000001': { bankName: 'STATE BANK OF INDIA', branchName: 'KOLKATA MAIN' },
          'SBIN0000002': { bankName: 'STATE BANK OF INDIA', branchName: 'MUMBAI MAIN' },
          'HDFC0000001': { bankName: 'HDFC BANK', branchName: 'DELHI MAIN' },
          'HDFC0000002': { bankName: 'HDFC BANK', branchName: 'BANGALORE MAIN' },
          'ICIC0000001': { bankName: 'ICICI BANK', branchName: 'BANGALORE CITY' },
          'PNB0000001': { bankName: 'PUNJAB NATIONAL BANK', branchName: 'CHANDIGARH' },
          'PNB0000002': { bankName: 'PUNJAB NATIONAL BANK', branchName: 'DELHI' }
        };
        
        const bankData = mockIfscDatabase[ifscCode.toUpperCase()];
        
        if (bankData) {
          resolve({
            success: true,
            data: {
              ...bankData,
              beneficiaryMmid: '123456789',
              beneficiaryMobileNo: '9021699203'
            }
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid IFSC code - Bank details not found'
          });
        }
      }, 1000);
    });
  },
  
  // Mock Save Transaction
  mockSaveTransaction: async (transactionData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            transactionId: `TXN${Date.now()}`,
            status: 'SUCCESS',
            message: 'Transaction saved successfully'
          }
        });
      }, 1500);
    });
  }
};

// Export configuration for easy access
export { API_CONFIG, API_ENDPOINTS };

// Default export for convenience
export default {
  transaction: transactionService,
  account: accountService,
  bank: bankService,
  mock: mockServices,
  config: { API_CONFIG, API_ENDPOINTS }
};
