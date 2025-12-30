import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function ImportAuction() {
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [auctionName, setAuctionName] = useState("");
  const importMutation = trpc.auctions.importExcel.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
        toast.error("Formato inválido", {
          description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
        });
        return;
      }
      setFile(selectedFile);
      // Sugerir nome do leilão baseado no nome do arquivo
      if (!auctionName) {
        const suggestedName = selectedFile.name.replace(/\.(xlsx|xls)$/i, "");
        setAuctionName(suggestedName);
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Nenhum arquivo selecionado");
      return;
    }

    if (!auctionName.trim()) {
      toast.error("Nome do leilão é obrigatório");
      return;
    }

    try {
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const fileBase64 = base64.split(",")[1]; // Remover prefixo data:...;base64,

        const result = await importMutation.mutateAsync({
          fileBase64,
          auctionName: auctionName.trim(),
        });

        toast.success("Importação concluída!", {
          description: `${result.vehiclesImported} veículos importados com sucesso.`,
        });

        // Redirecionar para o dashboard
        setTimeout(() => {
          setLocation("/dashboard");
        }, 1500);
      };

      reader.onerror = () => {
        toast.error("Erro ao ler arquivo");
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error("Erro na importação", {
        description: error.message || "Não foi possível importar a planilha",
      });
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Importar Planilha de Leilão</h1>
          <p className="text-muted-foreground">
            Faça upload de uma planilha Excel (.xlsx) com os dados do leilão
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload de Planilha</CardTitle>
            <CardDescription>
              A planilha deve conter as colunas: PLACA, MARCA/MODELO, ANO, TIPO, VALOR ALCANÇADO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="auctionName">Nome do Leilão</Label>
              <Input
                id="auctionName"
                placeholder="Ex: MAISBRASIL-10.12.25-Autorizada"
                value={auctionName}
                onChange={(e) => setAuctionName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Arquivo Excel</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {file && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-[hsl(var(--warning))] mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Instruções de Importação:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>A primeira linha deve conter os cabeçalhos das colunas</li>
                    <li>Coluna PLACA é obrigatória e deve ser única</li>
                    <li>Coluna TIPO deve conter "Sucata" ou "Recuperável"</li>
                    <li>Valores monetários podem estar no formato "R$ 10.000,00"</li>
                    <li>O sistema calculará automaticamente o valor FIPE e o valor sugerido</li>
                  </ul>
                </div>
              </div>
            </div>

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
                disabled={!file || !auctionName.trim() || importMutation.isPending}
              >
                {importMutation.isPending ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Importar Leilão
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {importMutation.isSuccess && (
          <Card className="border-[hsl(var(--success))]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-[hsl(var(--success))]" />
                <div>
                  <p className="font-medium">Importação concluída com sucesso!</p>
                  <p className="text-sm text-muted-foreground">
                    Redirecionando para o dashboard...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
