import React, { useState } from 'react';
import { 
  KanbanSquare, 
  List, 
  Filter, 
  Search, 
  UserPlus, 
  PhoneCall, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  UserCheck, 
  ChevronDown, 
  Sparkles,
  Building,
  DollarSign
} from 'lucide-react';
import { Lead, PipelineStage, LeadSource, SalesAgent } from '../types';
import { STAGE_CONFIG, SOURCE_CONFIG, REQUEST_TYPE_LABELS, formatCurrency } from '../utils/formatters';

interface LeadManagementProps {
  leads: Lead[];
  agents: SalesAgent[];
  onOpenCustomerDetail: (leadId: string) => void;
  onOpenNewLeadModal: () => void;
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  onAssignLead: (leadId: string, agentId: string) => void;
  onLogCall: (leadId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PIPELINE_ORDER: PipelineStage[] = [
  'new_lead',
  'contacted',
  'qualified',
  'interested',
  'viewing_scheduled',
  'negotiation',
  'closed_won',
  'closed_lost',
];

export const LeadManagement: React.FC<LeadManagementProps> = ({
  leads,
  agents,
  onOpenCustomerDetail,
  onOpenNewLeadModal,
  onUpdateLeadStage,
  onAssignLead,
  onLogCall,
  searchQuery,
  setSearchQuery,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchPhone = lead.phone.includes(q);
      const matchProject = lead.interestedProjectName?.toLowerCase().includes(q) || false;
      const matchAgent = lead.assignedAgentName?.toLowerCase().includes(q) || false;
      if (!matchName && !matchPhone && !matchProject && !matchAgent) return false;
    }

    // Source filter
    if (selectedSource !== 'all' && lead.source !== selectedSource) return false;

    // Agent filter
    if (selectedAgent === 'unassigned') {
      if (lead.assignedAgentId) return false;
    } else if (selectedAgent !== 'all' && lead.assignedAgentId !== selectedAgent) {
      return false;
    }

    // Stage filter (for list view)
    if (selectedStage !== 'all' && lead.stage !== selectedStage) return false;

    return true;
  });

  // Advance stage helper
  const advanceStage = (lead: Lead, direction: 'forward' | 'backward') => {
    const currentIndex = PIPELINE_ORDER.indexOf(lead.stage);
    if (direction === 'forward' && currentIndex < PIPELINE_ORDER.length - 2) {
      // Advance to next (stop before closed_lost)
      const nextStage = PIPELINE_ORDER[currentIndex + 1];
      onUpdateLeadStage(lead.id, nextStage);
    } else if (direction === 'backward' && currentIndex > 0) {
      const prevStage = PIPELINE_ORDER[currentIndex - 1];
      onUpdateLeadStage(lead.id, prevStage);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar: Title + View Switcher + New Lead Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#18181B] p-6 rounded-xl border border-[#27272A]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <KanbanSquare className="w-4 h-4" />
            <span>مسار المبيعات التفاعلي (Sales Pipeline & Leads)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-light text-white tracking-tight">
            إدارة ومتابعة العملاء المحتملين والـ Pipeline
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            تتبع مراحل العميل من أول التقاط حتى إغلاق الصفقة وتسجيل المكالمات والمواعيد
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle (Kanban vs List) */}
          <div className="flex items-center p-1 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'text-[#71717A] hover:text-white'
              }`}
            >
              <KanbanSquare className="w-3.5 h-3.5" />
              <span>لوحة Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'text-[#71717A] hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>جدول البيانات</span>
            </button>
          </div>

          {/* New Lead Button */}
          <button
            onClick={onOpenNewLeadModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ تسجيل عميل</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#18181B] p-4 rounded-xl border border-[#27272A] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 text-[#71717A] pl-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>تصفية:</span>
          </div>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-[#0A0A0B] border border-[#27272A] text-[#E4E4E7] focus:outline-none focus:border-emerald-500"
          >
            <option value="all">جميع المصادر ({leads.length})</option>
            <option value="facebook_ads">إعلانات Facebook</option>
            <option value="whatsapp">واتساب WhatsApp</option>
            <option value="website">الموقع الإلكتروني</option>
            <option value="phone_call">اتصال هاتفي مباشر</option>
            <option value="referral">تزكية وترشيح</option>
            <option value="google_ads">إعلانات Google</option>
            <option value="tiktok_ads">إعلانات TikTok</option>
          </select>

          {/* Agent Filter */}
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-[#0A0A0B] border border-[#27272A] text-[#E4E4E7] focus:outline-none focus:border-emerald-500"
          >
            <option value="all">جميع مسؤولي المبيعات</option>
            <option value="unassigned">غير معينين (Unassigned)</option>
            {agents.filter(a => a.role === 'sales_agent').map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          {/* Stage Filter (for list view) */}
          {viewMode === 'list' && (
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-[#0A0A0B] border border-[#27272A] text-[#E4E4E7] focus:outline-none focus:border-emerald-500"
            >
              <option value="all">جميع المراحل</option>
              {PIPELINE_ORDER.map(s => (
                <option key={s} value={s}>{STAGE_CONFIG[s]?.label}</option>
              ))}
            </select>
          )}

          {(selectedSource !== 'all' || selectedAgent !== 'all' || selectedStage !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSource('all');
                setSelectedAgent('all');
                setSelectedStage('all');
                setSearchQuery('');
              }}
              className="text-emerald-400 hover:underline text-[11px] px-2 py-1"
            >
              إعادة ضبط الفلاتر ✕
            </button>
          )}
        </div>

        <div className="text-[#71717A] text-[11px]">
          إجمالي النتائج المعروضة: <span className="font-semibold text-white">{filteredLeads.length}</span> من أصل {leads.length}
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1550px]">
            {PIPELINE_ORDER.map(stageKey => {
              const stageCfg = STAGE_CONFIG[stageKey];
              const stageLeads = filteredLeads.filter(l => l.stage === stageKey);

              return (
                <div 
                  key={stageKey}
                  className="w-72 shrink-0 bg-[#18181B] rounded-xl border border-[#27272A] flex flex-col max-h-[750px]"
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-[#27272A] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stageCfg.bg} ${stageCfg.border} border`} />
                      <div>
                        <div className="font-semibold text-xs text-white leading-tight">
                          {stageCfg.label}
                        </div>
                        <div className="text-[10px] text-[#71717A]">{stageCfg.labelEn}</div>
                      </div>
                    </div>
                    <span className="w-5 h-5 rounded-md bg-[#27272A] text-[#A1A1AA] text-xs font-medium flex items-center justify-center">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Column Body: Leads Cards */}
                  <div className="p-2.5 flex-1 overflow-y-auto space-y-3">
                    {stageLeads.length === 0 ? (
                      <div className="py-8 text-center text-[#71717A] text-[11px] border border-dashed border-[#27272A] rounded-lg">
                        لا يوجد عملاء في هذه المرحلة
                      </div>
                    ) : (
                      stageLeads.map(lead => {
                        const sourceCfg = SOURCE_CONFIG[lead.source];
                        const reqTypeCfg = REQUEST_TYPE_LABELS[lead.requestType];

                        return (
                          <div
                            key={lead.id}
                            className="p-3.5 rounded-lg bg-[#0A0A0B] border border-[#27272A] hover:border-[#3F3F46] transition-colors space-y-2.5"
                          >
                            {/* Card Top: Name, Phone & Source */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div
                                  onClick={() => onOpenCustomerDetail(lead.id)}
                                  className="font-semibold text-xs text-white hover:text-emerald-400 cursor-pointer transition-colors"
                                >
                                  {lead.name}
                                </div>
                                <div className="text-[11px] text-[#71717A] font-mono mt-0.5">
                                  {lead.phone}
                                </div>
                              </div>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded border ${sourceCfg?.badgeColor}`}>
                                {sourceCfg?.label.split(' ')[0]}
                              </span>
                            </div>

                            {/* Project & Budget */}
                            <div className="bg-[#18181B] p-2 rounded-md border border-[#27272A] text-[11px] space-y-1">
                              <div className="flex items-center justify-between text-[#A1A1AA]">
                                <span className="text-[#71717A]">المشروع:</span>
                                <span className="font-medium text-white truncate max-w-[130px]">
                                  {lead.interestedProjectName || 'غير محدد'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[#A1A1AA]">
                                <span className="text-[#71717A]">الميزانية:</span>
                                <span className="font-semibold text-emerald-400">
                                  {formatCurrency(lead.budgetMax)}
                                </span>
                              </div>
                            </div>

                            {/* Assigned Agent & Follow-up reminder */}
                            <div className="flex items-center justify-between pt-1 border-t border-[#27272A] text-[10px]">
                              <div className="flex items-center gap-1.5 text-[#A1A1AA]">
                                <UserCheck className="w-3 h-3 text-[#71717A]" />
                                <span className="truncate max-w-[90px]">
                                  {lead.assignedAgentName || 'غير معين'}
                                </span>
                              </div>

                              {lead.nextFollowUpDate ? (
                                <div className="text-amber-400 font-mono flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{lead.nextFollowUpDate.slice(5)}</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => onLogCall(lead.id)}
                                  className="text-[#71717A] hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  <span>مكالمة</span>
                                </button>
                              )}
                            </div>

                            {/* Stage Advancement Quick Controls */}
                            <div className="flex items-center justify-between pt-1 border-t border-[#27272A] text-[10px]">
                              <button
                                onClick={() => advanceStage(lead, 'backward')}
                                disabled={lead.stage === 'new_lead'}
                                className={`p-1 rounded hover:bg-[#27272A] text-[#71717A] hover:text-white transition-colors cursor-pointer ${
                                  lead.stage === 'new_lead' ? 'opacity-20 cursor-not-allowed' : ''
                                }`}
                                title="إرجاع للمرحلة السابقة"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => onOpenCustomerDetail(lead.id)}
                                className="text-[10px] text-emerald-400 hover:underline font-medium"
                              >
                                الملف والملاحظات
                              </button>

                              <button
                                onClick={() => advanceStage(lead, 'forward')}
                                disabled={lead.stage === 'closed_won' || lead.stage === 'closed_lost'}
                                className={`p-1 rounded hover:bg-[#27272A] text-[#71717A] hover:text-emerald-400 transition-colors cursor-pointer ${
                                  lead.stage === 'closed_won' || lead.stage === 'closed_lost' ? 'opacity-20 cursor-not-allowed' : ''
                                }`}
                                title="تقديم للمرحلة التالية"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: FULL DATA TABLE */}
      {viewMode === 'list' && (
        <div className="bg-[#18181B] rounded-xl border border-[#27272A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#0A0A0B] border-b border-[#27272A] text-[#71717A]">
                <tr>
                  <th className="py-3.5 pr-4 font-medium uppercase tracking-wider">اسم العميل ورقم الهاتف</th>
                  <th className="py-3.5 px-3 font-medium uppercase tracking-wider">مصدر الـ Lead</th>
                  <th className="py-3.5 px-3 font-medium uppercase tracking-wider">نوع الطلب</th>
                  <th className="py-3.5 px-3 font-medium uppercase tracking-wider">المشروع المطلوب</th>
                  <th className="py-3.5 px-3 font-medium uppercase tracking-wider">الميزانية</th>
                  <th className="py-3.5 px-3 font-medium uppercase tracking-wider">المرحلة الحالية</th>
                  <th className="py-3.5 px-3 font-medium uppercase tracking-wider">مسؤول المبيعات</th>
                  <th className="py-3.5 px-3 font-medium uppercase tracking-wider">المتابعة القادمة</th>
                  <th className="py-3.5 pl-4 font-medium uppercase tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#71717A]">
                      لا يوجد عملاء يطابقون خيارات البحث الحالية
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(lead => {
                    const stageCfg = STAGE_CONFIG[lead.stage];
                    const sourceCfg = SOURCE_CONFIG[lead.source];
                    const reqCfg = REQUEST_TYPE_LABELS[lead.requestType];

                    return (
                      <tr key={lead.id} className="hover:bg-[#27272A]/40 transition-colors">
                        <td className="py-3.5 pr-4">
                          <div 
                            onClick={() => onOpenCustomerDetail(lead.id)}
                            className="font-semibold text-white hover:text-emerald-400 cursor-pointer"
                          >
                            {lead.name}
                          </div>
                          <div className="text-[11px] text-[#71717A] font-mono mt-0.5">{lead.phone}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded border ${sourceCfg?.badgeColor}`}>
                            {sourceCfg?.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded border ${reqCfg?.color}`}>
                            {reqCfg?.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-medium text-[#E4E4E7]">{lead.interestedProjectName || 'غير محدد'}</div>
                          <div className="text-[10px] text-[#71717A]">{lead.preferredUnitType}</div>
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-emerald-400">
                          {formatCurrency(lead.budgetMax)}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${stageCfg?.bg} ${stageCfg?.color} ${stageCfg?.border}`}>
                            {stageCfg?.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          {lead.assignedAgentId ? (
                            <span className="font-medium text-[#A1A1AA]">{lead.assignedAgentName}</span>
                          ) : (
                            <button
                              onClick={() => {
                                const defaultAgent = agents.find(a => a.role === 'sales_agent');
                                if (defaultAgent) onAssignLead(lead.id, defaultAgent.id);
                              }}
                              className="text-[10px] px-2 py-1 rounded bg-[#27272A] text-emerald-400 border border-[#3F3F46] hover:bg-[#3F3F46] cursor-pointer"
                            >
                              + تعيين موظف
                            </button>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-[#A1A1AA] font-mono text-[11px]">
                          {lead.nextFollowUpDate ? (
                            <div className="flex items-center gap-1 text-amber-400">
                              <Clock className="w-3 h-3" />
                              <span>{lead.nextFollowUpTime || '12:00'} ({lead.nextFollowUpDate.slice(5)})</span>
                            </div>
                          ) : (
                            <span className="text-[#71717A] text-[10px]">غير محدد</span>
                          )}
                        </td>

                        <td className="py-3.5 pl-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onLogCall(lead.id)}
                              className="p-1.5 rounded bg-[#27272A] hover:bg-[#3F3F46] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                              title="تسجيل مكالمة"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                            </button>
                            <button
                              onClick={() => onOpenCustomerDetail(lead.id)}
                              className="px-2.5 py-1 rounded bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-medium cursor-pointer"
                            >
                              ملف العميل
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
