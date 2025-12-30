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
      
      // Pegar os 5 últimos veículos do resumo (ordenados por data de entrada)
      const sorted = [...allData.resumo].sort((a, b) => {
        return new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime();
      });
      setUltimosVeiculos(sorted.slice(0, 5));
      
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
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da planilha...</p>
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

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do gerenciamento de veículos salvados</p>
        <button
          onClick={loadData}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          🔄 Atualizar Dados
        </button>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Veículos */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Veículos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.totalVeiculos}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Vendidos */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendidos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.veiculosVendidos}</p>
              <p className="text-sm text-gray-500 mt-1">
                {((metrics.veiculosVendidos / metrics.totalVeiculos) * 100).toFixed(1)}% do total
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Valor em Vendas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor em Vendas</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(metrics.valorTotalVendido)}</p>
              <p className="text-sm text-gray-500 mt-1">
                Taxa: {metrics.taxaRecuperacao.toFixed(1)}%
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tempo Médio */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.tempoMedio}</p>
              <p className="text-sm text-gray-500 mt-1">dias no pátio</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status dos Veículos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status dos Veículos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Novo no Pátio</p>
            <p className="text-2xl font-bold text-blue-600">{metrics.novosNoPatio}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Venda Autorizada</p>
            <p className="text-2xl font-bold text-green-600">{metrics.vendaAutorizada}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Vendido (Não Recebido)</p>
            <p className="text-2xl font-bold text-yellow-600">{metrics.vendidoNaoRecebido}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Vendido (Recebido)</p>
            <p className="text-2xl font-bold text-green-600">{metrics.vendidoRecebido}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Ocorrências</p>
            <p className="text-2xl font-bold text-red-600">{metrics.ocorrencias}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Proibida Venda</p>
            <p className="text-2xl font-bold text-gray-600">{metrics.proibidaVenda}</p>
          </div>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">💰 Resumo Financeiro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Valor Total FIPE</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.valorTotalFipe)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Valor Sugerido Total</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.valorTotalSugerido)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Vendido</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.valorTotalVendido)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Recebido</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(metrics.valorTotalRecebido)}</p>
          </div>
        </div>
      </div>

      {/* Últimos Veículos Adicionados */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Últimos Veículos Adicionados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor FIPE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Entrada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dias</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ultimosVeiculos.map((veiculo, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {veiculo.placa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {veiculo.marca} {veiculo.modelo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      veiculo.situacao.includes('VENDIDO RECEBIDO') ? 'bg-green-100 text-green-800' :
                      veiculo.situacao.includes('VENDIDO') ? 'bg-yellow-100 text-yellow-800' :
                      veiculo.situacao.includes('VENDA AUTORIZADA') ? 'bg-blue-100 text-blue-800' :
                      veiculo.situacao.includes('NOVO') ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {veiculo.situacao}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(veiculo.fipe)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(veiculo.dataEntrada)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {veiculo.dias}d
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
