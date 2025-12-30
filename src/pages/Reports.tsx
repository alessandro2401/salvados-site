import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { exportToPDF, exportToExcel } from "@/lib/exportReports";
import { toast } from "sonner";

function formatCurrency(cents: number | null | undefined): string {
  if (!cents) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

const COLORS = {
  sucata: "hsl(var(--warning))",
  recuperavel: "hsl(var(--primary))",
  positivo: "hsl(var(--success))",
  negativo: "hsl(var(--danger))",
  primary: "hsl(var(--primary))",
  warning: "hsl(var(--warning))",
};

export default function Reports() {
  const { data: vehicles, isLoading } = trpc.vehicles.list.useQuery();
  const { data: auctions } = trpc.auctions.list.useQuery();
  const [selectedAuction, setSelectedAuction] = useState<string>("all");

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  // Filtrar veículos por leilão selecionado
  const filteredVehicles = selectedAuction === "all" 
    ? vehicles 
    : vehicles?.filter(v => v.leilaoId === parseInt(selectedAuction));

  // Análise por tipo de veículo
  const analysisByType = filteredVehicles?.reduce(
    (acc, v) => {
      const tipo = v.tipo === "Sucata" ? "sucata" : "recuperavel";
      acc[tipo].count++;
      acc[tipo].valorEsperado += v.valorSugerido || 0;
      acc[tipo].valorAlcancado += v.valorAlcancado || 0;
      acc[tipo].desvio += v.desvio || 0;
      return acc;
    },
    {
      sucata: { count: 0, valorEsperado: 0, valorAlcancado: 0, desvio: 0 },
      recuperavel: { count: 0, valorEsperado: 0, valorAlcancado: 0, desvio: 0 },
    }
  );

  // Dados para gráfico de barras (Desvio por Tipo)
  const desvioByTypeData = [
    {
      name: "Sucata",
      valorEsperado: (analysisByType?.sucata.valorEsperado || 0) / 100,
      valorAlcancado: (analysisByType?.sucata.valorAlcancado || 0) / 100,
      desvio: (analysisByType?.sucata.desvio || 0) / 100,
    },
    {
      name: "Recuperável",
      valorEsperado: (analysisByType?.recuperavel.valorEsperado || 0) / 100,
      valorAlcancado: (analysisByType?.recuperavel.valorAlcancado || 0) / 100,
      desvio: (analysisByType?.recuperavel.desvio || 0) / 100,
    },
  ];

  // Dados para gráfico de pizza (Distribuição por Tipo)
  const distributionData = [
    { name: "Sucata", value: analysisByType?.sucata.count || 0 },
    { name: "Recuperável", value: analysisByType?.recuperavel.count || 0 },
  ];

  // Análise de desvio (positivo vs negativo)
  const desvioAnalysis = filteredVehicles?.reduce(
    (acc, v) => {
      if ((v.desvio || 0) >= 0) {
        acc.positivo.count++;
        acc.positivo.valor += v.desvio || 0;
      } else {
        acc.negativo.count++;
        acc.negativo.valor += Math.abs(v.desvio || 0);
      }
      return acc;
    },
    { positivo: { count: 0, valor: 0 }, negativo: { count: 0, valor: 0 } }
  );

  const desvioDistributionData = [
    { name: "Acima do Esperado", value: desvioAnalysis?.positivo.count || 0 },
    { name: "Abaixo do Esperado", value: desvioAnalysis?.negativo.count || 0 },
  ];

  const handleExportPDF = () => {
    if (!filteredVehicles || filteredVehicles.length === 0) {
      toast.error("Nenhum veículo para exportar");
      return;
    }
    
    try {
      const leilaoNome = selectedAuction === "all" 
        ? "Todos os Leilões" 
        : auctions?.find(a => a.id === parseInt(selectedAuction))?.nome;
      
      exportToPDF(filteredVehicles, leilaoNome);
      toast.success("Relatório PDF exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar PDF");
      console.error(error);
    }
  };

  const handleExportExcel = () => {
    if (!filteredVehicles || filteredVehicles.length === 0) {
      toast.error("Nenhum veículo para exportar");
      return;
    }
    
    try {
      const leilaoNome = selectedAuction === "all" 
        ? "Todos os Leilões" 
        : auctions?.find(a => a.id === parseInt(selectedAuction))?.nome;
      
      exportToExcel(filteredVehicles, leilaoNome);
      toast.success("Relatório Excel exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar Excel");
      console.error(error);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Performance</h1>
          <p className="text-muted-foreground">
            Análise detalhada de leilões e performance de vendas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Filtro por Leilão */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium">Leilão:</label>
            <Select value={selectedAuction} onValueChange={setSelectedAuction}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Leilões</SelectItem>
                {auctions?.map((auction) => (
                  <SelectItem key={auction.id} value={auction.id.toString()}>
                    {auction.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Resumidos */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredVehicles?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Desvio Positivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--success))]">
              {desvioAnalysis?.positivo.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(desvioAnalysis?.positivo.valor)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Desvio Negativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--danger))]">
              {desvioAnalysis?.negativo.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(desvioAnalysis?.negativo.valor)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredVehicles && filteredVehicles.length > 0
                ? Math.round(
                    ((desvioAnalysis?.positivo.count || 0) / filteredVehicles.length) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Acima do esperado</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Análise de Desvio por Tipo</CardTitle>
            <CardDescription>Comparação entre valor esperado e alcançado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={desvioByTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value) * 100)} />
                <Legend />
                <Bar dataKey="valorEsperado" fill={COLORS.primary} name="Valor Esperado" />
                <Bar dataKey="valorAlcancado" fill={COLORS.sucata} name="Valor Alcançado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Veículo</CardTitle>
            <CardDescription>Quantidade de veículos por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill={COLORS.warning} />
                  <Cell fill={COLORS.recuperavel} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance de Vendas</CardTitle>
            <CardDescription>Veículos acima vs abaixo do esperado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={desvioDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill={COLORS.positivo} />
                  <Cell fill={COLORS.negativo} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>Análise consolidada por tipo de veículo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sucata</span>
                <span className="text-sm text-muted-foreground">
                  {analysisByType?.sucata.count} veículos
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Esperado</p>
                  <p className="font-medium">
                    {formatCurrency(analysisByType?.sucata.valorEsperado)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Alcançado</p>
                  <p className="font-medium">
                    {formatCurrency(analysisByType?.sucata.valorAlcancado)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(analysisByType?.sucata.desvio || 0) >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-[hsl(var(--danger))]" />
                )}
                <span
                  className={`text-sm font-medium ${
                    (analysisByType?.sucata.desvio || 0) >= 0
                      ? "text-[hsl(var(--success))]"
                      : "text-[hsl(var(--danger))]"
                  }`}
                >
                  {formatCurrency(analysisByType?.sucata.desvio)}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recuperável</span>
                <span className="text-sm text-muted-foreground">
                  {analysisByType?.recuperavel.count} veículos
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Esperado</p>
                  <p className="font-medium">
                    {formatCurrency(analysisByType?.recuperavel.valorEsperado)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Alcançado</p>
                  <p className="font-medium">
                    {formatCurrency(analysisByType?.recuperavel.valorAlcancado)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(analysisByType?.recuperavel.desvio || 0) >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-[hsl(var(--danger))]" />
                )}
                <span
                  className={`text-sm font-medium ${
                    (analysisByType?.recuperavel.desvio || 0) >= 0
                      ? "text-[hsl(var(--success))]"
                      : "text-[hsl(var(--danger))]"
                  }`}
                >
                  {formatCurrency(analysisByType?.recuperavel.desvio)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
