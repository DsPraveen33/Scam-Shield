import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);

  // Scans
  app.post(api.scans.create.path, async (req, res) => {
    try {
      const input = api.scans.create.input.parse(req.body);
      
      // Scam Detection Logic
      let riskScore = 0;
      let result = "SAFE";
      let flags: string[] = [];
      let reasoning = "";
      
      const domain = input.jobUrl ? new URL(input.jobUrl).hostname : "";
      
      // 1. Check Blacklist
      if (domain) {
        const blacklisted = await storage.getBlacklistByDomain(domain);
        if (blacklisted) {
          riskScore = 100;
          result = "FAKE";
          flags.push("Domain is blacklisted");
          reasoning = `The domain ${domain} is in our database of known scam sites: ${blacklisted.reason}`;
        }
      }

      // 2. AI Analysis (if not already known fake)
      if (riskScore < 100) {
        try {
          const prompt = `Analyze the following job offer/url for scam indicators. 
          
          URL: ${input.jobUrl || "N/A"}
          Text: ${input.offerText || "N/A"}
          
          Provide a risk score (0-100), a result (SAFE, SUSPICIOUS, FAKE), a reasoning, and a list of flags.
          Return ONLY valid JSON in this format:
          {
            "riskScore": number,
            "result": "SAFE" | "SUSPICIOUS" | "FAKE",
            "reasoning": "string",
            "flags": ["string"]
          }`;

          const response = await openai.chat.completions.create({
            model: "gpt-5.1",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
          });

          const aiResult = JSON.parse(response.choices[0]?.message?.content || "{}");
          
          if (aiResult.riskScore !== undefined) {
             riskScore = Math.max(riskScore, aiResult.riskScore);
             result = aiResult.result;
             reasoning = aiResult.reasoning;
             flags = [...flags, ...(aiResult.flags || [])];
          }
        } catch (error) {
          console.error("AI Analysis failed:", error);
          reasoning += " AI analysis failed, falling back to basic checks.";
        }
      }

      // 3. Keyword Check (Basic fallback or supplement)
      const keywords = await storage.getKeywords();
      const textToCheck = (input.offerText + " " + input.jobUrl).toLowerCase();
      
      for (const kw of keywords) {
        if (textToCheck.includes(kw.word.toLowerCase())) {
          riskScore = Math.min(riskScore + (kw.weight * 10), 100);
          flags.push(`Contains keyword: ${kw.word}`);
          if (riskScore > 50 && result === "SAFE") result = "SUSPICIOUS";
          if (riskScore > 80) result = "FAKE";
        }
      }

      const userId = (req.user as any)?.claims?.sub;

      const scan = await storage.createScan({
        userId,
        jobUrl: input.jobUrl,
        offerText: input.offerText,
        riskScore,
        result,
        details: { reasoning, flags }
      });

      res.json(scan);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.scans.list.path, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
    const scans = await storage.getScans(userId); // Filter by user if logged in
    res.json(scans);
  });

  app.get(api.scans.get.path, async (req, res) => {
    const scan = await storage.getScan(Number(req.params.id));
    if (!scan) return res.status(404).json({ message: "Scan not found" });
    res.json(scan);
  });

  // Blacklist
  app.get(api.blacklist.list.path, async (req, res) => {
    const list = await storage.getBlacklist();
    res.json(list);
  });

  app.post(api.blacklist.create.path, async (req, res) => {
    const input = api.blacklist.create.input.parse(req.body);
    const item = await storage.createBlacklist(input);
    res.status(201).json(item);
  });

  app.delete(api.blacklist.delete.path, async (req, res) => {
    await storage.deleteBlacklist(Number(req.params.id));
    res.status(204).send();
  });

  // Keywords
  app.get(api.keywords.list.path, async (req, res) => {
    const list = await storage.getKeywords();
    res.json(list);
  });

  app.post(api.keywords.create.path, async (req, res) => {
    const input = api.keywords.create.input.parse(req.body);
    const item = await storage.createKeyword(input);
    res.status(201).json(item);
  });

  app.delete(api.keywords.delete.path, async (req, res) => {
    await storage.deleteKeyword(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingBlacklist = await storage.getBlacklist();
  if (existingBlacklist.length === 0) {
    await storage.createBlacklist({ domain: "scam-job-offer.com", reason: "Known phishing site" });
    await storage.createBlacklist({ domain: "fake-recruiters.net", reason: "Reported for identity theft" });
  }

  const existingKeywords = await storage.getKeywords();
  if (existingKeywords.length === 0) {
    await storage.createKeyword({ word: "wire transfer", category: "payment", weight: 5 });
    await storage.createKeyword({ word: "processing fee", category: "payment", weight: 4 });
    await storage.createKeyword({ word: "urgently", category: "urgency", weight: 2 });
  }
}
