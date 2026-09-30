import React, { useState } from 'react';
import { 
  PhoneCall, 
  X, 
  MessageSquare, 
  CheckCircle, 
  Calendar, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Lead, ActivityLog, FollowUpReminder, PipelineStage } from '../types';

interface LogCallModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCall: (activity: Omit<ActivityLog, 'id'>, nextFollowUp?: Omit<FollowUpReminder, 'id'>, newStage?: PipelineStage) => void;
}

export const LogCallModal: React.FC<LogCallModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSaveCall,
}) => {
  if (!isOpen || !lead) return null;

  const [outcome, setOutcome] = useState<'answered' | 'no_answer' | 'busy' | 'followup_needed'>('answered');
  const [callNotes, setCallNotes] = useState('');
  const [scheduleNext, setScheduleNext] = useState(true);
  const [nextDate, setNextDate] = useState('2026-09-04');
  const [nextTime, setNextTime] = useState('14:00');
  const [nextNote, setNextNote] = useState('متابعة العميل هاتفياً واستكمال المناقشة');
  const [updateStage, setUpdateStage] = useState<PipelineStage | ''>(lead.stage === 'new_lead' ? 'contacted' : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callNotes.trim()) return;

    const activity: Omit<ActivityLog, 'id'> = {
      leadId: lead.id,
      agentId: lead.assignedAgentId || 'agent-1',
      agentName: lead.assignedAgentName || 'مسؤول المبيعات',
      type: 'call',
      title: outcome === 'answered' ? 'مكالمة هاتفية ناجحة' : outcome === 'busy' ? 'خط مشغول' : 'لم يتم الرد',
      description: callNotes,
      timestamp: 'الآن',
      outcome: outcome,
    };

    let followUp: Omit<FollowUpReminder, 'id'> | undefined = undefined;
    if (scheduleNext && nextDate) {
      followUp = {
        leadId: lead.id,
        leadName: lead.name,
        leadPhone: lead.phone,
        agentId: lead.assignedAgentId || 'agent-1',
        scheduledTime: `${nextTime} (${nextDate})`,
        date: nextDate,
        time: nextTime,
        note: nextNote,
        isCompleted: false,
        priority: 'high',
      };
    }

    onSaveCall(activity, followUp, updateStage || undefined);
    onClose();
    setCallNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">تسجيل تفاصيل المكالمة مع {lead.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{lead.phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Outcome Buttons */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">نتيجة الاتصال (Outcome):</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'answered', label: 'تم الرد بنجاح' },
                { id: 'no_answer', label: 'لم يرد' },
                { id: 'busy', label: 'الرقم مشغول' },
                { id: 'followup_needed', label: 'اتصال لاحقاً' },
              ].map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setOutcome(opt.id as any)}
                  className={`p-2 rounded-lg text-center transition-all cursor-pointer text-xs ${
                    outcome === opt.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">تفاصيل ما دار في المكالمة *:</label>
            <textarea
              rows={3}
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="اكتب ملاحظات رد العميل، رغبته في المعاينة، تفاصيل المشروع المطلوب..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Advance Stage Option */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">نقل العميل لمرحلة جديدة في الـ Pipeline:</label>
            <select
              value={updateStage}
              onChange={(e) => setUpdateStage(e.target.value as any)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">-- الإبقاء على نفس المرحلة الحالية --</option>
              <option value="contacted">تم التواصل (Contacted)</option>
              <option value="qualified">مؤهل وجاد (Qualified)</option>
              <option value="interested">مهتم بالمشروع (Interested)</option>
              <option value="viewing_scheduled">معاينة مجدولة (Viewing Scheduled)</option>
              <option value="negotiation">تفاوض وعرض سعر (Negotiation)</option>
              <option value="closed_won">تم البيع بنجاح (Closed Won)</option>
              <option value="closed_lost">فرصة ملغاة (Closed Lost)</option>
            </select>
          </div>

          {/* Schedule Next Follow Up */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduleNext}
                  onChange={(e) => setScheduleNext(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span className="font-semibold text-white text-xs">تحديد موعد المتابعة القادم (Follow Up)</span>
              </label>
            </div>

            {scheduleNext && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400">التاريخ:</span>
                  <input
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">التوقيت:</span>
                  <input
                    type="time"
                    value={nextTime}
                    onChange={(e) => setNextTime(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold cursor-pointer"
            >
              حفظ المكالمة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
