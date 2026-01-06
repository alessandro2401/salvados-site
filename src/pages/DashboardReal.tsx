import React, { useState, useEffect } from 'react';
import { fetchAllSheets, calculateMetrics, type Vehicle } from '../services/googleSheets';
import { Card, Badge, Button } from '../components';

export default function DashboardReal() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const metrics = calculateMetrics(vehicles);

  const filteredVehicles = vehicles
    .filter(v => 
      v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.marca.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10);

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
        <Card className="mb-8">
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

        {/* Métricas Principais (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total de Veículos</p>
                <p className="text-4xl font-bold text-gray-900">{metrics.totalVeiculos}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Veículos Vendidos</p>
                <p className="text-4xl font-bold text-gray-900">{metrics.veiculosVendidos}</p>
                <p className="text-xs text-gray-400 mt-1">{((metrics.veiculosVendidos / metrics.totalVeiculos) * 100).toFixed(1)}% do total</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Novos no Pátio</p>
                <p className="text-4xl font-bold text-gray-900">{metrics.novosNoPatio}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-orange-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Ocorrências</p>
                <p className="text-4xl font-bold text-gray-900">{metrics.ocorrencias}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Receita Total</p>
                <p className="text-3xl font-bold text-blue-900">
                  {metrics.totalVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-xs text-blue-600 mt-1">Total vendido no período</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-blue-700">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Valor Recebido</p>
                <p className="text-3xl font-bold text-green-900">
                  {metrics.totalRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-xs text-green-600 mt-1">Pagamentos confirmados</p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-green-700">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Taxa de Recuperação</p>
                <p className="text-3xl font-bold text-purple-900">{metrics.taxaRecuperacao.toFixed(1)}%</p>
                <p className="text-xs text-purple-600 mt-1">Retorno sobre investimento</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-purple-700">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Últimos Veículos Adicionados */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Últimos Veículos Adicionados</h3>
              <p className="text-sm text-gray-500">{filteredVehicles.length} veículos encontrados</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por placa, marca ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
              <svg 
                width="20" 
                height="20" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                className="absolute left-3 top-2.5 text-gray-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.placa} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Placa e Status */}
                  <div className="col-span-3">
                    <p className="text-xl font-bold text-gray-900 mb-1">{vehicle.placa}</p>
                    <Badge variant={getStatusBadgeVariant(vehicle.situacao)}>
                      {vehicle.situacao}
                    </Badge>
                  </div>

                  {/* Informações do Veículo */}
                  <div className="col-span-4">
                    <p className="text-base font-semibold text-gray-900">{vehicle.marca} {vehicle.modelo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getAvaliacaoBadgeVariant(vehicle.avaliacao)} className="text-xs">
                        {vehicle.avaliacao}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="inline mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(vehicle.dataEntrada).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Métricas Financeiras */}
                  <div className="col-span-3 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">FIPE</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {vehicle.valorFipe ? vehicle.valorFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Sugerido</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {vehicle.valorSugerido ? vehicle.valorSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Vendido</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {vehicle.valorVendido ? vehicle.valorVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="col-span-2 flex gap-2 justify-end">
                    <Button variant="success" size="sm">Docs</Button>
                    <Button variant="secondary" size="sm">Detalhes</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="secondary">Ver Todos os Veículos →</Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
