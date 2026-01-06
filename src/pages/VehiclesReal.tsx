import React, { useState, useEffect } from 'react';
import { fetchAllSheets, type Vehicle } from '../services/googleSheets';
import { Card, Badge, Button } from '../components';

type TabKey = 'todos' | 'novos' | 'autorizado' | 'aguardando' | 'recebido' | 'ocorrencias' | 'proibido';

export default function VehiclesReal() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('todos');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllSheets();
      setVehicles(data);
      setLastSync(new Date().toLocaleString('pt-BR'));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filterByTab = (vehicles: Vehicle[], tab: TabKey): Vehicle[] => {
    switch (tab) {
      case 'novos':
        return vehicles.filter(v => v.situacao.includes('NOVO') || v.aba === 'Novos No Pátio');
      case 'autorizado':
        return vehicles.filter(v => v.situacao.includes('AUTORIZADO') || v.aba === 'Venda Autorizada');
      case 'aguardando':
        return vehicles.filter(v => v.situacao.includes('AGUARDANDO') || v.situacao.includes('NÃO RECEBIDO') || v.aba === 'Vendido e Não Recebido');
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

  const filteredVehicles = filterByTab(vehicles, activeTab).filter(v =>
    v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.situacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { key: 'todos' as TabKey, label: 'Todos', count: vehicles.length },
    { key: 'novos' as TabKey, label: 'Novos', count: filterByTab(vehicles, 'novos').length },
    { key: 'autorizado' as TabKey, label: 'Autorizado', count: filterByTab(vehicles, 'autorizado').length },
    { key: 'aguardando' as TabKey, label: 'Aguardando', count: filterByTab(vehicles, 'aguardando').length },
    { key: 'recebido' as TabKey, label: 'Recebido', count: filterByTab(vehicles, 'recebido').length },
    { key: 'ocorrencias' as TabKey, label: 'Ocorrências', count: filterByTab(vehicles, 'ocorrencias').length },
    { key: 'proibido' as TabKey, label: 'Proibido', count: filterByTab(vehicles, 'proibido').length },
  ];

  const getStatusBadgeVariant = (situacao: string) => {
    if (situacao.includes('VENDIDO') && situacao.includes('RECEBIDO')) return 'success';
    if (situacao.includes('PROIBIDO')) return 'danger';
    if (situacao.includes('AUTORIZADO')) return 'warning';
    return 'info';
  };

  const getAvaliacaoBadgeVariant = (avaliacao: string) => {
    return avaliacao === 'RECUPERÁVEL' ? 'info' : 'warning';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Status da Integração */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Google Sheets Conectado</h3>
                <p className="text-sm text-gray-500">Última sincronização: {lastSync}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={loadData}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sincronizar
            </Button>
          </div>
        </Card>

        {/* Campo de Busca */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por placa, modelo ou situação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
            <svg 
              width="20" 
              height="20" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              className="absolute left-4 top-3.5 text-gray-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-colors
                  ${activeTab === tab.key
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </Card>

        {/* Contador de Veículos */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredVehicles.length} veículos encontrados
          </p>
        </div>

        {/* Lista de Veículos */}
        <div className="space-y-4">
          {filteredVehicles.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <svg 
                  width="48" 
                  height="48" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  className="mx-auto text-gray-400 mb-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">Nenhum veículo encontrado</p>
              </div>
            </Card>
          ) : (
            filteredVehicles.map((vehicle) => (
              <Card key={vehicle.placa} className="hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12 gap-4 items-center">
                  
                  {/* Placa e Status */}
                  <div className="col-span-12 md:col-span-2">
                    <p className="text-xl font-bold text-gray-900 mb-2">{vehicle.placa}</p>
                    <Badge variant={getStatusBadgeVariant(vehicle.situacao)}>
                      {vehicle.situacao.split('(')[0].trim()}
                    </Badge>
                  </div>

                  {/* Informações do Veículo */}
                  <div className="col-span-12 md:col-span-4">
                    <p className="text-base font-semibold text-gray-900 mb-1">
                      {vehicle.marca} {vehicle.modelo}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getAvaliacaoBadgeVariant(vehicle.avaliacao)} className="text-xs">
                        {vehicle.avaliacao}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(vehicle.dataEntrada).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Métricas Financeiras */}
                  <div className="col-span-12 md:col-span-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Valor FIPE</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {vehicle.valorFipe ? vehicle.valorFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Valor Sugerido</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {vehicle.valorSugerido ? vehicle.valorSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Rentabilidade</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {vehicle.valorVendido && vehicle.valorSugerido
                            ? `${((vehicle.valorVendido / vehicle.valorSugerido - 1) * 100).toFixed(1)}%`
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="col-span-12 md:col-span-2 flex gap-2">
                    <Button variant="success" size="sm" fullWidth>CRLV</Button>
                    <Button variant="secondary" size="sm" fullWidth>Detalhes</Button>
                  </div>

                </div>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
