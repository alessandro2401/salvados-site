import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardReal from './pages/DashboardReal';
import VehiclesReal from './pages/VehiclesReal';

function Navigation() {
  const location = useLocation();
  
  return (
    <header className="bg-gradient-to-r from-[#0A4A6E] to-[#1E5A7E] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo e Título - Esquerda */}
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-lg p-2.5">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-[#0A4A6E]">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">POTERE</h1>
          </div>
          <div className="ml-2 bg-white/10 rounded px-3 py-1">
            <span className="text-xs font-medium">REMIGGI</span>
          </div>
        </div>

        {/* Título do Sistema - Direita */}
        <div className="text-right">
          <h2 className="text-lg font-semibold">Sistema de Aluguéis</h2>
          <p className="text-sm text-blue-200">Gestão de Frota</p>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<DashboardReal />} />
          <Route path="/veiculos" element={<VehiclesReal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
