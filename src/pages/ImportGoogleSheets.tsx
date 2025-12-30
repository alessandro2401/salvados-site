import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function ImportGoogleSheets() {
  const [, setLocation] = useLocation();
  const importMutation = trpc.googleSheets.importAll.useMutation();

  const handleImport = async () => {
    try {
      const result = await importMutation.mutateAsync();

      toast.success("Importação concluída!", {
        description: `${result.totalImported} veículos importados com sucesso.`,
      });

      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast.error("Erro na importação", {
        description: error.message || "Não foi possível importar os dados do Google Sheets",
      });
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Importar do Google Sheets</h1>
          <p className="text-muted-foreground">
            Sincronizar dados de todas as abas da planilha do Google Sheets
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sincronização Automática</CardTitle>
            <CardDescription>
              Esta operação importará todos os veículos de todas as abas da planilha configurada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="h-5 w-5 text-[hsl(var(--primary))] mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Abas que serão importadas:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Novos No Pátio</li>
                    <li>Venda Autorizada</li>
                    <li>Vendido e Não Recebido</li>
                    <li>Vendido e Recebido</li>
                    <li>Ocorrência</li>
                    <li>Proibia a Venda</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-[hsl(var(--warning))] mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-[hsl(var(--warning))]">Atenção:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>A importação pode levar alguns minutos dependendo do volume de dados</li>
                    <li>O valor FIPE será consultado automaticamente para cada veículo</li>
                    <li>Veículos duplicados (mesma placa) serão ignorados</li>
                  </ul>
                </div>
              </div>
            </div>

            {importMutation.isSuccess && (
              <div className="bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[hsl(var(--success))]" />
                  <div>
                    <p className="font-medium text-[hsl(var(--success))]">
                      Importação concluída!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {importMutation.data?.totalImported} veículos importados
                    </p>
                    {importMutation.data?.breakdown && (
                      <div className="mt-2 text-xs text-muted-foreground space-y-1">
                        <p>• Novos no Pátio: {importMutation.data.breakdown.novosNoPatio}</p>
                        <p>• Venda Autorizada: {importMutation.data.breakdown.vendaAutorizada}</p>
                        <p>
                          • Vendido e Não Recebido:{" "}
                          {importMutation.data.breakdown.vendidoNaoRecebido}
                        </p>
                        <p>
                          • Vendido e Recebido: {importMutation.data.breakdown.vendidoRecebido}
                        </p>
                        <p>• Ocorrência: {importMutation.data.breakdown.ocorrencia}</p>
                        <p>• Proibida a Venda: {importMutation.data.breakdown.proibidaVenda}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setLocation("/dashboard")}
                disabled={importMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={importMutation.isPending}
              >
                {importMutation.isPending ? (
                  <>
                    <Download className="h-4 w-4 mr-2 animate-pulse" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Iniciar Importação
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuração do Webhook (Opcional)</CardTitle>
            <CardDescription>
              Para atualização automática quando a planilha for modificada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="font-medium">Passos para configurar o Google Apps Script:</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Abra a planilha do Google Sheets</li>
                <li>Vá em Extensões → Apps Script</li>
                <li>Cole o código do webhook (disponível na documentação)</li>
                <li>Configure o gatilho para executar ao editar a planilha</li>
                <li>
                  Configure a URL do webhook:{" "}
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {window.location.origin}/api/trpc/googleSheets.webhook
                  </code>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
