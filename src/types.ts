export type Role = 'admin' | 'team_leader' | 'sales_agent';

export type LeadSource = 
  | 'facebook_ads' 
  | 'website' 
  | 'whatsapp' 
  | 'phone_call' 
  | 'referral' 
  | 'google_ads' 
  | 'tiktok_ads'
  | 'expo_event';

export type RequestType = 'buy' | 'rent' | 'invest';

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

export type DealStatus = 'draft' | 'under_contract' | 'payment_pending' | 'closed_won' | 'closed_lost';

export interface SalesAgent {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  role: 'sales_agent' | 'team_leader' | 'admin';
  activeLeadsCount: number;
  monthlyTarget: number;
  achievedRevenue: number;
  conversionRate: number;
  avgResponseTimeMin: number;
  rating: number;
}

export interface ActivityLog {
  id: string;
  leadId: string;
  agentId: string;
  agentName: string;
  type: 'call' | 'whatsapp' | 'note' | 'stage_change' | 'meeting' | 'unit_linked' | 'deal_created';
  title: string;
  description: string;
  timestamp: string;
  outcome?: 'answered' | 'no_answer' | 'busy' | 'followup_needed' | 'positive';
}

export interface FollowUpReminder {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  agentId: string;
  scheduledTime: string; // ISO or human string
  date: string;
  time: string;
  note: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  requestType: RequestType;
  interestedProjectId?: string;
  interestedProjectName?: string;
  preferredUnitType: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  stage: PipelineStage;
  assignedAgentId: string | null;
  assignedAgentName: string | null;
  assignedAt?: string;
  createdAt: string;
  updatedAt: string;
  score: number; // 0 - 100
  notes: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  linkedUnitId?: string;
}

export interface Unit {
  id: string;
  unitNumber: string;
  projectId: string;
  projectName: string;
  building: string;
  type: string; // شقة، فيلا، بنتهاوس، تجاري
  areaM2: number;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  currency: string;
  status: UnitStatus;
  view: string;
  reservedByLeadId?: string;
  reservedByCustomerName?: string;
  reservedUntil?: string;
  depositAmount?: number;
  features: string[];
  imageUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  developer: string;
  location: string;
  city: string;
  totalUnits: number;
  availableUnits: number;
  minPrice: number;
  maxPrice: number;
  currency: string;
  deliveryDate: string;
  status: 'under_construction' | 'ready_to_move' | 'off_plan';
  description: string;
  image: string;
}

export interface Deal {
  id: string;
  dealNumber: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  agentId: string;
  agentName: string;
  projectId: string;
  projectName: string;
  unitId: string;
  unitNumber: string;
  dealValue: number;
  downPayment: number;
  installmentsYears: number;
  currency: string;
  status: DealStatus;
  closingDate: string;
  notes: string;
  createdAt: string;
}

export type ActiveTab = 
  | 'admin_dashboard' 
  | 'team_leader_dashboard' 
  | 'sales_dashboard' 
  | 'leads' 
  | 'properties' 
  | 'deals' 
  | 'reports'
  | 'execution';
