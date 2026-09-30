import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Filter, 
  Search, 
  Layers, 
  CreditCard 
} from 'lucide-react';
import { ExecutionCostItem } from '../../types/execution';

interface ExecutionCostsProps {
  costs: ExecutionCostItem[];
}

export const ExecutionCosts: React.FC<ExecutionCostsProps> = ({ costs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const totalBudget = costs.reduce((acc, c) => acc + c.estimatedCost, 0);
  const totalActual = costs.reduce((acc, c) => acc + c.actualCost, 0);
  const totalPaid = costs.reduce((acc, c) => acc + c.paidAmount, 0);
  const totalRemaining = costs.reduce((acc, c) => acc + c.remainingAmount, 0);
  const totalVariance = totalBudget - totalActual; // Positive = under budget (savings), Negative = over budget

  const filteredCosts = costs.filter((c) => {
    const matchesSearch = 
      c.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.projectName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatEGP = (val: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(val);
  };

  const getStatusBadge = (status: ExecutionCostItem['status']) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">مسدد بالكامل</span>;
      case 'partially_paid':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">مسدد جزئياً</span>;
      case 'overdue':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">مستحق متأخر</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">قيد المراجعة</span>;
    }
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>المتابعة المالية ومستخلصات التنفيذ</span>
            </span>
            <span className="text-xs text-slate-400">• تدقيق الميزانيات وتكاليف التشطيب</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            تكاليف التشطيب وميزانيات المشاريع الإنشائية
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            مقارنة الميزانيات التقديرية بالمصروف الفعلي، نسب الانحراف، والمستخلصات المسددة للمقاولين.
          </p>
        </div>

        <button
          onClick={() => alert('تم تصدير التقرير المالي الشامل بصيغة PDF / Excel')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>تصدير التقرير المالي</span>
        </button>
      </div>

      {/* 5 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <span className="text-slate-400 text-xs block">الميزانية التقديرية الإجمالية:</span>
          <div className="text-xl font-black text-slate-900 mt-2">{formatEGP(totalBudget)}</div>
          <span className="text-[11px] text-slate-400 block mt-1">مجموع بنود التشطيب المعتمدة</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <span className="text-slate-400 text-xs block">المنصرف الفعلي (Spent):</span>
          <div className="text-xl font-black text-emerald-700 mt-2">{formatEGP(totalActual)}</div>
          <span className="text-[11px] text-emerald-600 block mt-1">
            {Math.round((totalActual / totalBudget) * 100)}% من الميزانية
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <span className="text-slate-400 text-xs block">المسدد للمقاولين (Paid):</span>
          <div className="text-xl font-black text-blue-700 mt-2">{formatEGP(totalPaid)}</div>
          <span className="text-[11px] text-blue-600 block mt-1">مستخلصات معتمدة ومصروفة</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <span className="text-slate-400 text-xs block">مستخلصات معلقة (Pending):</span>
          <div className="text-xl font-black text-amber-700 mt-2">{formatEGP(totalRemaining)}</div>
          <span className="text-[11px] text-amber-600 block mt-1">بانتظار اعتماد الاستشاري</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <span className="text-slate-400 text-xs block">الانحراف عن الميزانية (Variance):</span>
          <div className={`text-xl font-black mt-2 ${totalVariance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {totalVariance >= 0 ? `+${formatEGP(totalVariance)} وفراً` : `${formatEGP(Math.abs(totalVariance))} زيادة`}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {totalVariance >= 0 ? 'تحت سقف الميزانية (Under budget)' : 'تجاوز للميزانية (Over budget)'}
          </span>
        </div>
      </div>

      {/* Visual Chart / Progress Bar Section for Budget vs Actual */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>المقارنة البصرية: الميزانية التقديرية مقابل الفعلي حسب البنود</span>
        </h3>

        <div className="space-y-4 pt-2">
          {costs.map((item) => {
            const percentOfBudget = Math.round((item.actualCost / item.estimatedCost) * 100);
            const isOver = percentOfBudget > 100;

            return (
              <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{item.stageName}</span>
                    <span className="text-slate-400 text-xs mr-2">({item.projectName} - المقاول: {item.contractorName})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">التقديري: <strong>{formatEGP(item.estimatedCost)}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-bold">الفعلي: <strong>{formatEGP(item.actualCost)}</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isOver ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {percentOfBudget}%
                    </span>
                  </div>
                </div>

                {/* Progress bar comparison */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOver ? 'bg-rose-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(100, percentOfBudget)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Costs Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="بحث بالمرحلة، المقاول، المشروع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">تصفية الحالة:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 outline-none"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="paid">مسدد بالكامل</option>
              <option value="partially_paid">مسدد جزئياً</option>
              <option value="pending">قيد المراجعة</option>
              <option value="overdue">متأخر</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">مرحلة التشطيب</th>
                <th className="py-3 px-4">المشروع</th>
                <th className="py-3 px-4">المقاول المسؤول</th>
                <th className="py-3 px-4">الميزانية التقديرية</th>
                <th className="py-3 px-4">المنصرف الفعلي</th>
                <th className="py-3 px-4">المسدد فعلياً</th>
                <th className="py-3 px-4">المتبقي</th>
                <th className="py-3 px-4">حالة المستخلص</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCosts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{c.stageName}</td>
                  <td className="py-3 px-4 text-slate-600">{c.projectName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{c.contractorName}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">{formatEGP(c.estimatedCost)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatEGP(c.actualCost)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{formatEGP(c.paidAmount)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{formatEGP(c.remainingAmount)}</td>
                  <td className="py-3 px-4">{getStatusBadge(c.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
