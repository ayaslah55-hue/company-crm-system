import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2,
  DollarSign,
  Filter,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Lead, Deal, Project, SalesAgent } from '../types';
import { formatCurrency, formatFullCurrency, SOURCE_CONFIG } from '../utils/formatters';

interface ReportsViewProps {
  leads: Lead[];
  deals: Deal[];
  projects: Project[];
  agents: SalesAgent[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  leads,
  deals,
  projects,
  agents,
}) => {
  // Sales by Project
  const projectRevenueData = projects.map(proj => {
    const projectDeals = deals.filter(d => d.projectId === proj.id);
    const revenue = projectDeals.reduce((sum, d) => sum + d.dealValue, 0);
    return {
      name: proj.name.split(' ')[0] + ' ' + (proj.name.split(' ')[1] || ''),
      fullName: proj.name,
      revenue: revenue,
      dealsCount: projectDeals.length,
    };
  });

  // Source conversion metrics
  const sourceStats = Object.keys(SOURCE_CONFIG).map(sourceKey => {
    const sourceLeads = leads.filter(l => l.source === sourceKey);
    const wonLeads = sourceLeads.filter(l => l.stage === 'closed_won');
    const conversionRate = sourceLeads.length > 0 
      ? Math.round((wonLeads.length / sourceLeads.length) * 100) 
      : 0;

    return {
      sourceKey,
      label: SOURCE_CONFIG[sourceKey as keyof typeof SOURCE_CONFIG]?.label || sourceKey,
      totalLeads: sourceLeads.length,
      closedWon: wonLeads.length,
      conversionRate,
    };
  }).filter(s => s.totalLeads > 0);

  const handleExportSummary = () => {
    const content = `تقرير مبيعات دار العقار CRM
تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-EG')}
إجمالي العملاء: ${leads.length}
إجمالي الصفقات: ${deals.length}
إجمالي المبيعات المحققة: ${deals.filter(d => d.status === 'closed_won').reduce((s, d) => s + d.dealValue, 0)} ج.م
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sales_report_${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/85 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>التقارير التحليلية والذكاء البيعي (Sales & Marketing Intelligence)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            تحليل كفاءة التسويق، الإيرادات بالمشاريع، ومعدلات الإغلاق
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            تقارير تفصيلية تدعم قرارات الإدارة في توجيه الميزانيات الإعلانية ومتابعة عائد الاستثمار (ROI).
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>تصدير تقرير الإدارة</span>
        </button>
      </div>

      {/* Revenue by Project Chart */}
      <div className="bg-slate-900/85 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>حجم المبيعات حسب المشروع العقاري (Sales Revenue per Project)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              مقارنة الإيرادات الناتجة عن كل مشروع وعدد الصفقات المبرمة
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectRevenueData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis 
                stroke="#64748b" 
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `${val / 1000000}م`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: any) => [`${formatCurrency(Number(val))}`, 'إجمالي المبيعات']}
              />
              <Bar dataKey="revenue" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Marketing Source ROI & Efficiency */}
      <div className="bg-slate-900/85 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="mb-4 pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>كفاءة القنوات الإعلانية ومعدل الإغلاق (Lead Sources ROI & Conversion)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تحديد القنوات الأكثر ربحية وتوليداً للعملاء المؤهلين الذين أتموا التعاقد
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="py-2.5 pr-2 font-medium">مصدر العميل (Channel)</th>
                <th className="py-2.5 px-3 font-medium">إجمالي الـ Leads</th>
                <th className="py-2.5 px-3 font-medium">الصفقات المكتملة</th>
                <th className="py-2.5 px-3 font-medium">معدل التحويل النهائي</th>
                <th className="py-2.5 px-3 font-medium">تقييم الكفاءة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sourceStats.map(s => (
                <tr key={s.sourceKey} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pr-2 font-semibold text-white">
                    {s.label}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-300">
                    {s.totalLeads} عميل
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    {s.closedWon} صفقات
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-amber-400" 
                          style={{ width: `${Math.max(10, s.conversionRate * 3)}%` }}
                        />
                      </div>
                      <span className="font-bold text-white">{s.conversionRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      s.conversionRate >= 20 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {s.conversionRate >= 20 ? 'عائد ممتاز (High ROI)' : 'متوسط (Average)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
