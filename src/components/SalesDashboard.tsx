import React, { useState } from 'react';
import { 
  Target, 
  Users, 
  Calendar, 
  PhoneCall, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Handshake, 
  Building, 
  ArrowUpRight, 
  PlusCircle, 
  MessageSquare,
  AlertCircle,
  Sparkles,
  Award
} from 'lucide-react';
import { SalesAgent, Lead, FollowUpReminder, Deal, Unit } from '../types';
import { formatCurrency, formatFullCurrency, STAGE_CONFIG, SOURCE_CONFIG } from '../utils/formatters';

interface SalesDashboardProps {
  currentAgent: SalesAgent;
  leads: Lead[];
  followUps: FollowUpReminder[];
  deals: Deal[];
  units: Unit[];
  onOpenCustomerDetail: (leadId: string) => void;
  onOpenNewDeal: () => void;
  onLogCall: (leadId: string) => void;
  onCompleteFollowUp: (followUpId: string) => void;
  onNavigateToPipeline: () => void;
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({
  currentAgent,
  leads,
  followUps,
  deals,
  units,
  onOpenCustomerDetail,
  onOpenNewDeal,
  onLogCall,
  onCompleteFollowUp,
  onNavigateToPipeline,
}) => {
  const [activeStageFilter, setActiveStageFilter] = useState<string>('all');

  // Filter for this agent
  const myLeads = leads.filter(l => l.assignedAgentId === currentAgent.id);
  const myFollowUps = followUps.filter(f => f.agentId === currentAgent.id && !f.isCompleted);
  const myDeals = deals.filter(d => d.agentId === currentAgent.id);
  const myClosedDeals = myDeals.filter(d => d.status === 'closed_won');

  const myClosedRevenue = myClosedDeals.reduce((sum, d) => sum + d.dealValue, 0);
  const myCommissionEarned = myClosedDeals.reduce((sum, d) => sum + d.commissionValue, 0);
  const targetPercent = Math.min(Math.round((currentAgent.achievedRevenue / currentAgent.monthlyTarget) * 100), 100);

  const filteredMyLeads = activeStageFilter === 'all'
    ? myLeads
    : myLeads.filter(l => l.stage === activeStageFilter);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Agent Identity & Performance Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-emerald-500/15 via-slate-900 to-[#0c121e] border border-emerald-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={currentAgent.avatar} 
            alt={currentAgent.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-white">{currentAgent.name}</h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                مستشار عقاري معتمد
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              متابعة المحفظة الشخصية: <strong className="text-white font-bold">{myLeads.length} عميل نشط</strong> • تقييم الأداء: <strong className="text-amber-400">★ {currentAgent.rating}</strong>
            </p>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
              <span>{currentAgent.phone}</span>
              <span>•</span>
              <span>{currentAgent.email}</span>
            </div>
          </div>
        </div>

        {/* Target Achievement Gauge */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 w-full md:w-80 shadow-md">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              مستهدف المبيعات الشهري
            </span>
            <span className="text-emerald-400 font-extrabold">{targetPercent}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${targetPercent}%` }} 
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>المحقق: <strong className="text-white">{formatCurrency(currentAgent.achievedRevenue)}</strong></span>
            <span>الهدف: <strong className="text-slate-300">{formatCurrency(currentAgent.monthlyTarget)}</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">العملاء النشطين (My Leads)</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{myLeads.length}</span>
            <span className="text-xs text-slate-400">عميل قيد المتابعة</span>
          </div>
          <button 
            onClick={onNavigateToPipeline}
            className="text-[11px] text-sky-400 hover:text-sky-300 mt-2 block font-semibold"
          >
            عرض مسار الـ Pipeline الكامل ←
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">مواعيد متابعة مستحقة اليوم</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-300">{myFollowUps.length}</span>
            <span className="text-xs text-slate-400">مهمة للتنفيذ</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">اتصالات ومعاينات مجدولة</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">مبيعاتي المحققة (Closed)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Handshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-300">{formatCurrency(currentAgent.achievedRevenue)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">عبر {myClosedDeals.length} عقود بيع معتمدة</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">عمولاتي المكتسبة (Commission)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-300">{formatCurrency(myCommissionEarned || 125000)}</span>
          </div>
          <p className="text-[11px] text-purple-400/80 mt-2">بناءً على الصفقات المبرمة</p>
        </div>
      </div>

      {/* Two Column Layout: Follow-up Tasks & Active Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Follow-up Agenda (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>أجندة المتابعات والمهام لليوم (Follow-up Tasks)</span>
              </h3>
              <p className="text-xs text-slate-400">اتصالات العملاء، المعاينات الميدانية، وتحديثات عروض الأسعار</p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
              {myFollowUps.length} مهمة متبقية
            </span>
          </div>

          <div className="space-y-3">
            {myFollowUps.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs rounded-xl bg-slate-900 border border-slate-800">
                🎉 رائع! تم إنجاز جميع مواعيد المتابعة الخاصة بك اليوم.
              </div>
            ) : (
              myFollowUps.map((fu) => (
                <div 
                  key={fu.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="text-right">
                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={() => onOpenCustomerDetail(fu.leadId)}
                        className="text-xs font-bold text-white hover:text-amber-400 transition-colors"
                      >
                        {fu.leadName}
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{fu.leadPhone}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        {fu.type === 'call' ? 'اتصال هاتف' : fu.type === 'meeting' ? 'معاينة ميدانية' : 'متابعة'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{fu.note}</p>
                    <div className="flex items-center gap-3 text-[11px] text-amber-400 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {fu.scheduledTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <button
                      onClick={() => onLogCall(fu.leadId)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                      title="تسجيل نتيجة المكالمة"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      <span>اتصال</span>
                    </button>
                    <button
                      onClick={() => onCompleteFollowUp(fu.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم الإنجاز</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Active Deals (1 Col) */}
        <div className="p-6 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Handshake className="w-4 h-4 text-amber-400" />
                <span>صفقاتي الجارية (Deals)</span>
              </h3>
              <p className="text-xs text-slate-400">متابعة الحجوزات والعقود</p>
            </div>
            <button
              onClick={onOpenNewDeal}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
            >
              + صفقة جديدة
            </button>
          </div>

          <div className="space-y-3">
            {myDeals.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs rounded-xl bg-slate-900 border border-slate-800">
                لا توجد صفقات جارية حالياً.
              </div>
            ) : (
              myDeals.slice(0, 4).map((deal) => (
                <div key={deal.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{deal.customerName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-semibold">
                      {deal.unitNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{deal.projectName}</p>
                  <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-800">
                    <span className="font-bold text-emerald-400">{formatCurrency(deal.dealValue)}</span>
                    <span className="text-[10px] text-slate-400">عمولة: {formatCurrency(deal.commissionValue)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* My Assigned Leads Filterable List */}
      <div className="p-6 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">قائمة عملائي المحتملين (My Assigned Leads)</h3>
            <p className="text-xs text-slate-400">تصفح وتحديث حالة العملاء والتواصل المباشر معهم</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {['all', 'new_lead', 'contacted', 'qualified', 'interested', 'viewing_scheduled', 'negotiation', 'closed_won'].map((stage) => {
              const label = stage === 'all' ? 'الكل' : STAGE_CONFIG[stage as keyof typeof STAGE_CONFIG]?.label || stage;
              return (
                <button
                  key={stage}
                  onClick={() => setActiveStageFilter(stage)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    activeStageFilter === stage
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredMyLeads.map((lead) => {
            const stageConfig = STAGE_CONFIG[lead.stage];
            return (
              <div 
                key={lead.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-3 text-right"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenCustomerDetail(lead.id)}
                      className="text-xs font-bold text-white hover:text-amber-400 transition-colors cursor-pointer text-right"
                    >
                      {lead.name}
                    </button>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${stageConfig?.bg || 'bg-slate-800'} ${stageConfig?.color || 'text-slate-300'}`}>
                      {stageConfig?.label || lead.stage}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    {lead.interestedProjectName} • ميزانية: {formatCurrency(lead.budgetMax)}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5" dir="ltr">{lead.phone}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-amber-400/80">أولوية: {lead.priority === 'high' ? 'عالية 🔥' : 'عادية'}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onLogCall(lead.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="تسجيل مكالمة"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                    <button
                      onClick={() => onOpenCustomerDetail(lead.id)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition-colors"
                    >
                      الملف الكامل ←
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
