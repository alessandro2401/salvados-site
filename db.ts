import { eq, and, gte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, vehicles, auctions, fipeCache, InsertVehicle, InsertAuction, InsertFipeCache } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Vehicle Queries =====

export async function createVehicle(vehicle: InsertVehicle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(vehicles).values(vehicle);
  return result;
}

export async function getVehiclesByAuctionId(auctionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vehicles).where(eq(vehicles.leilaoId, auctionId));
}

export async function getAllVehicles() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
}

export async function updateVehicle(id: number, data: Partial<InsertVehicle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(vehicles).set(data).where(eq(vehicles.id, id));
}

export async function approveVehicle(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(vehicles).set({
    aprovado: true,
    aprovadoPor: userId,
    aprovadoEm: new Date(),
  }).where(eq(vehicles.id, id));
}

export async function rejectVehicle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(vehicles).set({
    aprovado: false,
    aprovadoPor: null,
    aprovadoEm: null,
  }).where(eq(vehicles.id, id));
}

// ===== Auction Queries =====

export async function createAuction(auction: InsertAuction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(auctions).values(auction);
  return result;
}

export async function getAllAuctions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(auctions).orderBy(desc(auctions.createdAt));
}

export async function getAuctionById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(auctions).where(eq(auctions.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateAuction(id: number, data: Partial<InsertAuction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(auctions).set(data).where(eq(auctions.id, id));
}

// ===== FIPE Cache Queries =====

export async function getFipeCached(marca: string, modelo: string, ano: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const now = new Date();
  const result = await db.select().from(fipeCache).where(
    and(
      eq(fipeCache.marca, marca),
      eq(fipeCache.modelo, modelo),
      eq(fipeCache.ano, ano),
      gte(fipeCache.expiresAt, now)
    )
  ).limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function saveFipeCache(data: InsertFipeCache) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(fipeCache).values(data);
}
