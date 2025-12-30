import { useState, useEffect } from 'react';
import { fetchAllSheets, calculateMetrics, type Vehicle } from '../services/googleSheets';

export default function DashboardReal() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
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

  const metrics = calculateMetrics(vehicles);

  // Últimos 10 veículos adicionados
  const latestVehicles = [...vehicles]
    .sort((a, b) => new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime())
    .slice(0, 10);

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

        {/* Cards KPI - 4 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
            <svg width="24" height="24" className="text-gray-400 absolute top-6 right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <p className="text-5xl font-bold text-gray-900 leading-none mb-2">{metrics.totalVeiculos}</p>
            <p className="text-sm text-gray-500">Total de Veículos</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
            <svg width="24" height="24" className="text-green-500 absolute top-6 right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-5xl font-bold text-gray-900 leading-none mb-2">{metrics.veiculosVendidos}</p>
            <p className="text-sm text-gray-500">Veículos Vendidos</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
            <svg width="24" height="24" className="text-blue-500 absolute top-6 right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-5xl font-bold text-gray-900 leading-none mb-2">{metrics.novosNoPatio}</p>
            <p className="text-sm text-gray-500">Novos no Pátio</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
            <svg width="24" height="24" className="text-orange-500 absolute top-6 right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-5xl font-bold text-gray-900 leading-none mb-2">{metrics.ocorrencias}</p>
            <p className="text-sm text-gray-500">Ocorrências</p>
          </div>
        </div>

        {/* Cards Financeiros - 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 rounded-2xl p-6 shadow-sm relative">
            <svg width="28" height="28" className="text-blue-500 absolute top-6 right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-700 font-medium mb-1">Receita Total</p>
            <p className="text-3xl font-bold text-gray-900 leading-none mb-2">
              {metrics.totalVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-xs text-gray-500 uppercase">Total vendido no período</p>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 shadow-sm relative">
            <svg width="28" height="28" className="text-green-500 absolute top-6 right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-sm text-gray-700 font-medium mb-1">Valor Recebido</p>
            <p className="text-3xl font-bold text-gray-900 leading-none mb-2">
              {metrics.totalRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-xs text-gray-500 uppercase">Taxa de recuperação: {metrics.taxaRecuperacao.toFixed(1)}%</p>
          </div>
        </div>

        {/* Seção Totais Acumulados */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Totais Acumulados</h2>
            <button className="px-4 py-2 border-2 border-dashed border-yellow-400 rounded-lg text-gray-700 text-sm font-medium">
              2025
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-2xl p-6 shadow-sm relative">
              <svg width="28" height="28" className="text-blue-500 absolute top-6 right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-700 font-medium mb-1">Total FIPE 2025</p>
              <p className="text-3xl font-bold text-gray-900 leading-none mb-2">
                {metrics.totalFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-xs text-gray-500 uppercase">Valor de referência da tabela FIPE</p>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 shadow-sm relative">
              <svg width="28" height="28" className="text-green-500 absolute top-6 right-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-sm text-gray-700 font-medium mb-1">Total Sugerido 2025</p>
              <p className="text-3xl font-bold text-gray-900 leading-none mb-2">
                {metrics.totalSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-xs text-gray-500 uppercase">Valor sugerido para venda</p>
            </div>
          </div>
        </div>

        {/* Campo de Busca */}
        <div className="mb-6">
          <div className="relative">
            <svg width="20" height="20" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por placa, marca ou modelo..."
              className="w-full pl-12 pr-4 py-3 border-2 border-dashed border-orange-400 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Seção Últimos Veículos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Últimos Veículos Adicionados</h2>
            <p className="text-sm text-gray-500">{latestVehicles.length} veículos encontrados</p>
          </div>

          <div className="space-y-4">
            {latestVehicles.map((vehicle, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="grid grid-cols-12 gap-4 items-center">
                  
                  {/* Placa + Badge */}
                  <div className="col-span-12 md:col-span-2">
                    <p className="text-xl font-bold text-gray-900 mb-1">{vehicle.placa}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.situacao.includes('VENDIDO RECEBIDO') ? 'bg-green-500 text-white' :
                      vehicle.situacao.includes('PROIBIDO') ? 'bg-red-500 text-white' :
                      vehicle.situacao.includes('AUTORIZADO') ? 'bg-yellow-500 text-white' :
                      vehicle.situacao.includes('AGUARDANDO') ? 'bg-orange-500 text-white' :
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
                      <p className="text-xs text-gray-500 uppercase mb-1">Valor Vendido</p>
                      <p className="text-base font-semibold text-gray-900">
                        {vehicle.valorVendido ? vehicle.valorVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="col-span-12 md:col-span-2 flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors">
                      Docs
                    </button>
                    <button className="flex-1 px-4 py-2 bg-yellow-400 text-white text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors">
                      Detalhes
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
