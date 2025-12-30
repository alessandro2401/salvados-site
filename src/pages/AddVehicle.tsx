import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

function formatCurrency(cents: number | null | undefined): string {
  if (!cents) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export default function AddVehicle() {
  const [, setLocation] = useLocation();
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [tipo, setTipo] = useState<"Sucata" | "Recuperável">("Recuperável");
  const [status, setStatus] = useState<string>("Novo no Pátio");
  const [observacoes, setObservacoes] = useState("");
  const [valorFipe, setValorFipe] = useState<number | null>(null);
  const [valorSugerido, setValorSugerido] = useState<number | null>(null);
  const [loadingFipe, setLoadingFipe] = useState(false);

  const createMutation = trpc.vehicles.create.useMutation();
  const fipeQuery = trpc.fipe.getValue.useQuery(
    { marca, modelo, ano: parseInt(ano) },
    { enabled: false }
  );

  // Buscar valor FIPE quando marca, modelo e ano estiverem preenchidos
  const handleFetchFipe = async () => {
    if (!marca.trim() || !modelo.trim() || !ano) {
      toast.error("Preencha marca, modelo e ano para buscar o valor FIPE");
      return;
    }

    const anoNum = parseInt(ano);
    if (isNaN(anoNum) || anoNum < 1900 || anoNum > new Date().getFullYear() + 1) {
      toast.error("Ano inválido");
      return;
    }

    setLoadingFipe(true);
    try {
      const result = await fipeQuery.refetch();
      if (result.data) {
        setValorFipe(result.data.valorFipe);
        // Calcular valor sugerido
        const percentual = tipo === "Sucata" ? 0.25 : 0.40;
        const sugerido = Math.round(result.data.valorFipe * percentual);
        setValorSugerido(sugerido);
        toast.success("Valor FIPE obtido com sucesso!");
      }
    } catch (error: any) {
      toast.error("Erro ao buscar valor FIPE", {
        description: error.message || "Verifique se a marca, modelo e ano estão corretos",
      });
    } finally {
      setLoadingFipe(false);
    }
  };

  // Recalcular valor sugerido quando o tipo mudar
  useEffect(() => {
    if (valorFipe) {
      const percentual = tipo === "Sucata" ? 0.25 : 0.40;
      const sugerido = Math.round(valorFipe * percentual);
      setValorSugerido(sugerido);
    }
  }, [tipo, valorFipe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!placa.trim()) {
      toast.error("Placa é obrigatória");
      return;
    }

    if (!marca.trim() || !modelo.trim()) {
      toast.error("Marca e modelo são obrigatórios");
      return;
    }

    const anoNum = parseInt(ano);
    if (isNaN(anoNum)) {
      toast.error("Ano inválido");
      return;
    }

    try {
      await createMutation.mutateAsync({
        placa: placa.trim().toUpperCase(),
        marca: marca.trim(),
        modelo: modelo.trim(),
        ano: anoNum,
        tipo,
        status: status as any,
        observacoes: observacoes.trim() || undefined,
      });

      toast.success("Veículo cadastrado com sucesso!");
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    } catch (error: any) {
      toast.error("Erro ao cadastrar veículo", {
        description: error.message || "Verifique os dados e tente novamente",
      });
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastrar Novo Veículo</h1>
          <p className="text-muted-foreground">
            Adicione um veículo manualmente ao sistema
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Dados do Veículo</CardTitle>
              <CardDescription>
                Preencha as informações do veículo. O valor FIPE será consultado automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="placa">Placa *</Label>
                  <Input
                    id="placa"
                    placeholder="ABC-1234"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ano">Ano *</Label>
                  <Input
                    id="ano"
                    type="number"
                    placeholder="2020"
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    min={1900}
                    max={new Date().getFullYear() + 1}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca *</Label>
                  <Input
                    id="marca"
                    placeholder="Ex: VW - VolksWagen"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo *</Label>
                  <Input
                    id="modelo"
                    placeholder="Ex: Gol 1.0"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFetchFipe}
                  disabled={loadingFipe || !marca || !modelo || !ano}
                >
                  {loadingFipe ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Consultando...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Buscar Valor FIPE
                    </>
                  )}
                </Button>
              </div>

              {valorFipe && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor FIPE</p>
                      <p className="text-lg font-bold text-[hsl(var(--primary))]">
                        {formatCurrency(valorFipe)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Sugerido ({tipo === "Sucata" ? "25%" : "40%"})</p>
                      <p className="text-lg font-bold text-[hsl(var(--success))]">
                        {formatCurrency(valorSugerido)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select value={tipo} onValueChange={(v) => setTipo(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Recuperável">Recuperável</SelectItem>
                      <SelectItem value="Sucata">Sucata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Novo no Pátio">Novo no Pátio</SelectItem>
                      <SelectItem value="Venda Autorizada">Venda Autorizada</SelectItem>
                      <SelectItem value="Vendido e Não Recebido">Vendido e Não Recebido</SelectItem>
                      <SelectItem value="Vendido e Recebido">Vendido e Recebido</SelectItem>
                      <SelectItem value="Ocorrência">Ocorrência</SelectItem>
                      <SelectItem value="Proibida a Venda">Proibida a Venda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre o veículo..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/dashboard")}
                  disabled={createMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Veículo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
