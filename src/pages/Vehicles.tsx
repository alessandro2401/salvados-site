import { useEffect, useState } from 'react';
import { fetchAllSheets, type Vehicle } from '../services/googleSheets';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAba, setFilterAba] = useState('Todos');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllSheets();
      setVehicles(data);
    } catch (err) {
      setError('Erro ao carregar dados do Google Sheets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtrar veículos
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.situacao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAba = filterAba === 'Todos' || vehicle.aba === filterAba;
    
    return matchesSearch && matchesAba;
  });

  // Contar veículos por aba
  const abaCounts = {
    'Todos': vehicles.length,
    'Novos No Pátio': vehicles.filter(v => v.aba === 'Novos No Pátio').length,
    'Venda Autorizada': vehicles.filter(v => v.aba === 'Venda Autorizada').length,
    'Vendido e Não Recebido': vehicles.filter(v => v.aba === 'Vendido e Não Recebido').length,
    'Vendido e Recebido': vehicles.filter(v => v.aba === 'Vendido e Recebido').length,
    'Ocorrências': vehicles.filter(v => v.aba === 'Ocorrências').length,
    'Proibida a Venda': vehicles.filter(v => v.aba === 'Proibida a Venda').length,
  };

  // Estilos
  const containerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem',
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '1rem',
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    marginBottom: '1.5rem',
  };

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  };

  const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    background: isActive ? '#3b82f6' : '#f3f4f6',
    color: isActive ? 'white' : '#6b7280',
    transition: 'all 0.2s',
  });

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '0.75rem',
    borderBottom: '2px solid #e5e7eb',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  };

  const tdStyle: React.CSSProperties = {
    padding: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.875rem',
    color: '#6b7280',
  };

  const badgeStyle = (color: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: color === 'green' ? '#d1fae5' : color === 'red' ? '#fee2e2' : color === 'yellow' ? '#fef3c7' : '#dbeafe',
    color: color === 'green' ? '#065f46' : color === 'red' ? '#991b1b' : color === 'yellow' ? '#92400e' : '#1e40af',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>Carregando veículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.125rem', color: '#dc2626' }}>{error}</p>
          <button 
            onClick={loadData} 
            style={{ 
              background: '#3b82f6', 
              color: 'white', 
              padding: '0.625rem 1.25rem', 
              borderRadius: '0.5rem', 
              border: 'none', 
              fontWeight: '600', 
              cursor: 'pointer', 
              marginTop: '1rem' 
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Veículos</h1>
        
        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar por placa, marca, modelo ou situação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />

        {/* Tabs de filtro */}
        <div style={tabsContainerStyle}>
          {Object.entries(abaCounts).map(([aba, count]) => (
            <button
              key={aba}
              onClick={() => setFilterAba(aba)}
              style={getTabStyle(filterAba === aba)}
            >
              {aba} ({count})
            </button>
          ))}
        </div>

        {/* Contador */}
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
          {filteredVehicles.length} veículos encontrados
        </p>

        {/* Tabela de veículos */}
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Placa</th>
                <th style={thStyle}>Veículo</th>
                <th style={thStyle}>Situação</th>
                <th style={thStyle}>Avaliação</th>
                <th style={thStyle}>Data Entrada</th>
                <th style={thStyle}>Valor FIPE</th>
                <th style={thStyle}>Valor Sugerido</th>
                <th style={thStyle}>Valor Vendido</th>
                <th style={thStyle}>Dias</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: 'center', padding: '2rem' }}>
                    Nenhum veículo encontrado
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td style={tdStyle}><strong>{vehicle.placa}</strong></td>
                    <td style={tdStyle}>{vehicle.marca} {vehicle.modelo}</td>
                    <td style={tdStyle}>
                      <span style={badgeStyle(
                        vehicle.situacao.includes('VENDIDO') ? 'green' : 
                        vehicle.situacao.includes('PROIBIDO') ? 'red' : 
                        'blue'
                      )}>
                        {vehicle.situacao}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={badgeStyle(vehicle.avaliacao === 'RECUPERÁVEL' ? 'blue' : 'yellow')}>
                        {vehicle.avaliacao}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {vehicle.dataEntrada ? new Date(vehicle.dataEntrada).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td style={tdStyle}>{formatCurrency(vehicle.valorFipe)}</td>
                    <td style={tdStyle}>{formatCurrency(vehicle.valorSugerido)}</td>
                    <td style={tdStyle}>
                      {vehicle.valorVendido > 0 ? formatCurrency(vehicle.valorVendido) : '-'}
                    </td>
                    <td style={tdStyle}>{vehicle.dias > 0 ? `${vehicle.dias}d` : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
