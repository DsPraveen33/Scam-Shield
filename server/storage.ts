import { scans, blacklist, keywords, type InsertScan, type Scan, type InsertBlacklist, type Blacklist, type InsertKeyword, type Keyword } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Scans
  createScan(scan: InsertScan): Promise<Scan>;
  getScans(userId?: string): Promise<Scan[]>;
  getScan(id: number): Promise<Scan | undefined>;
  
  // Blacklist
  createBlacklist(item: InsertBlacklist): Promise<Blacklist>;
  getBlacklist(): Promise<Blacklist[]>;
  getBlacklistByDomain(domain: string): Promise<Blacklist | undefined>;
  deleteBlacklist(id: number): Promise<void>;

  // Keywords
  createKeyword(item: InsertKeyword): Promise<Keyword>;
  getKeywords(): Promise<Keyword[]>;
  deleteKeyword(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createScan(scan: InsertScan): Promise<Scan> {
    const [newScan] = await db.insert(scans).values(scan).returning();
    return newScan;
  }

  async getScans(userId?: string): Promise<Scan[]> {
    const query = db.select().from(scans).orderBy(desc(scans.createdAt));
    if (userId) {
      // @ts-ignore
      query.where(eq(scans.userId, userId));
    }
    return await query;
  }

  async getScan(id: number): Promise<Scan | undefined> {
    const [scan] = await db.select().from(scans).where(eq(scans.id, id));
    return scan;
  }

  async createBlacklist(item: InsertBlacklist): Promise<Blacklist> {
    const [newItem] = await db.insert(blacklist).values(item).returning();
    return newItem;
  }

  async getBlacklist(): Promise<Blacklist[]> {
    return await db.select().from(blacklist).orderBy(desc(blacklist.createdAt));
  }

  async getBlacklistByDomain(domain: string): Promise<Blacklist | undefined> {
    const [item] = await db.select().from(blacklist).where(eq(blacklist.domain, domain));
    return item;
  }

  async deleteBlacklist(id: number): Promise<void> {
    await db.delete(blacklist).where(eq(blacklist.id, id));
  }

  async createKeyword(item: InsertKeyword): Promise<Keyword> {
    const [newItem] = await db.insert(keywords).values(item).returning();
    return newItem;
  }

  async getKeywords(): Promise<Keyword[]> {
    return await db.select().from(keywords).orderBy(desc(keywords.createdAt));
  }

  async deleteKeyword(id: number): Promise<void> {
    await db.delete(keywords).where(eq(keywords.id, id));
  }
}

export const storage = new DatabaseStorage();
