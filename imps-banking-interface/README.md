# IMPS Banking Interface

A complete React-based banking interface for IMPS (Immediate Payment Service) transactions, built with Vite and Tailwind CSS.

## Overview

This application simulates an IMPS Host Interface system that allows banks to process immediate fund transfers, validate beneficiaries, and manage transactions through a professional web interface.

## Features

### 🏦 Core Banking Operations
- **Outward Fund Transfer** (HostOwReqPay) - Send money to other accounts
- **Inward Transactions** (HostIwReqPay) - View and manage received money
- **Beneficiary Validation** - Validate account details before transfers
- **Heartbeat Status** (HostOwReqHbt) - Monitor system health

### 🎨 Professional UI/UX
- Modern, responsive design with Tailwind CSS
- Banking-grade color scheme (Indigo/Slate)
- Mobile-friendly interface with collapsible sidebar
- Real-time status updates and notifications

### 🔧 Technical Features
- XML-based request/response simulation
- Comprehensive error code mapping
- Transaction history and analytics
- Form validation with real-time feedback
- Loading states and error handling

## Project Structure

```
src/
├── assets/          # Images and icons
├── components/      # Reusable UI components
│   ├── Button.jsx
│   ├── InputField.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── TransactionStatusBadge.jsx
├── pages/           # Main application screens
│   ├── Dashboard.jsx
│   ├── OutwardTransfer.jsx
│   ├── InwardTransactions.jsx
│   └── BeneficiaryValidation.jsx
├── services/        # API and business logic
│   └── api.js
├── hooks/           # Custom React hooks
│   └── useTransaction.js
├── utils/           # Utility functions
│   ├── formatters.js
│   └── errorCodes.js
└── App.jsx          # Main application component
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5174`

## Usage

### Dashboard
- View transaction summary and statistics
- Monitor system heartbeat status
- Quick access to all banking operations
- Recent transaction history

### Outward Transfer
- Fill in payer and payee account details
- Specify transfer amount and remarks
- Preview transaction before confirmation
- Real-time beneficiary validation

### Inward Transactions
- View all received money transactions
- Filter by status and search functionality
- Detailed transaction information
- Export capabilities (future enhancement)

### Beneficiary Validation
- Validate account holder details
- Check account status and existence
- Reduce transaction failure risks
- Mobile number verification support

## IMPS Error Codes

The application includes comprehensive error code mapping:

- **00** - Success
- **01-09** - Various error conditions (Invalid account, Insufficient funds, etc.)
- **91** - Deemed Approved
- **92** - Reversed
- **93** - Chargeback

See `src/utils/errorCodes.js` for complete mapping.

## API Simulation

The application includes a mock API service that simulates:
- XML request/response generation
- Realistic processing delays
- Various success and failure scenarios
- Error code responses based on input validation

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Styling
- Built with Tailwind CSS
- Custom component classes in `src/index.css`
- Responsive design with mobile-first approach
- Banking-industry color scheme

### Components
All components are reusable and follow React best practices:
- Props validation
- Accessibility features
- Loading and error states
- Consistent styling patterns

## Future Enhancements

- [ ] Real backend API integration
- [ ] Transaction receipts and PDF export
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Transaction scheduling
- [ ] Bulk transfer operations
- [ ] Two-factor authentication
- [ ] Audit logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for demonstration purposes only.

## Support

For questions or support, please refer to the project documentation or create an issue in the repository.
