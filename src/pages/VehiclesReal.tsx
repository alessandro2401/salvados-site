import { useEffect, useState } from 'react';
import { fetchAllSheets, VehicleData, SHEET_TABS } from '../services/googleSheets';

type TabKey = 'resumo' | 'novosNoPatio' | 'vendaAutorizada' | 'vendidoNaoRecebido' | 'vendidoRecebido' | 'ocorrencia' | 'proibidaVenda';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: string;
  color: string;
}

const TABS: TabConfig[] = [
  { key: 'resumo', label: 'Resumo Geral', icon: '📊', color: 'blue' },
  { key: 'novosNoPatio', label: 'Novos no Pátio', icon: '🆕', color: 'purple' },
  { key: 'vendaAutorizada', label: 'Venda Autorizada', icon: '✅', color: 'green' },
  { key: 'vendidoNaoRecebido', label: 'Vendido (Aguardando)', icon: '⏳', color: 'yellow' },
  { key: 'vendidoRecebido', label: 'Vendido e Recebido', icon: '💰', color: 'green' },
  { key: 'ocorrencia', label: 'Ocorrências', icon: '⚠️', color: 'red' },
  { key: 'proibidaVenda', label: 'Proibido a Venda', icon: '🚫', color: 'gray' },
];

export default function VehiclesReal() {
  const [activeTab, setActiveTab] = useState<TabKey>('resumo');
  const [allData, setAllData] = useState<Record<TabKey, VehicleData[]> | null>(null);
  const [filteredData, setFilteredData] = useState<VehicleData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (allData) {
      filterData();
    }
  }, [activeTab, searchTerm, allData]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchAllSheets();
      setAllData(data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados da planilha. Verifique a conexão.');
      setLoading(false);
    }
  }

  function filterData() {
    if (!allData) return;
    
    let data = allData[activeTab] || [];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(v =>
        v.placa.toLowerCase().includes(term) ||
        v.marca.toLowerCase().includes(term) ||
        v.modelo.toLowerCase().includes(term) ||
        v.situacao.toLowerCase().includes(term)
      );
    }
    
    setFilteredData(data);
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Erro ao Carregar Dados</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Veículos</h1>
        <p className="text-gray-600 mt-1">Visualize e gerencie todos os veículos salvados por categoria</p>
        <button
          onClick={loadData}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          🔄 Atualizar Dados
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-2 px-4" aria-label="Tabs">
            {TABS.map((tab) => {
              const count = allData?.[tab.key]?.length || 0;
              const isActive = activeTab === tab.key;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`
                    px-2 py-0.5 text-xs font-semibold rounded-full
                    ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}
                  `}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Buscar por placa, marca, modelo ou situação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Results Count */}
        <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600">
          Exibindo {filteredData.length} de {allData?.[activeTab]?.length || 0} veículos
        </div>

        {/* Vehicles Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avaliação</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor FIPE</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Sugerido</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Vlr Vendido</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Vlr Recebido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Entrada</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Dias</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observação</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                    Nenhum veículo encontrado
                  </td>
                </tr>
              ) : (
                filteredData.map((veiculo, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {veiculo.placa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{veiculo.marca}</div>
                      <div className="text-gray-500">{veiculo.modelo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        veiculo.situacao.includes('VENDIDO RECEBIDO') ? 'bg-green-100 text-green-800' :
                        veiculo.situacao.includes('VENDIDO') ? 'bg-yellow-100 text-yellow-800' :
                        veiculo.situacao.includes('VENDA AUTORIZADA') ? 'bg-blue-100 text-blue-800' :
                        veiculo.situacao.includes('NOVO') ? 'bg-purple-100 text-purple-800' :
                        veiculo.situacao.includes('PROIBIDO') ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {veiculo.situacao}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {veiculo.avaliacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(veiculo.fipe)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(veiculo.valorSugerido)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {veiculo.vlrVendido > 0 ? formatCurrency(veiculo.vlrVendido) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right font-medium">
                      {veiculo.vlRecebido > 0 ? formatCurrency(veiculo.vlRecebido) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(veiculo.dataEntrada)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {veiculo.dias > 0 ? `${veiculo.dias}d` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={veiculo.observacao}>
                      {veiculo.observacao || '-'}
                    </td>
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
