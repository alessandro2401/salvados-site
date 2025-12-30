import { BarChart3, TrendingUp, DollarSign, Clock, Package, CheckCircle } from 'lucide-react';
import { mockVehicles, calculateStats, formatCurrency } from '../data/mockVehicles';

export default function Dashboard() {
  const stats = calculateStats(mockVehicles);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do gerenciamento de veículos salvados</p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Veículos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Veículos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {stats.porTipo.recuperavel} Recuperáveis
            </span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-orange-600 font-medium">
              {stats.porTipo.sucata} Sucatas
            </span>
          </div>
        </div>

        {/* Veículos Vendidos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendidos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVendidos}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">
              {((stats.totalVendidos / stats.total) * 100).toFixed(1)}% do total
            </span>
          </div>
        </div>

        {/* Valor Total em Vendas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor em Vendas</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.valorTotalVendas)}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            Taxa de recuperação: {stats.taxaRecuperacao.toFixed(1)}%
          </div>
        </div>

        {/* Tempo Médio no Pátio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.mediaDiasPatio}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            dias no pátio
          </div>
        </div>
      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status dos Veículos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Status dos Veículos</h2>
          </div>
          <div className="space-y-3">
            <StatusBar 
              label="Novo no Pátio" 
              count={stats.porStatus.novoNoPatio} 
              total={stats.total} 
              color="bg-blue-500" 
            />
            <StatusBar 
              label="Em Avaliação" 
              count={stats.porStatus.emAvaliacao} 
              total={stats.total} 
              color="bg-yellow-500" 
            />
            <StatusBar 
              label="Aguardando Leilão" 
              count={stats.porStatus.aguardandoLeilao} 
              total={stats.total} 
              color="bg-orange-500" 
            />
            <StatusBar 
              label="Leiloado" 
              count={stats.porStatus.leiloado} 
              total={stats.total} 
              color="bg-purple-500" 
            />
            <StatusBar 
              label="Vendido" 
              count={stats.porStatus.vendido} 
              total={stats.total} 
              color="bg-green-500" 
            />
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Resumo Financeiro</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Valor Total FIPE</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(stats.valorTotalFipe)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Valor Sugerido Total</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(stats.valorTotalSugerido)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Total Arrecadado</span>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(stats.valorTotalVendas)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-medium text-gray-700">Taxa de Recuperação</span>
              <span className="text-xl font-bold text-blue-600">
                {stats.taxaRecuperacao.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Últimos Veículos Adicionados */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimos Veículos Adicionados</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Placa</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Veículo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Valor FIPE</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Dias</th>
              </tr>
            </thead>
            <tbody>
              {mockVehicles.slice(0, 5).map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {vehicle.marca} {vehicle.modelo} {vehicle.ano}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vehicle.tipo === 'Recuperável' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {vehicle.tipo}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(vehicle.status)
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {formatCurrency(vehicle.valorFipe)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{vehicle.diasPatio}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para barra de status
function StatusBar({ label, count, total, color }: { 
  label: string; 
  count: number; 
  total: number; 
  color: string; 
}) {
  const percentage = (count / total) * 100;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-900">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Função auxiliar para cores de status
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Novo no Pátio': 'bg-blue-100 text-blue-800',
    'Em Avaliação': 'bg-yellow-100 text-yellow-800',
    'Aguardando Leilão': 'bg-orange-100 text-orange-800',
    'Leiloado': 'bg-purple-100 text-purple-800',
    'Vendido': 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
