import { useState } from 'react';

const DashboardLayout = ({ activeView, setActiveView, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">TRUST FINTECH  CO-OPERATIVE BANK LIMITED PUNE</h1>
              <div className="flex space-x-6 mt-1">
                <span 
                  className="text-xs hover:text-blue-200 cursor-pointer transition-colors"
                  onClick={() => setActiveView('dashboard')}
                >
          
                </span>
                <span 
                  className="text-xs hover:text-blue-200 cursor-pointer transition-colors"
                  onClick={() => setActiveView('impsForm')}
                >
                  
                </span>
                <span 
                  className="text-xs hover:text-blue-200 cursor-pointer transition-colors"
                  onClick={() => setActiveView('reports')}
                >
          
                </span>
                <span 
                  className="text-xs hover:text-blue-200 cursor-pointer transition-colors"
                  onClick={() => setActiveView('settings')}
                >
                
                </span>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 bg-white shadow-lg`}>
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('impsForm')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'impsForm' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                IMPS Outward
              </button>
              <button
                onClick={() => setActiveView('inwardTransactions')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'inwardTransactions' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Inward Transactions
              </button>
              <button
                onClick={() => setActiveView('beneficiaryValidation')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'beneficiaryValidation' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Beneficiary Validation
              </button>
              <button
                onClick={() => setActiveView('heartbeat')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'heartbeat' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                CBS Heartbeat
              </button>
              <button
                onClick={() => setActiveView('reports')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'reports' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setActiveView('settings')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'settings' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Settings
              </button>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
