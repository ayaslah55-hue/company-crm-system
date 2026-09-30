import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  MessageSquare, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Building, 
  DollarSign, 
  UserCheck, 
  Plus, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Send,
  AlertCircle,
  Home,
  Tag
} from 'lucide-react';
import { Lead, ActivityLog, FollowUpReminder, SalesAgent, Unit, PipelineStage } from '../types';
import { STAGE_CONFIG, SOURCE_CONFIG, REQUEST_TYPE_LABELS, formatCurrency, formatFullCurrency } from '../utils/formatters';

interface CustomerDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  activities: ActivityLog[];
  followUps: FollowUpReminder[];
  agents: SalesAgent[];
  units: Unit[];
  onAddActivity: (activity: Omit<ActivityLog, 'id'>) => void;
  onScheduleFollowUp: (followUp: Omit<FollowUpReminder, 'id'>) => void;
  onUpdateLeadStage: (leadId: string, stage: PipelineStage) => void;
  onAssignLead: (leadId: string, agentId: string) => void;
  onLinkUnitToLead: (leadId: string, unitId: string) => void;
  onNavigateToNewDeal: (leadId: string, unitId?: string) => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  lead,
  onClose,
  activities,
  followUps,
  agents,
  units,
  onAddActivity,
  onScheduleFollowUp,
  onUpdateLeadStage,
  onAssignLead,
  onLinkUnitToLead,
  onNavigateToNewDeal,
}) => {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState<'timeline' | 'log_call' | 'schedule_followup' | 'link_unit'>('timeline');
  
  // Call form state
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState<'answered' | 'no_answer' | 'busy' | 'followup_needed'>('answered');
  
  // Follow-up form state
  const [followUpDate, setFollowUpDate] = useState('2026-09-04');
  const [followUpTime, setFollowUpTime] = useState('14:00');
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpPriority, setFollowUpPriority] = useState<'low' | 'medium' | 'high'>('high');

  // Selected unit for linking
  const [selectedUnitId, setSelectedUnitId] = useState(lead.linkedUnitId || '');

  const stageCfg = STAGE_CONFIG[lead.stage];
  const sourceCfg = SOURCE_CONFIG[lead.source];
  const reqCfg = REQUEST_TYPE_LABELS[lead.requestType];

  const leadActivities = activities.filter(a => a.leadId === lead.id);
  const leadFollowUps = followUps.filter(f => f.leadId === lead.id);
  const linkedUnit = units.find(u => u.id === lead.linkedUnitId);

  // Handle logging a call
  const handleSaveCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callNotes.trim()) return;

    onAddActivity({
      leadId: lead.id,
      agentId: lead.assignedAgentId || 'agent-1',
      agentName: lead.assignedAgentName || 'مسؤول المبيعات',
      type: 'call',
      title: callOutcome === 'answered' ? 'مكالمة هاتفية ناجحة' : callOutcome === 'busy' ? 'الرقم مشغول' : 'لم يتم الرد',
      description: callNotes,
      timestamp: 'الآن',
      outcome: callOutcome,
    });

    setCallNotes('');
    setActiveTab('timeline');
  };

  // Handle scheduling follow up
  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpNote.trim()) return;

    onScheduleFollowUp({
      leadId: lead.id,
      leadName: lead.name,
      leadPhone: lead.phone,
      agentId: lead.assignedAgentId || 'agent-1',
      scheduledTime: `${followUpTime} (${followUpDate})`,
      date: followUpDate,
      time: followUpTime,
      note: followUpNote,
      isCompleted: false,
      priority: followUpPriority,
    });

    onAddActivity({
      leadId: lead.id,
      agentId: lead.assignedAgentId || 'agent-1',
      agentName: lead.assignedAgentName || 'مسؤول المبيعات',
      type: 'meeting',
      title: 'جدولة موعد متابعة قادم',
      description: `${followUpNote} - الموعد: ${followUpDate} الساعة ${followUpTime}`,
      timestamp: 'الآن',
    });

    setFollowUpNote('');
    setActiveTab('timeline');
  };

  // Handle linking property
  const handleLinkUnit = () => {
    if (selectedUnitId) {
      onLinkUnitToLead(lead.id, selectedUnitId);
      const unit = units.find(u => u.id === selectedUnitId);
      onAddActivity({
        leadId: lead.id,
        agentId: lead.assignedAgentId || 'agent-1',
        agentName: lead.assignedAgentName || 'مسؤول المبيعات',
        type: 'unit_linked',
        title: 'ربط وحدة عقارية بالعميل',
        description: `تم ربط الوحدة ${unit?.unitNumber} في مشروع ${unit?.projectName} بالعميل تمهيداً للحجز والتعاقد.`,
        timestamp: 'الآن',
      });
      setActiveTab('timeline');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-start">
      <div className="w-full max-w-2xl bg-[#0b0f19] border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold">
              {lead.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{lead.name}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${stageCfg?.bg} ${stageCfg?.color} ${stageCfg?.border}`}>
                  {stageCfg?.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                <span>{lead.phone}</span>
                {lead.email && <span>• {lead.email}</span>}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Summary Info Card */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div>
              <div className="text-[10px] text-slate-400">مصدر الـ Lead</div>
              <div className="font-semibold text-slate-200 mt-0.5">{sourceCfg?.label}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">نوع الطلب</div>
              <div className="font-semibold text-amber-300 mt-0.5">{reqCfg?.label}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">الميزانية</div>
              <div className="font-bold text-emerald-400 mt-0.5">{formatCurrency(lead.budgetMax)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">المشروع المطلوب</div>
              <div className="font-semibold text-slate-200 mt-0.5 truncate">{lead.interestedProjectName || 'غير محدد'}</div>
            </div>
          </div>

          {/* Pipeline Stage Bar */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">تغيير مرحلة الـ Pipeline:</span>
              <span className="font-bold text-amber-300">{stageCfg.label} ({stageCfg.labelEn})</span>
            </div>
            <select
              value={lead.stage}
              onChange={(e) => onUpdateLeadStage(lead.id, e.target.value as PipelineStage)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="new_lead">1. عميل جديد (New Lead)</option>
              <option value="contacted">2. تم التواصل هاتفياً (Contacted)</option>
              <option value="qualified">3. عميل مؤهل وجاد (Qualified)</option>
              <option value="interested">4. مهتم بالمشروع (Interested)</option>
              <option value="viewing_scheduled">5. موعد معاينة مجدول (Viewing Scheduled)</option>
              <option value="negotiation">6. تفاوض وعرض سعر (Negotiation)</option>
              <option value="closed_won">7. تم البيع بنجاح (Closed Won)</option>
              <option value="closed_lost">8. فرصة ملغاة (Closed Lost)</option>
            </select>
          </div>

          {/* Assigned Agent Control */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-slate-400 text-[11px]">موظف المبيعات المسؤول:</div>
                <div className="font-semibold text-white">{lead.assignedAgentName || 'لم يتم التعيين بعد'}</div>
              </div>
            </div>
            <select
              value={lead.assignedAgentId || ''}
              onChange={(e) => onAssignLead(lead.id, e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
            >
              <option value="">-- تعيين مسؤول --</option>
              {agents.filter(a => a.role === 'sales_agent').map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Linked Unit Box */}
          {linkedUnit ? (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-slate-900/80 border border-cyan-500/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">الوحدة المختارة: {linkedUnit.unitNumber}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {linkedUnit.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {linkedUnit.projectName} • {linkedUnit.areaM2} م² • {formatCurrency(linkedUnit.price)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateToNewDeal(lead.id, linkedUnit.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                + إنشاء صفقة (Deal)
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/50 border border-dashed border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">لم يتم ربط وحدة عقارية محددة بهذا العميل حتى الآن</span>
              <button
                onClick={() => setActiveTab('link_unit')}
                className="text-amber-400 hover:underline font-semibold"
              >
                + ربط وحدة عقارية الآن
              </button>
            </div>
          )}

          {/* Customer Action Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'timeline' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              سجل النشاطات ({leadActivities.length})
            </button>
            <button
              onClick={() => setActiveTab('log_call')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'log_call' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              تسجيل مكالمة
            </button>
            <button
              onClick={() => setActiveTab('schedule_followup')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'schedule_followup' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              جدولة Follow Up
            </button>
            <button
              onClick={() => setActiveTab('link_unit')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'link_unit' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ربط عقار
            </button>
          </div>

          {/* TAB 1: ACTIVITY TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 pt-2">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>الخط الزمني لتفاعلات العميل (Activity Timeline)</span>
                <span className="text-[10px] text-slate-400 font-normal">مرتب من الأحدث للأقدم</span>
              </div>

              <div className="space-y-3 relative before:absolute before:right-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {leadActivities.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 text-xs">
                    لا توجد نشاطات مسجلة بعد. استخدم التبويبات أعلاه لتسجيل أول مكالمة أو موعد.
                  </div>
                ) : (
                  leadActivities.map(act => (
                    <div key={act.id} className="relative pr-8 space-y-1">
                      <div className="absolute right-2 top-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-slate-900" />
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{act.title}</span>
                          <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{act.description}</p>
                        <div className="text-[10px] text-amber-400/80 pt-1">بواسطة: {act.agentName}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LOG CALL FORM */}
          {activeTab === 'log_call' && (
            <form onSubmit={handleSaveCall} className="space-y-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>تسجيل تفاصيل مكالمة هاتفية مع العميل</span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">نتيجة المكالمة (Call Outcome):</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'answered', label: 'تم الرد بنجاح' },
                    { id: 'no_answer', label: 'لم يرد' },
                    { id: 'busy', label: 'الخط مشغول' },
                    { id: 'followup_needed', label: 'طلب اتصال لاحقاً' },
                  ].map(opt => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setCallOutcome(opt.id as any)}
                      className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
                        callOutcome === opt.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 border border-slate-800 text-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">ملاحظات المكالمة ورد العميل:</label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="سجل ما تم الاتفاق عليه، درجة اهتمام العميل، الوحدات التي فضلها، وأي اعتراضات..."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold cursor-pointer"
                >
                  حفظ المكالمة في السجل
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SCHEDULE FOLLOW UP */}
          {activeTab === 'schedule_followup' && (
            <form onSubmit={handleSaveFollowUp} className="space-y-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>تحديد موعد المتابعة القادم (Follow Up Reminder)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">تاريخ المتابعة:</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">توقيت الاتصال:</label>
                  <input
                    type="time"
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">ملاحظة التذكير وهدف المكالمة:</label>
                <textarea
                  rows={2}
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  placeholder="مثلاً: الاتصال لإرسال العقود النهائية، أو تأكيد موعد المعاينة بموقع المشروع..."
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
                >
                  تأكيد وحفظ الموعد
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: LINK PROPERTY UNIT */}
          {activeTab === 'link_unit' && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>ربط وحدة عقارية من المخزون بالعميل</span>
              </div>
              <p className="text-[11px] text-slate-400">
                اختر الوحدة التي يرغب العميل بحجزها أو التفاوض عليها:
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {units.filter(u => u.status === 'available' || u.id === lead.linkedUnitId).map(unit => (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedUnitId === unit.id
                        ? 'bg-cyan-500/15 border-cyan-500 text-white'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{unit.unitNumber} - {unit.type}</div>
                      <div className="text-[11px] text-slate-400">{unit.projectName} • {unit.areaM2} م²</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-400">{formatCurrency(unit.price)}</div>
                      <div className="text-[10px] text-emerald-400">متاح للحجز</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleLinkUnit}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold cursor-pointer"
                >
                  تأكيد ربط الوحدة بالعميل
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
