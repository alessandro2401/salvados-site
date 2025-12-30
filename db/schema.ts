export const auctions = mysqlTable("auctions", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 200 }).notNull(),
  dataLeilao: timestamp("dataLeilao"),
  status: mysqlEnum("status", ["Pendente", "Em Análise", "Aprovado", "Finalizado"]).default("Pendente").notNull(),
  valorEsperadoTotal: int("valorEsperadoTotal"), // Soma dos valorSugerido em centavos
  valorAlcancadoTotal: int("valorAlcancadoTotal"), // Soma dos valorAlcancado em centavos
  desvioTotal: int("desvioTotal"), // Alcançado - Esperado em centavos
  importadoPor: int("importadoPor"), // FK para users.id
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Auction = typeof auctions.$inferSelect;
export type InsertAuction = typeof auctions.$inferInsert;

/**
 * Tabela de Cache FIPE
 * Armazena valores FIPE consultados para minimizar requisições à API
 */