import React, { useState, useEffect } from 'react';
import { 
  Role, 
  ActiveTab, 
  Lead, 
  Unit, 
  Deal, 
  Project, 
  SalesAgent, 
  ActivityLog, 
  FollowUpReminder, 
  PipelineStage, 
  DealStatus 
} from './types';
import { 
  INITIAL_AGENTS, 
  INITIAL_PROJECTS, 
  INITIAL_UNITS, 
  INITIAL_LEADS, 
  INITIAL_DEALS, 
  INITIAL_FOLLOW_UPS, 
  INITIAL_ACTIVITIES 
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { TeamLeaderDashboard } from './components/TeamLeaderDashboard';
import { SalesDashboard } from './components/SalesDashboard';
import { LeadManagement } from './components/LeadManagement';
import { PropertyManagement } from './components/PropertyManagement';
import { DealManagement } from './components/DealManagement';
import { ReportsView } from './components/ReportsView';
import { FinishingExecutionModule } from './components/execution/FinishingExecutionModule';
import { CustomerDrawer } from './components/CustomerDrawer';
import { NewLeadModal } from './components/NewLeadModal';
import { LogCallModal } from './components/LogCallModal';
import { Sparkles, CheckCircle2, PhoneCall, X } from 'lucide-react';

export default function App() {
  // Role & View State
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [currentAgentId, setCurrentAgentId] = useState<string>('agent-2'); // Sarah Mahmoud
  const [activeTab, setActiveTab] = useState<ActiveTab>('admin_dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary Entities State (with LocalStorage caching for persistence)
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('realestate_crm_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('realestate_crm_units');
    return saved ? JSON.parse(saved) : INITIAL_UNITS;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('realestate_crm_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  const [agents, setAgents] = useState<SalesAgent[]>(() => {
    const saved = localStorage.getItem('realestate_crm_agents');
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [followUps, setFollowUps] = useState<FollowUpReminder[]>(() => {
    const saved = localStorage.getItem('realestate_crm_followups');
    return saved ? JSON.parse(saved) : INITIAL_FOLLOW_UPS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('realestate_crm_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [projects] = useState<Project[]>(INITIAL_PROJECTS);

  // Modals & Drawers State
  const [selectedLeadIdForDrawer, setSelectedLeadIdForDrawer] = useState<string | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [leadForCallModal, setLeadForCallModal] = useState<Lead | null>(null);
  const [notificationToast, setNotificationToast] = useState<{ title: string; message: string; leadId?: string } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('realestate_crm_leads', JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem('realestate_crm_units', JSON.stringify(units));
  }, [units]);
  useEffect(() => {
    localStorage.setItem('realestate_crm_deals', JSON.stringify(deals));
  }, [deals]);
  useEffect(() => {
    localStorage.setItem('realestate_crm_followups', JSON.stringify(followUps));
  }, [followUps]);
  useEffect(() => {
    localStorage.setItem('realestate_crm_activities', JSON.stringify(activities));
  }, [activities]);

  // Current logged in agent
  const currentAgent = agents.find(a => a.id === currentAgentId) || agents[1];

  // Lead Actions
  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => {
    const newId = `lead-${Date.now()}`;
    const newLead: Lead = {
      ...newLeadData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      score: 80,
    };

    setLeads(prev => [newLead, ...prev]);

    // Record Activity
    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      leadId: newId,
      agentId: newLead.assignedAgentId || 'system',
      agentName: newLead.assignedAgentName || 'النظام التلقائي',
      type: 'whatsapp',
      title: 'تسجيل عميل جديد داخل النظام',
      description: `تم إضافة العميل ${newLead.name} برقم ${newLead.phone} من مصدر ${newLead.source}.`,
      timestamp: 'الآن',
    };
    setActivities(prev => [newActivity, ...prev]);

    // Update agent leads count if assigned
    if (newLead.assignedAgentId) {
      setAgents(prev => prev.map(a => a.id === newLead.assignedAgentId ? { ...a, activeLeadsCount: a.activeLeadsCount + 1 } : a));
    }

    setNotificationToast({
      title: 'تم تسجيل العميل بنجاح',
      message: `تم إضافة ${newLead.name} لمرحلة الـ New Lead بنجاح.`,
      leadId: newId,
    });
  };

  // Simulate incoming lead (e.g. from Facebook Ads Webhook or WhatsApp)
  const handleSimulateIncomingLead = () => {
    const sampleNames = ['م. حازم القاضي', 'د. ريهام الشناوي', 'المستشار وائل بدر', 'المهندس كريم عز الدين', 'سيدة الأعمال ناهد عثمان'];
    const sampleProjects = projects;
    const sampleSources: ('facebook_ads' | 'whatsapp' | 'website')[] = ['facebook_ads', 'whatsapp', 'website'];
    
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomProject = sampleProjects[Math.floor(Math.random() * sampleProjects.length)];
    const randomSource = sampleSources[Math.floor(Math.random() * sampleSources.length)];
    const randomPhone = `+20 1${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newId = `lead-sim-${Date.now()}`;
    const newLead: Lead = {
      id: newId,
      name: randomName,
      phone: randomPhone,
      email: `client.${Date.now()}@example.com`,
      source: randomSource,
      requestType: 'buy',
      interestedProjectId: randomProject.id,
      interestedProjectName: randomProject.name,
      preferredUnitType: 'شقة فندقية',
      budgetMin: randomProject.minPrice,
      budgetMax: randomProject.minPrice + 3000000,
      currency: 'ج.م',
      stage: 'new_lead',
      assignedAgentId: null,
      assignedAgentName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      score: 88,
      notes: `عميل تم التقاطه آلياً عبر Webhook من حملة إعلانات ${randomSource === 'facebook_ads' ? 'Facebook Ads' : randomSource === 'whatsapp' ? 'WhatsApp Business' : 'Website'} لمشروع ${randomProject.name}.`,
    };

    setLeads(prev => [newLead, ...prev]);

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      leadId: newId,
      agentId: 'system',
      agentName: 'نظام التقاط الـ Leads الآلي',
      type: 'whatsapp',
      title: `وصول عميل جديد من ${randomSource === 'facebook_ads' ? 'Facebook Ads' : 'WhatsApp'}`,
      description: `سجل العميل ${randomName} اهتماماً بمشروع ${randomProject.name}.`,
      timestamp: 'الآن',
    };
    setActivities(prev => [newActivity, ...prev]);

    setNotificationToast({
      title: `عميل جديد وصل الآن من ${randomSource === 'facebook_ads' ? 'Facebook Ads' : 'WhatsApp'}!`,
      message: `${randomName} مهتم بمشروع ${randomProject.name} (الميزانية: ${(newLead.budgetMax / 1000000).toFixed(1)} مليون ج.م)`,
      leadId: newId,
    });
  };

  // Update Lead Stage
  const handleUpdateLeadStage = (leadId: string, newStage: PipelineStage) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          stage: newStage,
          updatedAt: new Date().toISOString(),
        };
      }
      return lead;
    }));

    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      const act: ActivityLog = {
        id: `act-${Date.now()}`,
        leadId: leadId,
        agentId: lead.assignedAgentId || 'system',
        agentName: lead.assignedAgentName || 'النظام',
        type: 'stage_change',
        title: 'تحديث مرحلة الـ Pipeline',
        description: `تم نقل العميل إلى مرحلة [${newStage}].`,
        timestamp: 'الآن',
      };
      setActivities(prev => [act, ...prev]);
    }
  };

  // Assign Lead to Agent
  const handleAssignLead = (leadId: string, agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          assignedAgentId: agent.id,
          assignedAgentName: agent.name,
          assignedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return lead;
    }));

    // Update agent workload counter
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, activeLeadsCount: a.activeLeadsCount + 1 } : a));

    const lead = leads.find(l => l.id === leadId);
    const act: ActivityLog = {
      id: `act-${Date.now()}`,
      leadId: leadId,
      agentId: agent.id,
      agentName: 'قائد الفريق',
      type: 'stage_change',
      title: 'توزيع العميل على مستشار مبيعات',
      description: `تم تعيين العميل ${lead?.name} لمسؤول المبيعات [${agent.name}].`,
      timestamp: 'الآن',
    };
    setActivities(prev => [act, ...prev]);

    setNotificationToast({
      title: 'تم توزيع العميل',
      message: `تم تعيين العميل للمستشار ${agent.name}.`,
    });
  };

  // Auto-distribute unassigned leads (Round-Robin)
  const handleAutoDistributeLeads = () => {
    const unassigned = leads.filter(l => !l.assignedAgentId);
    if (unassigned.length === 0) return;

    const salesAgents = agents.filter(a => a.role === 'sales_agent');
    if (salesAgents.length === 0) return;

    let agentIdx = 0;
    const updatedLeads = leads.map(lead => {
      if (!lead.assignedAgentId) {
        const assignedAgent = salesAgents[agentIdx % salesAgents.length];
        agentIdx++;
        return {
          ...lead,
          assignedAgentId: assignedAgent.id,
          assignedAgentName: assignedAgent.name,
          assignedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return lead;
    });

    setLeads(updatedLeads);

    // Recalculate agent leads counts
    setAgents(prev => prev.map(agent => {
      const count = updatedLeads.filter(l => l.assignedAgentId === agent.id).length;
      return { ...agent, activeLeadsCount: count };
    }));

    setNotificationToast({
      title: 'اكتمل التوزيع التلقائي العادل',
      message: `تم توزيع ${unassigned.length} عميل محتمل بالتساوي على فريق المبيعات بنجاح.`,
    });
  };

  // Link Unit to Lead
  const handleLinkUnitToLead = (leadId: string, unitId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, linkedUnitId: unitId } : l));
  };

  // Reserve Unit
  const handleReserveUnit = (unitId: string, leadId: string, depositAmount: number, reservedUntil: string) => {
    const lead = leads.find(l => l.id === leadId);
    const unit = units.find(u => u.id === unitId);
    if (!lead || !unit) return;

    // Update unit
    setUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          status: 'reserved',
          reservedByLeadId: lead.id,
          reservedByCustomerName: lead.name,
          depositAmount: depositAmount,
          reservedUntil: reservedUntil,
        };
      }
      return u;
    }));

    // Update lead
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          linkedUnitId: unitId,
          stage: l.stage === 'new_lead' || l.stage === 'contacted' ? 'negotiation' : l.stage,
        };
      }
      return l;
    }));

    // Activity
    const act: ActivityLog = {
      id: `act-${Date.now()}`,
      leadId: lead.id,
      agentId: lead.assignedAgentId || 'system',
      agentName: lead.assignedAgentName || 'مسؤول المبيعات',
      type: 'unit_linked',
      title: `حجز مبدئي للوحدة ${unit.unitNumber}`,
      description: `تم حجز الوحدة بمبلغ جدية حجز ${depositAmount} ج.م حتى تاريخ ${reservedUntil}.`,
      timestamp: 'الآن',
      outcome: 'positive',
    };
    setActivities(prev => [act, ...prev]);

    setNotificationToast({
      title: 'تم حجز الوحدة بنجاح',
      message: `الوحدة ${unit.unitNumber} أصبحت محجوزة للعميل ${lead.name}.`,
    });
  };

  // Create Deal
  const handleCreateDeal = (newDealData: Omit<Deal, 'id' | 'dealNumber' | 'createdAt'>) => {
    const newDealNumber = `DEAL-2026-0${deals.length + 95}`;
    const newDeal: Deal = {
      ...newDealData,
      id: `deal-${Date.now()}`,
      dealNumber: newDealNumber,
      createdAt: new Date().toISOString(),
    };

    setDeals(prev => [newDeal, ...prev]);

    // If deal status is closed_won, update unit to sold and lead to closed_won
    if (newDeal.status === 'closed_won') {
      setUnits(prev => prev.map(u => u.id === newDeal.unitId ? { ...u, status: 'sold' } : u));
      setLeads(prev => prev.map(l => l.id === newDeal.leadId ? { ...l, stage: 'closed_won' } : l));
      setAgents(prev => prev.map(a => a.id === newDeal.agentId ? { ...a, achievedRevenue: a.achievedRevenue + newDeal.dealValue } : a));
    } else {
      // Mark unit as reserved if not already
      setUnits(prev => prev.map(u => u.id === newDeal.unitId && u.status === 'available' ? { ...u, status: 'reserved', reservedByLeadId: newDeal.leadId, reservedByCustomerName: newDeal.customerName } : u));
    }

    const act: ActivityLog = {
      id: `act-${Date.now()}`,
      leadId: newDeal.leadId,
      agentId: newDeal.agentId,
      agentName: newDeal.agentName,
      type: 'deal_created',
      title: `إنشاء صفقة تعاقد رقم ${newDealNumber}`,
      description: `قيمة الصفقة ${(newDeal.dealValue / 1000000).toFixed(1)} مليون ج.م للوحدة ${newDeal.unitNumber} في ${newDeal.projectName}.`,
      timestamp: 'الآن',
      outcome: 'positive',
    };
    setActivities(prev => [act, ...prev]);

    setNotificationToast({
      title: 'تم إنشاء الصفقة وتوثيقها',
      message: `تم تسجيل الصفقة رقم ${newDealNumber} بنجاح.`,
    });
  };

  // Update Deal Status
  const handleUpdateDealStatus = (dealId: string, status: DealStatus) => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === dealId) {
        // If changed to closed_won
        if (status === 'closed_won' && deal.status !== 'closed_won') {
          setUnits(uPrev => uPrev.map(u => u.id === deal.unitId ? { ...u, status: 'sold' } : u));
          setLeads(lPrev => lPrev.map(l => l.id === deal.leadId ? { ...l, stage: 'closed_won' } : l));
          setAgents(aPrev => aPrev.map(a => a.id === deal.agentId ? { ...a, achievedRevenue: a.achievedRevenue + deal.dealValue } : a));
        }
        return { ...deal, status };
      }
      return deal;
    }));
  };

  // Add Activity Log
  const handleAddActivity = (activity: Omit<ActivityLog, 'id'>) => {
    const newAct: ActivityLog = {
      ...activity,
      id: `act-${Date.now()}`,
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Schedule Follow Up
  const handleScheduleFollowUp = (followUp: Omit<FollowUpReminder, 'id'>) => {
    const newFup: FollowUpReminder = {
      ...followUp,
      id: `fup-${Date.now()}`,
    };
    setFollowUps(prev => [newFup, ...prev]);

    // Also update lead's next follow up date
    setLeads(prev => prev.map(l => l.id === followUp.leadId ? { ...l, nextFollowUpDate: followUp.date, nextFollowUpTime: followUp.time } : l));
  };

  // Complete Follow Up
  const handleCompleteFollowUp = (followUpId: string) => {
    setFollowUps(prev => prev.map(f => f.id === followUpId ? { ...f, isCompleted: true } : f));
  };

  const selectedLeadForDrawer = leads.find(l => l.id === selectedLeadIdForDrawer) || null;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] flex flex-col font-['Tajawal',sans-serif]">
      {/* Real-time Notification Toast */}
      {notificationToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-[#18181B] border border-emerald-500/40 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-right">
              <div className="font-semibold text-xs text-emerald-400">{notificationToast.title}</div>
              <div className="text-[11px] text-[#A1A1AA]">{notificationToast.message}</div>
            </div>
            {notificationToast.leadId && (
              <button
                onClick={() => {
                  setSelectedLeadIdForDrawer(notificationToast.leadId!);
                  setNotificationToast(null);
                }}
                className="px-2.5 py-1 rounded-md bg-emerald-500 text-black text-xs font-bold mr-2 hover:bg-emerald-400 cursor-pointer transition-colors"
              >
                عرض
              </button>
            )}
            <button
              onClick={() => setNotificationToast(null)}
              className="text-[#71717A] hover:text-white mr-1 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global CRM Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={(role) => {
          setCurrentRole(role);
          if (role === 'admin') setActiveTab('admin_dashboard');
          if (role === 'team_leader') setActiveTab('team_leader_dashboard');
          if (role === 'sales_agent') setActiveTab('sales_dashboard');
        }}
        agents={agents}
        currentAgentId={currentAgentId}
        setCurrentAgentId={setCurrentAgentId}
        followUps={followUps}
        onOpenNewLead={() => setIsNewLeadModalOpen(true)}
        onSimulateIncomingLead={handleSimulateIncomingLead}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCustomerDetail={(leadId) => setSelectedLeadIdForDrawer(leadId)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentRole={currentRole}
          unassignedLeadsCount={leads.filter(l => !l.assignedAgentId).length}
          myFollowUpsCount={followUps.filter(f => f.agentId === currentAgentId && !f.isCompleted).length}
          availableUnitsCount={units.filter(u => u.status === 'available').length}
          activeDealsCount={deals.filter(d => d.status === 'under_contract' || d.status === 'payment_pending').length}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {activeTab === 'admin_dashboard' && (
            <AdminDashboard
              leads={leads}
              units={units}
              deals={deals}
              agents={agents}
              onNavigateToLeads={() => setActiveTab('leads')}
              onNavigateToProperties={() => setActiveTab('properties')}
              onNavigateToDeals={() => setActiveTab('deals')}
              onOpenCustomerDetail={(leadId) => setSelectedLeadIdForDrawer(leadId)}
            />
          )}

          {activeTab === 'team_leader_dashboard' && (
            <TeamLeaderDashboard
              leads={leads}
              agents={agents}
              followUps={followUps}
              onAssignLead={handleAssignLead}
              onAutoDistributeLeads={handleAutoDistributeLeads}
              onOpenCustomerDetail={(leadId) => setSelectedLeadIdForDrawer(leadId)}
            />
          )}

          {activeTab === 'sales_dashboard' && (
            <SalesDashboard
              currentAgent={currentAgent}
              leads={leads}
              followUps={followUps}
              deals={deals}
              units={units}
              onOpenCustomerDetail={(leadId) => setSelectedLeadIdForDrawer(leadId)}
              onOpenNewDeal={() => setActiveTab('deals')}
              onLogCall={(leadId) => {
                const l = leads.find(item => item.id === leadId);
                if (l) setLeadForCallModal(l);
              }}
              onCompleteFollowUp={handleCompleteFollowUp}
              onNavigateToPipeline={() => setActiveTab('leads')}
            />
          )}

          {activeTab === 'leads' && (
            <LeadManagement
              leads={leads}
              agents={agents}
              onOpenCustomerDetail={(leadId) => setSelectedLeadIdForDrawer(leadId)}
              onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
              onUpdateLeadStage={handleUpdateLeadStage}
              onAssignLead={handleAssignLead}
              onLogCall={(leadId) => {
                const l = leads.find(item => item.id === leadId);
                if (l) setLeadForCallModal(l);
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeTab === 'properties' && (
            <PropertyManagement
              projects={projects}
              units={units}
              leads={leads}
              onReserveUnit={handleReserveUnit}
              onNavigateToDealWithUnit={(unitId, leadId) => {
                setActiveTab('deals');
              }}
            />
          )}

          {activeTab === 'deals' && (
            <DealManagement
              deals={deals}
              leads={leads}
              units={units}
              agents={agents}
              onCreateDeal={handleCreateDeal}
              onUpdateDealStatus={handleUpdateDealStatus}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              leads={leads}
              deals={deals}
              projects={projects}
              agents={agents}
            />
          )}

          {activeTab === 'execution' && (
            <FinishingExecutionModule />
          )}
        </main>
      </div>

      {/* Clean Minimalism Status Footer */}
      <footer className="h-10 border-t border-[#27272A] px-6 lg:px-8 flex items-center justify-between text-[11px] text-[#52525B] font-mono bg-[#0A0A0B] shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM ACTIVE • RE-PRO ENTERPRISE</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span>PIPELINE: 7 STAGES</span>
          <span>AUTOMATION: ACTIVE</span>
          <span>BUILD 2.4.0-MINIMAL</span>
        </div>
        <div>REAL ESTATE SALES ENGINE</div>
      </footer>

      {/* Customer Profile & Activity Timeline Drawer */}
      <CustomerDrawer
        lead={selectedLeadForDrawer}
        onClose={() => setSelectedLeadIdForDrawer(null)}
        activities={activities}
        followUps={followUps}
        agents={agents}
        units={units}
        onAddActivity={handleAddActivity}
        onScheduleFollowUp={handleScheduleFollowUp}
        onUpdateLeadStage={handleUpdateLeadStage}
        onAssignLead={handleAssignLead}
        onLinkUnitToLead={handleLinkUnitToLead}
        onNavigateToNewDeal={(leadId, unitId) => {
          setSelectedLeadIdForDrawer(null);
          setActiveTab('deals');
        }}
      />

      {/* New Lead Modal */}
      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        projects={projects}
        agents={agents}
        onAddLead={handleAddLead}
      />

      {/* Quick Log Call Modal */}
      <LogCallModal
        lead={leadForCallModal}
        isOpen={!!leadForCallModal}
        onClose={() => setLeadForCallModal(null)}
        onSaveCall={(activity, nextFollowUp, newStage) => {
          handleAddActivity(activity);
          if (nextFollowUp) handleScheduleFollowUp(nextFollowUp);
          if (newStage && leadForCallModal) handleUpdateLeadStage(leadForCallModal.id, newStage);
          setNotificationToast({
            title: 'تم توثيق المكالمة',
            message: `تم حفظ تفاصيل المكالمة مع ${leadForCallModal?.name} بنجاح.`,
          });
        }}
      />
    </div>
  );
}
