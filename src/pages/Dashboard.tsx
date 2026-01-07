import { useEffect, useState } from 'react';
import { fetchAllSheets, calculateMetrics, type Vehicle } from '../services/googleSheets';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllSheets();
      setVehicles(data);
      setLastSync(new Date());
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

  const metrics = vehicles.length > 0 ? calculateMetrics(vehicles) : null;

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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const kpiCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #3b82f6',
  };

  const kpiLabelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
    fontWeight: '500',
  };

  const kpiValueStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827',
  };

  const kpiSubtextStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.25rem',
  };

  const buttonStyle: React.CSSProperties = {
    background: '#3b82f6',
    color: 'white',
    padding: '0.625rem 1.25rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    background: '#10b981',
    color: 'white',
    padding: '0.625rem 1.25rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const buttonsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  };

  const syncInfoStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  };

  const statusStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#059669',
  };

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
    background: color === 'green' ? '#d1fae5' : color === 'red' ? '#fee2e2' : '#dbeafe',
    color: color === 'green' ? '#065f46' : color === 'red' ? '#991b1b' : '#1e40af',
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
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.125rem', color: '#dc2626' }}>{error}</p>
          <button onClick={loadData} style={{ ...buttonStyle, marginTop: '1rem' }}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const lastVehicles = vehicles.slice(0, 10);

  return (
    <div style={containerStyle}>
      {/* Status e Sincronização */}
      <div style={cardStyle}>
        <div style={syncInfoStyle}>
          <div style={statusStyle}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span>
            <span><strong>Google Sheets Conectado</strong></span>
            <span style={{ color: '#6b7280' }}>
              | Última sincronização: {lastSync.toLocaleString('pt-BR')}
            </span>
          </div>
          <div style={buttonsContainerStyle}>
            <button 
              onClick={() => window.open('https://docs.google.com/spreadsheets/d/1M6cez9KsP0KdvkYrcwITd4eMkA10KpYUmPxIvNGCmEI/edit', '_blank')}
              style={secondaryButtonStyle}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              Acesso aos Dados Google
            </button>
            <button onClick={loadData} style={buttonStyle}>
              Sincronizar
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      {metrics && (
        <div style={gridStyle}>
          <div style={kpiCardStyle}>
            <div style={kpiLabelStyle}>Total de Veículos</div>
            <div style={kpiValueStyle}>{metrics.totalVeiculos}</div>
          </div>

          <div style={{ ...kpiCardStyle, borderLeftColor: '#10b981' }}>
            <div style={kpiLabelStyle}>Veículos Vendidos</div>
            <div style={kpiValueStyle}>{metrics.veiculosVendidos}</div>
            <div style={kpiSubtextStyle}>
              {((metrics.veiculosVendidos / metrics.totalVeiculos) * 100).toFixed(1)}% do total
            </div>
          </div>

          <div style={{ ...kpiCardStyle, borderLeftColor: '#f59e0b' }}>
            <div style={kpiLabelStyle}>Novos no Pátio</div>
            <div style={kpiValueStyle}>{metrics.novosNoPatio}</div>
          </div>

          <div style={{ ...kpiCardStyle, borderLeftColor: '#ef4444' }}>
            <div style={kpiLabelStyle}>Ocorrências</div>
            <div style={kpiValueStyle}>{metrics.ocorrencias}</div>
          </div>
        </div>
      )}

      {/* Resumo Financeiro */}
      {metrics && (
        <div style={gridStyle}>
          <div style={{ ...kpiCardStyle, borderLeftColor: '#3b82f6' }}>
            <div style={kpiLabelStyle}>Receita Total</div>
            <div style={{ ...kpiValueStyle, fontSize: '1.5rem' }}>
              {formatCurrency(metrics.totalVendido)}
            </div>
            <div style={kpiSubtextStyle}>Total vendido no período</div>
          </div>

          <div style={{ ...kpiCardStyle, borderLeftColor: '#10b981' }}>
            <div style={kpiLabelStyle}>Valor Recebido</div>
            <div style={{ ...kpiValueStyle, fontSize: '1.5rem' }}>
              {formatCurrency(metrics.totalRecebido)}
            </div>
            <div style={kpiSubtextStyle}>Pagamentos confirmados</div>
          </div>

          <div style={{ ...kpiCardStyle, borderLeftColor: '#8b5cf6' }}>
            <div style={kpiLabelStyle}>Taxa de Recuperação</div>
            <div style={{ ...kpiValueStyle, fontSize: '1.5rem' }}>
              {metrics.taxaRecuperacao.toFixed(1)}%
            </div>
            <div style={kpiSubtextStyle}>Retorno sobre investimento</div>
          </div>
        </div>
      )}

      {/* Últimos Veículos */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>Últimos Veículos Adicionados</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Placa</th>
                <th style={thStyle}>Veículo</th>
                <th style={thStyle}>Situação</th>
                <th style={thStyle}>Avaliação</th>
                <th style={thStyle}>Valor FIPE</th>
                <th style={thStyle}>Valor Sugerido</th>
                <th style={thStyle}>Valor Vendido</th>
              </tr>
            </thead>
            <tbody>
              {lastVehicles.map((vehicle, index) => (
                <tr key={index}>
                  <td style={tdStyle}><strong>{vehicle.placa}</strong></td>
                  <td style={tdStyle}>{vehicle.marca} {vehicle.modelo}</td>
                  <td style={tdStyle}>
                    <span style={badgeStyle(vehicle.situacao.includes('VENDIDO') ? 'green' : vehicle.situacao.includes('PROIBIDO') ? 'red' : 'blue')}>
                      {vehicle.situacao}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={badgeStyle(vehicle.avaliacao === 'RECUPERÁVEL' ? 'blue' : 'yellow')}>
                      {vehicle.avaliacao}
                    </span>
                  </td>
                  <td style={tdStyle}>{formatCurrency(vehicle.valorFipe)}</td>
                  <td style={tdStyle}>{formatCurrency(vehicle.valorSugerido)}</td>
                  <td style={tdStyle}>
                    {vehicle.valorVendido > 0 ? formatCurrency(vehicle.valorVendido) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
