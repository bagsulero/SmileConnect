import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'admin', 'student', 'barangay'
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isActive: boolean("is_active").default(true),
  lastActive: timestamp("last_active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const caseLeads = pgTable("case_leads", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  age: integer("age"),
  contactInfo: text("contact_info").notNull(),
  address: text("address").notNull(),
  issueDescription: text("issue_description").notNull(),
  priority: text("priority").notNull(), // 'routine', 'moderate', 'urgent'
  source: text("source").notNull(), // 'facebook', 'reddit', 'barangay'
  location: text("location").notNull(),
  status: text("status").notNull().default('available'), // 'available', 'saved', 'claimed', 'completed'
  submittedBy: integer("submitted_by").references(() => users.id),
  claimedBy: integer("claimed_by").references(() => users.id),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedCases = pgTable("saved_cases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  caseLeadId: integer("case_lead_id").references(() => caseLeads.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const claimedCases = pgTable("claimed_cases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  caseLeadId: integer("case_lead_id").references(() => caseLeads.id),
  status: text("status").notNull().default('contacted'), // 'contacted', 'scheduled', 'done'
  appointmentDate: timestamp("appointment_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastActive: true,
});

export const insertCaseLeadSchema = createInsertSchema(caseLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  claimedBy: true,
  isPublished: true,
});

export const insertSavedCaseSchema = createInsertSchema(savedCases).omit({
  id: true,
  createdAt: true,
});

export const insertClaimedCaseSchema = createInsertSchema(claimedCases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CaseLead = typeof caseLeads.$inferSelect;
export type InsertCaseLead = z.infer<typeof insertCaseLeadSchema>;
export type SavedCase = typeof savedCases.$inferSelect;
export type InsertSavedCase = z.infer<typeof insertSavedCaseSchema>;
export type ClaimedCase = typeof claimedCases.$inferSelect;
export type InsertClaimedCase = z.infer<typeof insertClaimedCaseSchema>;
