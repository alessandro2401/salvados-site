import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, TrendingUp, TrendingDown, DollarSign, Plus } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { NotificationBell } from "@/components/NotificationBell";

function formatCurrency(cents: number | null | undefined): string {
  if (!cents) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function getDesvioColor(desvio: number | null | undefined): string {
  if (!desvio) return "text-muted-foreground";
  if (desvio > 0) return "text-[hsl(var(--success))]";
  return "text-[hsl(var(--danger))]";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: vehicles, isLoading } = trpc.vehicles.list.useQuery();
  const approveMutation = trpc.vehicles.approve.useMutation();
  const rejectMutation = trpc.vehicles.reject.useMutation();
  const utils = trpc.useUtils();

  const isAdmin = user?.role === "admin";

  // Calcular KPIs
  const kpis = vehicles?.reduce(
    (acc, v) => {
      acc.valorEsperado += v.valorSugerido || 0;
      acc.valorAlcancado += v.valorAlcancado || 0;
      acc.desvioTotal += v.desvio || 0;
      return acc;
    },
    { valorEsperado: 0, valorAlcancado: 0, desvioTotal: 0 }
  );

  const handleApprove = async (id: number) => {
    await approveMutation.mutateAsync({ id });
    utils.vehicles.list.invalidate();
  };

  const handleReject = async (id: number) => {
    await rejectMutation.mutateAsync({ id });
    utils.vehicles.list.invalidate();
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Leilões</h1>
          <p className="text-muted-foreground">
            Análise de veículos salvados e performance de vendas
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && <NotificationBell />}
          {isAdmin && (
            <Button asChild>
              <a href="/add-vehicle">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Veículo
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Esperado Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">
              {formatCurrency(kpis?.valorEsperado)}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado em {vehicles?.length || 0} veículos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Alcançado Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--warning))]">
              {formatCurrency(kpis?.valorAlcancado)}
            </div>
            <p className="text-xs text-muted-foreground">Valor de venda realizado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desvio Total</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getDesvioColor(kpis?.desvioTotal)}`}>
              {formatCurrency(kpis?.desvioTotal)}
            </div>
            <p className="text-xs text-muted-foreground">
              {(kpis?.desvioTotal || 0) >= 0 ? "Acima" : "Abaixo"} do esperado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Veículos */}
      <Card>
        <CardHeader>
          <CardTitle>Veículos em Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor FIPE</TableHead>
                <TableHead>Valor Sugerido</TableHead>
                <TableHead>Valor Alcançado</TableHead>
                <TableHead>Desvio</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles?.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.placa}</TableCell>
                  <TableCell>
                    {vehicle.marca} {vehicle.modelo} ({vehicle.ano})
                  </TableCell>
                  <TableCell>
                    <Badge variant={vehicle.tipo === "Sucata" ? "secondary" : "default"}>
                      {vehicle.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(vehicle.valorFipe)}</TableCell>
                  <TableCell>{formatCurrency(vehicle.valorSugerido)}</TableCell>
                  <TableCell>{formatCurrency(vehicle.valorAlcancado)}</TableCell>
                  <TableCell className={getDesvioColor(vehicle.desvio)}>
                    {formatCurrency(vehicle.desvio)}
                  </TableCell>
                  <TableCell>
                    {vehicle.aprovado ? (
                      <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">
                        Aprovado
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pendente</Badge>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex gap-2">
                        {!vehicle.aprovado && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(vehicle.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                        )}
                        {vehicle.aprovado && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(vehicle.id)}
                            disabled={rejectMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
