// API Constants - Centralized configuration

// Environment-based configuration
export const API_CONFIG = {
  // Base URL - can be easily changed for different environments
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  
  // Toggle between mock and real API (for development)
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API !== 'false', // Default to true for development
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// API Endpoints - All URLs in one place
export const API_ENDPOINTS = {
  // Transaction endpoints
  TRANSACTION: {
    SAVE: '/save-transaction',
    LIST: '/transactions',
    GET_BY_ID: '/transactions/:id',
    UPDATE: '/transactions/:id',
    DELETE: '/transactions/:id'
  },
  
  // Account endpoints
  ACCOUNT: {
    LOOKUP: '/account/lookup',
    DETAILS: '/account/:accountNumber',
    BALANCE: '/account/:accountNumber/balance',
    VALIDATE: '/account/validate'
  },
  
  // Bank endpoints
  BANK: {
    IFSC_LOOKUP: '/bank/ifsc/:ifscCode',
    DETAILS: '/bank/details/:bankCode',
    LIST: '/banks',
    BRANCHES: '/bank/:bankCode/branches'
  },
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify'
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'Access forbidden. You do not have permission.',
  NOT_FOUND: 'Resource not found.',
  BAD_REQUEST: 'Bad request. Please check your input.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNKNOWN: 'An unexpected error occurred.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TRANSACTION_SAVED: 'Transaction saved successfully!',
  ACCOUNT_FOUND: 'Account details retrieved successfully!',
  BANK_DETAILS_FOUND: 'Bank details retrieved successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!'
};

// Request Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Validation Rules
export const VALIDATION_RULES = {
  IFSC_CODE: {
    MIN_LENGTH: 11,
    MAX_LENGTH: 11,
    PATTERN: /^[A-Z]{4}0[A-Z0-9]{6}$/
  },
  MMID: {
    MIN_LENGTH: 7,
    MAX_LENGTH: 7,
    PATTERN: /^\d{7}$/
  },
  MOBILE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10,
    PATTERN: /^\d{10}$/
  },
  ACCOUNT_NUMBER: {
    MIN_LENGTH: 12,
    MAX_LENGTH: 20,
    PATTERN: /^\d+$/
  }
};
