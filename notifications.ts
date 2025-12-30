import { getDb } from "./db";
import { notifications, InsertNotification } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Criar uma nova notificação
 */
export async function createNotification(data: InsertNotification): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notifications).values(data);
  return Number(result[0].insertId);
}

/**
 * Listar todas as notificações (ordenadas por data, mais recentes primeiro)
 */
export async function listNotifications(limit?: number) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(notifications).orderBy(desc(notifications.createdAt));
  
  if (limit) {
    query = query.limit(limit) as any;
  }

  return await query;
}

/**
 * Listar notificações não lidas
 */
export async function listUnreadNotifications() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.lida, "false"))
    .orderBy(desc(notifications.createdAt));
}

/**
 * Marcar notificação como lida
 */
export async function markAsRead(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(notifications)
    .set({ lida: "true" })
    .where(eq(notifications.id, id));
}

/**
 * Marcar todas as notificações como lidas
 */
export async function markAllAsRead(): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(notifications)
    .set({ lida: "true" })
    .where(eq(notifications.lida, "false"));
}

/**
 * Deletar notificação
 */
export async function deleteNotification(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(notifications).where(eq(notifications.id, id));
}

/**
 * Notificar quando um veículo é vendido abaixo do esperado
 */
export async function notifyVendaAbaixoEsperado(
  veiculo: { id: number; placa: string; valorSugerido: number; valorAlcancado: number; desvio: number }
): Promise<void> {
  const desvioPercentual = ((veiculo.desvio / veiculo.valorSugerido) * 100).toFixed(2);
  
  await createNotification({
    tipo: "venda_abaixo",
    titulo: `Veículo vendido abaixo do esperado: ${veiculo.placa}`,
    mensagem: `O veículo ${veiculo.placa} foi vendido com um desvio negativo de ${desvioPercentual}%. Valor esperado: R$ ${(veiculo.valorSugerido / 100).toFixed(2)}, Valor alcançado: R$ ${(veiculo.valorAlcancado / 100).toFixed(2)}.`,
    veiculoId: veiculo.id,
    lida: "false",
  });
}

/**
 * Notificar quando um novo veículo é adicionado ao pátio
 */
export async function notifyNovoVeiculo(
  veiculo: { id: number; placa: string; marca: string; modelo: string; tipo: string }
): Promise<void> {
  await createNotification({
    tipo: "novo_veiculo",
    titulo: `Novo veículo no pátio: ${veiculo.placa}`,
    mensagem: `Um novo veículo ${veiculo.marca} ${veiculo.modelo} (${veiculo.tipo}) foi adicionado ao pátio.`,
    veiculoId: veiculo.id,
    lida: "false",
  });
}

/**
 * Notificar quando um veículo é aprovado para venda
 */
export async function notifyVeiculoAprovado(
  veiculo: { id: number; placa: string; valorSugerido: number }
): Promise<void> {
  await createNotification({
    tipo: "veiculo_aprovado",
    titulo: `Veículo aprovado para venda: ${veiculo.placa}`,
    mensagem: `O veículo ${veiculo.placa} foi aprovado para venda com valor sugerido de R$ ${(veiculo.valorSugerido / 100).toFixed(2)}.`,
    veiculoId: veiculo.id,
    lida: "false",
  });
}
