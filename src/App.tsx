import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';

function Navigation() {
  const location = useLocation();
  
  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: 'white',
    padding: '1.5rem 0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };
  
  const containerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: '1.75rem',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.025em',
  };
  
  const subtitleStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    margin: '0.25rem 0 0 0',
    opacity: 0.95,
    fontWeight: '400',
  };
  
  const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
  };
  
  const getLinkStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '0.625rem 1.25rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9375rem',
    background: isActive ? 'white' : 'rgba(255,255,255,0.1)',
    color: isActive ? '#1e3a8a' : 'white',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
  });
  
  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div>
          <h1 style={titleStyle}>ADMINISTRADORA MUTUAL</h1>
          <p style={subtitleStyle}>Sistema de Gestão de Veículos Salvados</p>
        </div>
        <nav style={navStyle}>
          <Link to="/" style={getLinkStyle(location.pathname === '/')}>
            Dashboard
          </Link>
          <Link to="/veiculos" style={getLinkStyle(location.pathname === '/veiculos')}>
            Veículos
          </Link>
        </nav>
      </div>
    </header>
  );
}

function App() {
  const appStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };
  
  return (
    <Router>
      <div style={appStyle}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/veiculos" element={<Vehicles />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
