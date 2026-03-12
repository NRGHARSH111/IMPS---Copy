<!-- # API Services Architecture

This directory contains the centralized API service layer for the IMPS Banking Interface.

## 📁 File Structure

```
src/services/
├── apiService.js          # Core API service with real and mock implementations
├── serviceAdapter.js      # Adapter that switches between mock/real APIs
└── README.md             # This documentation file

src/constants/
└── apiConstants.js       # All API endpoints, configuration, and constants
```

## 🏗️ Architecture Overview

### 1. **Service Layer Pattern**
- Clean separation between UI and API logic
- Centralized error handling and configuration
- Easy switching between mock and real APIs

### 2. **Key Components**

#### `apiConstants.js`
- **BASE_URL**: Single place to configure API base URL
- **API_ENDPOINTS**: All API endpoints organized by feature
- **ERROR_MESSAGES**: Centralized error messages
- **VALIDATION_RULES**: Input validation patterns

#### `apiService.js`
- **Real API Services**: `transactionService`, `accountService`, `bankService`
- **Mock Services**: `mockServices` for development
- **Error Handler**: Centralized error processing
- **Request Handler**: Generic API request with timeout

#### `serviceAdapter.js`
- **Auto-switching**: Chooses mock/real API based on configuration
- **Clean Interface**: Simple functions for UI components
- **Runtime Switching**: Can change API mode during runtime

## 🚀 Usage Examples

### In Components

```javascript
// Import specific functions
import { saveTransaction, lookupAccount, lookupIfsc } from '../services/serviceAdapter';

// Use in component
const handleSubmit = async () => {
  const result = await saveTransaction(transactionData);
  if (result.success) {
    // Handle success
  } else {
    // Handle error
  }
};
```

### Environment Configuration

```javascript
// .env file
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_USE_MOCK_API=false

// Development (default)
REACT_APP_USE_MOCK_API=true
```

## 🔧 Configuration

### Switching Between Mock and Real APIs

1. **Via Environment Variable** (Recommended):
   ```bash
   # Development with mock
   REACT_APP_USE_MOCK_API=true
   
   # Production with real API
   REACT_APP_USE_MOCK_API=false
   ```

2. **Via Code** (Runtime switching):
   ```javascript
   import serviceAdapter from '../services/serviceAdapter';
   
   // Switch to real API
   serviceAdapter.setUseMock(false);
   
   // Check current mode
   console.log(serviceAdapter.getApiMode()); // 'REAL' or 'MOCK'
   ```

### Changing Base URL

```javascript
// In apiConstants.js
export const API_CONFIG = {
  BASE_URL: 'http://your-api-server.com/api',
  // ... other config
};
```

## 📊 Available Services

### Transaction Service
```javascript
// Save transaction
await saveTransaction(transactionData);
```

### Account Service
```javascript
// Lookup account details
await lookupAccount(accountNumber);
```

### Bank Service
```javascript
// IFSC lookup
await lookupIfsc(ifscCode);

// Bank details
await getBankDetails(bankCode);
```

## 🛡️ Error Handling

The service layer provides automatic error handling:

- **Network Errors**: "Network error. Please check your connection."
- **Server Errors**: "Server error. Please try again later."
- **Validation Errors**: "Bad request. Please check your input."
- **Timeout**: "Request timeout. Please try again."

## 🔄 Request Flow

```
UI Component
    ↓
Service Adapter (chooses mock/real)
    ↓
API Service (handles requests/errors)
    ↓
Real API / Mock Implementation
```

## 🎯 Benefits

1. **Clean Separation**: UI components don't know about API URLs
2. **Centralized Configuration**: Change base URL in one place
3. **Easy Testing**: Switch to mock API for development
4. **Consistent Error Handling**: All errors handled the same way
5. **Type Safety**: Consistent response format
6. **Timeout Protection**: Automatic request timeouts
7. **Environment Support**: Different configs for dev/staging/prod

## 🧪 Development Mode

When `USE_MOCK_API` is true:
- All API calls return mock data
- No network requests are made
- Perfect for development and testing
- Simulates realistic delays (1-1.5 seconds)

## 🚀 Production Mode

When `USE_MOCK_API` is false:
- Real API calls are made
- Network errors are handled gracefully
- Automatic retries and timeouts
- Production-ready error messages

## 📝 Adding New Services

1. Add endpoints to `apiConstants.js`
2. Implement service in `apiService.js`
3. Add wrapper in `serviceAdapter.js`
4. Import and use in components

Example:
```javascript
// apiConstants.js
export const API_ENDPOINTS = {
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings'
  }
};

// apiService.js
export const userService = {
  getProfile: () => apiRequest(API_ENDPOINTS.USER.PROFILE),
  updateSettings: (data) => apiRequest(API_ENDPOINTS.USER.SETTINGS, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// serviceAdapter.js
async getUserProfile() {
  return this.useMock ? mockServices.mockGetProfile() : userService.getProfile();
}
``` -->
