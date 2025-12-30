import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardReal';
import VehiclesPage from './pages/VehiclesReal';
import './index.css';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Header Azul Escuro - Estilo Potere */}
      <header className="bg-teal-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e Título */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-lg p-2">
                  <svg className="w-8 h-8 text-teal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold">ADMINISTRADORA MUTUAL</h1>
                </div>
              </div>
            </div>
            
            {/* Título do Sistema */}
            <div className="text-right">
              <h2 className="text-lg font-semibold">Sistema de Veículos Salvados</h2>
              <p className="text-sm text-teal-200">Gestão de Frota</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação - Abas */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-3">
            <Link
              to="/"
              className={`px-5 py-2 rounded-full font-medium transition ${
                isActive('/')
                  ? 'bg-teal-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/veiculos"
              className={`px-5 py-2 rounded-full font-medium transition ${
                isActive('/veiculos')
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Veículos
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/veiculos" element={<VehiclesPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-gray-900">Sistema de Gestão de Veículos Salvados</p>
                <p className="text-xs text-gray-600 mt-1">Administradora Mutual © 2025</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Integrado com Google Sheets</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
