import React, { useState } from 'react';
import { X, UserPlus, Building, DollarSign, Phone, Mail, FileText, User } from 'lucide-react';
import { Lead, Project, SalesAgent, LeadSource, RequestType } from '../types';
import { SOURCE_CONFIG, REQUEST_TYPE_LABELS } from '../utils/formatters';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  agents: SalesAgent[];
  onAddLead: (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  projects,
  agents,
  onAddLead,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState<LeadSource>('facebook_ads');
  const [requestType, setRequestType] = useState<RequestType>('buy');
  const [projectId, setProjectId] = useState<string>(projects[0]?.id || '');
  const [unitType, setUnitType] = useState<string>('شقة سكنية فاخرة');
  const [budget, setBudget] = useState<string>('2500000');
  const [agentId, setAgentId] = useState<string>('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const selectedProj = projects.find(p => p.id === projectId) || projects[0];
    const selectedAgent = agents.find(a => a.id === agentId);
    const numBudget = Number(budget) || 2500000;

    onAddLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      source,
      requestType,
      interestedProjectId: selectedProj?.id,
      interestedProjectName: selectedProj?.name,
      preferredUnitType: unitType,
      budgetMin: Math.round(numBudget * 0.8),
      budgetMax: numBudget,
      currency: selectedProj?.currency || 'ج.م',
      stage: 'new_lead',
      assignedAgentId: selectedAgent ? selectedAgent.id : null,
      assignedAgentName: selectedAgent ? selectedAgent.name : null,
      assignedAt: selectedAgent ? new Date().toISOString() : undefined,
      notes: notes.trim() || 'تم تسجيل العميل يدوياً من نموذج الإضافة السريعة.',
    });

    onClose();
    // Reset fields
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#111726] border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150 text-right">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0c121e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100">تسجيل عميل محتمل جديد (New Lead)</h3>
              <p className="text-xs text-slate-400">توثيق بيانات الطلب والمصدر والقناة التسويقية بدقة</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">اسم العميل الكامل: *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: م. عبد الله الفهد"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">رقم الهاتف (واتساب): *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 123 4567"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-right"
                required
              />
            </div>
          </div>

          {/* Row 2: Email and Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">البريد الإلكتروني (اختياري):</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-right"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">مصدر العميل (Lead Source): *</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {Object.entries(SOURCE_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Request Type & Preferred Project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">نوع الطلب العقاري: *</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as RequestType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {Object.entries(REQUEST_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">المشروع المهتم به: *</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.location})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Unit Type & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">نوع الوحدة المطلوبة: *</label>
              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="شقة سكنية فاخرة">شقة سكنية فاخرة</option>
                <option value="دوبلكس">دوبلكس</option>
                <option value="بنتهاوس مع روف">بنتهاوس مع روف</option>
                <option value="تاون هاوس">تاون هاوس</option>
                <option value="فيلا مستقلة">فيلا مستقلة</option>
                <option value="مكتب إداري">مكتب إداري</option>
                <option value="محل تجاري">محل تجاري</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">الميزانية التقديرية (بالعملة المحلية): *</label>
              <input
                type="number"
                step="50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-bold"
                required
              />
            </div>
          </div>

          {/* Row 5: Assign to Sales Agent */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">تعيين مستشار المبيعات:</label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">-- تركه غير معين للتوزيع اللاحق بنظام Round-Robin --</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name} ({a.activeLeadsCount} عميل نشط)</option>
              ))}
            </select>
          </div>

          {/* Row 6: Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">ملاحظات أولية ومواصفات خاصة:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: يفضل دور علوي، إطلالة بحرية، السداد عبر أقساط على 5 سنوات..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              تسجيل وحفظ العميل في المنظومة
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
