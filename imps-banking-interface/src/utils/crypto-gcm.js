// Mock crypto-gcm utilities for development
// In production, replace with actual GCM encryption implementation

export const encryptData = async (data) => {
  // Mock encryption - return the data as-is for development
  console.log('Mock encryption:', data.slice(0, 100) + '...');
  
  return {
    encryptedData: btoa(data), // Base64 encode for mock
    iv: 'XYZ CO-OPERATIVE BANKock-iv-123456789012',
    tag: 'mock-tag-123456789012'
  };
};

export const decryptData = async (encryptedData) => {
  // Mock decryption - decode Base64 and return
  try {
    console.log('Mock decryption:', encryptedData.slice(0, 100) + '...');
    return atob(encryptedData); // Base64 decode for mock
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};
