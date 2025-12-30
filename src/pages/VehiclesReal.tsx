import { useState, useEffect } from 'react';
import { fetchAllSheets, VehicleData } from '../services/googleSheets';

type TabKey = 'resumo' | 'novosNoPatio' | 'vendaAutorizada' | 'vendidoNaoRecebido' | 'vendidoRecebido' | 'ocorrencia' | 'proibidaVenda';

interface TabConfig {
  key: TabKey;
  label: string;
  emoji: string;
}

const TABS: TabConfig[] = [
  { key: 'resumo', label: 'Todos', emoji: '📊' },
  { key: 'novosNoPatio', label: 'Novos', emoji: '🆕' },
  { key: 'vendaAutorizada', label: 'Autorizado', emoji: '✅' },
  { key: 'vendidoNaoRecebido', label: 'Aguardando', emoji: '⏳' },
  { key: 'vendidoRecebido', label: 'Recebido', emoji: '💰' },
  { key: 'ocorrencia', label: 'Ocorrências', emoji: '⚠️' },
  { key: 'proibidaVenda', label: 'Proibido', emoji: '🚫' },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
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
      <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg width="12" height="12" className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Google Sheets Conectado</p>
            <p className="text-xs text-gray-500">Última sincronização: {new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 text-sm border-2 border-dashed border-yellow-400 text-gray-700 rounded-lg hover:bg-yellow-50 transition"
        >
          🔄 Sincronizar
        </button>
      </div>

      {/* Campo de Busca */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por placa, marca, modelo ou situação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-10 border-2 border-dashed border-orange-400 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
        />
        <svg width="20" height="20" className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Navegação por Abas - Botões Pill */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = allData?.[tab.key]?.length || 0;
          const isActive = activeTab === tab.key;
          
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                isActive
                  ? 'bg-teal-700 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              {tab.emoji} {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Título da Seção */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          {TABS.find(t => t.key === activeTab)?.label || 'Todos'}
        </h2>
        <p className="text-sm text-gray-500">{filteredData.length} veículos encontrados</p>
      </div>

      {/* Lista de Veículos */}
      {filteredData.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 font-medium">Nenhum veículo encontrado</p>
          <p className="text-gray-400 text-sm mt-1">Tente ajustar os filtros ou busca</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredData.map((veiculo, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Coluna 1-2: Placa + Badge */}
                <div className="col-span-12 md:col-span-2">
                  <p className="text-xl font-bold text-gray-900">{veiculo.placa}</p>
                  <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                    veiculo.situacao?.includes('VENDIDO') || veiculo.situacao?.includes('RECEBIDO') ? 'bg-green-100 text-green-700' :
                    veiculo.situacao?.includes('PROIBIDO') ? 'bg-red-100 text-red-700' :
                    veiculo.situacao?.includes('AUTORIZADO') ? 'bg-yellow-100 text-yellow-700' :
                    veiculo.situacao?.includes('AGUARDANDO') || veiculo.situacao?.includes('NÃO RECEBIDO') ? 'bg-orange-100 text-orange-700' :
                    veiculo.situacao?.includes('OCORRÊNCIA') ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {veiculo.situacao || 'Novo'}
                  </span>
                </div>

                {/* Coluna 3-5: Informações */}
                <div className="col-span-12 md:col-span-3">
                  <p className="text-base font-semibold text-gray-900">{veiculo.marca} {veiculo.modelo}</p>
                  <p className="text-sm text-gray-500">
                    Avaliação: <span className={`font-medium ${
                      veiculo.avaliacao === 'RECUPERÁVEL' ? 'text-blue-600' : 'text-orange-600'
                    }`}>{veiculo.avaliacao || '-'}</span>
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <svg width="16" height="16" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(veiculo.dataEntrada)}
                  </div>
                </div>

                {/* Coluna 6-10: Métricas */}
                <div className="col-span-12 md:col-span-5 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Valor FIPE</p>
                    <p className="text-base font-semibold text-gray-900">{formatCurrency(veiculo.valorFipe || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Valor Sugerido</p>
                    <p className="text-base font-semibold text-gray-900">{formatCurrency(veiculo.valorSugerido || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      {veiculo.valorVendido ? 'Valor Vendido' : 'Rentabilidade'}
                    </p>
                    <p className="text-base font-semibold text-green-700">
                      {veiculo.valorVendido ? formatCurrency(veiculo.valorVendido) : '-'}
                    </p>
                  </div>
                </div>

                {/* Coluna 11-12: Botões */}
                <div className="col-span-12 md:col-span-2 flex gap-2 justify-end">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition">
                    Docs
                  </button>
                  <button className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
