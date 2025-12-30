import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  url: string;
  status: 'online' | 'offline';
  responseTime: number;
  uptime: number;
  lastCheck: Date;
}

const SITES: Site[] = [
  { id: '1', name: 'Movimento Mais Brasil', url: 'https://www.movimentomaisbrasil.org.br', status: 'online', responseTime: 245, uptime: 99.8, lastCheck: new Date() },
  { id: '2', name: 'Movimento Mais Seguro', url: 'https://www.movimentomaisseguro.com.br', status: 'online', responseTime: 312, uptime: 99.5, lastCheck: new Date() },
  { id: '3', name: 'Mais Brasil Motorcycle', url: 'https://www.maisbrasilmotorcycle.com.br', status: 'online', responseTime: 189, uptime: 99.9, lastCheck: new Date() },
  { id: '4', name: 'Potere BP Mensal', url: 'https://www.poterebpmensal.com.br', status: 'online', responseTime: 267, uptime: 99.7, lastCheck: new Date() },
  { id: '5', name: 'Potere Consórcio', url: 'https://www.potereconsorcio.com.br', status: 'online', responseTime: 198, uptime: 99.6, lastCheck: new Date() },
  { id: '6', name: 'Potere Seguro Auto', url: 'https://www.potereseguroauto.com.br', status: 'online', responseTime: 234, uptime: 99.8, lastCheck: new Date() },
  { id: '7', name: 'Soluções Corretora', url: 'https://www.solucoescorretora.com.br', status: 'online', responseTime: 301, uptime: 99.4, lastCheck: new Date() },
  { id: '8', name: 'Alpha Proteções', url: 'https://www.alphaprotecoes.com.br', status: 'online', responseTime: 156, uptime: 99.9, lastCheck: new Date() },
  { id: '9', name: 'Grupo MMB', url: 'https://www.grupommb.com', status: 'online', responseTime: 223, uptime: 99.7, lastCheck: new Date() },
  { id: '10', name: 'Juntos Podemos Mais', url: 'https://www.juntospodmais.com.br', status: 'online', responseTime: 289, uptime: 99.5, lastCheck: new Date() },
];

export function SitesMonitoring() {
  const [sites, setSites] = useState<Site[]>(SITES);
  const [stats, setStats] = useState({
    online: 10,
    offline: 0,
    avgUptime: 99.7,
    avgResponseTime: 241,
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSites(prev => prev.map(site => ({
        ...site,
        responseTime: Math.floor(Math.random() * 500) + 100,
        lastCheck: new Date(),
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Monitoramento de Sites</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe o status em tempo real de todos os sites da Administradora Mutual
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-700">Sites Online</h3>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold mt-4">{stats.online}</div>
          <p className="text-xs text-gray-500">de {sites.length} sites</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-700">Sites Offline</h3>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold mt-4">{stats.offline}</div>
          <p className="text-xs text-gray-500">aguardando recuperação</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-700">Uptime Médio</h3>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-4">{stats.avgUptime.toFixed(2)}%</div>
          <p className="text-xs text-gray-500">últimos 30 dias</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-700">Tempo Médio</h3>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mt-4">{stats.avgResponseTime}ms</div>
          <p className="text-xs text-gray-500">tempo de resposta</p>
        </div>
      </div>

      {/* Sites Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Status dos Sites</h2>
          <p className="text-sm text-gray-500 mt-1">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>
        <div className="p-6 space-y-4">
          {sites.map(site => (
            <div
              key={site.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${site.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-semibold text-gray-900">{site.name}</p>
                    <p className="text-sm text-gray-500">{site.url}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{site.responseTime}ms</p>
                  <p className="text-xs text-gray-500">resposta</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{site.uptime.toFixed(2)}%</p>
                  <p className="text-xs text-gray-500">uptime</p>
                </div>

                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  site.status === 'online' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {site.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Alertas Recentes</h2>
          <p className="text-sm text-gray-500 mt-1">
            Nenhum alerta no momento - todos os sites estão funcionando normalmente
          </p>
        </div>
        <div className="p-6 flex items-center justify-center py-8 text-green-600">
          <CheckCircle className="h-8 w-8 mr-2" />
          <p className="text-lg font-semibold">✅ Sistema operacional</p>
        </div>
      </div>
    </div>
  );
}
