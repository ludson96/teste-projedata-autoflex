import { useState } from 'react';
import { RawMaterialManager } from './components/RawMaterialManager';
import { ProductManager } from './components/ProductManager';

const AppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6" />
  </svg>
);


function App() {
  const [activeTab, setActiveTab] = useState<'materials' | 'products'>('materials');

  const tabClasses = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ease-in-out";
  const activeClasses = "border-blue-500 text-gray-900";
  const inactiveClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="shrink-0 flex items-center gap-2">
                <AppIcon />
                <h1 className="text-xl font-bold text-gray-800">Factory Inventory</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button onClick={() => setActiveTab('materials')}
                  className={`${tabClasses} ${activeTab === 'materials' ? activeClasses : inactiveClasses}`}>
                  Raw Materials
                </button>
                <button onClick={() => setActiveTab('products')}
                  className={`${tabClasses} ${activeTab === 'products' ? activeClasses : inactiveClasses}`}>
                  Products
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        {activeTab === 'materials' && <RawMaterialManager />}
        {activeTab === 'products' && <ProductManager />}
      </main>
    </div>
  );
}

export default App;