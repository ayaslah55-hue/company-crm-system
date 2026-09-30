import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { X, BadgePercent, Building, DollarSign, UserCheck, Calendar, CreditCard } from 'lucide-react';
import { DealStatus } from '../types/crm';
import { formatCurrency, DEAL_STATUS_CONFIG } from '../utils/translations';

export const NewDealModal: React.FC = () => {
  const { 
    isNewDealModalOpen, 
    setIsNewDealModalOpen, 
    leads, 
    units, 
    agents, 
    createDeal, 
    currentUser 
  } = useCRM();

  const [leadId, setLeadId] = useState(leads[0]?.id || '');
  const [unitId, setUnitId] = useState(units[0]?.id || '');
  const [agentId, setAgentId] = useState(currentUser.id);
  const [dealValue, setDealValue] = useState<number>(() => units[0]?.price || 2500000);
  const [commissionRate, setCommissionRate] = useState(2.5);
  const [status, setStatus] = useState<DealStatus>('deposit_received');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'installments' | 'mortgage'>('installments');
  const [closingDate, setClosingDate] = useState(() => {
    const d = new Date(Date.now() + 14 * 86400000);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  if (!isNewDealModalOpen) return null;

  const handleUnitChange = (uId: string) => {
    setUnitId(uId);
    const selected = units.find(u => u.id === uId);
    if (selected) {
      setDealValue(selected.price);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedLead = leads.find(l => l.id === leadId);
    const selectedUnit = units.find(u => u.id === unitId);
    const selectedAgent = agents.find(a => a.id === agentId) || currentUser;

    createDeal({
      title: `بيع وحدة ${selectedUnit?.unitCode || ''} للعميل ${selectedLead?.name || ''}`,
      leadId,
      customerName: selectedLead?.name || 'عميل',
      customerPhone: selectedLead?.phone || '',
      unitId,
      unitCode: selectedUnit?.unitCode || 'UNIT-00',
      projectName: selectedUnit?.projectName || 'مشروع سكني',
      agentId: selectedAgent.id,
      agentName: selectedAgent.name,
      dealValue: Number(dealValue),
      commissionRate: Number(commissionRate),
      status,
      paymentMethod,
      expectedClosingDate: closingDate,
      notes: notes || undefined
    });

    setIsNewDealModalOpen(false);
  };

  const calculatedCommission = Math.round(dealValue * (commissionRate / 100));

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111726] border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150 text-right">
        {/* Header */}
        <div className="p-6 bg-[#0c121e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <BadgePercent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100">إنشاء صفقة بيع عقارية جديدة</h3>
              <p className="text-xs text-slate-400">ربط العميل والوحدة ومستشار المبيعات وتوثيق القيمة المالية</p>
            </div>
          </div>

          <button
            onClick={() => setIsNewDealModalOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {/* Row 1: Select Customer */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">العميل المشتري (من قائمة الـ Leads): *</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              required
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} • ميزانية: {formatCurrency(l.budget)} ({l.code})
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: Select Unit */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">الوحدة العقارية المختارة: *</label>
            <select
              value={unitId}
              onChange={(e) => handleUnitChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer font-bold"
              required
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.unitCode} - {u.projectName} ({formatCurrency(u.price)}) [{u.status === 'available' ? 'متاحة' : 'محجوزة'}]
                </option>
              ))}
            </select>
          </div>

          {/* Row 3: Deal Value & Commission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">قيمة الصفقة الإجمالية (بالريال): *</label>
              <input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-amber-300 font-extrabold focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">نسبة العمولة (%):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-24 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-bold"
                />
                <span className="text-xs text-slate-400">
                  = <strong className="text-amber-300">{formatCurrency(calculatedCommission)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Row 4: Sales Agent & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">المستشار المسؤول: *</label>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">مرحلة / حالة الصفقة: *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DealStatus)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {Object.entries(DEAL_STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.ar}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Payment method & Closing date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">طريقة السداد المعتمدة:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="cash">سداد نقدي كامل (كاش)</option>
                <option value="installments">أقساط مجدولة مع المطور</option>
                <option value="mortgage">تمويل عقاري بنكي</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">تاريخ الإغلاق المتوقع: *</label>
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">شروط الدفع والملاحظات التعاقدية:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: دفعة أولى 15% والباقي على 3 سنوات..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
            >
              حفظ واعتماد الصفقة في النظام
            </button>

            <button
              type="button"
              onClick={() => setIsNewDealModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
