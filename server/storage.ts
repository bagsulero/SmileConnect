import { db } from "./mysql";
import {
  users,
  caseLeads,
  savedCases,
  claimedCases,
  type User,
  type InsertUser,
  type CaseLead,
  type InsertCaseLead,
  type SavedCase,
  type InsertSavedCase,
  type ClaimedCase,
  type InsertClaimedCase
} from "@shared/schema";
import express from "express";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Case lead management
  getCaseLead(id: number): Promise<CaseLead | undefined>;
  getAllCaseLeads(): Promise<CaseLead[]>;
  getPublishedCaseLeads(): Promise<CaseLead[]>;
  getUnpublishedCaseLeads(): Promise<CaseLead[]>;
  createCaseLead(caseLead: InsertCaseLead): Promise<CaseLead>;
  updateCaseLead(id: number, caseLead: Partial<CaseLead>): Promise<CaseLead>;
  deleteCaseLead(id: number): Promise<void>;
  
  // Saved cases
  getSavedCases(userId: number): Promise<(SavedCase & { caseLead: CaseLead })[]>;
  saveCaseLead(userId: number, caseLeadId: number): Promise<SavedCase>;
  removeSavedCase(userId: number, caseLeadId: number): Promise<void>;
  
  // Claimed cases
  getClaimedCases(userId: number): Promise<(ClaimedCase & { caseLead: CaseLead })[]>;
  claimCaseLead(userId: number, caseLeadId: number): Promise<ClaimedCase>;
  updateClaimedCase(id: number, claimedCase: Partial<ClaimedCase>): Promise<ClaimedCase>;
  
  // Statistics
  getStats(): Promise<{
    activeStudents: number;
    totalLeads: number;
    pendingReviews: number;
    completedCases: number;
  }>;
}

export class MySQLStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return (rows as User[])[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    return (rows as User[])[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.query(
      "INSERT INTO users (username, email, password, role, firstName, lastName, isActive, lastActive, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        insertUser.username,
        insertUser.email,
        insertUser.password,
        insertUser.role,
        insertUser.firstName,
        insertUser.lastName,
        true,
        new Date(),
        new Date(),
      ]
    );
    const id = result[0].insertId;
    return { id, ...insertUser, isActive: true, lastActive: new Date(), createdAt: new Date() };
  }

  async updateUser(id: number, updateUser: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    const updatedUser = { ...user, ...updateUser };
    await db.query(
      "UPDATE users SET username = ?, email = ?, password = ?, role = ?, firstName = ?, lastName = ?, isActive = ?, lastActive = ?, createdAt = ? WHERE id = ?",
      [
        updatedUser.username,
        updatedUser.email,
        updatedUser.password,
        updatedUser.role,
        updatedUser.firstName,
        updatedUser.lastName,
        updatedUser.isActive,
        updatedUser.lastActive,
        updatedUser.createdAt,
        id,
      ]
    );
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    const [rows] = await db.query("SELECT * FROM users");
    return rows as User[];
  }

  async getCaseLead(id: number): Promise<CaseLead | undefined> {
    const [rows] = await db.query("SELECT * FROM case_leads WHERE id = ?", [id]);
    return (rows as CaseLead[])[0];
  }

  async getAllCaseLeads(): Promise<CaseLead[]> {
    const [rows] = await db.query("SELECT * FROM case_leads");
    return rows as CaseLead[];
  }

  async getPublishedCaseLeads(): Promise<CaseLead[]> {
    const [rows] = await db.query("SELECT * FROM case_leads WHERE isPublished = 1");
    return rows as CaseLead[];
  }

  async getUnpublishedCaseLeads(): Promise<CaseLead[]> {
    const [rows] = await db.query("SELECT * FROM caseLeads WHERE isPublished = 0");
    return rows as CaseLead[];
  }

  async createCaseLead(insertCaseLead: InsertCaseLead): Promise<CaseLead> {
    const result = await db.query(
      "INSERT INTO caseLeads (patientName, age, contactInfo, address, issueDescription, priority, source, location, status, submittedBy, claimedBy, isPublished, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        insertCaseLead.patientName,
        insertCaseLead.age,
        insertCaseLead.contactInfo,
        insertCaseLead.address,
        insertCaseLead.issueDescription,
        insertCaseLead.priority,
        insertCaseLead.source,
        insertCaseLead.location,
        'available',
        null,
        null,
        0,
        new Date(),
        new Date(),
      ]
    );
    const id = result[0].insertId;
    return { id, ...insertCaseLead, status: 'available', claimedBy: null, isPublished: false, createdAt: new Date(), updatedAt: new Date() };
  }

  async updateCaseLead(id: number, updateCaseLead: Partial<CaseLead>): Promise<CaseLead> {
    const caseLead = await this.getCaseLead(id);
    if (!caseLead) {
      throw new Error(`Case lead with id ${id} not found`);
    }
    const updatedCaseLead = { ...caseLead, ...updateCaseLead, updatedAt: new Date() };
    await db.query(
      "UPDATE caseLeads SET patientName = ?, age = ?, contactInfo = ?, address = ?, issueDescription = ?, priority = ?, source = ?, location = ?, status = ?, submittedBy = ?, claimedBy = ?, isPublished = ?, createdAt = ?, updatedAt = ? WHERE id = ?",
      [
        updatedCaseLead.patientName,
        updatedCaseLead.age,
        updatedCaseLead.contactInfo,
        updatedCaseLead.address,
        updatedCaseLead.issueDescription,
        updatedCaseLead.priority,
        updatedCaseLead.source,
        updatedCaseLead.location,
        updatedCaseLead.status,
        updatedCaseLead.submittedBy,
        updatedCaseLead.claimedBy,
        updatedCaseLead.isPublished ? 1 : 0,
        updatedCaseLead.createdAt,
        updatedCaseLead.updatedAt,
        id,
      ]
    );
    return updatedCaseLead;
  }

  async deleteCaseLead(id: number): Promise<void> {
    await db.query("DELETE FROM caseLeads WHERE id = ?", [id]);
  }

  async getSavedCases(userId: number): Promise<(SavedCase & { caseLead: CaseLead })[]> {
    const [rows] = await db.query(
      "SELECT savedCases.*, caseLeads.* FROM savedCases JOIN caseLeads ON savedCases.caseLeadId = caseLeads.id WHERE savedCases.userId = ?",
      [userId]
    );
    return rows as (SavedCase & { caseLead: CaseLead })[];
  }

  async saveCaseLead(userId: number, caseLeadId: number): Promise<SavedCase> {
    const result = await db.query(
      "INSERT INTO savedCases (userId, caseLeadId, createdAt) VALUES (?, ?, ?)",
      [userId, caseLeadId, new Date()]
    );
    const id = result[0].insertId;
    return { id, userId, caseLeadId, createdAt: new Date() };
  }

  async removeSavedCase(userId: number, caseLeadId: number): Promise<void> {
    await db.query(
      "DELETE FROM savedCases WHERE userId = ? AND caseLeadId = ?",
      [userId, caseLeadId]
    );
  }

  async getClaimedCases(userId: number): Promise<(ClaimedCase & { caseLead: CaseLead })[]> {
    const [rows] = await db.query(
      "SELECT claimedCases.*, caseLeads.* FROM claimedCases JOIN caseLeads ON claimedCases.caseLeadId = caseLeads.id WHERE claimedCases.userId = ?",
      [userId]
    );
    return rows as (ClaimedCase & { caseLead: CaseLead })[];
  }

  async claimCaseLead(userId: number, caseLeadId: number): Promise<ClaimedCase> {
    const result = await db.query(
      "INSERT INTO claimedCases (userId, caseLeadId, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
      [userId, caseLeadId, 'contacted', new Date(), new Date()]
    );
    const id = result[0].insertId;
    
    // Update case lead status
    await this.updateCaseLead(caseLeadId, { 
      status: 'claimed',
      claimedBy: userId 
    });
    
    return { id, userId, caseLeadId, status: 'contacted', appointmentDate: null, notes: null, createdAt: new Date(), updatedAt: new Date() };
  }

  async updateClaimedCase(id: number, updateClaimedCase: Partial<ClaimedCase>): Promise<ClaimedCase> {
    const claimedCase = await this.getClaimedCases(id);
    if (!claimedCase) {
      throw new Error(`Claimed case with id ${id} not found`);
    }
    const updatedClaimedCase = { ...claimedCase, ...updateClaimedCase, updatedAt: new Date() };
    await db.query(
      "UPDATE claimedCases SET userId = ?, caseLeadId = ?, status = ?, appointmentDate = ?, notes = ?, createdAt = ?, updatedAt = ? WHERE id = ?",
      [
        updatedClaimedCase.userId,
        updatedClaimedCase.caseLeadId,
        updatedClaimedCase.status,
        updatedClaimedCase.appointmentDate,
        updatedClaimedCase.notes,
        updatedClaimedCase.createdAt,
        updatedClaimedCase.updatedAt,
        id,
      ]
    );
    return updatedClaimedCase;
  }

  async getStats() {
    // Count active students
    const [activeStudentsRows] = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'student' AND isActive = 1"
    );
    const activeStudents = (activeStudentsRows as any)[0].count;

    // Count total leads
    const [totalLeadsRows] = await db.query(
      "SELECT COUNT(*) as count FROM case_leads"
    );
    const totalLeads = (totalLeadsRows as any)[0].count;

    // Count pending reviews (example: unpublished leads)
    const [pendingReviewsRows] = await db.query(
      "SELECT COUNT(*) as count FROM case_leads WHERE isPublished = 0"
    );
    const pendingReviews = (pendingReviewsRows as any)[0].count;

    // Count completed cases
    const [completedCasesRows] = await db.query(
      "SELECT COUNT(*) as count FROM case_leads WHERE status = 'completed'"
    );
    const completedCases = (completedCasesRows as any)[0].count;

    return {
      activeStudents,
      totalLeads,
      pendingReviews,
      completedCases,
    };
  }
}

export const storage = new MySQLStorage();

const app = express();

app.get("/api/admin/stats", async (req, res) => {
  const stats = await storage.getStats();
  res.json(stats);
});
