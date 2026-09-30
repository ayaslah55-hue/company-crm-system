export type ExecutionProjectStatus = 'on_track' | 'at_risk' | 'delayed' | 'completed';

export type StageStatus = 'not_started' | 'in_progress' | 'waiting_approval' | 'completed' | 'delayed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ContractorSpecialization = 
  | 'electrical'
  | 'plumbing'
  | 'painting'
  | 'flooring'
  | 'gypsum_board'
  | 'carpentry'
  | 'aluminium'
  | 'hvac'
  | 'kitchen_installation'
  | 'structural'
  | 'inspection';

export interface StageChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
}

export interface StageComment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface StageChangeLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface ExecutionStage {
  id: string;
  order: number;
  name: string;
  nameEn: string;
  category: 'structural' | 'mep' | 'finishing' | 'handover';
  completionPercent: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  responsibleTeam: string;
  contractorId?: string;
  contractorName?: string;
  estimatedCost: number;
  actualCost: number;
  status: StageStatus;
  description: string;
  checklist: StageChecklistItem[];
  notes?: string;
  photos: {
    id: string;
    url: string;
    caption: string;
    type: 'before' | 'after' | 'progress';
    date: string;
    uploadedBy: string;
  }[];
  documents: {
    id: string;
    title: string;
    size: string;
    date: string;
    type: string;
  }[];
  comments: StageComment[];
  changeHistory: StageChangeLog[];
}

export interface ExecutionMilestone {
  id: string;
  title: string;
  projectName: string;
  projectId: string;
  dueDate: string;
  isCompleted: boolean;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
  progressPercent: number;
  responsiblePerson: string;
}

export interface ExecutionTask {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  unitId: string;
  unitCode: string;
  assignedPerson: string;
  assignedRole: string;
  deadline: string;
  priority: TaskPriority;
  stageName: string;
  stageId: string;
  status: 'not_started' | 'in_progress' | 'waiting_approval' | 'completed' | 'delayed';
  progress: number;
  description?: string;
}

export interface ExecutionContractor {
  id: string;
  name: string;
  companyName: string;
  specialization: ContractorSpecialization;
  phone: string;
  email: string;
  avatar: string;
  activeProjectsCount: number;
  assignedUnitsCount: number;
  completedJobsCount: number;
  currentTasksCount: number;
  performanceStatus: 'excellent' | 'good' | 'under_review' | 'delayed';
  rating: number; // 1-5
  totalContractValue: number;
  paidAmount: number;
  remainingAmount: number;
  projects: string[];
  activeTasks: string[];
  workPhotos: string[];
  complianceScore: number; // %
}

export interface ExecutionUnit {
  id: string;
  unitCode: string;
  projectId: string;
  projectName: string;
  building: string;
  floor: number;
  ownerName: string;
  ownerPhone: string;
  propertyType: string;
  areaM2: number;
  finishingPackage: 'Super Lux' | 'Ultra Lux' | 'Modern Deluxe' | 'Classic';
  currentStage: string;
  currentStageOrder: number;
  completionPercent: number;
  nextStage: string;
  expectedDelivery: string;
  actualDelivery?: string;
  responsibleEngineer: string;
  engineerPhone: string;
  status: 'on_track' | 'in_progress' | 'delayed' | 'completed';
  stages: ExecutionStage[];
  handoverProgress: {
    currentStep: number;
    steps: {
      stepNumber: number;
      name: string;
      isCompleted: boolean;
      completedDate?: string;
      notes?: string;
    }[];
    checklist: {
      id: string;
      label: string;
      isChecked: boolean;
      verifiedBy?: string;
    }[];
    snagList: {
      id: string;
      issue: string;
      location: string;
      severity: 'low' | 'medium' | 'high';
      isResolved: boolean;
      photoUrl?: string;
    }[];
    isHandedOver: boolean;
    handoverDate?: string;
    clientSignature?: string;
  };
}

export interface ExecutionProject {
  id: string;
  name: string;
  developer: string;
  location: string;
  city: string;
  totalUnits: number;
  unitsUnderFinishing: number;
  completedUnits: number;
  delayedUnits: number;
  overallProgress: number;
  currentStage: string;
  startDate: string;
  expectedDeliveryDate: string;
  projectManager: string;
  projectManagerPhone: string;
  status: ExecutionProjectStatus;
  totalBudget: number;
  currentSpending: number;
  image: string;
  stages: ExecutionStage[];
  documentsCount: number;
  photosCount: number;
}

export interface SitePhoto {
  id: string;
  projectId: string;
  projectName: string;
  unitId?: string;
  unitCode: string;
  executionStage: string;
  date: string;
  uploadedBy: string;
  uploaderRole: string;
  notes: string;
  url: string;
  type: 'before' | 'after' | 'progress';
  caption?: string;
  pairedPhotoUrl?: string; // For before/after comparison
}

export interface ExecutionCostRecord {
  id: string;
  stageName: string;
  projectId: string;
  projectName: string;
  contractorName: string;
  contractorSpecialization?: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus?: 'paid' | 'partial' | 'pending' | 'overdue';
  status?: 'paid' | 'partially_paid' | 'pending' | 'overdue';
  invoiceNumber?: string;
  dueDate?: string;
}

export type ExecutionCostItem = ExecutionCostRecord;

export interface ExecutionAlert {
  id: string;
  type: 'delay' | 'approval' | 'payment' | 'inspection' | 'milestone' | 'handover';
  title: string;
  description: string;
  message?: string;
  projectId?: string;
  projectName: string;
  unitId?: string;
  unitCode?: string;
  timestamp: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  actionLabel?: string;
}
