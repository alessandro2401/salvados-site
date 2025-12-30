import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { FileSpreadsheet, BarChart3, CheckCircle2, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
              <h1 className="text-xl font-bold">{APP_TITLE}</h1>
            </div>
            <Button asChild>
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
          <div className="container max-w-4xl py-16 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                Sistema de Gestão de Veículos Salvados
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Controle financeiro e análise de leilões de veículos indenizados pelo Movimento
                Mais Brasil (MMB)
              </p>
              <div className="pt-4">
                <Button size="lg" asChild>
                  <a href={getLoginUrl()}>Acessar Sistema</a>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <FileSpreadsheet className="h-8 w-8 text-[hsl(var(--primary))] mb-2" />
                  <CardTitle>Importação de Planilhas</CardTitle>
                  <CardDescription>
                    Faça upload de planilhas Excel de leilão com cálculo automático de valores FIPE
                    e retorno esperado
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8 text-[hsl(var(--success))] mb-2" />
                  <CardTitle>Aprovação de Vendas</CardTitle>
                  <CardDescription>
                    Interface de análise com aprovação/rejeição individual de veículos baseada em
                    regras de negócio
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-[hsl(var(--warning))] mb-2" />
                  <CardTitle>Dashboard de Performance</CardTitle>
                  <CardDescription>
                    Visualize KPIs de leilão, desvios entre valor esperado e alcançado, e análise
                    financeira em tempo real
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-[hsl(var(--primary))] mb-2" />
                  <CardTitle>Integração FIPE</CardTitle>
                  <CardDescription>
                    Consulta automática de valores FIPE com sistema de cache para otimização de
                    requisições
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Usuário autenticado - redirecionar para dashboard
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <h1 className="text-xl font-bold">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Olá, {user?.name || user?.email}
            </span>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Ir para Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="container max-w-2xl py-16 text-center space-y-6">
          <h2 className="text-3xl font-bold">Bem-vindo ao Sistema Salvados</h2>
          <p className="text-lg text-muted-foreground">
            Acesse o dashboard para visualizar os leilões e gerenciar os veículos
          </p>
          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  Visualizar e gerenciar veículos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Acessar
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {user?.role === "admin" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Importar Leilão</CardTitle>
                    <CardDescription>
                      Carregar planilha Excel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/import">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Importar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Relatórios</CardTitle>
                    <CardDescription>
                      Análise de performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/reports">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Ver Relatórios
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
