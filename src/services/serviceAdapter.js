// Service Adapter - Handles switching between mock and real APIs

import { API_CONFIG } from '../constants/apiConstants';
import { transactionService, accountService, bankService, mockServices } from './apiService';

// Service Adapter - Automatically chooses between mock and real API based on configuration
class ServiceAdapter {
  constructor() {
    this.useMock = API_CONFIG.USE_MOCK_API;
  }

  // Transaction Services
  async saveTransaction(transactionData) {
    if (this.useMock) {
      return await mockServices.mockSaveTransaction(transactionData);
    }
    return await transactionService.saveTransaction(transactionData);
  }

  // Account Services
  async lookupAccount(accountNumber) {
    if (this.useMock) {
      return await mockServices.mockAccountLookup(accountNumber);
    }
    return await accountService.lookupAccount(accountNumber);
  }

  // Bank Services
  async lookupIfsc(ifscCode) {
    if (this.useMock) {
      return await mockServices.mockIfscLookup(ifscCode);
    }
    return await bankService.lookupIfsc(ifscCode);
  }

  async getBankDetails(bankCode) {
    if (this.useMock) {
      // Mock implementation for bank details
      return {
        success: true,
        data: {
          bankName: 'Mock Bank',
          branchName: 'Mock Branch'
        }
      };
    }
    return await bankService.getBankDetails(bankCode);
  }

  // Utility method to switch API mode
  setUseMock(useMock) {
    this.useMock = useMock;
  }

  // Get current API mode
  getApiMode() {
    return this.useMock ? 'MOCK' : 'REAL';
  }
}

// Create and export singleton instance
const serviceAdapter = new ServiceAdapter();
export default serviceAdapter;

// Named exports for specific services (for cleaner imports)
export const {
  saveTransaction,
  lookupAccount,
  lookupIfsc,
  getBankDetails,
  setUseMock,
  getApiMode
} = serviceAdapter;
