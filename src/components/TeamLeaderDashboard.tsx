import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Shuffle, 
  ArrowUpRight, 
  Calendar, 
  PhoneCall, 
  Award,
  AlertCircle,
  Percent,
  ChevronDown
} from 'lucide-react';
import { Lead, SalesAgent, FollowUpReminder } from '../types';
import { formatCurrency, formatFullCurrency, STAGE_CONFIG, SOURCE_CONFIG } from '../utils/formatters';

interface TeamLeaderDashboardProps {
  leads: Lead[];
  agents: SalesAgent[];
  followUps: FollowUpReminder[];
  onAssignLead: (leadId: string, agentId: string) => void;
  onAutoDistributeLeads: () => void;
  onOpenCustomerDetail: (leadId: string) => void;
}

export const TeamLeaderDashboard: React.FC<TeamLeaderDashboardProps> = ({
  leads,
  agents,
  followUps,
  onAssignLead,
  onAutoDistributeLeads,
  onOpenCustomerDetail,
}) => {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');
  const [assignmentNotice, setAssignmentNotice] = useState<string | null>(null);

  const unassignedLeads = leads.filter(l => !l.assignedAgentId);
  const pendingFollowUps = followUps.filter(f => !f.isCompleted);
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.stage === 'closed_won').length;
  const teamConversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';

  const handleAutoDistributeClick = () => {
    onAutoDistributeLeads();
    setAssignmentNotice('تم التوزيع التلقائي العادل للعملاء الجدد على مستشاري المبيعات بنجاح!');
    setTimeout(() => setAssignmentNotice(null), 4000);
  };

  const handleManualAssign = (leadId: string, agentId: string) => {
    onAssignLead(leadId, agentId);
    const agent = agents.find(a => a.id === agentId);
    setAssignmentNotice(`تم تعيين العميل للمستشار ${agent?.name || ''} بنجاح!`);
    setTimeout(() => setAssignmentNotice(null), 4000);
  };

  // Filtered follow ups
  const filteredFollowUps = selectedAgentFilter === 'all'
    ? pendingFollowUps
    : pendingFollowUps.filter(f => f.agentId === selectedAgentFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast feedback */}
      {assignmentNotice && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{assignmentNotice}</span>
          </div>
          <button onClick={() => setAssignmentNotice(null)} className="text-[#71717A] hover:text-white cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-xl bg-[#18181B] border border-[#27272A] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              <span>مركز قيادة وتوزيع فريق المبيعات (Team Leader Dashboard)</span>
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-light text-white">
            متابعة أداء مستشاري المبيعات، توزيع الـ Leads، ومراقبة الـ Follow Ups
          </h2>
          <p className="text-xs text-[#71717A] mt-1">
            يوجد <strong className="text-emerald-400 font-semibold">{unassignedLeads.length} عميل غير معين</strong> بانتظار التوزيع، 
            و <strong className="text-amber-400 font-semibold">{pendingFollowUps.length} متابعات مستحقة</strong> قيد المراقبة اليوم.
          </p>
        </div>

        {unassignedLeads.length > 0 && (
          <button
            onClick={handleAutoDistributeClick}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs cursor-pointer transition-colors shrink-0"
          >
            <Shuffle className="w-4 h-4" />
            <span>توزيع آلي عادل (Round-Robin)</span>
          </button>
        )}
      </div>

      {/* 4 Team KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717A] uppercase font-bold tracking-wider">عملاء بانتظار التوزيع</span>
            <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-light text-amber-400">{unassignedLeads.length}</span>
            <span className="text-xs text-[#71717A]">عميل جديد</span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">من منصات Facebook، WhatsApp، والموقع</p>
        </div>

        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717A] uppercase font-bold tracking-wider">مستشاري المبيعات</span>
            <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-light text-white">{agents.length}</span>
            <span className="text-xs text-[#71717A]">مستشارين معتمدين</span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">تحت إشراف قائد الفريق</p>
        </div>

        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717A] uppercase font-bold tracking-wider">معدل تحويل الفريق</span>
            <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-light text-white">{teamConversionRate}%</span>
            <span className="text-xs font-semibold text-emerald-500">نسبة الإغلاق</span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">عبر {wonLeads} صفقات بيع ناجحة</p>
        </div>

        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717A] uppercase font-bold tracking-wider">المتابعات المستحقة</span>
            <div className="w-7 h-7 rounded-md bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-light text-white">{pendingFollowUps.length}</span>
            <span className="text-xs text-[#71717A]">مهمة متابعة</span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">مراقبة الالتزام بمواعيد العملاء</p>
        </div>
      </div>

      {/* Unassigned Leads Allocation Pool */}
      {unassignedLeads.length > 0 && (
        <div className="p-6 rounded-xl bg-[#18181B] border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>العملاء الجدد بانتظار التعيين (Lead Distribution Pool)</span>
              </h3>
              <p className="text-xs text-[#71717A]">قم بتعيين المستشار المناسب لكل عميل أو وزعهم بالتساوي بضغطة زر</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              {unassignedLeads.length} عميل بانتظار التعيين
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {unassignedLeads.map((lead) => {
              const sourceConfig = SOURCE_CONFIG[lead.source as keyof typeof SOURCE_CONFIG];
              return (
                <div 
                  key={lead.id}
                  className="p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A] hover:border-[#3F3F46] flex items-center justify-between gap-4 text-right transition-colors"
                >
                  <div>
                    <button
                      onClick={() => onOpenCustomerDetail(lead.id)}
                      className="text-xs font-semibold text-white hover:text-emerald-400 transition-colors block text-right cursor-pointer"
                    >
                      {lead.name}
                    </button>
                    <p className="text-[11px] text-[#71717A] mt-0.5">
                      {lead.interestedProjectName} • {formatCurrency(lead.budgetMax)}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-medium">{sourceConfig?.label || lead.source}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleManualAssign(lead.id, e.target.value);
                        }
                      }}
                      defaultValue=""
                      className="px-3 py-1.5 rounded-md bg-[#18181B] border border-[#27272A] text-xs text-[#E4E4E7] focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="" disabled>تعيين لمستشار...</option>
                      {agents.map((ag) => (
                        <option key={ag.id} value={ag.id}>{ag.name} ({ag.activeLeadsCount} عميل)</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sales Agents Performance Comparison Matrix */}
      <div className="p-6 rounded-xl bg-[#18181B] border border-[#27272A]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">جدول مقارنة أداء فريق المبيعات (Sales Comparison Matrix)</h3>
            <p className="text-xs text-[#71717A]">متابعة المبيعات المحققة، نسبة تحقيق التارجت، ونسب التحويل لكل موظف</p>
          </div>
          <span className="text-xs font-medium text-emerald-400">{agents.length} مستشارين</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#0A0A0B] text-[#71717A] border-b border-[#27272A] font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">مستشار المبيعات</th>
                <th className="py-3 px-4">العملاء النشطين</th>
                <th className="py-3 px-4">المبيعات المحققة</th>
                <th className="py-3 px-4">المستهدف الشهري</th>
                <th className="py-3 px-4">نسبة تحقيق التارجت</th>
                <th className="py-3 px-4">معدل التحويل (Rate)</th>
                <th className="py-3 px-4">سرعة الاستجابة</th>
                <th className="py-3 px-4">التقييم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A] text-[#E4E4E7]">
              {agents.map((agent) => {
                const targetPercent = Math.min(Math.round((agent.achievedRevenue / agent.monthlyTarget) * 100), 100);

                return (
                  <tr key={agent.id} className="hover:bg-[#27272A]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full object-cover border border-[#27272A]" />
                        <div>
                          <span className="font-semibold block text-white">{agent.name}</span>
                          <span className="text-[10px] text-[#71717A]">{agent.role === 'team_leader' ? 'قائد مبيعات' : 'مستشار عقاري'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#A1A1AA]">
                      {agent.activeLeadsCount} عميل
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-white">
                      {formatCurrency(agent.achievedRevenue)}
                    </td>

                    <td className="py-3.5 px-4 text-[#71717A]">
                      {formatCurrency(agent.monthlyTarget)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1 w-36">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#71717A]">{targetPercent}%</span>
                          <span className="text-white font-medium">{targetPercent >= 80 ? 'ممتاز' : 'جيد'}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#27272A] overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${targetPercent >= 85 ? 'bg-emerald-500' : targetPercent >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${targetPercent}%` }} 
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium text-[11px]">
                        {agent.conversionRate}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#A1A1AA] text-[11px]">
                      {agent.avgResponseTimeMin} دقيقة
                    </td>

                    <td className="py-3.5 px-4 text-amber-400 font-medium">
                      ★ {agent.rating}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Follow-up Tracking & Compliance */}
      <div className="p-6 rounded-xl bg-[#18181B] border border-[#27272A]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>مراقبة الالتزام بمواعيد المتابعة (Follow-up Compliance)</span>
            </h3>
            <p className="text-xs text-[#71717A]">ضمان عدم إهمال أي عميل محتمل أو ضياع فرصة بيعية</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#71717A]">تصفية بالمستشار:</span>
            <select
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-[#0A0A0B] border border-[#27272A] text-xs text-[#E4E4E7]"
            >
              <option value="all">كافة المستشارين</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredFollowUps.length === 0 ? (
            <div className="py-8 text-center text-[#71717A] text-xs">
              جميع مواعيد المتابعة مكتملة ولا يوجد أي تأخير!
            </div>
          ) : (
            filteredFollowUps.map((fu) => {
              const assignedAgent = agents.find(a => a.id === fu.agentId);
              return (
                <div 
                  key={fu.id}
                  onClick={() => onOpenCustomerDetail(fu.leadId)}
                  className="p-3.5 rounded-lg bg-[#0A0A0B] border border-[#27272A] hover:border-[#3F3F46] flex items-center justify-between gap-4 text-right cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{fu.leadName}</span>
                      <span className="text-[10px] text-[#71717A]" dir="ltr">{fu.leadPhone}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#27272A] text-white font-medium">
                        {fu.type === 'call' ? 'اتصال هاتف' : fu.type === 'meeting' ? 'معاينة' : 'متابعة'}
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1AA] mt-1">{fu.note}</p>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-xs text-[#E4E4E7] font-medium block">{assignedAgent?.name || 'غير معين'}</span>
                    <span className="text-[10px] text-amber-400 flex items-center gap-1 justify-end mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {fu.scheduledTime}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
