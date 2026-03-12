# Axios API Implementation

This directory contains the centralized Axios-based API layer for the IMPS Banking Interface.

## 📁 File Structure

```
src/api/
├── api.js          # Main Axios configuration and API functions
└── README.md       # This documentation file
```

## 🚀 Features Implemented

### ✅ **Axios Setup**
- ✅ Axios package installed
- ✅ Central Axios instance with baseURL and headers
- ✅ Request/Response interceptors for error handling
- ✅ Timeout protection (10 seconds)
- ✅ Automatic retry logic for failed requests

### ✅ **GET Requests**
- ✅ `fetchRemitterDetails(accountNumber)` - Fetch account details by account number
- ✅ `fetchBankDetails(ifscCode)` - Fetch bank/branch details by IFSC code

### ✅ **POST Requests**
- ✅ `saveTransaction(transactionData)` - Save complete transaction data

### ✅ **Integration**
- ✅ IFSC field auto-populates Bank and Branch names using Axios GET
- ✅ SAVE button uses Axios POST to send form data
- ✅ Content-Type: application/json headers included

### ✅ **Mock Logic**
- ✅ Try-catch blocks for graceful error handling
- ✅ Automatic fallback to mock data when backend is unavailable
- ✅ Success/error alerts visible in UI
- ✅ Environment-based switching between mock and real APIs

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_USE_MOCK_API=true
VITE_API_TIMEOUT=10000
```

### Switching Between Mock and Real APIs

**Development Mode (Mock):**
```bash
VITE_USE_MOCK_API=true
```

**Production Mode (Real API):**
```bash
VITE_USE_MOCK_API=false
```

## 📡 API Functions

### 1. fetchRemitterDetails(accountNumber)

Fetches remitter/account details based on account number.

**Parameters:**
- `accountNumber` (string): Complete 12-digit account number

**Returns:**
```javascript
{
  success: true,
  data: {
    accountName: 'Ajay Krishna Javali',
    accountBalance: '50,000.00',
    remitterMmid: '987654321',
    remitterMobile: '9876543210',
    withdrawableAmount: '49,000.00'
  }
}
```

**Usage:**
```javascript
import { fetchRemitterDetails } from '../api/api';

const result = await fetchRemitterDetails('500910001900');
if (result.success) {
  console.log('Account details:', result.data);
}
```

### 2. fetchBankDetails(ifscCode)

Fetches bank and branch details based on IFSC code.

**Parameters:**
- `ifscCode` (string): 11-character IFSC code

**Returns:**
```javascript
{
  success: true,
  data: {
    bankName: 'STATE BANK OF INDIA',
    branchName: 'KOLKATA MAIN',
    beneficiaryMmid: '123456789',
    beneficiaryMobileNo: '9021699203'
  }
}
```

**Usage:**
```javascript
import { fetchBankDetails } from '../api/api';

const result = await fetchBankDetails('SBIN0000001');
if (result.success) {
  console.log('Bank details:', result.data);
}
```

### 3. saveTransaction(transactionData)

Saves complete transaction data to backend.

**Parameters:**
- `transactionData` (object): Complete transaction details

**Returns:**
```javascript
{
  success: true,
  data: {
    transactionId: 'TXN1647123456789',
    status: 'SUCCESS',
    message: 'Transaction saved successfully'
  }
}
```

**Usage:**
```javascript
import { saveTransaction } from '../api/api';

const transactionData = {
  txnType: 'IMPS',
  branch: '5009-BANDRA',
  accountNumber: '500910001900',
  transactionAmount: '5000',
  // ... other fields
};

const result = await saveTransaction(transactionData);
if (result.success) {
  alert('Transaction saved successfully!');
}
```

## 🛡️ Error Handling

### Automatic Error Interception

The Axios instance includes comprehensive error handling:

- **Network Errors**: "Network error. Please check your connection."
- **Timeout Errors**: "Request timeout. Please try again."
- **400 Bad Request**: "Bad request. Please check your input."
- **401 Unauthorized**: "Unauthorized. Please login again."
- **403 Forbidden**: "Access forbidden. You do not have permission."
- **404 Not Found**: "Resource not found."
- **500 Server Error**: "Server error. Please try again later."

### Mock Fallback Logic

When the real API is unavailable, the system automatically:

1. **Detects API failure** through try-catch blocks
2. **Falls back to mock data** with realistic responses
3. **Maintains UI functionality** with success/error alerts
4. **Logs detailed information** for debugging

## 🔄 Request Flow

```
UI Component
    ↓
API Function (fetchRemitterDetails, fetchBankDetails, saveTransaction)
    ↓
Axios Instance (with interceptors)
    ↓
Real API or Mock Data (based on REACT_APP_USE_MOCK_API)
    ↓
Response with Error Handling
    ↓
UI Update (success/error alerts)
```

## 🎯 Integration Points

### 1. IFSC Field Integration

The IFSC input field automatically:
- Calls `fetchBankDetails()` when 11 characters are entered
- Populates Bank Name and Branch Name fields
- Shows loading spinner during API call
- Displays error message for invalid IFSC codes

### 2. Account Lookup Integration

The account number lookup automatically:
- Calls `fetchRemitterDetails()` when complete account number is entered
- Populates account holder details
- Shows loading indicator during API call
- Displays error message for invalid accounts

### 3. SAVE Button Integration

The SAVE button:
- Calls `saveTransaction()` with complete form data
- Shows "Saving..." state during API call
- Displays success message on successful save
- Resets form after successful transaction
- Shows error message if save fails

## 🧪 Testing

### Mock Data Available

The following mock data is available for testing:

**Account Numbers:**
- Any 12-digit account number returns mock remitter details

**IFSC Codes:**
- `SBIN0000001` - STATE BANK OF INDIA, KOLKATA MAIN
- `SBIN0000002` - STATE BANK OF INDIA, MUMBAI MAIN
- `HDFC0000001` - HDFC BANK, DELHI MAIN
- `HDFC0000002` - HDFC BANK, BANGALORE MAIN
- `ICIC0000001` - ICICI BANK, BANGALORE CITY
- `PNB0000001` - PUNJAB NATIONAL BANK, CHANDIGARH
- `PNB0000002` - PUNJAB NATIONAL BANK, DELHI

## 📊 Monitoring & Debugging

### Console Logging

All API requests and responses are logged to console:
- Request method, URL, and data
- Response status and data
- Error details with context

### Network Tab

Check browser's Network tab to see:
- Actual HTTP requests being made
- Request/response headers
- Response times and status codes

## 🚀 Production Deployment

### For Production Environment:

1. **Set environment variables:**
   ```bash
   VITE_USE_MOCK_API=false
   VITE_API_BASE_URL=https://your-api-server.com/api
   ```

2. **Ensure backend endpoints exist:**
   - `GET /api/account/lookup?accountNumber={accountNumber}`
   - `GET /api/bank/ifsc/{ifscCode}`
   - `POST /api/save-transaction`

3. **Configure CORS** on your backend to allow requests from your frontend domain.

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Backend needs to allow frontend domain
2. **Timeout Errors**: Check network connectivity and API response times
3. **404 Errors**: Verify API endpoints exist and URLs are correct
4. **Validation Errors**: Ensure request data matches expected format

### Debug Mode:

Enable detailed logging by checking browser console for:
- API request URLs and parameters
- Response data and status codes
- Error messages and stack traces

## 📝 Adding New API Functions

To add new API functions:

1. **Add endpoint to constants:**
   ```javascript
   // In api.js
   const NEW_ENDPOINT = '/new-endpoint';
   ```

2. **Create API function:**
   ```javascript
   export const newApiFunction = async (param) => {
     try {
       const response = await api.get(`${NEW_ENDPOINT}/${param}`);
       return { success: true, data: response.data };
     } catch (error) {
       // Error handling
     }
   };
   ```

3. **Add mock data:**
   ```javascript
   const mockData = {
     newEndpoint: { /* mock response */ }
   };
   ```

4. **Import and use in components:**
   ```javascript
   import { newApiFunction } from '../api/api';
   ```

## ✅ Benefits of This Implementation

1. **Clean Architecture**: Separation of concerns between UI and API logic
2. **Error Resilience**: Automatic fallback to mock data
3. **Easy Testing**: Mock data available for development
4. **Production Ready**: Real API integration with proper error handling
5. **Maintainable**: Centralized configuration and functions
6. **Scalable**: Easy to add new API endpoints
7. **Debuggable**: Comprehensive logging and error reporting
