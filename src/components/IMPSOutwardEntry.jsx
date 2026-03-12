import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import DashboardLayout from './DashboardLayout';
import { encryptData, decryptData } from '../utils/crypto-gcm';
import { 
  validateIfscMinLength, 
  validateBeneficiaryIfscMinLength, 
  validateBeneficiaryAccountNumber,
  validateMobileNumber,
  validateName,
  validateRequiredField,
  validateAccountParts,
  validateTransactionAmount,
  validateImpsCity,
  formatAccountNumber,
  getSafeInputValue,
  validateIMPSField,      
  validateIMPSForm       
} from '../validation/validators';

// Icon Components for Header
const MagnifyingGlassIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const InformationIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Bars3Icon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const Squares2X2Icon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ArrowRightIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const RefreshIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CurvedArrowIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const bankBranches = [
  { code: '5005', name: 'GHATKOPAR E' },
  { code: '5006', name: 'GHATKOPAR W' },
  { code: '5007', name: 'VIKHROLI' },
  { code: '5008', name: 'KANJUR MARG' },
  { code: '5009', name: 'BANDRA' },
  { code: '5010', name: 'ANDHERI' },
  { code: '5011', name: 'DADAR' },
  { code: '5012', name: 'THANE' }
];

const chartOfAccounts = [
  { value: 'SBA', label: 'Savings Bank Account' },
  { value: 'CA', label: 'Current Account' },
  { value: 'OD', label: 'Overdraft Account' },
  { value: 'CC', label: 'Cash Credit Account' },
  { value: 'FD', label: 'Fixed Deposit' },
];

// API Configuration
const API_BASE_URL = 'http://192.168.0.112:8080';

const IMPSOutwardEntry = () => {
  return <IMPSOutwardEntryContent />;
};

const IMPSOutwardEntryContent = () => {
  const [formData, setFormData] = useState({
    // Transaction Details
    txnType: 'IMPS',
    branch: "1008-KOTHRUD", // From image
    branchIfscCode: '',
    branchName: '',
    remitterIfscCode: 'HDFC0001001',
    orgId: '1002',          
    bankCode: 'ANR',        

    // Remitter Details
    orgElementCode: '', // Empty for backend population
    accountHeadCode: '', // Empty for backend population  
    accountNo: '', // Empty for backend population
    fullAccountNumber: '', // Empty for backend population
    chartOfAccount: '10001', // Fixed value as requested
    accountName: '', // Empty for backend population
    mobileNo: '', // Empty for backend population
    mmid: '', // Empty for backend population
    remitterAccountType: 'SAVINGS',
    remitterType: 'PERSON',
    remitterAccountName: '', // Empty for backend population
    remitterMobileNo: '', // Empty for backend population
    
    // Beneficiary Details
    beneficiaryIfscCode: 'SBIN0000001', // From image
    beneficiaryAccountNo: '',
    beneficiaryName: '',
    beneficiaryMobile: '9021699203', // From image
    beneficiaryBankName: 'STATE BANK OF INDIA', // From image
    beneficiaryBranchName: 'KOLKATA MAIN', // From image
    beneficiaryCity: '', 
    
    // Transaction Details
    transactionAmount: '0.00', // From image
    withdrawableAmount: '1284802.33', // From image
    purpose: 'IMPS',
    remarks: 'Initiate P2P Transaction', // From image
    
    // Account display fields
    displayAccountNumber: '', // For showing account number in UI
    fetchedAccountName: '' // For storing fetched account holder name
  });
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBranch, setIsFetchingBranch] = useState(false);
  const [isFetchingAccount, setIsFetchingAccount] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingBankDetails, setIsFetchingBankDetails] = useState(false);
  const [isFetchingBeneficiary, setIsFetchingBeneficiary] = useState(false);
  const [isFetchingIfscDetails, setIsFetchingIfscDetails] = useState(false);
  
  // Error States
  const [errors, setErrors] = useState({});
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [branchLookupError, setBranchLookupError] = useState('');
  const [accountNameError, setAccountNameError] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [ifscError, setIfscError] = useState('');
  
  // Validation State
  const [isFormValid, setIsFormValid] = useState(false);
  const [isBeneficiaryValid, setIsBeneficiaryValid] = useState(false);
  const [fieldValidation, setFieldValidation] = useState({
    orgElementCode: { valid: false, message: '' },
    accountHeadCode: { valid: false, message: '' },
    accountNo: { valid: false, message: '' },
    branchIfscCode: { valid: false, message: '' },
    beneficiaryIfscCode: { valid: false, message: '' },
    beneficiaryAccountNumber: { valid: false, message: '' },
    beneficiaryName: { valid: false, message: '' },
    transactionAmount: { valid: false, message: '' },
    beneficiaryCity: { valid: false, message: '' }
  });
  
  // Refs
  const abortControllerRef = useRef(null);
  const latestIfscRef = useRef('');
  const accountNumberTimeoutRef = useRef(null);
  const ifscCacheRef = useRef(new Map());
  const ifscInputRef = useRef(null);
  const searchIfscRef = useRef(null);
  const dropdownRef = useRef(null);
  const heartbeatRef = useRef(null);
  
  // CBS Heartbeat states
  const [isHeartbeatActive, setIsHeartbeatActive] = useState(false);
  const [heartbeatStatus, setHeartbeatStatus] = useState('Ready');
  const [lastPingTime, setLastPingTime] = useState(null);
 
  // Cleanup function for heartbeat
  useEffect(() => {
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, []);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          ifscInputRef.current && !ifscInputRef.current.contains(event.target)) {
        setShowIfscSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const validateForm = () => {
    return validateIMPSForm(formData);  
  };
  
  // State to track if user has interacted with form
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
   
  // Smart form validation - only run if user has interacted
  useEffect(() => {
    // Check if form is completely empty
    const isEmptyForm = !formData.orgElementCode && 
                       !formData.accountHeadCode && 
                       !formData.accountNo &&
                       !formData.branchIfscCode &&
                       !formData.beneficiaryIfscCode &&
                       !formData.beneficiaryAccountNo &&
                       !formData.beneficiaryName &&
                       !formData.transactionAmount &&
                       !formData.beneficiaryCity;
    
    // Only validate if user has interacted and form is not empty
    if (hasUserInteracted && !isEmptyForm) {
      const formErrors = validateForm();
      const isValid = Object.keys(formErrors).length === 0;
      
      setIsFormValid(isValid);
      setErrors(formErrors);
    } else if (isEmptyForm) {
      // Clear errors for empty form
      setErrors({});
      setIsFormValid(false);
    }
    
    // Initialize debounced search function
    searchIfscRef.current = debounce(async (prefix) => {
      if (!prefix || prefix.length < 4) {
        setIfscSuggestions([]);
        return;
      }
      
      try {
        setIsFetchingIfsc(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/bank/search-ifsc?prefix=${encodeURIComponent(prefix)}` 
        );
         
        setIfscSuggestions(response.data || []);
        setActiveSuggestionIndex(-1);
        if (response.data?.length > 0) {
          setShowIfscSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching IFSC suggestions:', error);
        setIfscSuggestions([]);
      } finally {
        setIsFetchingIfsc(false);
      }
    }, 500);
    
    return () => {
      if (searchIfscRef.current) {
        searchIfscRef.current.cancel();
      }
    };
  }, [formData, hasUserInteracted]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // UPPERCASE IFSC only
    const fieldValue = name === 'beneficiaryIfscCode' ? value.toUpperCase() : value;
    
    // Branch selection auto-fill logic
    if (name === 'branch') {
      const branchCode = value.split('-')[0]; // Extract first 4 digits
      console.log('BRANCH SELECTED:', value, 'CODE:', branchCode);
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: fieldValue,
        orgElementCode: branchCode, // Auto-fill first box
        accountHeadCode: '10001',   // Auto-fill middle box
        chartOfAccount: '10001'     // Auto-fill Chart of Account
      }));
      
      // Update field validation
      setFieldValidation(prev => ({ 
        ...prev, 
        [name]: { 
          valid: true, 
          message: '' 
        },
        orgElementCode: { 
          valid: true, 
          message: '' 
        },
        accountHeadCode: { 
          valid: true, 
          message: '' 
        }
      }));
    } else {
      // Update form data for other fields
      setFormData(prev => ({ ...prev, [name]: fieldValue }));
      
      // Update field validation
      setFieldValidation(prev => ({ 
        ...prev, 
        [name]: { 
          valid: true, 
          message: '' 
        } 
      }));
    }
    
    // IFSC auto-fill trigger
    if (name === 'beneficiaryIfscCode' && fieldValue.length === 11) {
      console.log('IFSC LOOKUP:', fieldValue);
      setTimeout(() => fetchBeneficiaryDetails(fieldValue), 800);
    }
  };

  // Mock Data for Testing - Enhanced with more accounts
const mockAccountsData = [
  {
    accountSuffix: '100',
    accountName: 'PRASHANT ANANT SURU',
    mmid: '8366061',
    mobileNo: '9822885952',
    withdrawableAmount: '1284802.33',
    chartOfAccount: '10001',
    remitterIfsc: 'HDFC0001001',
    orgId: '1002',
    bankCode: 'ANR'
  },
  {
    accountSuffix: '200',
    accountName: 'RAVI KUMAR SHARMA',
    mmid: '8366062',
    mobileNo: '9822885953',
    withdrawableAmount: '250000.00',
    chartOfAccount: '10001',
    remitterIfsc: 'HDFC0001001',
    orgId: '1002',
    bankCode: 'ANR'
  },
  {
    accountSuffix: '300',
    accountName: 'SUNITA DESHMUKH',
    mmid: '8366063',
    mobileNo: '9822885954',
    withdrawableAmount: '875432.50',
    chartOfAccount: '10001',
    remitterIfsc: 'HDFC0001001',
    orgId: '1002',
    bankCode: 'ANR'
  },
  {
    accountSuffix: '400',
    accountName: 'AMIT PATIL',
    mmid: '8366064',
    mobileNo: '9822885955',
    withdrawableAmount: '1500000.00',
    chartOfAccount: '10001',
    remitterIfsc: 'HDFC0001001',
    orgId: '1002',
    bankCode: 'ANR'
  },
  {
    accountSuffix: '500',
    accountName: 'PRIYA NAIR',
    mmid: '8366065',
    mobileNo: '9822885956',
    withdrawableAmount: '523456.78',
    chartOfAccount: '10001',
    remitterIfsc: 'HDFC0001001',
    orgId: '1002',
    bankCode: 'ANR'
  },
  {
    accountSuffix: '600',
    accountName: 'KARAN SINGH',
    mmid: '8366066',
    mobileNo: '9822885957',
    withdrawableAmount: '987654.32',
    chartOfAccount: '10001',
    remitterIfsc: 'HDFC0001001',
    orgId: '1002',
    bankCode: 'ANR'
  },
  {
    accountSuffix: '700',
    accountName: 'ANJALI REDDY',
    mmid: '8366067',
    mobileNo: '9822885958',
    withdrawableAmount: '345678.90',
    chartOfAccount: '10001',
    remitterIfsc: 'HDFC0001001',
    orgId: '1002',
    bankCode: 'ANR'
  },
  {
    accountSuffix: '800',
    accountName: 'VIJAY KUMAR',
    mmid: '8366068',
    mobileNo: '9822885959',
    withdrawableAmount: '2109876.54',
    chartOfAccount: '10001',
    remitterIfsc: 'HDFC0001001',
    orgId: '1002',
    bankCode: 'ANR'
  },
  {
    accountSuffix: '900',
    accountName: 'MEENA PATEL',
    mmid: '8366069',
    mobileNo: '9822885960',
    withdrawableAmount: '456789.12',
    chartOfAccount: '10001',
    remitterIfsc: 'HDFC0001001',
    orgId: '1002',
    bankCode: 'ANR'
  },
  {
    accountSuffix: '001',
    accountName: 'ROHIT SHARMA',
    mmid: '8366070',
    mobileNo: '9822885961',
    withdrawableAmount: '678901.23',
    chartOfAccount: '10001',
    remitterIfsc: 'HDFC0001001',
    orgId: '1002',
    bankCode: 'ANR'
  }
];

// CBS Branch database
  const cbsBranches = {
    'SBIN0001234': 'MUMBAI MAIN BRANCH',
    'HDFC0001001': 'ANURADHA URBAN CO-OPERATIVE BANK LTD',
    'SBIN0006789': 'PUNE CAMP BRANCH',
    'ICIC0000001': 'BANDRA KURLA ICICI'
  };

// Mock Beneficiary Database based on IFSC
const mockBeneficiaryDatabase = {
  'SBIN0000001': {
    bankName: 'STATE BANK OF INDIA',
    branchName: 'KOLKATA MAIN',
    mmid: '1234567',
    mobileNo: '9876543210'
  },
  'HDFC0001001': {
    bankName: 'HDFC BANK',
    branchName: 'MUMBAI MAIN',
    mmid: '7654321',
    mobileNo: '9876543211'
  },
  'ICIC0000001': {
    bankName: 'ICICI BANK',
    branchName: 'BANDRA KURLA',
    mmid: '9876543',
    mobileNo: '9876543212'
  },
  'SBIN0001234': {
    bankName: 'STATE BANK OF INDIA',
    branchName: 'MUMBAI MAIN BRANCH',
    mmid: '1111111',
    mobileNo: '9876543213'
  }
};

  // Simulate CBS database lookup
  const fetchBranchName = useCallback(async (ifscCode) => {
    setTimeout(() => {
      if (cbsBranches[ifscCode]) {
        setFormData(prev => ({
          ...prev,
          branchName: cbsBranches[ifscCode],
          bankName: ifscCode.slice(0, 4).toUpperCase() + ' BANK'
        }));
        setBranchLookupError('');
        console.log('CBS Branch Found:', ifscCode, '→', cbsBranches[ifscCode]);
      } else {
        setFormData(prev => ({ ...prev, branchName: '' }));
        setBranchLookupError('Branch not found in CBS database');
        console.log('CBS Branch Missing:', ifscCode);
      }
      setIsFetchingBranch(false);
    }, 800);
    
  }, []);

  // CBS Remitter lookup
  const fetchAccountHolderDetails = useCallback(async (orgElementCode, accountHeadCode, accountNo) => {
    console.log('CBS CALLED → Org:', orgElementCode, 'Head:', accountHeadCode);
    
    // Validate inputs
    if (!orgElementCode || orgElementCode.length !== 4) return;
    if (!accountHeadCode || accountHeadCode.length !== 5) return;
    if (!accountNo || accountNo.length !== 3) return;
    
    setIsFetchingAccount(true);
    setAccountNameError('');
    
    const fullAccountNumber = `${orgElementCode}${accountHeadCode}${accountNo}`;
    console.log('FULL ACCOUNT NUMBER:', fullAccountNumber);
    
    try {
      // API call to fetch account details
      const response = await axios.get(`${API_BASE_URL}/api/account-details/${fullAccountNumber}`);
      
      if (response.data) {
        setFormData(prev => ({
          ...prev,
          accountName: response.data.accountName || '',
          mobileNo: response.data.mobileNo || '',
          mmid: response.data.mmid || '',
          withdrawableAmount: response.data.withdrawableAmount || '0.00',
          chartOfAccount: response.data.chartOfAccount || '',
          remitterIfsc: response.data.remitterIfsc || '',
          orgId: response.data.orgId || '',
          bankCode: response.data.bankCode || ''
        }));
        setAccountNameError('');
        console.log('SUCCESS: Account details fetched', response.data);
      }
    } catch (error) {
      console.error('API ERROR:', error);
      
      // Fallback to mock data if API fails
      const cbsAccounts = {
        '10081000100': {
          accountName: 'PRASHANT ANANT SURU',
          mobileNo: '9822885952',
          mmid: '8366061',
          withdrawableAmount: '1284802.33',
          chartOfAccount: '10001',
          remitterIfsc: 'HDFC0001001',
          orgId: '1002',
          bankCode: 'ANR'
        }
      };
      
      if (cbsAccounts[fullAccountNumber]) {
        const account = cbsAccounts[fullAccountNumber];
        setFormData(prev => ({
          ...prev,
          accountName: account.accountName,
          mobileNo: account.mobileNo,
          mmid: account.mmid,
          withdrawableAmount: account.withdrawableAmount,
          chartOfAccount: account.chartOfAccount,
          remitterIfsc: account.remitterIfsc || '',
          orgId: account.orgId || '',
          bankCode: account.bankCode || ''
        }));
        setAccountNameError('');
        console.log('SUCCESS: Mock data used', account);
      } else {
        setAccountNameError('Account not found');
        alert('User Not Found: Account number does not exist in our records');
        console.log('NOT FOUND:', fullAccountNumber);
      }
    } finally {
      setIsFetchingAccount(false);
    }
  }, []);

  // Mock API to fetch beneficiary details based on IFSC
  const fetchBeneficiaryDetailsByIfsc = useCallback(async (ifscCode) => {
    console.log('BENEFICIARY API CALL:', ifscCode);
    
    if (!ifscCode || ifscCode.length !== 11) {
      console.log('INVALID IFSC LENGTH');
      return;
    }
    
    setIsFetchingIfscDetails(true);
    setIfscError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock API response
      const response = {
        success: true,
        data: mockBeneficiaryDatabase[ifscCode] || null
      };
      
      if (response.success && response.data) {
        const beneficiaryData = response.data;
        setFormData(prev => ({
          ...prev,
          beneficiaryBankName: beneficiaryData.bankName,
          beneficiaryBranchName: beneficiaryData.branchName,
          beneficiaryMmid: beneficiaryData.mmid,
          beneficiaryMobileNo: beneficiaryData.mobileNo
        }));
        setIfscError('');
        console.log('BENEFICIARY DETAILS FETCHED:', beneficiaryData);
      } else {
        // IFSC not found in database
        setFormData(prev => ({
          ...prev,
          beneficiaryBankName: '',
          beneficiaryBranchName: '',
          beneficiaryMmid: '',
          beneficiaryMobileNo: ''
        }));
        setIfscError('Invalid IFSC or Bank details not found');
        console.log('BENEFICIARY NOT FOUND for IFSC:', ifscCode);
      }
    } catch (error) {
      console.error('API ERROR:', error);
      setFormData(prev => ({
        ...prev,
        beneficiaryBankName: '',
        beneficiaryBranchName: '',
        beneficiaryMmid: '',
        beneficiaryMobileNo: ''
      }));
      setIfscError('Failed to fetch bank details. Please try again.');
    } finally {
      setIsFetchingIfscDetails(false);
    }
  }, []);

  // Account lookup handler
  const handleAccountLookup = useCallback(() => {
    const orgElementCode = formData.orgElementCode;
    const accountHeadCode = formData.accountHeadCode;
    const accountNo = formData.accountNo;
    
    console.log('LOOKUP TRIGGERED → Org:', orgElementCode, 'Head:', accountHeadCode, 'Account:', accountNo);
    
    if (orgElementCode.length === 4 && accountHeadCode.length === 5 && accountNo.length === 3) {
      fetchAccountHolderDetails(orgElementCode, accountHeadCode, accountNo);
    } else {
      alert('Please enter complete account number (4+5+3 digits) before lookup');
    }
  }, [formData, fetchAccountHolderDetails]);

  // Account part change handler
  const handleAccountPartChange = useCallback((fieldName, value) => {
    // Input Validation: Only accept numbers for account fields
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Apply field-specific length limits
    let sanitizedValue = numericValue;
    if (fieldName === 'orgElementCode') {
      sanitizedValue = numericValue.slice(0, 4); // Max 4 digits
    } else if (fieldName === 'accountHeadCode') {
      sanitizedValue = numericValue.slice(0, 5); // Max 5 digits
    } else if (fieldName === 'accountNo') {
      sanitizedValue = numericValue.slice(0, 3); // Max 3 digits
    }
    
    if (value !== sanitizedValue) {
      // If non-numeric characters were entered or length exceeded, only keep the valid part
      setFormData(prev => ({ 
        ...prev, 
        [fieldName]: sanitizedValue 
      }));
      value = sanitizedValue;
    }
    
    setFormData(prev => ({ 
      ...prev, 
      [fieldName]: value 
    }));
    
    // Synchronized Fields Logic: Mirror 3rd segment to Account Number field
    if (fieldName === 'accountNo') {
      console.log('LAST 3 DIGITS TYPED:', value);
      
      // Real-time sync: Always mirror the current value to Account Number field
      setFormData(prev => ({
        ...prev,
        displayAccountNumber: value // Real-time sync to Account Number field
      }));
      
      // Auto-Populate on Match: When exactly 3 digits are entered
      if (value.length === 3) {
        console.log('VALIDATION PASSED: 3 digits entered, fetching from mock data...');
        
        // Search mock data for matching account suffix
        const matchedAccount = mockAccountsData.find(account => account.accountSuffix === value);
        
        if (matchedAccount) {
          console.log('ACCOUNT FOUND:', matchedAccount);
          
          // Auto-populate all fields with matched account data
          setFormData(prev => ({
            ...prev,
            displayAccountNumber: `${prev.orgElementCode}${prev.accountHeadCode}${value}`, // Show full account number
            fetchedAccountName: matchedAccount.accountName, // Store account name separately
            mmid: matchedAccount.mmid,
            mobileNo: matchedAccount.mobileNo,
            withdrawableAmount: matchedAccount.withdrawableAmount,
            chartOfAccount: matchedAccount.chartOfAccount,
            remitterIfsc: matchedAccount.remitterIfsc || '',
            orgId: matchedAccount.orgId || '',
            bankCode: matchedAccount.bankCode || ''
          }));
          
          setAccountNameError('');
          console.log('SUCCESS: All fields auto-populated from mock data');
        } else {
          console.log('ACCOUNT NOT FOUND in mock data for suffix:', value);
          setAccountNameError('Account not found');
          
          // Clear fields if no match found
          setFormData(prev => ({
            ...prev,
            displayAccountNumber: `${prev.orgElementCode}${prev.accountHeadCode}${value}`, // Show full account number
            fetchedAccountName: '', // Clear account name
            mmid: '',
            mobileNo: '',
            withdrawableAmount: '0.00',
            chartOfAccount: '10001', // Keep default
            remitterIfsc: '',
            orgId: '',
            bankCode: ''
          }));
        }
      } else if (value.length < 3) {
        // Clear error while typing and show partial account number
        setAccountNameError('');
        setFormData(prev => ({
          ...prev,
          displayAccountNumber: `${prev.orgElementCode}${prev.accountHeadCode}${value}`, // Show partial account number
          fetchedAccountName: '' // Clear account name while typing
        }));
      }
    }
    
    // Update full account number for internal tracking
    const fullAccount = `${formData.orgElementCode || ''}${formData.accountHeadCode || ''}${formData.accountNo || ''}`;
    setFormData(prev => ({
      ...prev,
      fullAccountNumber: fullAccount
    }));

  }, [formData]);

  // Fetch beneficiary account holder name
  const fetchBeneficiaryAccountHolderName = async (ifscCode, accountNumber) => {
    setIsVerifying(true);
    setVerifyError('');
     
    try {
      // Simulate beneficiary verification
      setTimeout(() => {
        const mockBeneficiaryName = 'John Doe';
        setFormData(prev => ({ 
          ...prev, 
          beneficiaryName: mockBeneficiaryName
        }));
        setIsBeneficiaryValid(true);
        setVerifyError('');
        setIsVerifying(false);
        return true;
      }, 1500);
      
    } catch (error) {
      console.error('NPCI ERROR:', error);
      setVerifyError(`Backend Error: ${error.message}`);
      setIsVerifying(false);
      return false;
    }
  };

  const handleCancel = () => {
    setFormData({
      txnType: 'IMPS',
      branch: "1008-KOTHRUD", // Reset to pre-populated value
      branchIfscCode: '',
      branchName: '',
      remitterIfscCode: 'HDFC0001001',
      orgId: '1002',
      bankCode: 'ANR',
      accountHeadCode: '',
      accountNo: '',
      accountName: '',
      mobileNo: '',
      mmid: '',
      remitterAccountType: 'SAVINGS',
      beneficiaryIfscCode: '',
      beneficiaryAccountNo: '',
      beneficiaryName: '',
      beneficiaryMobile: '',
      beneficiaryBankName: '',
      beneficiaryBranchName: '',
      transactionAmount: '0.00',
      withdrawableAmount: '0',
      purpose: 'IMPS',
      remarks: ''
    });
    
    setErrors({});
    setBranchLookupError('');
    setAccountNameError('');
    setMobileNumberError('');
    setVerifyError('');
    setSubmitError('');
    setIsBeneficiaryValid(false);
    setIsVerifying(false);
    setIsSubmitting(false);
    setIsFormValid(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('IMPS TRANSACTION STARTED');
    
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!formData.beneficiaryIfscCode || formData.beneficiaryIfscCode.length !== 11) {
        alert('Please enter a valid IFSC Code');
        return;
      }
      
      if (!formData.beneficiaryBankName || !formData.beneficiaryBranchName) {
        alert('Please verify IFSC and fetch bank details first');
        return;
      }
      
      if (!formData.beneficiaryMmid) {
        alert('Please enter Beneficiary MMID');
        return;
      }
      
      if (!formData.beneficiaryMobileNo || formData.beneficiaryMobileNo.length !== 10) {
        alert('Please enter a valid Beneficiary Mobile Number');
        return;
      }
      
      // Success - All validations passed
      alert('IMPS Fund Transfer SUCCESSFUL!\n\n' +
            `Amount: ${formData.transactionAmount || '1000'}\n` +
            `To: ${formData.beneficiaryBankName}\n` +
            `Branch: ${formData.beneficiaryBranchName}\n` +
            `MMID: ${formData.beneficiaryMmid}\n` +
            `Mobile: ${formData.beneficiaryMobileNo}`);
      
    } catch (error) {
      console.error('TRANSACTION FAILED:', error);
      alert(`Transaction Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar - Pixel Perfect Match */}
      <div className="bg-[#0083B3] text-white px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Bank Name - Left */}
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">XYZ CO-OPERATIVE BANK</div>
            <div className="text-xs">1008 - KOTHRUD</div>
          </div>
          
          {/* User/Login Info - Center */}
          <div className="text-xs text-center">
            <div>Ajay Krishna Javali [akj142] | Last Login: 11 Mar 2026 10:31:41 | 27-Nov-2023 [01 Apr 2023 - 31 Mar 2024]</div>
          </div>
          
          {/* Action Icons - Right */}
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value="2214" 
              className="w-12 px-1 py-0.5 text-xs text-black border border-gray-300"
              readOnly
            />
            <button className="px-2 py-1 text-xs bg-white text-black border border-gray-300 hover:bg-gray-100">
              Go
            </button>
            <button className="p-1 hover:bg-blue-700 rounded">
              <MagnifyingGlassIcon />
            </button>
            <button className="p-1 hover:bg-blue-700 rounded">
              <RefreshIcon />
            </button>
            <button className="p-1 hover:bg-blue-700 rounded">
              <XMarkIcon />
            </button>
            <button className="p-1 hover:bg-blue-700 rounded">
              <InformationIcon />
            </button>
            <button className="p-1 hover:bg-blue-700 rounded">
              <Bars3Icon />
            </button>
            <button className="p-1 hover:bg-blue-700 rounded">
              <Squares2X2Icon />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-300 px-4 py-2">
        <div className="flex items-center text-xs text-gray-600 space-x-2">
          <span>Retail Banking</span>
          <ChevronRightIcon />
          <span>IMPS Outward Entry</span>
          <ChevronRightIcon />
          <span className="text-black font-medium">P2P</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Branch Section */}
        <div className="bg-white border border-gray-300 mb-4">
          <div className="px-4 py-2 border-b border-gray-300">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-gray-700">Branch:</span>
              <select 
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="text-xs px-2 py-1 border border-gray-300 bg-white"
              >
                {bankBranches.map((branch) => (
                  <option key={branch.code} value={`${branch.code}-${branch.name.replace(/ /g, '-')}`}>
                    {branch.code}-{branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Remitter's Details Section - Pixel Perfect */}
        <div className="bg-white border border-gray-300 mb-4">
          <div className="bg-blue-100 text-blue-900 px-4 py-2 border-b border-blue-200">
            <span className="text-sm font-bold">Remitter's Details</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Account # - 3 Connected Inputs */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">Account #</div>
                <div className="flex items-center space-x-0">
                  <input
                    type="text"
                    name="orgElementCode"
                    value={formData.orgElementCode}
                    onChange={(e) => handleAccountPartChange('orgElementCode', e.target.value)}
                    placeholder="0000"
                    maxLength={4}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 bg-white"
                  />
                  <input
                    type="text"
                    name="accountHeadCode"
                    value={formData.accountHeadCode}
                    onChange={(e) => handleAccountPartChange('accountHeadCode', e.target.value)}
                    placeholder="00000"
                    maxLength={5}
                    className="w-20 px-2 py-1 text-xs border border-gray-300 bg-white"
                  />
                  <input
                    type="text"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={(e) => handleAccountPartChange('accountNo', e.target.value)}
                    placeholder="000"
                    maxLength={3}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 bg-white"
                  />
                  <button
                    type="button"
                    className={`p-1 text-blue-600 border border-blue-300 hover:bg-blue-50 ${isFetchingAccount ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    onClick={handleAccountLookup}
                    disabled={isFetchingAccount}
                  >
                    {isFetchingAccount ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    ) : (
                      <ArrowRightIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Chart of Account - With Icons */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">Chart of Account</div>
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    name="chartOfAccount"
                    value={formData.chartOfAccount}
                    onChange={handleChange}
                    readOnly
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 bg-gray-50 text-gray-600"
                  />
                  <button
                    type="button"
                    className="p-1 text-blue-600 border border-blue-300 hover:bg-blue-50"
                    onClick={() => console.log('Chart account action clicked')}
                  >
                    <CurvedArrowIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-blue-600 border border-blue-300 hover:bg-blue-50"
                    onClick={() => console.log('Refresh chart account clicked')}
                  >
                    <RefreshIcon className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-600">[SAVINGS DEPOSIT - (GEN)]</span>
                </div>
              </div>

              {/* Account Number - With Icons and Name Display */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">Account Number</div>
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    name="displayAccountNumber"
                    value={formData.displayAccountNumber}
                    readOnly
                    placeholder="Account number will appear here"
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 bg-gray-50 text-gray-600"
                  />
                  <button
                    type="button"
                    className={`p-1 text-blue-600 border border-blue-300 hover:bg-blue-50 ${isFetchingAccount ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (formData.displayAccountNumber) {
                        fetchAccountHolderDetails(formData.orgElementCode, formData.accountHeadCode, formData.accountNo);
                      } else {
                        alert('Please enter account number first');
                      }
                    }}
                    disabled={isFetchingAccount}
                  >
                    {isFetchingAccount ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    ) : (
                      <ArrowRightIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="p-1 text-blue-600 border border-blue-300 hover:bg-blue-50"
                    onClick={() => console.log('Refresh account clicked')}
                  >
                    <RefreshIcon className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-600">{formData.fetchedAccountName ? `[${formData.fetchedAccountName}]` : ''}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* MMID */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">MMID</div>
                <input
                  type="text"
                  name="mmid"
                  value={formData.mmid}
                  readOnly
                  className="w-full px-2 py-1 text-xs border border-gray-300 bg-gray-50 text-gray-600"
                />
              </div>

              {/* Mobile No. */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">Mobile No.</div>
                <input
                  type="text"
                  name="mobileNo"
                  value={formData.mobileNo}
                  readOnly
                  className="w-full px-2 py-1 text-xs border border-gray-300 bg-gray-50 text-gray-600"
                />
              </div>

              {/* Transaction Amount */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">Transaction Amount</div>
                <input
                  type="text"
                  name="transactionAmount"
                  value={formData.transactionAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-2 py-1 text-xs border border-gray-300 bg-white"
                />
              </div>

              {/* Withdrawable Amount */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">Withdrawable Amount</div>
                <input
                  type="text"
                  name="withdrawableAmount"
                  value={formData.withdrawableAmount}
                  readOnly
                  className="w-full px-2 py-1 text-xs border border-gray-300 bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Beneficiary's Details Section - Pixel Perfect */}
        <div className="bg-white border border-gray-300 mb-4">
          <div className="bg-blue-100 text-blue-900 px-4 py-2 border-b border-blue-200">
            <span className="text-sm font-bold">Beneficiary's Details</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* IFSC - With Icons */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">IFSC</div>
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    name="beneficiaryIfscCode"
                    value={formData.beneficiaryIfscCode}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      setFormData(prev => ({ ...prev, beneficiaryIfscCode: value }));
                      setIfscError(''); // Clear error on typing
                      
                      // Auto-trigger API call when IFSC is complete
                      if (value.length === 11) {
                        fetchBeneficiaryDetailsByIfsc(value);
                      } else {
                        // Clear beneficiary details if IFSC is incomplete
                        setFormData(prev => ({
                          ...prev,
                          beneficiaryBankName: '',
                          beneficiaryBranchName: '',
                          beneficiaryMmid: '',
                          beneficiaryMobileNo: ''
                        }));
                      }
                    }}
                    placeholder="e.g. SBIN0000001"
                    maxLength={11}
                    className={`flex-1 px-2 py-1 text-xs border border-gray-300 bg-white ${ifscError ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    className="p-1 text-blue-600 border border-blue-300 hover:bg-blue-50"
                    onClick={() => {
                      if (formData.beneficiaryIfscCode && formData.beneficiaryIfscCode.length === 11) {
                        fetchBeneficiaryDetailsByIfsc(formData.beneficiaryIfscCode);
                      } else {
                        setIfscError('Please enter a valid 11-digit IFSC code');
                      }
                    }}
                    disabled={isFetchingIfscDetails}
                  >
                    {isFetchingIfscDetails ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    ) : (
                      <CurvedArrowIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="p-1 text-blue-600 border border-blue-300 hover:bg-blue-50"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        beneficiaryIfscCode: '',
                        beneficiaryBankName: '',
                        beneficiaryBranchName: '',
                        beneficiaryMmid: '',
                        beneficiaryMobileNo: ''
                      }));
                      setIfscError('');
                    }}
                  >
                    <RefreshIcon className="w-4 h-4" />
                  </button>
                </div>
                {/* Loading State or Error Message */}
                {isFetchingIfscDetails && (
                  <div className="mt-1 text-xs text-blue-600 flex items-center">
                    <div className="w-3 h-3 animate-spin rounded-full border border-blue-600 border-t-transparent mr-1"></div>
                    Fetching bank details...
                  </div>
                )}
                {ifscError && (
                  <div className="mt-1 text-xs text-red-600">
                    {ifscError}
                  </div>
                )}
              </div>

              {/* Bank Name - Read Only */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">Bank Name</div>
                <input
                  type="text"
                  name="beneficiaryBankName"
                  value={formData.beneficiaryBankName}
                  readOnly
                  placeholder="Auto-populated from IFSC"
                  className={`w-full px-2 py-1 text-xs border border-gray-300 bg-gray-50 text-gray-600 ${formData.beneficiaryBankName ? 'bg-green-50 border-green-300' : ''}`}
                />
              </div>

              {/* Branch Name - Read Only */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">Branch Name</div>
                <input
                  type="text"
                  name="beneficiaryBranchName"
                  value={formData.beneficiaryBranchName}
                  readOnly
                  placeholder="Auto-populated from IFSC"
                  className={`w-full px-2 py-1 text-xs border border-gray-300 bg-gray-50 text-gray-600 ${formData.beneficiaryBranchName ? 'bg-green-50 border-green-300' : ''}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Beneficiary's MMID */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">Beneficiary's MMID</div>
                <input
                  type="text"
                  name="beneficiaryMmid"
                  value={formData.beneficiaryMmid || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 7);
                    setFormData(prev => ({ ...prev, beneficiaryMmid: value }));
                  }}
                  placeholder="Enter MMID"
                  maxLength={7}
                  className="w-full px-2 py-1 text-xs border border-gray-300 bg-white"
                />
              </div>

              {/* Beneficiary's Mobile No. */}
              <div>
                <div className="text-xs font-bold text-gray-700 mb-1">Beneficiary's Mobile No.</div>
                <input
                  type="text"
                  name="beneficiaryMobileNo"
                  value={formData.beneficiaryMobileNo || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    setFormData(prev => ({ ...prev, beneficiaryMobileNo: value }));
                  }}
                  placeholder="Enter mobile number"
                  maxLength={10}
                  className="w-full px-2 py-1 text-xs border border-gray-300 bg-white"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <div className="text-xs font-bold text-gray-700 mb-1">Remarks</div>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, remarks: e.target.value }));
                }}
                placeholder="Enter remarks"
                rows={3}
                className="w-full px-2 py-1 text-xs border border-gray-300 bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons - Only SAVE button */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white text-xs font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'SAVE'}
                </button>
              </div>
      </div>
    </div>
  );
};

export default IMPSOutwardEntry;
