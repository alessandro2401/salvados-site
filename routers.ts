import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { getFipeValue, calculateExpectedReturn } from "./fipe";
import { parseAuctionExcel, validateAuctionExcel } from "./excelParser";
import { importAllSheetsData } from "./googleSheets";
import { TRPCError } from "@trpc/server";

// Procedure para admin apenas
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acesso restrito a administradores' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== Veículos =====
  vehicles: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllVehicles();
    }),
    
    listByAuction: protectedProcedure
      .input(z.object({ auctionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getVehiclesByAuctionId(input.auctionId);
      }),
    
    create: adminProcedure
      .input(z.object({
        placa: z.string(),
        marca: z.string(),
        modelo: z.string(),
        ano: z.number(),
        tipo: z.enum(["Sucata", "Recuperável"]),
        status: z.enum([
          "Novo no Pátio",
          "Venda Autorizada",
          "Vendido e Não Recebido",
          "Vendido e Recebido",
          "Ocorrência",
          "Proibida a Venda"
        ]).optional(),
        valorAlcancado: z.number().optional(),
        observacoes: z.string().optional(),
        leilaoId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        // Buscar valor FIPE
        const { valorFipe } = await getFipeValue(input.marca, input.modelo, input.ano);
        const valorSugerido = calculateExpectedReturn(valorFipe, input.tipo);
        
        const desvio = input.valorAlcancado 
          ? input.valorAlcancado - valorSugerido 
          : 0;
        
        await db.createVehicle({
          ...input,
          valorFipe,
          valorSugerido,
          desvio,
        });
        
        return { success: true };
      }),
    
    approve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.approveVehicle(input.id, ctx.user.id);
        return { success: true };
      }),
    
    reject: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.rejectVehicle(input.id);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          status: z.enum([
            "Novo no Pátio",
            "Venda Autorizada",
            "Vendido e Não Recebido",
            "Vendido e Recebido",
            "Ocorrência",
            "Proibida a Venda"
          ]).optional(),
          valorAlcancado: z.number().optional(),
          observacoes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateVehicle(input.id, input.data);
        return { success: true };
      }),
  }),

  // ===== Leilões =====
  auctions: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllAuctions();
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getAuctionById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        nome: z.string(),
        dataLeilao: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.createAuction({
          ...input,
          importadoPor: ctx.user.id,
        });
        return { success: true, id: (result as any).insertId };
      }),
    
    // Importar planilha de leilão
    importExcel: adminProcedure
      .input(z.object({
        fileBase64: z.string(),
        auctionName: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Decodificar base64 para buffer
        const buffer = Buffer.from(input.fileBase64, 'base64');
        
        // Validar planilha
        const validation = validateAuctionExcel(buffer);
        if (!validation.valid) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: validation.error || 'Planilha inválida' 
          });
        }
        
        // Parsear veículos
        const parsedVehicles = parseAuctionExcel(buffer);
        
        if (parsedVehicles.length === 0) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Nenhum veículo encontrado na planilha' 
          });
        }
        
        // Criar leilão
        const auctionResult = await db.createAuction({
          nome: input.auctionName,
          importadoPor: ctx.user.id,
        });
        const auctionId = (auctionResult as any).insertId;
        
        // Inserir veículos
        let valorEsperadoTotal = 0;
        let valorAlcancadoTotal = 0;
        
        for (const vehicle of parsedVehicles) {
          try {
            const { valorFipe } = await getFipeValue(vehicle.marca, vehicle.modelo, vehicle.ano);
            const valorSugerido = calculateExpectedReturn(valorFipe, vehicle.tipo);
            const desvio = vehicle.valorAlcancado 
              ? vehicle.valorAlcancado - valorSugerido 
              : 0;
            
            await db.createVehicle({
              ...vehicle,
              valorFipe,
              valorSugerido,
              desvio,
              leilaoId: auctionId,
              status: "Venda Autorizada",
            });
            
            valorEsperadoTotal += valorSugerido;
            valorAlcancadoTotal += vehicle.valorAlcancado || 0;
          } catch (error) {
            console.warn(`[Import] Erro ao processar veículo ${vehicle.placa}:`, error);
            // Continuar com o próximo veículo
          }
        }
        
        // Atualizar totais do leilão
        await db.updateAuction(auctionId, {
          valorEsperadoTotal,
          valorAlcancadoTotal,
          desvioTotal: valorAlcancadoTotal - valorEsperadoTotal,
          status: "Em Análise",
        });
        
        return { 
          success: true, 
          auctionId,
          vehiclesImported: parsedVehicles.length,
        };
      }),
  }),

  // ===== FIPE =====
  fipe: router({
    getValue: protectedProcedure
      .input(z.object({
        marca: z.string(),
        modelo: z.string(),
        ano: z.number(),
      }))
      .query(async ({ input }) => {
        return await getFipeValue(input.marca, input.modelo, input.ano);
      }),
  }),

  // ===== Google Sheets =====
  googleSheets: router({
    // Importar dados de todas as abas
    importAll: adminProcedure.mutation(async () => {
      try {
        const data = await importAllSheetsData();
        
        let totalImported = 0;
        
        // Processar cada categoria
        const allVehicles = [
          ...data.novosNoPatio,
          ...data.vendaAutorizada,
          ...data.vendidoNaoRecebido,
          ...data.vendidoRecebido,
          ...data.ocorrencia,
          ...data.proibidaVenda,
        ];
        
        for (const vehicle of allVehicles) {
          try {
            const { valorFipe } = await getFipeValue(
              vehicle.marca!,
              vehicle.modelo!,
              vehicle.ano!
            );
            const valorSugerido = calculateExpectedReturn(valorFipe, vehicle.tipo!);
            const desvio = vehicle.valorAlcancado 
              ? vehicle.valorAlcancado - valorSugerido 
              : 0;
            
            await db.createVehicle({
              ...vehicle,
              valorFipe,
              valorSugerido,
              desvio,
            } as any);
            
            totalImported++;
          } catch (error) {
            console.warn(`[Import] Erro ao processar veículo ${vehicle.placa}:`, error);
          }
        }
        
        return {
          success: true,
          totalImported,
          breakdown: {
            novosNoPatio: data.novosNoPatio.length,
            vendaAutorizada: data.vendaAutorizada.length,
            vendidoNaoRecebido: data.vendidoNaoRecebido.length,
            vendidoRecebido: data.vendidoRecebido.length,
            ocorrencia: data.ocorrencia.length,
            proibidaVenda: data.proibidaVenda.length,
          },
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Erro ao importar dados do Google Sheets',
        });
      }
    }),
    
    // Webhook para receber notificações do Google Apps Script
    webhook: publicProcedure
      .input(z.object({
        sheetName: z.string(),
        action: z.enum(['update', 'insert', 'delete']),
        rowData: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        console.log('[Webhook] Notificação recebida:', input);
        
        // Aqui você pode implementar a lógica de sincronização
        // Por exemplo, reimportar apenas a aba específica
        
        return { success: true, message: 'Webhook processado' };
      }),
  }),

  // ===== Notificações =====
  notifications: router({
    list: adminProcedure.query(async () => {
      const { listNotifications } = await import("./notifications");
      return await listNotifications();
    }),
    unread: adminProcedure.query(async () => {
      const { listUnreadNotifications } = await import("./notifications");
      return await listUnreadNotifications();
    }),
    markAsRead: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { markAsRead } = await import("./notifications");
        await markAsRead(input.id);
        return { success: true };
      }),
    markAllAsRead: adminProcedure.mutation(async () => {
      const { markAllAsRead } = await import("./notifications");
      await markAllAsRead();
      return { success: true };
    }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteNotification } = await import("./notifications");
        await deleteNotification(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
