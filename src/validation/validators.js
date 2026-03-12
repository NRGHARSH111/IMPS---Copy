// Mock validation utilities for development
// In production, implement actual validation logic

export const validateIfscMinLength = (ifsc) => {
  if (!ifsc || ifsc.length < 4) {
    return { valid: false, message: 'IFSC code must be at least 4 characters' };
  }
  return { valid: true, message: '' };
};

export const validateBeneficiaryIfscMinLength = (ifsc) => {
  if (!ifsc || ifsc.length !== 11) {
    return { valid: false, message: 'Beneficiary IFSC must be exactly 11 characters' };
  }
  return { valid: true, message: '' };
};

export const validateBeneficiaryAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 10 || accountNumber.length > 18) {
    return { valid: false, message: 'Account number must be 10-18 digits' };
  }
  if (!/^\d+$/.test(accountNumber)) {
    return { valid: false, message: 'Account number must contain only digits' };
  }
  return { valid: true, message: '' };
};

export const validateMobileNumber = (mobile) => {
  if (!mobile || mobile.length !== 10) {
    return { valid: false, message: 'Mobile number must be exactly 10 digits' };
  }
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return { valid: false, message: 'Invalid mobile number format' };
  }
  return { valid: true, message: '' };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return { valid: false, message: 'Name must contain only letters and spaces' };
  }
  return { valid: true, message: '' };
};

export const validateRequiredField = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
};

export const validateAccountParts = (orgElementCode, accountHeadCode, accountNo) => {
  const errors = {};
  
  if (!orgElementCode || orgElementCode.length !== 3) {
    errors.orgElementCode = 'Org Element Code must be exactly 3 digits';
  }
  
  if (!accountHeadCode || accountHeadCode.length !== 4) {
    errors.accountHeadCode = 'Account Head Code must be exactly 4 digits';
  }
  
  if (!accountNo || accountNo.length !== 8) {
    errors.accountNo = 'Account Number must be exactly 8 digits';
  }
  
  return Object.keys(errors).length === 0 ? { valid: true, message: '' } : { valid: false, message: 'Invalid account parts', errors };
};

export const validateTransactionAmount = (amount) => {
  if (!amount || amount.trim() === '') {
    return { valid: false, message: 'Transaction amount is required' };
  }
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return { valid: false, message: 'Amount must be a positive number' };
  }
  
  if (numAmount > 200000) {
    return { valid: false, message: 'IMPS limit is ₹2,00,000 per transaction' };
  }
  
  return { valid: true, message: '' };
};

export const validateImpsCity = (city) => {
  if (!city || city.trim().length < 2) {
    return { valid: false, message: 'City name is required' };
  }
  return { valid: true, message: '' };
};

export const formatAccountNumber = ({ orgElementCode, accountHeadCode, accountNo }) => {
  return `${orgElementCode}${accountHeadCode}${accountNo}`;
};

export const getSafeInputValue = (value) => {
  return value ? value.toString().trim() : '';
};

export const validateIMPSField = (fieldName, value) => {
  switch (fieldName) {
    case 'orgElementCode':
      return value && value.length === 3 ? { valid: true, message: '' } : { valid: false, message: 'Must be 3 digits' };
    case 'accountHeadCode':
      return value && value.length === 4 ? { valid: true, message: '' } : { valid: false, message: 'Must be 4 digits' };
    case 'accountNo':
      return value && value.length === 8 ? { valid: true, message: '' } : { valid: false, message: 'Must be 8 digits' };
    case 'beneficiaryIfscCode':
      return value && value.length === 11 ? { valid: true, message: '' } : { valid: false, message: 'Must be 11 characters' };
    case 'beneficiaryAccountNumber':
      return validateBeneficiaryAccountNumber(value);
    case 'transactionAmount':
      return validateTransactionAmount(value);
    default:
      return { valid: true, message: '' };
  }
};

export const validateIMPSForm = (formData) => {
  const errors = {};
  
  // Validate remitter account parts
  const accountPartsValidation = validateAccountParts(
    formData.orgElementCode,
    formData.accountHeadCode,
    formData.accountNo
  );
  if (!accountPartsValidation.valid && accountPartsValidation.errors) {
    Object.assign(errors, accountPartsValidation.errors);
  }
  
  // Validate beneficiary IFSC
  const beneficiaryIfscValidation = validateBeneficiaryIfscMinLength(formData.beneficiaryIfscCode);
  if (!beneficiaryIfscValidation.valid) {
    errors.beneficiaryIfscCode = beneficiaryIfscValidation.message;
  }
  
  // Validate beneficiary account
  const beneficiaryAccountValidation = validateBeneficiaryAccountNumber(formData.beneficiaryAccountNo);
  if (!beneficiaryAccountValidation.valid) {
    errors.beneficiaryAccountNo = beneficiaryAccountValidation.message;
  }
  
  // Validate transaction amount
  const amountValidation = validateTransactionAmount(formData.transactionAmount);
  if (!amountValidation.valid) {
    errors.transactionAmount = amountValidation.message;
  }
  
  // Validate beneficiary name
  if (!formData.beneficiaryName || formData.beneficiaryName.trim().length < 2) {
    errors.beneficiaryName = 'Beneficiary name is required';
  }
  
  return errors;
};
