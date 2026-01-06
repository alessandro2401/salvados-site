import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardReal from './pages/DashboardReal';
import VehiclesReal from './pages/VehiclesReal';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo e Título */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 40 40" 
                fill="none" 
                className="text-white"
              >
                <rect width="40" height="40" rx="8" fill="currentColor" fillOpacity="0.2"/>
                <path 
                  d="M20 10L28 14V20C28 25 24 29 20 30C16 29 12 25 12 20V14L20 10Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                />
                <path 
                  d="M16 20L19 23L24 17" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <h1 className="text-xl font-bold">ADMINISTRADORA MUTUAL</h1>
                <p className="text-sm text-blue-100">Sistema de Gestão de Veículos Salvados</p>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-colors
                ${isActive('/') 
                  ? 'bg-white text-blue-800' 
                  : 'text-white hover:bg-blue-700'
                }
              `}
            >
              <svg 
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                className="inline mr-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/veiculos"
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-colors
                ${isActive('/veiculos') 
                  ? 'bg-white text-blue-800' 
                  : 'text-white hover:bg-blue-700'
                }
              `}
            >
              <svg 
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                className="inline mr-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Veículos
            </Link>
          </nav>

        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">
              © {new Date().getFullYear()} Administradora Mutual. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm hover:text-white transition-colors">
              Suporte
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Documentação
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardReal />} />
            <Route path="/veiculos" element={<VehiclesReal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
