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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private caseLeads: Map<number, CaseLead>;
  private savedCases: Map<number, SavedCase>;
  private claimedCases: Map<number, ClaimedCase>;
  private currentUserId: number;
  private currentCaseLeadId: number;
  private currentSavedCaseId: number;
  private currentClaimedCaseId: number;

  constructor() {
    this.users = new Map();
    this.caseLeads = new Map();
    this.savedCases = new Map();
    this.claimedCases = new Map();
    this.currentUserId = 1;
    this.currentCaseLeadId = 1;
    this.currentSavedCaseId = 1;
    this.currentClaimedCaseId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      email: "admin@dentalcare.com",
      password: "password",
      role: "admin",
      firstName: "Maria",
      lastName: "Santos",
      isActive: true,
      lastActive: new Date(),
      createdAt: new Date(),
    };
    
    const studentUser: User = {
      id: this.currentUserId++,
      username: "student1",
      email: "juan.delacruz@email.com",
      password: "password",
      role: "student",
      firstName: "Juan",
      lastName: "Dela Cruz",
      isActive: true,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      createdAt: new Date(),
    };
    
    const barangayUser: User = {
      id: this.currentUserId++,
      username: "barangay1",
      email: "maria.santos@email.com",
      password: "password",
      role: "barangay",
      firstName: "Maria",
      lastName: "Santos",
      isActive: true,
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      createdAt: new Date(),
    };
    
    this.users.set(adminUser.id, adminUser);
    this.users.set(studentUser.id, studentUser);
    this.users.set(barangayUser.id, barangayUser);
    
    // Create sample case leads
    const caseLeads = [
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
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
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
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
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
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
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
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];
    
    caseLeads.forEach(caseLead => {
      this.caseLeads.set(caseLead.id, caseLead as CaseLead);
    });
    
    // Add a dummy completed case lead
    const completedDummyCaseLead: CaseLead = {
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
      submittedBy: 2, // student user id
      claimedBy: 2,   // student user id
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.caseLeads.set(completedDummyCaseLead.id, completedDummyCaseLead);

    // Add a dummy completed claimed case for the same lead
    const completedDummyClaimedCase: ClaimedCase = {
      id: this.currentClaimedCaseId++,
      userId: 2, // student user id
      caseLeadId: completedDummyCaseLead.id,
      status: "done",
      appointmentDate: new Date().toISOString(),
      notes: "Demo completed case for Read Account.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.claimedCases.set(completedDummyClaimedCase.id, completedDummyClaimedCase);

    
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      isActive: true,
      lastActive: new Date(),
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateUser: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    const updatedUser = { ...user, ...updateUser };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getCaseLead(id: number): Promise<CaseLead | undefined> {
    return this.caseLeads.get(id);
  }

  async getAllCaseLeads(): Promise<CaseLead[]> {
    return Array.from(this.caseLeads.values());
  }

  async getPublishedCaseLeads(): Promise<CaseLead[]> {
    return Array.from(this.caseLeads.values()).filter(caseLead => caseLead.isPublished);
  }

  async getUnpublishedCaseLeads(): Promise<CaseLead[]> {
    return Array.from(this.caseLeads.values()).filter(caseLead => !caseLead.isPublished);
  }

  async createCaseLead(insertCaseLead: InsertCaseLead): Promise<CaseLead> {
    const id = this.currentCaseLeadId++;
    const caseLead: CaseLead = {
      ...insertCaseLead,
      id,
      status: 'available',
      claimedBy: null,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.caseLeads.set(id, caseLead);
    return caseLead;
  }

  async updateCaseLead(id: number, updateCaseLead: Partial<CaseLead>): Promise<CaseLead> {
    const caseLead = this.caseLeads.get(id);
    if (!caseLead) {
      throw new Error(`Case lead with id ${id} not found`);
    }
    const updatedCaseLead = { ...caseLead, ...updateCaseLead, updatedAt: new Date() };
    this.caseLeads.set(id, updatedCaseLead);
    return updatedCaseLead;
  }

  async deleteCaseLead(id: number): Promise<void> {
    this.caseLeads.delete(id);
  }

  async getSavedCases(userId: number): Promise<(SavedCase & { caseLead: CaseLead })[]> {
    const savedCases = Array.from(this.savedCases.values()).filter(sc => sc.userId === userId);
    return savedCases.map(sc => ({
      ...sc,
      caseLead: this.caseLeads.get(sc.caseLeadId)!
    })).filter(sc => sc.caseLead);
  }

  async saveCaseLead(userId: number, caseLeadId: number): Promise<SavedCase> {
    const id = this.currentSavedCaseId++;
    const savedCase: SavedCase = {
      id,
      userId,
      caseLeadId,
      createdAt: new Date(),
    };
    this.savedCases.set(id, savedCase);
    return savedCase;
  }

  async removeSavedCase(userId: number, caseLeadId: number): Promise<void> {
    const savedCase = Array.from(this.savedCases.values()).find(
      sc => sc.userId === userId && sc.caseLeadId === caseLeadId
    );
    if (savedCase) {
      this.savedCases.delete(savedCase.id);
    }
  }

  async getClaimedCases(userId: number): Promise<(ClaimedCase & { caseLead: CaseLead })[]> {
    const claimedCases = Array.from(this.claimedCases.values()).filter(cc => cc.userId === userId);
    return claimedCases.map(cc => ({
      ...cc,
      caseLead: this.caseLeads.get(cc.caseLeadId)!
    })).filter(cc => cc.caseLead);
  }

  async claimCaseLead(userId: number, caseLeadId: number): Promise<ClaimedCase> {
    const id = this.currentClaimedCaseId++;
    const claimedCase: ClaimedCase = {
      id,
      userId,
      caseLeadId,
      status: 'contacted',
      appointmentDate: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.claimedCases.set(id, claimedCase);
    
    // Update case lead status
    await this.updateCaseLead(caseLeadId, { 
      status: 'claimed',
      claimedBy: userId 
    });
    
    return claimedCase;
  }

  async updateClaimedCase(id: number, updateClaimedCase: Partial<ClaimedCase>): Promise<ClaimedCase> {
    const claimedCase = this.claimedCases.get(id);
    if (!claimedCase) {
      throw new Error(`Claimed case with id ${id} not found`);
    }
    const updatedClaimedCase = { ...claimedCase, ...updateClaimedCase, updatedAt: new Date() };
    this.claimedCases.set(id, updatedClaimedCase);
    return updatedClaimedCase;
  }

  async getStats(): Promise<{
    activeStudents: number;
    totalLeads: number;
    pendingReviews: number;
    completedCases: number;
  }> {
    const users = Array.from(this.users.values());
    const caseLeads = Array.from(this.caseLeads.values());
    
    return {
      activeStudents: users.filter(u => u.role === 'student' && u.isActive).length,
      totalLeads: caseLeads.length,
      pendingReviews: caseLeads.filter(cl => !cl.isPublished).length,
      completedCases: caseLeads.filter(cl => cl.status === 'completed').length,
    };
  }
}

export const storage = new MemStorage();
