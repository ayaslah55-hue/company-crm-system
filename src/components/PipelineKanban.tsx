import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Calendar, 
  Phone, 
  DollarSign, 
  CheckCircle2, 
  Filter, 
  Building2,
  Clock
} from 'lucide-react';
import { PipelineStage, Lead } from '../types/crm';
import { STAGE_CONFIG, formatCurrency, formatCompactNumber, SOURCE_CONFIG } from '../utils/translations';

const PIPELINE_ORDER: PipelineStage[] = [
  'new_lead',
  'contacted',
  'qualified',
  'interested',
  'viewing_scheduled',
  'negotiation',
  'closed_won',
  'closed_lost'
];

export const PipelineKanban: React.FC = () => {
  const { leads, updateLeadStage, setSelectedLead, agents, projects, setIsNewLeadModalOpen } = useCRM();

  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');

  // Filter leads
  const filteredLeads = leads.filter(l => {
    if (selectedAgentFilter !== 'all' && l.assignedAgentId !== selectedAgentFilter) return false;
    if (selectedProjectFilter !== 'all' && l.preferredProjectId !== selectedProjectFilter) return false;
    return true;
  });

  const handleAdvanceStage = (leadId: string, currentStage: PipelineStage, direction: 'next' | 'prev') => {
    const currentIndex = PIPELINE_ORDER.indexOf(currentStage);
    if (currentIndex === -1) return;

    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < PIPELINE_ORDER.length) {
      updateLeadStage(leadId, PIPELINE_ORDER[targetIndex]);
    }
  };

  return (
    <div id="pipeline-kanban-view" className="p-8 space-y-6 h-full flex flex-col animate-in fade-in duration-200">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>لوحة مسار المبيعات التفاعلية (Kanban Pipeline)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            سحب وتحريك العملاء بين المراحل الثمانية ومراقبة وتيرة التدفق البيعي
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filter by Agent */}
          <div className="flex items-center gap-2 bg-[#0f1728] border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400">المستشار:</span>
            <select
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">كافة المستشارين</option>
              {agents.map(a => (
                <option key={a.id} value={a.id} className="bg-slate-900">{a.name}</option>
              ))}
            </select>
          </div>

          {/* Filter by Project */}
          <div className="flex items-center gap-2 bg-[#0f1728] border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400">المشروع:</span>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">كافة المشاريع</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsNewLeadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>عميل جديد</span>
          </button>
        </div>
      </div>

      {/* 8 Columns Kanban Board Container with horizontal scroll */}
      <div className="flex-1 overflow-x-auto pb-4 pt-1">
        <div className="flex gap-4 min-w-[1700px] h-full items-start">
          {PIPELINE_ORDER.map((stageKey, stageIdx) => {
            const stageConf = STAGE_CONFIG[stageKey];
            const stageLeads = filteredLeads.filter(l => l.stage === stageKey);
            const totalStageBudget = stageLeads.reduce((acc, curr) => acc + curr.budget, 0);

            return (
              <div 
                key={stageKey}
                className="w-72 shrink-0 flex flex-col bg-[#0b101c] rounded-2xl border border-slate-800/90 shadow-md max-h-[calc(100vh-210px)]"
              >
                {/* Column Header */}
                <div className={`p-4 rounded-t-2xl border-b border-slate-800 ${stageConf.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold flex items-center gap-2 ${stageConf.color}`}>
                      <span className={`w-2 h-2 rounded-full ${stageConf.color.replace('text-', 'bg-')}`} />
                      {stageConf.labelAr}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-200 font-bold border border-slate-700">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>قيمة الميزانيات:</span>
                    <span className="font-bold text-slate-200">{formatCompactNumber(totalStageBudget)} ريال</span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1">
                  {stageLeads.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-800/80 rounded-xl">
                      لا يوجد عملاء
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const sourceConf = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG.website;
                      return (
                        <div
                          key={lead.id}
                          className="p-3.5 rounded-xl bg-[#0f1728] border border-slate-800/90 hover:border-amber-500/50 transition-all shadow-sm group text-right"
                        >
                          {/* Card Top: Code & Priority */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-slate-400">{lead.code}</span>
                            <div className="flex items-center gap-1.5">
                              {lead.priority === 'high' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                                  أولوية
                                </span>
                              )}
                              <span className={`text-[10px] font-semibold ${sourceConf.color}`}>
                                {sourceConf.labelAr}
                              </span>
                            </div>
                          </div>

                          {/* Customer Name */}
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="text-right w-full font-bold text-xs text-slate-100 hover:text-amber-400 transition-colors mb-1 truncate block cursor-pointer"
                          >
                            {lead.name}
                          </button>

                          {/* Project & Unit */}
                          <p className="text-[11px] text-slate-400 truncate mb-2">
                            {lead.preferredProjectName} • {lead.preferredUnitType}
                          </p>

                          {/* Budget Tag */}
                          <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-slate-900/90 border border-slate-800 mb-3">
                            <span className="text-[10px] text-slate-400">الميزانية:</span>
                            <span className="font-extrabold text-amber-300">{formatCompactNumber(lead.budget)} ريال</span>
                          </div>

                          {/* Next Follow Up */}
                          {lead.nextFollowUpDate && (
                            <div className="text-[10px] text-amber-400/90 flex items-center gap-1 mb-2 bg-amber-500/10 px-2 py-0.8 rounded">
                              <Clock className="w-2.5 h-2.5" />
                              <span>متابعة: {new Date(lead.nextFollowUpDate).toLocaleDateString('ar-SA')}</span>
                            </div>
                          )}

                          {/* Card Footer: Agent & Stage Advance Buttons */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                            {/* Assigned Agent */}
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[9px] font-bold text-slate-300 flex items-center justify-center">
                                {lead.assignedAgentName ? lead.assignedAgentName[0] : '؟'}
                              </span>
                              <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                                {lead.assignedAgentName || 'غير معين'}
                              </span>
                            </div>

                            {/* Move Stage Arrows */}
                            <div className="flex items-center gap-1">
                              {stageIdx > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAdvanceStage(lead.id, lead.stage, 'prev');
                                  }}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  title="إرجاع للمرحلة السابقة"
                                >
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}

                              {stageIdx < PIPELINE_ORDER.length - 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAdvanceStage(lead.id, lead.stage, 'next');
                                  }}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                                  title="نقل للمرحلة التالية"
                                >
                                  <ChevronLeft className="w-3 h-3" />
                                </button>
                              )}
                            </div>
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
    </div>
  );
};
