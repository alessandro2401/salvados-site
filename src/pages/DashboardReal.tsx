import { useState, useEffect } from 'react';
import { fetchAllSheets, calculateDashboardMetrics, VehicleData } from '../services/googleSheets';

interface DashboardMetrics {
  totalVeiculos: number;
  valorTotalFipe: number;
  valorTotalSugerido: number;
  valorTotalVendido: number;
  valorTotalRecebido: number;
  veiculosVendidos: number;
  taxaRecuperacao: number;
  tempoMedio: number;
  novosNoPatio: number;
  vendaAutorizada: number;
  vendidoNaoRecebido: number;
  vendidoRecebido: number;
  ocorrencias: number;
  proibidaVenda: number;
}

export default function DashboardReal() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [ultimosVeiculos, setUltimosVeiculos] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const allData = await fetchAllSheets();
      const calculatedMetrics = calculateDashboardMetrics(allData);
      
      setMetrics(calculatedMetrics);
      
      const sorted = [...allData.resumo]
        .filter(v => v.dataEntrada)
        .sort((a, b) => {
          return new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime();
        });
      setUltimosVeiculos(sorted.slice(0, 10));
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados da planilha. Verifique a conexão.');
      setLoading(false);
    }
  }

  function formatCurrency(value: number): string {
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando dados da planilha...</p>
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

  if (!metrics) return null;

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

      {/* KPIs Pequenos - Grid 4 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5 relative">
          <svg width="24" height="24" className="w-6 h-6 text-gray-400 absolute top-4 right-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          <p className="text-5xl font-bold text-gray-900 leading-none mb-1">{metrics.totalVeiculos}</p>
          <p className="text-sm text-gray-500">Total de Veículos</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 relative">
          <svg width="24" height="24" className="w-6 h-6 text-green-500 absolute top-4 right-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-5xl font-bold text-gray-900 leading-none mb-1">{metrics.veiculosVendidos}</p>
          <p className="text-sm text-gray-500">Veículos Vendidos</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 relative">
          <svg width="24" height="24" className="w-6 h-6 text-blue-500 absolute top-4 right-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-5xl font-bold text-gray-900 leading-none mb-1">{metrics.novosNoPatio}</p>
          <p className="text-sm text-gray-500">Novos no Pátio</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 relative">
          <svg width="24" height="24" className="w-6 h-6 text-orange-500 absolute top-4 right-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-5xl font-bold text-gray-900 leading-none mb-1">{metrics.ocorrencias}</p>
          <p className="text-sm text-gray-500">Ocorrências</p>
        </div>
      </div>

      {/* Cards Financeiros - Grid 2 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 relative">
          <svg width="28" height="28" className="w-7 h-7 text-blue-700 absolute top-5 right-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-700 mb-1">Receita Total</p>
          <p className="text-3xl font-bold text-blue-800 leading-none mb-2">{formatCurrency(metrics.valorTotalVendido)}</p>
          <p className="text-xs text-gray-600">Total vendido no período</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 relative">
          <svg width="28" height="28" className="w-7 h-7 text-green-700 absolute top-5 right-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <p className="text-sm text-gray-700 mb-1">Valor Recebido</p>
          <p className="text-3xl font-bold text-green-700 leading-none mb-2">{formatCurrency(metrics.valorTotalRecebido)}</p>
          <p className="text-xs text-gray-600">Taxa de recuperação: {metrics.taxaRecuperacao.toFixed(1)}%</p>
        </div>
      </div>

      {/* Totais Acumulados */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Totais Acumulados</h2>
          <button className="px-4 py-2 text-sm border-2 border-dashed border-yellow-400 text-gray-700 rounded-lg hover:bg-yellow-50 transition">
            2025
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 relative">
            <svg width="28" height="28" className="w-7 h-7 text-blue-700 absolute top-5 right-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-700 mb-1">Total FIPE 2025</p>
            <p className="text-3xl font-bold text-blue-800 leading-none mb-2">{formatCurrency(metrics.valorTotalFipe)}</p>
            <p className="text-xs text-gray-600">Valor de referência da tabela FIPE</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 relative">
            <svg width="28" height="28" className="w-7 h-7 text-green-700 absolute top-5 right-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-sm text-gray-700 mb-1">Total Sugerido 2025</p>
            <p className="text-3xl font-bold text-green-700 leading-none mb-2">{formatCurrency(metrics.valorTotalSugerido)}</p>
            <p className="text-xs text-gray-600">Valor sugerido para venda</p>
          </div>
        </div>
      </div>

      {/* Campo de Busca */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por placa, marca ou modelo..."
          className="w-full px-4 py-3 pl-10 border-2 border-dashed border-orange-400 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
        />
        <svg width="20" height="20" className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Últimos Veículos Adicionados */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Últimos Veículos Adicionados</h2>
          <p className="text-sm text-gray-500">{ultimosVeiculos.length} veículos encontrados</p>
        </div>

        <div className="space-y-3">
          {ultimosVeiculos.map((veiculo, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Coluna 1-2: Placa + Badge */}
                <div className="col-span-12 md:col-span-2">
                  <p className="text-xl font-bold text-gray-900">{veiculo.placa}</p>
                  <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                    veiculo.situacao?.includes('VENDIDO') ? 'bg-green-100 text-green-700' :
                    veiculo.situacao?.includes('PROIBIDO') ? 'bg-red-100 text-red-700' :
                    veiculo.situacao?.includes('AUTORIZADO') ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {veiculo.situacao || 'Novo'}
                  </span>
                </div>

                {/* Coluna 3-5: Informações */}
                <div className="col-span-12 md:col-span-3">
                  <p className="text-base font-semibold text-gray-900">{veiculo.marca} {veiculo.modelo}</p>
                  <p className="text-sm text-gray-500">Avaliação: {veiculo.avaliacao || '-'}</p>
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
                    <p className="text-xs text-gray-500 uppercase">Valor Vendido</p>
                    <p className="text-base font-semibold text-green-700">{veiculo.valorVendido ? formatCurrency(veiculo.valorVendido) : '-'}</p>
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
      </div>
    </div>
  );
}
