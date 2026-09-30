import React, { useState } from 'react';
import { 
  Handshake, 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  FileText, 
  DollarSign, 
  Building, 
  Users, 
  Calendar, 
  Award,
  ChevronDown,
  X
} from 'lucide-react';
import { Deal, Lead, Unit, SalesAgent, DealStatus } from '../types';
import { formatCurrency, formatFullCurrency, DEAL_STATUS_CONFIG } from '../utils/formatters';

interface DealManagementProps {
  deals: Deal[];
  leads: Lead[];
  units: Unit[];
  agents: SalesAgent[];
  onCreateDeal: (dealData: Omit<Deal, 'id' | 'dealNumber' | 'createdAt'>) => void;
  onUpdateDealStatus: (dealId: string, status: DealStatus) => void;
}

export const DealManagement: React.FC<DealManagementProps> = ({
  deals,
  leads,
  units,
  agents,
  onCreateDeal,
  onUpdateDealStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New deal form
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(units[0]?.id || '');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [dealValue, setDealValue] = useState<number>(units[0]?.price || 2500000);
  const [commissionRate, setCommissionRate] = useState<number>(2.5);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'installments' | 'mortgage'>('installments');
  const [closingDate, setClosingDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  // Calculations
  const totalRevenueWon = deals
    .filter(d => d.status === 'closed_won')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const totalPipelineValue = deals
    .filter(d => d.status === 'under_contract' || d.status === 'payment_pending')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const totalCommissions = deals
    .filter(d => d.status === 'closed_won')
    .reduce((sum, d) => sum + d.commissionValue, 0);

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    if (statusFilter !== 'all' && deal.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCustomer = deal.customerName.toLowerCase().includes(q);
      const matchNumber = deal.dealNumber.toLowerCase().includes(q);
      const matchProject = deal.projectName.toLowerCase().includes(q);
      const matchUnit = deal.unitNumber.toLowerCase().includes(q);
      if (!matchCustomer && !matchNumber && !matchProject && !matchUnit) return false;
    }
    return true;
  });

  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    const targetUnit = units.find(u => u.id === unitId);
    if (targetUnit) {
      setDealValue(targetUnit.price);
    }
  };

  const handleSubmitNewDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === selectedLeadId);
    const unit = units.find(u => u.id === selectedUnitId);
    const agent = agents.find(a => a.id === selectedAgentId);

    if (!lead || !unit || !agent) return;

    const commVal = Math.round(dealValue * (commissionRate / 100));

    onCreateDeal({
      dealTitle: `بيع ${unit.unitNumber} - ${lead.name}`,
      leadId: lead.id,
      customerName: lead.name,
      customerPhone: lead.phone,
      unitId: unit.id,
      unitNumber: unit.unitNumber,
      projectName: unit.projectName,
      agentId: agent.id,
      agentName: agent.name,
      dealValue,
      commissionRate,
      commissionValue: commVal,
      status: 'under_contract',
      expectedClosingDate: closingDate,
      paymentMethod,
      notes,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-amber-500/15 via-slate-900 to-[#0c121e] border border-amber-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5" />
              إدارة الصفقات والتعاقدات (Deal & Contract Management)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">
            متابعة مراحل إغلاق الصفقات، تدفق العقود، وحساب العمولات
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            إجمالي الصفقات المفتوحة: <strong className="text-amber-400 font-bold">{deals.length} صفقة</strong> بقيمة إجمالية تتجاوز {formatCurrency(totalRevenueWon + totalPipelineValue)}.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>إنشاء صفقة تعاقد جديدة</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">إجمالي الصفقات المغلقة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{deals.filter(d => d.status === 'closed_won').length}</span>
            <span className="text-xs text-slate-400">صفقة ناجحة</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2">عقود موقعة ومكتملة</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">المبيعات المحققة فعلياً</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-300">{formatCurrency(totalRevenueWon)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">إجمالي الإيراد المحصل</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">قيمة صفقات قيد الإغلاق</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-300">{formatCurrency(totalPipelineValue)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">بانتظار استكمال الدفعات والعقود</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">إجمالي العمولات المكتسبة</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-300">{formatCurrency(totalCommissions)}</span>
          </div>
          <p className="text-[11px] text-purple-400/80 mt-2">مستحقة لفريق المبيعات</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0f1728] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث بكود الصفقة، العميل، المشروع، رقم الوحدة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({deals.length})
          </button>
          <button
            onClick={() => setStatusFilter('under_contract')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'under_contract' ? 'bg-amber-500 text-slate-950' : 'text-amber-400 hover:text-white'
            }`}
          >
            تجهيز العقد
          </button>
          <button
            onClick={() => setStatusFilter('payment_pending')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'payment_pending' ? 'bg-sky-500 text-slate-950' : 'text-sky-400 hover:text-white'
            }`}
          >
            بانتظار الدفعة
          </button>
          <button
            onClick={() => setStatusFilter('closed_won')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'closed_won' ? 'bg-emerald-500 text-slate-950' : 'text-emerald-400 hover:text-white'
            }`}
          >
            مكتملة (Won)
          </button>
          <button
            onClick={() => setStatusFilter('closed_lost')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'closed_lost' ? 'bg-rose-500 text-slate-950' : 'text-rose-400 hover:text-white'
            }`}
          >
            ملغاة
          </button>
        </div>
      </div>

      {/* Deals Table */}
      <div className="p-6 rounded-2xl bg-[#0f1728] border border-slate-800 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#0b101c] text-slate-400 border-b border-slate-800 font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">رقم الصفقة والعميل</th>
                <th className="py-3.5 px-4">الوحدة والمشروع</th>
                <th className="py-3.5 px-4">مستشار المبيعات</th>
                <th className="py-3.5 px-4">قيمة الصفقة</th>
                <th className="py-3.5 px-4">العمولة المستحقة</th>
                <th className="py-3.5 px-4">طريقة السداد</th>
                <th className="py-3.5 px-4">الحالة ومرحلة التعاقد</th>
                <th className="py-3.5 px-4">تحديث الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredDeals.map((deal) => {
                const statusConfig = DEAL_STATUS_CONFIG[deal.status];

                return (
                  <tr key={deal.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-extrabold text-white block">{deal.dealNumber}</span>
                        <span className="text-slate-300 font-semibold">{deal.customerName}</span>
                        <span className="text-[10px] text-slate-500 font-mono block" dir="ltr">{deal.customerPhone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-amber-300 block">{deal.unitNumber}</span>
                        <span className="text-[11px] text-slate-400">{deal.projectName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {deal.agentName}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-emerald-400">
                      {formatCurrency(deal.dealValue)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-purple-300">{formatCurrency(deal.commissionValue)}</div>
                      <span className="text-[10px] text-slate-400">({deal.commissionRate}%)</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {deal.paymentMethod === 'cash' ? 'سداد فوري (كاش)' :
                       deal.paymentMethod === 'installments' ? 'أقساط سنوية' : 'تمويل بنكي'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${statusConfig?.bg || 'bg-slate-800'} ${statusConfig?.color || 'text-slate-300'}`}>
                        {statusConfig?.label || deal.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={deal.status}
                        onChange={(e) => onUpdateDealStatus(deal.id, e.target.value as DealStatus)}
                        className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="under_contract">تجهيز العقد</option>
                        <option value="payment_pending">بانتظار الدفعة</option>
                        <option value="closed_won">إتمام البيع (فوز) ✓</option>
                        <option value="closed_lost">إلغاء الصفقة ✕</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f1728] border border-amber-500/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">إنشاء صفقة تعاقد عقارية جديدة</h3>
                <p className="text-xs text-slate-400 mt-0.5">ربط العميل المحتمل بالوحدة وتحديد شروط وقيمة البيع</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewDeal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">العميل (Lead):</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.name} - ({l.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">الوحدة العقارية:</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.unitNumber} - {u.projectName} ({formatCurrency(u.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">مستشار المبيعات المسؤول:</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">قيمة الصفقة الإجمالية:</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نسبة العمولة (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">طريقة السداد:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="installments">أقساط سنوية</option>
                    <option value="cash">سداد فوري (كاش)</option>
                    <option value="mortgage">تمويل بنكي عقاري</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تاريخ الإغلاق المتوقع:</label>
                  <input
                    type="date"
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ملاحظات وشروط التعاقد:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تفاصيل خاصة بدفعات السداد أو الملحقات..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-colors"
                >
                  حفظ وتوثيق الصفقة
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
