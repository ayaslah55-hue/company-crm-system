import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Lead, 
  PropertyUnit, 
  Project, 
  Deal, 
  SalesAgent, 
  FollowUpReminder, 
  ActivityLog, 
  CurrentUser, 
  PipelineStage, 
  DealStatus
} from '../types/crm';
import { 
  INITIAL_LEADS, 
  INITIAL_PROJECTS, 
  INITIAL_UNITS, 
  INITIAL_DEALS, 
  INITIAL_AGENTS, 
  INITIAL_FOLLOW_UPS, 
  INITIAL_ACTIVITIES 
} from '../data/mockData';

export type ActiveTab = 
  | 'admin_dashboard' 
  | 'team_leader' 
  | 'sales_dashboard' 
  | 'leads' 
  | 'pipeline' 
  | 'properties' 
  | 'deals';

interface CRMContextType {
  leads: Lead[];
  units: PropertyUnit[];
  projects: Project[];
  deals: Deal[];
  agents: SalesAgent[];
  followUps: FollowUpReminder[];
  activities: ActivityLog[];
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  selectedUnit: PropertyUnit | null;
  setSelectedUnit: (unit: PropertyUnit | null) => void;
  isNewLeadModalOpen: boolean;
  setIsNewLeadModalOpen: (open: boolean) => void;
  isNewDealModalOpen: boolean;
  setIsNewDealModalOpen: (open: boolean) => void;
  
  // Actions
  addLead: (leadData: Partial<Lead>) => Lead;
  updateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  assignLead: (leadId: string, agentId: string) => void;
  autoDistributeLeads: () => number;
  addActivity: (activity: Omit<ActivityLog, 'id' | 'createdAt'>) => void;
  addFollowUp: (followUp: Omit<FollowUpReminder, 'id' | 'isCompleted'>) => void;
  toggleFollowUpCompletion: (id: string) => void;
  reserveUnit: (unitId: string, leadId: string) => void;
  releaseUnit: (unitId: string) => void;
  createDeal: (dealData: Partial<Deal>) => Deal;
  updateDealStatus: (dealId: string, status: DealStatus) => void;
  simulateIncomingLead: () => Lead;
  resetToDemoData: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const CURRENT_USERS_LIST: CurrentUser[] = [
  {
    id: 'admin-root',
    name: 'سلطان بن عبد الرحمن آل سعود',
    nameEn: 'Sultan Abdulrahman (Admin)',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: 'المدير التنفيذي - إدارة المبيعات'
  },
  {
    id: 'agent-4',
    name: 'خالد السبيعي',
    nameEn: 'Khaled Al-Subaie (Team Leader)',
    role: 'team_leader',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'قائد فريق مبيعات النخبة'
  },
  {
    id: 'agent-1',
    name: 'أحمد المنصور',
    nameEn: 'Ahmed Al-Mansoor (Sales)',
    role: 'sales_agent',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'مستشار عقاري أول - كبار العملاء'
  },
  {
    id: 'agent-2',
    name: 'سارة الشمري',
    nameEn: 'Sarah Al-Shammari (Sales)',
    role: 'sales_agent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'مستشارة استثمار وتطوير عقاري'
  },
  {
    id: 'agent-3',
    name: 'عمر الفاروق',
    nameEn: 'Omar Al-Farooq (Sales)',
    role: 'sales_agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'مستشار عقاري - قطاع المشاريع'
  }
];

export { CURRENT_USERS_LIST };

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage state with fallbacks
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('dar_crm_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [units, setUnits] = useState<PropertyUnit[]>(() => {
    const saved = localStorage.getItem('dar_crm_units');
    return saved ? JSON.parse(saved) : INITIAL_UNITS;
  });

  const [projects] = useState<Project[]>(INITIAL_PROJECTS);

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('dar_crm_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  const [agents, setAgents] = useState<SalesAgent[]>(() => {
    const saved = localStorage.getItem('dar_crm_agents');
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [followUps, setFollowUps] = useState<FollowUpReminder[]>(() => {
    const saved = localStorage.getItem('dar_crm_followups');
    return saved ? JSON.parse(saved) : INITIAL_FOLLOW_UPS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('dar_crm_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser>(CURRENT_USERS_LIST[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('admin_dashboard');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dar_crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('dar_crm_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('dar_crm_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('dar_crm_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('dar_crm_followups', JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem('dar_crm_activities', JSON.stringify(activities));
  }, [activities]);

  // Adjust active tab when switching to sales agent to show their dashboard
  useEffect(() => {
    if (currentUser.role === 'sales_agent') {
      setActiveTab('sales_dashboard');
    } else if (currentUser.role === 'team_leader') {
      setActiveTab('team_leader');
    }
  }, [currentUser]);

  // Add new lead
  const addLead = (leadData: Partial<Lead>): Lead => {
    const newLeadCode = `LD-${1100 + leads.length}`;
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      code: newLeadCode,
      name: leadData.name || 'عميل جديد',
      phone: leadData.phone || '+966 50 000 0000',
      email: leadData.email,
      source: leadData.source || 'website',
      requestType: leadData.requestType || 'purchase',
      preferredProjectId: leadData.preferredProjectId || projects[0].id,
      preferredProjectName: leadData.preferredProjectName || projects[0].name,
      preferredUnitType: leadData.preferredUnitType || 'apartment',
      budget: Number(leadData.budget) || 2000000,
      currency: 'ريال',
      stage: 'new_lead',
      assignedAgentId: leadData.assignedAgentId || null,
      assignedAgentName: leadData.assignedAgentName || null,
      assignedAt: leadData.assignedAgentId ? new Date().toISOString() : undefined,
      notes: leadData.notes || '',
      priority: leadData.priority || 'medium',
      createdAt: new Date().toISOString(),
      rating: leadData.rating || 3
    };

    setLeads(prev => [newLead, ...prev]);

    // Add activity log
    addActivity({
      leadId: newLead.id,
      agentId: currentUser.id,
      agentName: currentUser.name,
      type: 'note',
      title: 'تسجيل عميل محتمل جديد',
      description: `تم استقبال وتوثيق بيانات العميل من مصدر (${newLead.source}) برغبة ${newLead.requestType} بميزانية ${newLead.budget.toLocaleString()} ريال.`
    });

    return newLead;
  };

  // Update lead stage
  const updateLeadStage = (leadId: string, newStage: PipelineStage) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updated = {
          ...lead,
          stage: newStage,
          lastContactedAt: new Date().toISOString()
        };
        return updated;
      }
      return lead;
    }));

    const targetLead = leads.find(l => l.id === leadId);
    if (targetLead) {
      addActivity({
        leadId,
        agentId: currentUser.id,
        agentName: currentUser.name,
        type: 'stage_change',
        title: 'تحديث مرحلة العميل في المسار',
        description: `تم نقل العميل (${targetLead.name}) إلى مرحلة: ${newStage}`
      });
    }
  };

  // Assign lead to sales agent
  const assignLead = (leadId: string, agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          assignedAgentId: agent.id,
          assignedAgentName: agent.name,
          assignedAt: new Date().toISOString(),
          stage: lead.stage === 'new_lead' ? 'contacted' : lead.stage
        };
      }
      return lead;
    }));

    // Update agent active leads count
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, activeLeadsCount: a.activeLeadsCount + 1 } : a));

    addActivity({
      leadId,
      agentId: currentUser.id,
      agentName: currentUser.name,
      type: 'note',
      title: 'توزيع العميل على مستشار مبيعات',
      description: `تم تعيين العميل لمتابعة المستشار: ${agent.name}.`
    });
  };

  // Auto distribute unassigned leads (Round-Robin / Workload)
  const autoDistributeLeads = (): number => {
    const unassigned = leads.filter(l => !l.assignedAgentId);
    if (unassigned.length === 0) return 0;

    const salesOnlyAgents = agents.filter(a => a.role === 'sales_agent');
    if (salesOnlyAgents.length === 0) return 0;

    let agentIndex = 0;
    const updatedLeads = [...leads];

    unassigned.forEach(lead => {
      const assignedAgent = salesOnlyAgents[agentIndex % salesOnlyAgents.length];
      const leadIndex = updatedLeads.findIndex(l => l.id === lead.id);
      if (leadIndex !== -1) {
        updatedLeads[leadIndex] = {
          ...updatedLeads[leadIndex],
          assignedAgentId: assignedAgent.id,
          assignedAgentName: assignedAgent.name,
          assignedAt: new Date().toISOString(),
          stage: updatedLeads[leadIndex].stage === 'new_lead' ? 'contacted' : updatedLeads[leadIndex].stage
        };

        addActivity({
          leadId: lead.id,
          agentId: currentUser.id,
          agentName: currentUser.name,
          type: 'note',
          title: 'توزيع آلي ذكي (Auto-Assignment)',
          description: `تم التوزيع التلقائي بالتساوي على المستشار: ${assignedAgent.name}.`
        });
      }
      agentIndex++;
    });

    setLeads(updatedLeads);
    return unassigned.length;
  };

  // Activity Log
  const addActivity = (act: Omit<ActivityLog, 'id' | 'createdAt'>) => {
    const newAct: ActivityLog = {
      ...act,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Follow-ups
  const addFollowUp = (fu: Omit<FollowUpReminder, 'id' | 'isCompleted'>) => {
    const newFu: FollowUpReminder = {
      ...fu,
      id: `fu-${Date.now()}`,
      isCompleted: false
    };
    setFollowUps(prev => [newFu, ...prev]);

    // update lead next follow up
    setLeads(prev => prev.map(l => l.id === fu.leadId ? { ...l, nextFollowUpDate: fu.dueDate } : l));

    addActivity({
      leadId: fu.leadId,
      agentId: currentUser.id,
      agentName: currentUser.name,
      type: 'note',
      title: 'جدولة موعد متابعة جديد',
      description: `متابعة من نوع (${fu.type}) بتاريخ ${new Date(fu.dueDate).toLocaleDateString('ar-SA')}: ${fu.notes}`
    });
  };

  const toggleFollowUpCompletion = (id: string) => {
    setFollowUps(prev => prev.map(fu => {
      if (fu.id === id) {
        const nextState = !fu.isCompleted;
        if (nextState) {
          addActivity({
            leadId: fu.leadId,
            agentId: currentUser.id,
            agentName: currentUser.name,
            type: 'call',
            title: 'إتمام موعد المتابعة',
            description: `تم إنجاز المتابعة المجدولة: ${fu.notes}`
          });
        }
        return { ...fu, isCompleted: nextState };
      }
      return fu;
    }));
  };

  // Unit Reservation
  const reserveUnit = (unitId: string, leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          status: 'reserved',
          reservedByLeadId: lead.id,
          reservedByLeadName: lead.name,
          assignedAgentId: lead.assignedAgentId || currentUser.id
        };
      }
      return u;
    }));

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          linkedUnitId: unitId,
          stage: l.stage === 'closed_won' ? l.stage : 'negotiation'
        };
      }
      return l;
    }));

    addActivity({
      leadId: lead.id,
      agentId: currentUser.id,
      agentName: currentUser.name,
      type: 'unit_reserved',
      title: 'حجز وحدة عقارية للعميل',
      description: `تم ربط وحجز الوحدة العقارية رقم (${unitId}) للعميل (${lead.name}) لبدء تجهيز مسودة العقد.`
    });
  };

  const releaseUnit = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    if (unit && unit.reservedByLeadId) {
      addActivity({
        leadId: unit.reservedByLeadId,
        agentId: currentUser.id,
        agentName: currentUser.name,
        type: 'note',
        title: 'إلغاء حجز الوحدة العقارية',
        description: `تم إلغاء حجز الوحدة (${unit.unitCode}) وإعادتها لقائمة الوحدات المتاحة.`
      });
    }

    setUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          status: 'available',
          reservedByLeadId: undefined,
          reservedByLeadName: undefined
        };
      }
      return u;
    }));
  };

  // Deal Management
  const createDeal = (dealData: Partial<Deal>): Deal => {
    const dealNumber = `DL-${8800 + deals.length + 1}`;
    const unit = units.find(u => u.id === dealData.unitId);
    const lead = leads.find(l => l.id === dealData.leadId);
    const val = Number(dealData.dealValue) || (unit ? unit.price : 2500000);
    const commRate = dealData.commissionRate || 2.5;
    const commVal = Math.round(val * (commRate / 100));

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      dealNumber,
      title: dealData.title || `صفقة بيع وحدة ${unit?.unitCode || ''} - ${lead?.name || ''}`,
      leadId: dealData.leadId || '',
      customerName: lead?.name || dealData.customerName || 'عميل',
      customerPhone: lead?.phone || dealData.customerPhone || '',
      unitId: dealData.unitId || '',
      unitCode: unit?.unitCode || dealData.unitCode || 'UNIT-00',
      projectName: unit?.projectName || dealData.projectName || 'المشروع السكني',
      agentId: dealData.agentId || currentUser.id,
      agentName: dealData.agentName || currentUser.name,
      dealValue: val,
      commissionRate: commRate,
      commissionValue: commVal,
      status: dealData.status || 'deposit_received',
      expectedClosingDate: dealData.expectedClosingDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paymentMethod: dealData.paymentMethod || 'installments',
      notes: dealData.notes,
      createdAt: new Date().toISOString()
    };

    setDeals(prev => [newDeal, ...prev]);

    // Update unit status to reserved or sold
    if (newDeal.unitId) {
      setUnits(prev => prev.map(u => u.id === newDeal.unitId ? {
        ...u,
        status: newDeal.status === 'completed' || newDeal.status === 'contract_signed' ? 'sold' : 'reserved',
        reservedByLeadId: newDeal.leadId,
        reservedByLeadName: newDeal.customerName
      } : u));
    }

    // Update lead stage
    if (newDeal.leadId) {
      const targetStage = newDeal.status === 'completed' ? 'closed_won' : 'negotiation';
      updateLeadStage(newDeal.leadId, targetStage);
    }

    // Activity log
    addActivity({
      leadId: newDeal.leadId,
      agentId: currentUser.id,
      agentName: currentUser.name,
      type: 'deal_created',
      title: `إنشاء صفقة عقارية جديدة (${newDeal.dealNumber})`,
      description: `تم إنشاء الصفقة بقيمة ${val.toLocaleString()} ريال بنجاح.`
    });

    return newDeal;
  };

  const updateDealStatus = (dealId: string, status: DealStatus) => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === dealId) {
        const updated = {
          ...deal,
          status,
          actualClosingDate: status === 'completed' ? new Date().toISOString().split('T')[0] : deal.actualClosingDate
        };

        if (status === 'completed') {
          // Mark unit sold
          setUnits(uPrev => uPrev.map(u => u.id === deal.unitId ? { ...u, status: 'sold' } : u));
          // Mark lead closed_won
          setLeads(lPrev => lPrev.map(l => l.id === deal.leadId ? { ...l, stage: 'closed_won' } : l));
        }

        return updated;
      }
      return deal;
    }));
  };

  // Simulate Incoming Lead
  const simulateIncomingLead = (): Lead => {
    const sampleNames = [
      'الأستاذ / ماجد القرني',
      'الدكتور / فيصل باخريصة',
      'المهندسة / سحر التميمي',
      'أ/ طلال السعدون',
      'سيدة الأعمال / نورة الرويلي'
    ];
    const sampleSources: ('facebook_ads' | 'website' | 'whatsapp' | 'calls' | 'referrals')[] = [
      'facebook_ads', 'whatsapp', 'website', 'referrals', 'calls'
    ];
    const sampleProjects = projects;
    const randomProject = sampleProjects[Math.floor(Math.random() * sampleProjects.length)];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomSource = sampleSources[Math.floor(Math.random() * sampleSources.length)];

    return addLead({
      name: randomName,
      phone: `+966 5${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `lead.${Date.now()}@domain.sa`,
      source: randomSource,
      requestType: Math.random() > 0.3 ? 'purchase' : 'investment',
      preferredProjectId: randomProject.id,
      preferredProjectName: randomProject.name,
      preferredUnitType: Math.random() > 0.5 ? 'apartment' : 'villa',
      budget: Math.floor((Math.random() * 4 + 1.5) * 10) * 100000,
      priority: Math.random() > 0.5 ? 'high' : 'medium',
      notes: `تم التقاط العميل آلياً عبر Webhook من حملة (${randomSource}) المهتمة بمشروع ${randomProject.name}.`
    });
  };

  const resetToDemoData = () => {
    localStorage.removeItem('dar_crm_leads');
    localStorage.removeItem('dar_crm_units');
    localStorage.removeItem('dar_crm_deals');
    localStorage.removeItem('dar_crm_agents');
    localStorage.removeItem('dar_crm_followups');
    localStorage.removeItem('dar_crm_activities');

    setLeads(INITIAL_LEADS);
    setUnits(INITIAL_UNITS);
    setDeals(INITIAL_DEALS);
    setAgents(INITIAL_AGENTS);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setActivities(INITIAL_ACTIVITIES);
  };

  return (
    <CRMContext.Provider value={{
      leads,
      units,
      projects,
      deals,
      agents,
      followUps,
      activities,
      currentUser,
      setCurrentUser,
      activeTab,
      setActiveTab,
      language,
      setLanguage,
      selectedLead,
      setSelectedLead,
      selectedUnit,
      setSelectedUnit,
      isNewLeadModalOpen,
      setIsNewLeadModalOpen,
      isNewDealModalOpen,
      setIsNewDealModalOpen,
      addLead,
      updateLeadStage,
      assignLead,
      autoDistributeLeads,
      addActivity,
      addFollowUp,
      toggleFollowUpCompletion,
      reserveUnit,
      releaseUnit,
      createDeal,
      updateDealStatus,
      simulateIncomingLead,
      resetToDemoData
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
