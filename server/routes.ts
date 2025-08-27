import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { database } from "./database";
import { insertCaseLeadSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Failed to update user" });
    }
  });

  // Case lead routes
  app.get("/api/case-leads", async (req, res) => {
    try {
      const caseLeads = await storage.getPublishedCaseLeads();
      res.json(caseLeads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch case leads" });
    }
  });

  app.get("/api/case-leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const caseLead = await storage.getCaseLead(id);
      if (!caseLead) {
        return res.status(404).json({ error: "Case lead not found" });
      }
      res.json(caseLead);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch case lead" });
    }
  });

  app.post("/api/case-leads", async (req, res) => {
    try {
      const caseLeadData = insertCaseLeadSchema.parse(req.body);
      const caseLead = await storage.createCaseLead(caseLeadData);
      res.json(caseLead);
    } catch (error) {
      res.status(400).json({ error: "Invalid case lead data" });
    }
  });

  app.patch("/api/case-leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const caseLead = await storage.updateCaseLead(id, req.body);
      res.json(caseLead);
    } catch (error) {
      res.status(400).json({ error: "Failed to update case lead" });
    }
  });

  app.delete("/api/case-leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCaseLead(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete case lead" });
    }
  });

  // Admin routes
  app.get("/api/admin/unpublished-leads", async (req, res) => {
    try {
      const caseLeads = await storage.getUnpublishedCaseLeads();
      res.json(caseLeads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unpublished leads" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Saved cases routes
  app.get("/api/saved-cases/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const savedCases = await storage.getSavedCases(userId);
      res.json(savedCases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved cases" });
    }
  });

  app.post("/api/saved-cases", async (req, res) => {
    try {
      const { userId, caseLeadId } = req.body;
      const savedCase = await storage.saveCaseLead(userId, caseLeadId);
      res.json(savedCase);
    } catch (error) {
      res.status(400).json({ error: "Failed to save case" });
    }
  });

  app.delete("/api/saved-cases/:userId/:caseLeadId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const caseLeadId = parseInt(req.params.caseLeadId);
      await storage.removeSavedCase(userId, caseLeadId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to remove saved case" });
    }
  });

  // Claimed cases routes
  app.get("/api/claimed-cases/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const claimedCases = await storage.getClaimedCases(userId);
      res.json(claimedCases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch claimed cases" });
    }
  });

  app.post("/api/claimed-cases", async (req, res) => {
    try {
      const { userId, caseLeadId } = req.body;
      const claimedCase = await storage.claimCaseLead(userId, caseLeadId);
      res.json(claimedCase);
    } catch (error) {
      res.status(400).json({ error: "Failed to claim case" });
    }
  });

  app.patch("/api/claimed-cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const claimedCase = await storage.updateClaimedCase(id, req.body);
      res.json(claimedCase);
    } catch (error) {
      res.status(400).json({ error: "Failed to update claimed case" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    // Demo users
    if (username === "admin" && password === "admin") {
      return res.json({ id: 1, firstName: "Maria", lastName: "Santos", role: "admin" });
    }
    if (username === "student" && password === "student") {
      return res.json({ id: 2, firstName: "Juan", lastName: "Dela Cruz", role: "student" });
    }
    if (username === "health" && password === "health") {
      return res.json({ id: 3, firstName: "Health", lastName: "Worker", role: "barangay" });
    }

    // Check storage for other users
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
