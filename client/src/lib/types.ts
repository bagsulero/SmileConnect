export type UserRole = 'admin' | 'student' | 'barangay';

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastActive: Date | null;
  createdAt: Date;
}

export interface CaseLeadWithDetails {
  id: number;
  patientName: string;
  age: number | null;
  contactInfo: string;
  address: string;
  issueDescription: string;
  priority: 'routine' | 'moderate' | 'urgent';
  source: 'facebook' | 'reddit' | 'barangay';
  location: string;
  status: 'available' | 'saved' | 'claimed' | 'completed';
  submittedBy: number | null;
  claimedBy: number | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedCaseWithDetails {
  id: number;
  userId: number;
  caseLeadId: number;
  createdAt: Date;
  caseLead: CaseLeadWithDetails;
}

export interface ClaimedCaseWithDetails {
  id: number;
  userId: number;
  caseLeadId: number;
  status: 'contacted' | 'scheduled' | 'done';
  appointmentDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  caseLead: CaseLeadWithDetails;
}

export interface DashboardStats {
  activeStudents: number;
  totalLeads: number;
  pendingReviews: number;
  completedCases: number;
}
