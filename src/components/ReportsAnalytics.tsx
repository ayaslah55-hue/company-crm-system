import React from 'react';
import { useCRM } from '../context/CRMContext';
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Award, 
  Share2, 
  Users, 
  Percent, 
  Download,
  Calendar
} from 'lucide-react';
import { formatCurrency, formatCompactNumber, SOURCE_CONFIG } from '../utils/translations';

const SOURCE_COLORS: Record<string, string> = {
  facebook_ads: '#3b82f6',
  website: '#10b981',
  whatsapp: '#22c55e',
  calls: '#f59e0b',
  referral: '#8b5cf6'
};

export const ReportsAnalytics: React.FC = () => {
  const { leads, deals, agents } = useCRM();

  // 1. Total revenue
  const totalRevenue = deals
    .filter(d => d.status === 'completed' || d.status === 'contract_signed')
    .reduce((acc, curr) => acc + curr.dealValue, 0);

  const totalWonDeals = deals.filter(d => d.status === 'completed' || d.status === 'contract_signed').length;
  const avgDealSize = totalWonDeals > 0 ? Math.round(totalRevenue / totalWonDeals) : 0;
  const overallConversion = leads.length > 0 ? ((totalWonDeals / leads.length) * 100).toFixed(1) : '0.0';

  // 2. Source breakdown
  const sourceStats = Object.keys(SOURCE_CONFIG).map(srcKey => {
    const srcLeads = leads.filter(l => l.source === srcKey);
    const wonLeads = srcLeads.filter(l => l.stage === 'closed_won');
    const qualifiedLeads = srcLeads.filter(l => l.stage !== 'new_lead' && l.stage !== 'contacted');
    const convRate = srcLeads.length > 0 ? ((wonLeads.length / srcLeads.length) * 100).toFixed(1) : '0.0';
    const totalSourceBudget = srcLeads.reduce((acc, curr) => acc + curr.budget, 0);

    return {
      key: srcKey,
      name: SOURCE_CONFIG[srcKey].labelAr,
      count: srcLeads.length,
      won: wonLeads.length,
      qualified: qualifiedLeads.length,
      convRate: Number(convRate),
      totalBudget: totalSourceBudget,
      color: SOURCE_COLORS[srcKey] || '#64748b'
    };
  });

  // 3. Agent Performance data for chart
  const agentChartData = agents.map(a => ({
    name: a.name.split(' ')[0],
    fullName: a.name,
    revenue: a.totalRevenue / 1000000, // in Millions
    deals: a.closedDealsCount,
    rate: a.conversionRate
  }));

  // 4. Monthly Trend mock
  const monthlyData = [
    { month: 'يناير', sales: 4.2 },
    { month: 'فبراير', sales: 6.8 },
    { month: 'مارس', sales: 8.5 },
    { month: 'أبريل', sales: 7.9 },
    { month: 'مايو', sales: 11.2 },
    { month: 'يونيو', sales: 14.5 }
  ];

  return (
    <div id="reports-analytics-view" className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>تقارير وتحليلات المبيعات الذكية (Sales Analytics)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مؤشرات أداء قنوات الاستقطاب التسويقية، نمو الإيرادات، ومعدلات تحويل فريق المبيعات
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>تصدير التقرير PDF</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800/90 shadow-md">
          <span className="text-xs font-semibold text-slate-400">إجمالي الإيرادات المحققة</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-300">{formatCompactNumber(totalRevenue)}</span>
            <span className="text-xs text-slate-400">ريال</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">عبر {totalWonDeals} صفقات ناجحة</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800/90 shadow-md">
          <span className="text-xs font-semibold text-slate-400">متوسط قيمة الصفقة (Deal Size)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-300">{formatCompactNumber(avgDealSize)}</span>
            <span className="text-xs text-slate-400">ريال</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">للوحدات السكنية والتجارية</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800/90 shadow-md">
          <span className="text-xs font-semibold text-slate-400">معدل التحويل الكلي (Win Rate)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-300">{overallConversion}%</span>
            <span className="text-xs font-bold text-purple-400">إغلاق ناجح</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">من إجمالي {leads.length} عميل محتمل</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800/90 shadow-md">
          <span className="text-xs font-semibold text-slate-400">القناة التسويقية الأكثر كفاءة</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-400">WhatsApp</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">أعلى سرعة استجابة ومعدل إغلاق</p>
        </div>
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue by Sales Agent */}
        <div className="p-6 rounded-2xl bg-[#0f1728] border border-slate-800/90 shadow-lg">
          <h3 className="text-base font-bold text-slate-100 mb-1">إيرادات مستشاري المبيعات (بالملايين)</h3>
          <p className="text-xs text-slate-400 mb-4">مقارنة حجم المبيعات المحققة لكل موظف</p>

          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b101c', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }} 
                  formatter={(val: any) => [`${val} مليون ريال`, 'المبيعات']}
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Lead Sources Distribution Pie */}
        <div className="p-6 rounded-2xl bg-[#0f1728] border border-slate-800/90 shadow-lg">
          <h3 className="text-base font-bold text-slate-100 mb-1">توزيع استفسارات العملاء حسب القناة</h3>
          <p className="text-xs text-slate-400 mb-4">نسب الإقبال من المنصات الإعلانية وموقع الويب</p>

          <div className="h-64 w-full flex items-center justify-center" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {sourceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b101c', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }} 
                  formatter={(val: any, name: any, item: any) => [`${val} عميل`, item.payload.name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {sourceStats.map(s => (
              <div key={s.key} className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span>{s.name} ({s.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sources Performance Analysis Detailed Table */}
      <div className="p-6 rounded-2xl bg-[#0f1728] border border-slate-800/90 shadow-lg">
        <h3 className="text-base font-bold text-slate-100 mb-1">جدول كفاءة قنوات التسويق والإعلانات (Lead Sources Performance)</h3>
        <p className="text-xs text-slate-400 mb-4">تحليل الجدوى والعائد من كل قناة إعلانية</p>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#0b101c] text-slate-400 border-b border-slate-800 font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">القناة التسويقية</th>
                <th className="py-3 px-4">إجمالي العملاء</th>
                <th className="py-3 px-4">العملاء المؤهلين</th>
                <th className="py-3 px-4">الصفقات الرابحة</th>
                <th className="py-3 px-4">حجم الميزانيات</th>
                <th className="py-3 px-4">معدل التحويل (Conversion)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {sourceStats.map((src) => (
                <tr key={src.key} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                    <span className="text-slate-100">{src.name}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{src.count} عميل</td>
                  <td className="py-3 px-4 text-slate-300">{src.qualified}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{src.won} صفقات</td>
                  <td className="py-3 px-4 font-extrabold text-amber-300">{formatCompactNumber(src.totalBudget)} ريال</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-slate-100">
                      {src.convRate}%
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
