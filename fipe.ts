import { getFipeCached, saveFipeCache } from "./db";

const FIPE_API_BASE = "https://fipe.parallelum.com.br/api/v2";

interface FipeReference {
  code: number;
  month: string;
}

interface FipeBrand {
  code: string;
  name: string;
}

interface FipeModel {
  code: string;
  name: string;
}

interface FipeYear {
  code: string;
  name: string;
}

interface FipeVehicleInfo {
  price: string; // Ex: "R$ 10.000,00"
  brand: string;
  model: string;
  modelYear: number;
  fuel: string;
  codeFipe: string;
  referenceMonth: string;
  vehicleType: number;
}

/**
 * Obter o código de referência mais atual da Tabela FIPE
 */
async function getCurrentReference(): Promise<FipeReference> {
  const response = await fetch(`${FIPE_API_BASE}/references`);
  if (!response.ok) {
    throw new Error(`Failed to fetch FIPE references: ${response.statusText}`);
  }
  const references: FipeReference[] = await response.json();
  return references[0]; // O primeiro é o mais atual
}

/**
 * Converter string de preço FIPE para centavos (int)
 * Ex: "R$ 10.000,00" -> 1000000
 */
function parsePrice(priceString: string): number {
  const cleaned = priceString.replace(/[R$\s.]/g, "").replace(",", "");
  return parseInt(cleaned, 10);
}

/**
 * Buscar o valor FIPE de um veículo com cache
 * @param marca Nome da marca (ex: "VW - VolksWagen")
 * @param modelo Nome do modelo (ex: "Gol 1.0")
 * @param ano Ano do veículo
 * @returns Valor FIPE em centavos
 */
export async function getFipeValue(
  marca: string,
  modelo: string,
  ano: number
): Promise<{ valorFipe: number; codeFipe: string; mesReferencia: string }> {
  // Verificar cache primeiro
  const cached = await getFipeCached(marca, modelo, ano);
  if (cached) {
    return {
      valorFipe: cached.valorFipe,
      codeFipe: cached.codeFipe || "",
      mesReferencia: cached.mesReferencia || "",
    };
  }

  // Se não estiver no cache, consultar a API
  try {
    const reference = await getCurrentReference();
    
    // Buscar marca
    const brandsResponse = await fetch(`${FIPE_API_BASE}/cars/brands`);
    const brands: FipeBrand[] = await brandsResponse.json();
    const brand = brands.find(b => 
      marca.toLowerCase().includes(b.name.toLowerCase()) || 
      b.name.toLowerCase().includes(marca.toLowerCase())
    );
    
    if (!brand) {
      throw new Error(`Marca não encontrada: ${marca}`);
    }

    // Buscar modelo
    const modelsResponse = await fetch(`${FIPE_API_BASE}/cars/brands/${brand.code}/models`);
    const models: FipeModel[] = await modelsResponse.json();
    const model = models.find(m => 
      modelo.toLowerCase().includes(m.name.toLowerCase()) || 
      m.name.toLowerCase().includes(modelo.toLowerCase())
    );
    
    if (!model) {
      throw new Error(`Modelo não encontrado: ${modelo}`);
    }

    // Buscar ano
    const yearsResponse = await fetch(`${FIPE_API_BASE}/cars/brands/${brand.code}/models/${model.code}/years`);
    const years: FipeYear[] = await yearsResponse.json();
    const year = years.find(y => y.name.includes(ano.toString()));
    
    if (!year) {
      throw new Error(`Ano não encontrado: ${ano}`);
    }

    // Buscar valor final
    const vehicleResponse = await fetch(
      `${FIPE_API_BASE}/cars/brands/${brand.code}/models/${model.code}/years/${year.code}?reference=${reference.code}`
    );
    const vehicleInfo: FipeVehicleInfo = await vehicleResponse.json();
    
    const valorFipe = parsePrice(vehicleInfo.price);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Cache expira em 30 dias

    // Salvar no cache
    await saveFipeCache({
      marca,
      modelo,
      ano,
      valorFipe,
      codeFipe: vehicleInfo.codeFipe,
      mesReferencia: reference.month,
      expiresAt,
    });

    return {
      valorFipe,
      codeFipe: vehicleInfo.codeFipe,
      mesReferencia: reference.month,
    };
  } catch (error) {
    console.error("[FIPE] Error fetching value:", error);
    throw error;
  }
}

/**
 * Calcular o valor esperado de retorno baseado no tipo do veículo
 * @param valorFipe Valor FIPE em centavos
 * @param tipo "Sucata" (25%) ou "Recuperável" (40%)
 * @returns Valor esperado em centavos
 */
export function calculateExpectedReturn(valorFipe: number, tipo: "Sucata" | "Recuperável"): number {
  const percentual = tipo === "Sucata" ? 0.25 : 0.40;
  return Math.round(valorFipe * percentual);
}
