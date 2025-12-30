import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import VehiclesPage from './pages/Vehicles';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Sistema de Gestão de Veículos Salvados
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Administradora Mutual - Gerenciamento de Veículos
            </p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8 py-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                Dashboard
              </Link>
              <Link to="/veiculos" className="text-gray-600 hover:text-gray-900">
                Veículos
              </Link>
              <Link to="/importar" className="text-gray-600 hover:text-gray-900">
                Importar
              </Link>
              <Link to="/relatorios" className="text-gray-600 hover:text-gray-900">
                Relatórios
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/veiculos" element={<VehiclesPage />} />
            <Route path="/importar" element={<Importar />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
            © 2025 Administradora Mutual - Sistema de Gestão de Veículos Salvados
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Páginas Simplificadas
function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total de Veículos</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Pendentes</h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Finalizados</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
      </div>
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Sistema em Desenvolvimento:</strong> Este é um protótipo visual. 
              As funcionalidades de backend (banco de dados, APIs) ainda precisam ser configuradas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Veiculos() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestão de Veículos</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Funcionalidade em desenvolvimento. Aqui será possível visualizar, cadastrar e editar veículos salvados.
        </p>
      </div>
    </div>
  );
}

function Importar() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Importar Dados</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Funcionalidade em desenvolvimento. Aqui será possível importar dados de:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Planilhas Excel (.xlsx)</li>
          <li>Google Sheets</li>
          <li>Arquivos CSV</li>
        </ul>
      </div>
    </div>
  );
}

function Relatorios() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Relatórios</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Funcionalidade em desenvolvimento. Aqui será possível gerar relatórios de performance e análises.
        </p>
      </div>
    </div>
  );
}

export default App;
