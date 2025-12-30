import { useEffect, useState } from 'react';
import { fetchAllSheets, VehicleData } from '../services/googleSheets';

type TabKey = 'resumo' | 'novosNoPatio' | 'vendaAutorizada' | 'vendidoNaoRecebido' | 'vendidoRecebido' | 'ocorrencia' | 'proibidaVenda';

interface TabConfig {
  key: TabKey;
  label: string;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const TABS: TabConfig[] = [
  { key: 'resumo', label: 'Todos', color: 'text-white', bgColor: 'bg-teal-700', hoverColor: 'hover:bg-teal-800' },
  { key: 'novosNoPatio', label: 'Novos', color: 'text-white', bgColor: 'bg-green-600', hoverColor: 'hover:bg-green-700' },
  { key: 'vendaAutorizada', label: 'Autorizado', color: 'text-white', bgColor: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600' },
  { key: 'vendidoNaoRecebido', label: 'Aguardando', color: 'text-white', bgColor: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
  { key: 'vendidoRecebido', label: 'Recebido', color: 'text-white', bgColor: 'bg-green-600', hoverColor: 'hover:bg-green-700' },
  { key: 'ocorrencia', label: 'Ocorrências', color: 'text-white', bgColor: 'bg-red-600', hoverColor: 'hover:bg-red-700' },
  { key: 'proibidaVenda', label: 'Proibido', color: 'text-white', bgColor: 'bg-gray-600', hoverColor: 'hover:bg-gray-700' },
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

  function getStatusBadge(situacao: string) {
    if (situacao.includes('VENDIDO RECEBIDO')) {
      return { label: 'Vendido', className: 'bg-green-100 text-green-800' };
    }
    if (situacao.includes('VENDIDO')) {
      return { label: 'Vendido', className: 'bg-blue-100 text-blue-800' };
    }
    if (situacao.includes('PROIBIDO')) {
      return { label: 'Proibido', className: 'bg-red-100 text-red-800' };
    }
    if (situacao.includes('VENDA AUTORIZADA')) {
      return { label: 'Autorizado', className: 'bg-yellow-100 text-yellow-800' };
    }
    if (situacao.includes('NOVO')) {
      return { label: 'Novo', className: 'bg-purple-100 text-purple-800' };
    }
    return { label: 'Ativo', className: 'bg-gray-100 text-gray-800' };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
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

  return (
    <div className="space-y-6">
      {/* Card de Status - Google Sheets */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Google Sheets Conectado</p>
            <p className="text-sm text-gray-500">Última sincronização: {new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition border border-yellow-300 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sincronizar
        </button>
      </div>

      {/* Campo de Busca com borda tracejada */}
      <div className="border-2 border-dashed border-orange-400 rounded-lg p-1 bg-white">
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
            className="block w-full pl-10 pr-3 py-3 border-0 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>
      </div>

      {/* Botões de Navegação - Pills */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = allData?.[tab.key]?.length || 0;
          const isActive = activeTab === tab.key;
          
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                isActive
                  ? `${tab.bgColor} ${tab.color}`
                  : `bg-gray-200 text-gray-700 hover:bg-gray-300`
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Lista de Veículos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {TABS.find(t => t.key === activeTab)?.label || 'Veículos'}
          </h2>
          <span className="text-sm text-gray-600">{filteredData.length} veículos encontrados</span>
        </div>

        {filteredData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-900">Nenhum veículo encontrado</p>
            <p className="text-sm text-gray-600 mt-1">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((veiculo, index) => {
              const statusBadge = getStatusBadge(veiculo.situacao);
              
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Placa e Status */}
                    <div className="lg:col-span-2">
                      <p className="text-lg font-bold text-gray-900">{veiculo.placa}</p>
                      <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Informações do Veículo */}
                    <div className="lg:col-span-3">
                      <p className="font-semibold text-gray-900">{veiculo.marca}</p>
                      <p className="text-sm text-gray-600">{veiculo.modelo}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(veiculo.dataEntrada)}
                      </p>
                    </div>

                    {/* Métricas Financeiras */}
                    <div className="lg:col-span-5 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Valor FIPE</p>
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(veiculo.fipe)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Valor Sugerido</p>
                        <p className="text-sm font-bold text-teal-700">{formatCurrency(veiculo.valorSugerido)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Rentabilidade</p>
                        <p className="text-sm font-bold text-green-700">
                          {veiculo.vlrVendido > 0 && veiculo.fipe > 0
                            ? `${((veiculo.vlrVendido / veiculo.fipe) * 100).toFixed(1)}%`
                            : '-'}
                        </p>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="lg:col-span-2 flex gap-2 justify-end">
                      <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition">
                        Docs
                      </button>
                      <button className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition">
                        Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rodapé com Totais */}
      {filteredData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total FIPE</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredData.reduce((sum, v) => sum + v.fipe, 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Sugerido</p>
              <p className="text-2xl font-bold text-teal-700">
                {formatCurrency(filteredData.reduce((sum, v) => sum + v.valorSugerido, 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Vendido</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(filteredData.reduce((sum, v) => sum + v.vlrVendido, 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
