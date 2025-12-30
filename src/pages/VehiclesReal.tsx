import { useState, useEffect } from 'react';
import { fetchAllSheets, type Vehicle } from '../services/googleSheets';

export default function VehiclesReal() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [lastSync, setLastSync] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllSheets();
      setVehicles(data);
      setLastSync(new Date());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtrar veículos por aba
  const filterByTab = (vehicles: Vehicle[]) => {
    switch (activeTab) {
      case 'novos':
        return vehicles.filter(v => v.situacao.includes('NOVO') || v.aba === 'Novos No Pátio');
      case 'autorizado':
        return vehicles.filter(v => v.situacao.includes('AUTORIZADO') || v.aba === 'Venda Autorizada');
      case 'aguardando':
        return vehicles.filter(v => v.situacao.includes('NÃO RECEBIDO') || v.aba === 'Vendido e Não Recebido');
      case 'recebido':
        return vehicles.filter(v => v.situacao.includes('RECEBIDO') || v.aba === 'Vendido e Recebido');
      case 'ocorrencias':
        return vehicles.filter(v => v.situacao.includes('OCORRÊNCIA') || v.aba === 'Ocorrências');
      case 'proibido':
        return vehicles.filter(v => v.situacao.includes('PROIBIDO') || v.aba === 'Proibida a Venda');
      default:
        return vehicles;
    }
  };

  // Filtrar por busca
  const filteredVehicles = filterByTab(vehicles).filter(vehicle =>
    vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.situacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Contadores por aba
  const counts = {
    todos: vehicles.length,
    novos: vehicles.filter(v => v.situacao.includes('NOVO') || v.aba === 'Novos No Pátio').length,
    autorizado: vehicles.filter(v => v.situacao.includes('AUTORIZADO') || v.aba === 'Venda Autorizada').length,
    aguardando: vehicles.filter(v => v.situacao.includes('NÃO RECEBIDO') || v.aba === 'Vendido e Não Recebido').length,
    recebido: vehicles.filter(v => v.situacao.includes('RECEBIDO') || v.aba === 'Vendido e Recebido').length,
    ocorrencias: vehicles.filter(v => v.situacao.includes('OCORRÊNCIA') || v.aba === 'Ocorrências').length,
    proibido: vehicles.filter(v => v.situacao.includes('PROIBIDO') || v.aba === 'Proibida a Venda').length,
  };

  const tabs = [
    { id: 'todos', label: 'Todos', emoji: '📊', count: counts.todos },
    { id: 'novos', label: 'Novos', emoji: '🆕', count: counts.novos },
    { id: 'autorizado', label: 'Autorizado', emoji: '✅', count: counts.autorizado },
    { id: 'aguardando', label: 'Aguardando', emoji: '⏳', count: counts.aguardando },
    { id: 'recebido', label: 'Recebido', emoji: '💰', count: counts.recebido },
    { id: 'ocorrencias', label: 'Ocorrências', emoji: '⚠️', count: counts.ocorrencias },
    { id: 'proibido', label: 'Proibido', emoji: '🚫', count: counts.proibido },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Card de Status Google Sheets */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <svg width="20" height="20" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-semibold">Google Sheets Conectado</p>
              <p className="text-sm text-gray-500">
                Última sincronização: {lastSync.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 border-2 border-dashed border-yellow-400 rounded-lg text-gray-700 text-sm font-medium hover:bg-yellow-50 transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" className="text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sincronizar
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="mb-6">
          <div className="relative">
            <svg width="20" height="20" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por placa, modelo ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-dashed border-orange-400 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Botões de Navegação (Pills) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.emoji} {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Título da Seção */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {tabs.find(t => t.id === activeTab)?.label || 'Todos'}
          </h2>
          <p className="text-sm text-gray-500">{filteredVehicles.length} veículos encontrados</p>
        </div>

        {/* Lista de Veículos */}
        <div className="space-y-4">
          {filteredVehicles.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <svg width="48" height="48" className="mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg">Nenhum veículo encontrado</p>
              <p className="text-gray-400 text-sm mt-1">Tente ajustar os filtros ou a busca</p>
            </div>
          ) : (
            filteredVehicles.map((vehicle, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="grid grid-cols-12 gap-4 items-center">
                  
                  {/* Placa + Badge */}
                  <div className="col-span-12 md:col-span-2">
                    <p className="text-xl font-bold text-gray-900 mb-1">{vehicle.placa}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.situacao.includes('VENDIDO RECEBIDO') ? 'bg-green-500 text-white' :
                      vehicle.situacao.includes('PROIBIDO') ? 'bg-red-500 text-white' :
                      vehicle.situacao.includes('AUTORIZADO') ? 'bg-yellow-500 text-white' :
                      vehicle.situacao.includes('AGUARDANDO') || vehicle.situacao.includes('NÃO RECEBIDO') ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {vehicle.situacao.split('(')[0].trim()}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className="col-span-12 md:col-span-4">
                    <p className="text-base font-semibold text-gray-900">{vehicle.marca} {vehicle.modelo}</p>
                    <p className="text-sm text-gray-500">Avaliação: {vehicle.avaliacao}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <svg width="16" height="16" className="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(vehicle.dataEntrada).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {/* Métricas */}
                  <div className="col-span-12 md:col-span-4 grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Valor FIPE</p>
                      <p className="text-base font-semibold text-gray-900">
                        {vehicle.valorFipe ? vehicle.valorFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Valor Sugerido</p>
                      <p className="text-base font-semibold text-gray-900">
                        {vehicle.valorSugerido ? vehicle.valorSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Rentabilidade</p>
                      <p className="text-base font-semibold text-gray-900">
                        {vehicle.valorVendido && vehicle.valorFipe 
                          ? `${((vehicle.valorVendido / vehicle.valorFipe) * 100).toFixed(1)}%`
                          : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="col-span-12 md:col-span-2 flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors">
                      CRLV
                    </button>
                    <button className="flex-1 px-4 py-2 bg-yellow-400 text-white text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors">
                      Detalhes
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
