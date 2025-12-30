import { useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import { mockVehicles, formatCurrency, type Vehicle } from '../data/mockVehicles';

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'all' | 'Sucata' | 'Recuperável'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filtrar veículos
  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filterTipo === 'all' || vehicle.tipo === filterTipo;
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;

    return matchesSearch && matchesTipo && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Veículos</h1>
        <p className="text-gray-600 mt-1">Visualize e gerencie todos os veículos salvados</p>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Placa, marca ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="Recuperável">Recuperável</option>
              <option value="Sucata">Sucata</option>
            </select>
          </div>

          {/* Filtro por Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="Novo no Pátio">Novo no Pátio</option>
              <option value="Em Avaliação">Em Avaliação</option>
              <option value="Aguardando Leilão">Aguardando Leilão</option>
              <option value="Leiloado">Leiloado</option>
              <option value="Vendido">Vendido</option>
            </select>
          </div>
        </div>

        {/* Contador de Resultados */}
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <Filter className="w-4 h-4 mr-2" />
          Exibindo {filteredVehicles.length} de {mockVehicles.length} veículos
        </div>
      </div>

      {/* Lista de Veículos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredVehicles.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Nenhum veículo encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}

// Componente Card de Veículo
function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header do Card */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {vehicle.marca} {vehicle.modelo}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {vehicle.ano} • {vehicle.placa}
          </p>
        </div>
        <div className="flex gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            vehicle.tipo === 'Recuperável' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {vehicle.tipo}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          getStatusColor(vehicle.status)
        }`}>
          {vehicle.status}
        </span>
      </div>

      {/* Informações Financeiras */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
        <div>
          <p className="text-xs text-gray-600 mb-1">Valor FIPE</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(vehicle.valorFipe)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Valor Sugerido</p>
          <p className="text-lg font-semibold text-blue-600">
            {formatCurrency(vehicle.valorSugerido)}
          </p>
        </div>
        {vehicle.valorVenda && (
          <>
            <div>
              <p className="text-xs text-gray-600 mb-1">Valor de Venda</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(vehicle.valorVenda)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Diferença</p>
              <p className={`text-lg font-semibold ${
                vehicle.valorVenda > vehicle.valorSugerido ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(vehicle.valorVenda - vehicle.valorSugerido)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Informações Adicionais */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Data de Entrada:</span>
          <span className="font-medium text-gray-900">
            {new Date(vehicle.dataEntrada).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Dias no Pátio:</span>
          <span className="font-medium text-gray-900">{vehicle.diasPatio} dias</span>
        </div>
        {vehicle.dataVenda && (
          <div className="flex justify-between">
            <span className="text-gray-600">Data de Venda:</span>
            <span className="font-medium text-gray-900">
              {new Date(vehicle.dataVenda).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}
        {vehicle.comprador && (
          <div className="flex justify-between">
            <span className="text-gray-600">Comprador:</span>
            <span className="font-medium text-gray-900">{vehicle.comprador}</span>
          </div>
        )}
        {vehicle.leiloeiro && (
          <div className="flex justify-between">
            <span className="text-gray-600">Leiloeiro:</span>
            <span className="font-medium text-gray-900">{vehicle.leiloeiro}</span>
          </div>
        )}
      </div>

      {/* Observações */}
      {vehicle.observacoes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Observações:</p>
          <p className="text-sm text-gray-700">{vehicle.observacoes}</p>
        </div>
      )}

      {/* Botão Ver Detalhes */}
      <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Eye className="w-4 h-4" />
        Ver Detalhes
      </button>
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
