import { useEffect, useState } from 'react';
import { fetchAllSheets, VehicleData } from '../services/googleSheets';

type TabKey = 'resumo' | 'novosNoPatio' | 'vendaAutorizada' | 'vendidoNaoRecebido' | 'vendidoRecebido' | 'ocorrencia' | 'proibidaVenda';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const TABS: TabConfig[] = [
  { key: 'resumo', label: 'Todos', icon: '📊', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-500' },
  { key: 'novosNoPatio', label: 'Novos', icon: '🆕', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-500' },
  { key: 'vendaAutorizada', label: 'Autorizado', icon: '✅', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-500' },
  { key: 'vendidoNaoRecebido', label: 'Aguardando', icon: '⏳', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-500' },
  { key: 'vendidoRecebido', label: 'Recebido', icon: '💰', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-500' },
  { key: 'ocorrencia', label: 'Ocorrências', icon: '⚠️', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-500' },
  { key: 'proibidaVenda', label: 'Proibido', icon: '🚫', bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-500' },
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
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  function getSituacaoBadgeClass(situacao: string): string {
    if (situacao.includes('VENDIDO RECEBIDO')) return 'bg-green-100 text-green-800 border-green-300';
    if (situacao.includes('VENDIDO')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (situacao.includes('PROIBIDO')) return 'bg-red-100 text-red-800 border-red-300';
    if (situacao.includes('VENDA AUTORIZADA')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (situacao.includes('NOVO')) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto mt-8">
        <h3 className="text-red-800 font-semibold mb-2">Erro ao Carregar Dados</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const currentTabConfig = TABS.find(t => t.key === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Veículos</h1>
          <p className="text-gray-600 mt-1">Visualize e gerencie todos os veículos por categoria</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </button>
      </div>

      {/* Tabs de Navegação */}
      <div className="bg-white rounded-xl shadow-md p-2">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const count = allData?.[tab.key]?.length || 0;
            const isActive = activeTab === tab.key;
            
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                  isActive
                    ? `${tab.bgColor} ${tab.textColor} border-2 ${tab.borderColor} shadow-sm`
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-white bg-opacity-50' : 'bg-gray-200'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por placa, marca, modelo ou situação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Exibindo <span className="font-semibold text-gray-900">{filteredData.length}</span> de{' '}
          <span className="font-semibold text-gray-900">{allData?.[activeTab]?.length || 0}</span> veículos
        </p>
      </div>

      {/* Tabela de Veículos */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Placa</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Veículo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Situação</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avaliação</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Valor FIPE</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Valor Sugerido</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Valor Vendido</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Data Entrada</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Observação</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">Nenhum veículo encontrado</p>
                    <p className="text-sm mt-1">Tente ajustar os filtros de busca</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((veiculo, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">{veiculo.placa}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{veiculo.marca}</div>
                      <div className="text-sm text-gray-600">{veiculo.modelo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getSituacaoBadgeClass(veiculo.situacao)}`}>
                        {veiculo.situacao.length > 25 ? veiculo.situacao.substring(0, 25) + '...' : veiculo.situacao}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        veiculo.avaliacao === 'RECUPERÁVEL' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {veiculo.avaliacao}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(veiculo.fipe)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-medium">
                      {formatCurrency(veiculo.valorSugerido)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">
                      {formatCurrency(veiculo.vlrVendido)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(veiculo.dataEntrada)}
                      {veiculo.dias > 0 && (
                        <div className="text-xs text-gray-400 mt-1">{veiculo.dias} dias</div>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-600 truncate" title={veiculo.observacao}>
                        {veiculo.observacao || '-'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rodapé com informações */}
      {filteredData.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total FIPE</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(filteredData.reduce((sum, v) => sum + v.fipe, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sugerido</p>
              <p className="text-xl font-bold text-blue-700">
                {formatCurrency(filteredData.reduce((sum, v) => sum + v.valorSugerido, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Vendido</p>
              <p className="text-xl font-bold text-green-700">
                {formatCurrency(filteredData.reduce((sum, v) => sum + v.vlrVendido, 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
