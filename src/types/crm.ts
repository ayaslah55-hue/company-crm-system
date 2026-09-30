export type LeadSource = 'facebook_ads' | 'website' | 'whatsapp' | 'calls' | 'referrals';

export type RequestType = 'purchase' | 'rent' | 'investment';

export type UnitType = 'villa' | 'apartment' | 'townhouse' | 'penthouse' | 'commercial' | 'duplex';

export type PipelineStage = 
  | 'new_lead'
  | 'contacted'
  | 'qualified'
  | 'interested'
  | 'viewing_scheduled'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type UnitStatus = 'available' | 'reserved' | 'sold';

export type DealStatus = 
  | 'draft'
  | 'deposit_received'
  | 'contract_review'
  | 'contract_signed'
  | 'completed'
  | 'cancelled';

export type UserRole = 'admin' | 'team_leader' | 'sales_agent';

export interface SalesAgent {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'sales_agent' | 'team_leader';
  activeLeadsCount: number;
  closedDealsCount: number;
  totalRevenue: number;
  conversionRate: number; // percentage
  targetMonthly: number;
}

export interface ActivityLog {
  id: string;
  leadId: string;
  agentId: string;
  agentName: string;
  type: 'call' | 'whatsapp' | 'meeting' | 'note' | 'stage_change' | 'deal_created' | 'unit_reserved';
  title: string;
  description: string;
  outcome?: 'interested' | 'not_interested' | 'no_answer' | 'rescheduled' | 'followup_needed';
  durationMinutes?: number;
  createdAt: string;
}

export interface FollowUpReminder {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  agentId: string;
  dueDate: string; // ISO date-time string
  type: 'call' | 'site_visit' | 'contract_signing' | 'send_brochure' | 'whatsapp';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  isCompleted: boolean;
}

export interface Lead {
  id: string;
  code: string; // e.g. LD-1042
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  requestType: RequestType;
  preferredProjectId: string;
  preferredProjectName: string;
  preferredUnitType: UnitType;
  budget: number; // in local currency (e.g. SAR)
  currency: string;
  stage: PipelineStage;
  assignedAgentId: string | null;
  assignedAgentName: string | null;
  assignedAt?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastContactedAt?: string;
  nextFollowUpDate?: string;
  linkedUnitId?: string;
  rating: number; // 1 to 5 stars lead qualification score
}

export interface Project {
  id: string;
  name: string;
  nameEn: string;
  location: string;
  city: string;
  description: string;
  totalUnits: number;
  image: string;
  minPrice: number;
  maxPrice: number;
  completionDate: string;
  developer: string;
}

export interface PropertyUnit {
  id: string;
  unitCode: string; // e.g. P-402, V-12
  projectId: string;
  projectName: string;
  unitType: UnitType;
  buildingNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  price: number;
  status: UnitStatus;
  location: string;
  features: string[];
  reservedByLeadId?: string;
  reservedByLeadName?: string;
  assignedAgentId?: string;
  image: string;
}

export interface Deal {
  id: string;
  dealNumber: string; // DL-8891
  title: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  unitId: string;
  unitCode: string;
  projectName: string;
  agentId: string;
  agentName: string;
  dealValue: number;
  commissionRate: number; // e.g. 2.5%
  commissionValue: number;
  status: DealStatus;
  expectedClosingDate: string;
  actualClosingDate?: string;
  paymentMethod: 'cash' | 'installments' | 'mortgage';
  notes?: string;
  createdAt: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  nameEn: string;
  role: UserRole;
  avatar: string;
  title: string;
}
