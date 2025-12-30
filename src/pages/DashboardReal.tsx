import { useEffect, useState } from 'react';
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
      
      // Pegar os 10 últimos veículos do resumo (ordenados por data de entrada)
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
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
    <div className="space-y-8">
      {/* Header com botão de atualizar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do gerenciamento de veículos salvados</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar Dados
        </button>
      </div>

      {/* Métricas Principais - Grid 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Veículos */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total de Veículos</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.totalVeiculos}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Veículos Vendidos */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Vendidos</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.veiculosVendidos}</p>
              <p className="text-sm text-green-600 font-medium mt-1">
                {((metrics.veiculosVendidos / metrics.totalVeiculos) * 100).toFixed(1)}% do total
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Valor Arrecadado */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Arrecadado</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2 truncate">{formatCurrency(metrics.valorTotalRecebido)}</p>
              <p className="text-sm text-emerald-600 font-medium mt-1">
                Taxa: {metrics.taxaRecuperacao.toFixed(1)}%
              </p>
            </div>
            <div className="bg-emerald-100 rounded-full p-4 flex-shrink-0">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tempo Médio */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tempo Médio</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.tempoMedio}</p>
              <p className="text-sm text-orange-600 font-medium mt-1">dias no pátio</p>
            </div>
            <div className="bg-orange-100 rounded-full p-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Resumo Financeiro
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">Valor Total FIPE</p>
            <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(metrics.valorTotalFipe)}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">Valor Sugerido</p>
            <p className="text-xl lg:text-2xl font-bold text-blue-700">{formatCurrency(metrics.valorTotalSugerido)}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">Total Vendido</p>
            <p className="text-xl lg:text-2xl font-bold text-green-700">{formatCurrency(metrics.valorTotalVendido)}</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">Total Recebido</p>
            <p className="text-xl lg:text-2xl font-bold text-emerald-700">{formatCurrency(metrics.valorTotalRecebido)}</p>
          </div>
        </div>
      </div>

      {/* Status dos Veículos */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Status dos Veículos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-3xl font-bold text-blue-700">{metrics.novosNoPatio}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Novos no Pátio</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-3xl font-bold text-yellow-700">{metrics.vendaAutorizada}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Venda Autorizada</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-3xl font-bold text-orange-700">{metrics.vendidoNaoRecebido}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Aguardando Pgto</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-3xl font-bold text-green-700">{metrics.vendidoRecebido}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Vendido/Recebido</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-3xl font-bold text-red-700">{metrics.ocorrencias}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Ocorrências</p>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-lg border border-gray-300">
            <p className="text-3xl font-bold text-gray-700">{metrics.proibidaVenda}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Proibido Venda</p>
          </div>
        </div>
      </div>

      {/* Últimos Veículos */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Últimos Veículos Adicionados
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor FIPE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrada</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ultimosVeiculos.map((veiculo, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{veiculo.placa}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{veiculo.marca}</div>
                    <div className="text-sm text-gray-500">{veiculo.modelo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                      veiculo.situacao.includes('VENDIDO RECEBIDO') ? 'bg-green-100 text-green-800' :
                      veiculo.situacao.includes('VENDIDO') ? 'bg-blue-100 text-blue-800' :
                      veiculo.situacao.includes('PROIBIDO') ? 'bg-red-100 text-red-800' :
                      veiculo.situacao.includes('VENDA AUTORIZADA') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {veiculo.situacao.length > 25 ? veiculo.situacao.substring(0, 25) + '...' : veiculo.situacao}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(veiculo.fipe)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(veiculo.dataEntrada)}
                    {veiculo.dias > 0 && <span className="ml-2 text-xs text-gray-400">({veiculo.dias}d)</span>}
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
