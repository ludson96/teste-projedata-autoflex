import { useState } from 'react';
import { RawMaterialManager } from './components/RawMaterialManager';
import { ProductManager } from './components/ProductManager';

function App() {
  const [activeTab, setActiveTab] = useState<'materials' | 'products'>('materials');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Factory Inventory</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button onClick={() => setActiveTab('materials')}
                  className={`${activeTab === 'materials' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Raw Materials
                </button>
                <button onClick={() => setActiveTab('products')}
                  className={`${activeTab === 'products' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'materials' && <RawMaterialManager />}
        {activeTab === 'products' && <ProductManager />}
      </main>
    </div>
  );
}

export default App;