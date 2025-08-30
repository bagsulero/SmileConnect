// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  caseLeads;
  savedCases;
  claimedCases;
  currentUserId;
  currentCaseLeadId;
  currentSavedCaseId;
  currentClaimedCaseId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.caseLeads = /* @__PURE__ */ new Map();
    this.savedCases = /* @__PURE__ */ new Map();
    this.claimedCases = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentCaseLeadId = 1;
    this.currentSavedCaseId = 1;
    this.currentClaimedCaseId = 1;
    this.seedData();
  }
  seedData() {
    const adminUser = {
      id: this.currentUserId++,
      username: "admin",
      email: "admin@dentalcare.com",
      password: "password",
      role: "admin",
      firstName: "Maria",
      lastName: "Santos",
      isActive: true,
      lastActive: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date()
    };
    const studentUser = {
      id: this.currentUserId++,
      username: "student1",
      email: "juan.delacruz@email.com",
      password: "password",
      role: "student",
      firstName: "Juan",
      lastName: "Dela Cruz",
      isActive: true,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1e3),
      // 2 hours ago
      createdAt: /* @__PURE__ */ new Date()
    };
    const barangayUser = {
      id: this.currentUserId++,
      username: "barangay1",
      email: "maria.santos@email.com",
      password: "password",
      role: "barangay",
      firstName: "Maria",
      lastName: "Santos",
      isActive: true,
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1e3),
      // 1 day ago
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(adminUser.id, adminUser);
    this.users.set(studentUser.id, studentUser);
    this.users.set(barangayUser.id, barangayUser);
    const caseLeads2 = [
      {
        id: this.currentCaseLeadId++,
        patientName: "Ana Reyes",
        age: 34,
        contactInfo: "09123456789",
        address: "123 Main St, Quezon City",
        issueDescription: "Severe toothache on upper left molar, pain for 3 days, difficulty eating. Looking for urgent dental care.",
        priority: "urgent",
        source: "facebook",
        location: "Quezon City",
        status: "available",
        submittedBy: null,
        claimedBy: null,
        isPublished: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1e3),
        // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1e3)
      },
      {
        id: this.currentCaseLeadId++,
        patientName: "Carlos Mendoza",
        age: 28,
        contactInfo: "carlosmendoza@email.com",
        address: "456 Oak Ave, Makati",
        issueDescription: "Need wisdom tooth extraction, impacted and causing pain. Referred by dentist for extraction.",
        priority: "moderate",
        source: "reddit",
        location: "Makati",
        status: "available",
        submittedBy: null,
        claimedBy: null,
        isPublished: true,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1e3),
        // 5 hours ago
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1e3)
      },
      {
        id: this.currentCaseLeadId++,
        patientName: "Maria Santos",
        age: 45,
        contactInfo: "09987654321",
        address: "789 Pine St, Pasig",
        issueDescription: "Routine dental cleaning needed, last visit was 2 years ago. Some sensitivity issues.",
        priority: "routine",
        source: "barangay",
        location: "Pasig",
        status: "available",
        submittedBy: barangayUser.id,
        claimedBy: null,
        isPublished: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1e3),
        // 1 day ago
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1e3)
      },
      {
        id: this.currentCaseLeadId++,
        patientName: "Pedro Garcia",
        age: 55,
        contactInfo: "09111222333",
        address: "321 Elm St, Mandaluyong",
        issueDescription: "Dental cleaning completed successfully. Patient satisfied with treatment.",
        priority: "routine",
        source: "barangay",
        location: "Mandaluyong",
        status: "completed",
        submittedBy: barangayUser.id,
        claimedBy: studentUser.id,
        isPublished: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3),
        // 1 week ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)
      }
    ];
    caseLeads2.forEach((caseLead) => {
      this.caseLeads.set(caseLead.id, caseLead);
    });
    const completedDummyCaseLead = {
      id: this.currentCaseLeadId++,
      patientName: "Read Account",
      age: 29,
      contactInfo: "read.account@email.com",
      address: "456 Sample Ave, Demo City",
      issueDescription: "Patient completed root canal treatment and restoration.",
      priority: "routine",
      source: "facebook",
      location: "Demo City",
      status: "completed",
      submittedBy: 2,
      // student user id
      claimedBy: 2,
      // student user id
      isPublished: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.caseLeads.set(completedDummyCaseLead.id, completedDummyCaseLead);
    const completedDummyClaimedCase = {
      id: this.currentClaimedCaseId++,
      userId: 2,
      // student user id
      caseLeadId: completedDummyCaseLead.id,
      status: "done",
      appointmentDate: (/* @__PURE__ */ new Date()).toISOString(),
      notes: "Demo completed case for Read Account.",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.claimedCases.set(completedDummyClaimedCase.id, completedDummyClaimedCase);
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = {
      ...insertUser,
      id,
      isActive: true,
      lastActive: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updateUser) {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    const updatedUser = { ...user, ...updateUser };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  async getCaseLead(id) {
    return this.caseLeads.get(id);
  }
  async getAllCaseLeads() {
    return Array.from(this.caseLeads.values());
  }
  async getPublishedCaseLeads() {
    return Array.from(this.caseLeads.values()).filter((caseLead) => caseLead.isPublished);
  }
  async getUnpublishedCaseLeads() {
    return Array.from(this.caseLeads.values()).filter((caseLead) => !caseLead.isPublished);
  }
  async createCaseLead(insertCaseLead) {
    const id = this.currentCaseLeadId++;
    const caseLead = {
      ...insertCaseLead,
      id,
      status: "available",
      claimedBy: null,
      isPublished: false,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.caseLeads.set(id, caseLead);
    return caseLead;
  }
  async updateCaseLead(id, updateCaseLead) {
    const caseLead = this.caseLeads.get(id);
    if (!caseLead) {
      throw new Error(`Case lead with id ${id} not found`);
    }
    const updatedCaseLead = { ...caseLead, ...updateCaseLead, updatedAt: /* @__PURE__ */ new Date() };
    this.caseLeads.set(id, updatedCaseLead);
    return updatedCaseLead;
  }
  async deleteCaseLead(id) {
    this.caseLeads.delete(id);
  }
  async getSavedCases(userId) {
    const savedCases2 = Array.from(this.savedCases.values()).filter((sc) => sc.userId === userId);
    return savedCases2.map((sc) => ({
      ...sc,
      caseLead: this.caseLeads.get(sc.caseLeadId)
    })).filter((sc) => sc.caseLead);
  }
  async saveCaseLead(userId, caseLeadId) {
    const id = this.currentSavedCaseId++;
    const savedCase = {
      id,
      userId,
      caseLeadId,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.savedCases.set(id, savedCase);
    return savedCase;
  }
  async removeSavedCase(userId, caseLeadId) {
    const savedCase = Array.from(this.savedCases.values()).find(
      (sc) => sc.userId === userId && sc.caseLeadId === caseLeadId
    );
    if (savedCase) {
      this.savedCases.delete(savedCase.id);
    }
  }
  async getClaimedCases(userId) {
    const claimedCases2 = Array.from(this.claimedCases.values()).filter((cc) => cc.userId === userId);
    return claimedCases2.map((cc) => ({
      ...cc,
      caseLead: this.caseLeads.get(cc.caseLeadId)
    })).filter((cc) => cc.caseLead);
  }
  async claimCaseLead(userId, caseLeadId) {
    const id = this.currentClaimedCaseId++;
    const claimedCase = {
      id,
      userId,
      caseLeadId,
      status: "contacted",
      appointmentDate: null,
      notes: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.claimedCases.set(id, claimedCase);
    await this.updateCaseLead(caseLeadId, {
      status: "claimed",
      claimedBy: userId
    });
    return claimedCase;
  }
  async updateClaimedCase(id, updateClaimedCase) {
    const claimedCase = this.claimedCases.get(id);
    if (!claimedCase) {
      throw new Error(`Claimed case with id ${id} not found`);
    }
    const updatedClaimedCase = { ...claimedCase, ...updateClaimedCase, updatedAt: /* @__PURE__ */ new Date() };
    this.claimedCases.set(id, updatedClaimedCase);
    return updatedClaimedCase;
  }
  async getStats() {
    const users2 = Array.from(this.users.values());
    const caseLeads2 = Array.from(this.caseLeads.values());
    return {
      activeStudents: users2.filter((u) => u.role === "student" && u.isActive).length,
      totalLeads: caseLeads2.length,
      pendingReviews: caseLeads2.filter((cl) => !cl.isPublished).length,
      completedCases: caseLeads2.filter((cl) => cl.status === "completed").length
    };
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  // 'admin', 'student', 'barangay'
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isActive: boolean("is_active").default(true),
  lastActive: timestamp("last_active"),
  createdAt: timestamp("created_at").defaultNow()
});
var caseLeads = pgTable("case_leads", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  age: integer("age"),
  contactInfo: text("contact_info").notNull(),
  address: text("address").notNull(),
  issueDescription: text("issue_description").notNull(),
  priority: text("priority").notNull(),
  // 'routine', 'moderate', 'urgent'
  source: text("source").notNull(),
  // 'facebook', 'reddit', 'barangay'
  location: text("location").notNull(),
  status: text("status").notNull().default("available"),
  // 'available', 'saved', 'claimed', 'completed'
  submittedBy: integer("submitted_by").references(() => users.id),
  claimedBy: integer("claimed_by").references(() => users.id),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var savedCases = pgTable("saved_cases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  caseLeadId: integer("case_lead_id").references(() => caseLeads.id),
  createdAt: timestamp("created_at").defaultNow()
});
var claimedCases = pgTable("claimed_cases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  caseLeadId: integer("case_lead_id").references(() => caseLeads.id),
  status: text("status").notNull().default("contacted"),
  // 'contacted', 'scheduled', 'done'
  appointmentDate: timestamp("appointment_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastActive: true
});
var insertCaseLeadSchema = createInsertSchema(caseLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  claimedBy: true,
  isPublished: true
});
var insertSavedCaseSchema = createInsertSchema(savedCases).omit({
  id: true,
  createdAt: true
});
var insertClaimedCaseSchema = createInsertSchema(claimedCases).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Failed to update user" });
    }
  });
  app2.get("/api/case-leads", async (req, res) => {
    try {
      const caseLeads2 = await storage.getPublishedCaseLeads();
      res.json(caseLeads2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch case leads" });
    }
  });
  app2.get("/api/case-leads/:id", async (req, res) => {
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
  app2.post("/api/case-leads", async (req, res) => {
    try {
      const caseLeadData = insertCaseLeadSchema.parse(req.body);
      const caseLead = await storage.createCaseLead(caseLeadData);
      res.json(caseLead);
    } catch (error) {
      res.status(400).json({ error: "Invalid case lead data" });
    }
  });
  app2.patch("/api/case-leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const caseLead = await storage.updateCaseLead(id, req.body);
      res.json(caseLead);
    } catch (error) {
      res.status(400).json({ error: "Failed to update case lead" });
    }
  });
  app2.delete("/api/case-leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCaseLead(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete case lead" });
    }
  });
  app2.get("/api/admin/unpublished-leads", async (req, res) => {
    try {
      const caseLeads2 = await storage.getUnpublishedCaseLeads();
      res.json(caseLeads2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unpublished leads" });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });
  app2.get("/api/saved-cases/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const savedCases2 = await storage.getSavedCases(userId);
      res.json(savedCases2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved cases" });
    }
  });
  app2.post("/api/saved-cases", async (req, res) => {
    try {
      const { userId, caseLeadId } = req.body;
      const savedCase = await storage.saveCaseLead(userId, caseLeadId);
      res.json(savedCase);
    } catch (error) {
      res.status(400).json({ error: "Failed to save case" });
    }
  });
  app2.delete("/api/saved-cases/:userId/:caseLeadId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const caseLeadId = parseInt(req.params.caseLeadId);
      await storage.removeSavedCase(userId, caseLeadId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to remove saved case" });
    }
  });
  app2.get("/api/claimed-cases/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const claimedCases2 = await storage.getClaimedCases(userId);
      res.json(claimedCases2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch claimed cases" });
    }
  });
  app2.post("/api/claimed-cases", async (req, res) => {
    try {
      const { userId, caseLeadId } = req.body;
      const claimedCase = await storage.claimCaseLead(userId, caseLeadId);
      res.json(claimedCase);
    } catch (error) {
      res.status(400).json({ error: "Failed to claim case" });
    }
  });
  app2.patch("/api/claimed-cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const claimedCase = await storage.updateClaimedCase(id, req.body);
      res.json(claimedCase);
    } catch (error) {
      res.status(400).json({ error: "Failed to update claimed case" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      return res.json({ id: 1, firstName: "Maria", lastName: "Santos", role: "admin" });
    }
    if (username === "student" && password === "student") {
      return res.json({ id: 2, firstName: "Juan", lastName: "Dela Cruz", role: "student" });
    }
    if (username === "health" && password === "health") {
      return res.json({ id: 3, firstName: "Health", lastName: "Worker", role: "barangay" });
    }
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
