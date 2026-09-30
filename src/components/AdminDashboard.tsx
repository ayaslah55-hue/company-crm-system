import React from 'react';
import { 
  Users, 
  UserCheck, 
  Building, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Award, 
  ArrowUpRight, 
  DollarSign, 
  Flame,
  ArrowDownRight,
  Filter
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
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { Lead, Unit, Deal, SalesAgent } from '../types';
import { formatCurrency, formatFullCurrency, STAGE_CONFIG, SOURCE_CONFIG } from '../utils/formatters';

interface AdminDashboardProps {
  leads: Lead[];
  units: Unit[];
  deals: Deal[];
  agents: SalesAgent[];
  onNavigateToLeads: () => void;
  onNavigateToProperties: () => void;
  onNavigateToDeals: () => void;
  onOpenCustomerDetail: (leadId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  leads,
  units,
  deals,
  agents,
  onNavigateToLeads,
  onNavigateToProperties,
  onNavigateToDeals,
  onOpenCustomerDetail,
}) => {
  // Metrics calculations
  const totalLeadsCount = leads.length;
  const activeCustomersCount = leads.filter(l => l.stage !== 'closed_lost').length;
  const availableUnits = units.filter(u => u.status === 'available');
  const reservedUnits = units.filter(u => u.status === 'reserved');
  const soldUnits = units.filter(u => u.status === 'sold');
  
  const totalClosedRevenue = deals
    .filter(d => d.status === 'closed_won')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const pipelineRevenue = deals
    .filter(d => d.status === 'under_contract' || d.status === 'payment_pending')
    .reduce((sum, d) => sum + d.dealValue, 0);

  // Revenue analytics data
  const revenueTrendData = [
    { month: 'يناير', target: 20000000, revenue: 18500000 },
    { month: 'فبراير', target: 22000000, revenue: 24200000 },
    { month: 'مارس', target: 25000000, revenue: 27800000 },
    { month: 'أبريل', target: 28000000, revenue: 26500000 },
    { month: 'مايو', target: 30000000, revenue: 32400000 },
    { month: 'يونيو', target: 35000000, revenue: 38900000 },
    { month: 'يوليو', target: 40000000, revenue: 42100000 },
    { month: 'أغسطس', target: 45000000, revenue: 49500000 },
  ];

  // Lead sources data
  const sourceCounts: Record<string, number> = {};
  leads.forEach(l => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });

  const sourceData = Object.entries(sourceCounts).map(([sourceKey, count]) => {
    const config = SOURCE_CONFIG[sourceKey as keyof typeof SOURCE_CONFIG];
    return {
      name: config?.label.split(' ')[0] || sourceKey,
      fullName: config?.label || sourceKey,
      value: count,
    };
  });

  const SOURCE_COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#14b8a6', '#ef4444', '#ec4899'];

  // Pipeline funnel distribution
  const stageDistribution = [
    { stage: 'جديد (New)', count: leads.filter(l => l.stage === 'new_lead').length, color: '#38bdf8' },
    { stage: 'تواصل (Contacted)', count: leads.filter(l => l.stage === 'contacted').length, color: '#60a5fa' },
    { stage: 'مؤهل (Qualified)', count: leads.filter(l => l.stage === 'qualified').length, color: '#a78bfa' },
    { stage: 'مهتم (Interested)', count: leads.filter(l => l.stage === 'interested').length, color: '#fbbf24' },
    { stage: 'معاينة (Viewing)', count: leads.filter(l => l.stage === 'viewing_scheduled').length, color: '#22d3ee' },
    { stage: 'تفاوض (Negotiation)', count: leads.filter(l => l.stage === 'negotiation').length, color: '#fb923c' },
    { stage: 'مغلق فوز (Won)', count: leads.filter(l => l.stage === 'closed_won').length, color: '#34d399' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Welcome & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#18181B] p-6 rounded-xl border border-[#27272A]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>لوحة تحكم الإدارة التنفيذية والتحليل المالي</span>
          </div>
          <h1 className="text-xl md:text-2xl font-light text-white tracking-tight">
            نظرة عامة على أداء الشركة والمبيعات العقارية
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            متابعة حركة الـ Leads، تدفق الإيرادات، حالة مخزون الوحدات، ومعدلات تحويل فريق المبيعات.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-md bg-[#27272A]/50 border border-[#27272A] text-xs text-[#A1A1AA] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>الربع الحالي Q3 - 2026</span>
          </div>
          <button
            onClick={onNavigateToDeals}
            className="px-3.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors cursor-pointer"
          >
            سجل الصفقات ←
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid (Requested: Total Leads, Active Customers, Available Properties, Reserved Units, Sold Units, Revenue Analytics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Leads */}
        <div 
          onClick={onNavigateToLeads}
          className="bg-[#18181B] hover:border-[#3F3F46] p-5 rounded-xl border border-[#27272A] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#71717A] uppercase font-bold tracking-wider">إجمالي العملاء</span>
            <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-light text-white">{totalLeadsCount}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18% عن الشهر الماضي</span>
          </div>
        </div>

        {/* Active Customers */}
        <div 
          onClick={onNavigateToLeads}
          className="bg-[#18181B] hover:border-[#3F3F46] p-5 rounded-xl border border-[#27272A] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#71717A] uppercase font-bold tracking-wider">قيد المتابعة</span>
            <div className="w-7 h-7 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-light text-white">{activeCustomersCount}</div>
          <div className="text-[11px] text-[#71717A] mt-1">
            في مسار التفاوض والاهتمام
          </div>
        </div>

        {/* Available Properties */}
        <div 
          onClick={onNavigateToProperties}
          className="bg-[#18181B] hover:border-[#3F3F46] p-5 rounded-xl border border-[#27272A] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#71717A] uppercase font-bold tracking-wider">الوحدات المتاحة</span>
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-light text-emerald-400">{availableUnits.length}</div>
          <div className="text-[11px] text-[#71717A] mt-1">
            من إجمالي {units.length} وحدة مسجلة
          </div>
        </div>

        {/* Reserved Units */}
        <div 
          onClick={onNavigateToProperties}
          className="bg-[#18181B] hover:border-[#3F3F46] p-5 rounded-xl border border-[#27272A] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#71717A] uppercase font-bold tracking-wider">الوحدات المحجوزة</span>
            <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-light text-amber-400">{reservedUnits.length}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            بانتظار توقيع العقود
          </div>
        </div>

        {/* Sold Units */}
        <div 
          onClick={onNavigateToProperties}
          className="bg-[#18181B] hover:border-[#3F3F46] p-5 rounded-xl border border-[#27272A] transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#71717A] uppercase font-bold tracking-wider">الوحدات المباعة</span>
            <div className="w-7 h-7 rounded-md bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-light text-white">{soldUnits.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1">
            مكتملة التعاقد بالكامل
          </div>
        </div>

        {/* Total Closed Revenue */}
        <div 
          onClick={onNavigateToDeals}
          className="bg-[#18181B] hover:border-[#3F3F46] p-5 rounded-xl border border-emerald-500/30 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-emerald-400 uppercase font-bold tracking-wider">المبيعات المحققة</span>
            <div className="w-7 h-7 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-light text-white">
            {formatCurrency(totalClosedRevenue)}
          </div>
          <div className="text-[11px] text-[#71717A] mt-1">
            + {formatCurrency(pipelineRevenue)} قيد التعاقد
          </div>
        </div>
      </div>

      {/* Revenue Analytics & Lead Source Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics (2 Cols) */}
        <div className="lg:col-span-2 bg-[#18181B] p-6 rounded-xl border border-[#27272A]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-4 border-b border-[#27272A]">
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>تحليل الإيرادات والمستهدف الشهري (Revenue Analytics)</span>
              </div>
              <p className="text-xs text-[#71717A] mt-0.5">
                مقارنة المبيعات المحققة فعلياً مقابل المستهدف البيعي للشركة
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-[#E4E4E7]">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div>
                <span>المبيعات المحققة</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#71717A]">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#27272A]"></div>
                <span>المستهدف (Target)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#27272A" vertical={false} />
                <XAxis dataKey="month" stroke="#71717A" tick={{ fontSize: 12 }} />
                <YAxis 
                  stroke="#71717A" 
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `${val / 1000000}م`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px', fontSize: '12px', color: '#E4E4E7' }}
                  formatter={(val: any) => [`${(Number(val) / 1000000).toFixed(1)} مليون ج.م`, '']}
                />
                <Bar dataKey="target" fill="#27272A" radius={[4, 4, 0, 0]} name="المستهدف" />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="المحقق" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources Breakdown (1 Col) */}
        <div className="bg-[#18181B] p-6 rounded-xl border border-[#27272A] flex flex-col justify-between">
          <div>
            <div className="text-sm font-semibold text-white flex items-center justify-between mb-1">
              <span>مصادر العملاء (Lead Sources)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">{totalLeadsCount} عميل</span>
            </div>
            <p className="text-xs text-[#71717A] mb-4">
              أفضل القنوات التسويقية من حيث حجم العملاء المحتملين
            </p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px', fontSize: '12px', color: '#E4E4E7' }}
                    formatter={(val: any, name: any, item: any) => [`${val} عميل`, item.payload.fullName]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sources List */}
          <div className="space-y-1.5 mt-2 pt-3 border-t border-[#27272A]">
            {sourceData.slice(0, 4).map((src, i) => (
              <div key={src.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#A1A1AA]">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }}></div>
                  <span>{src.fullName}</span>
                </div>
                <span className="font-medium text-white">{src.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Team Performance & Pipeline Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Team Performance Leaderboard (2 Cols) */}
        <div className="lg:col-span-2 bg-[#18181B] p-6 rounded-xl border border-[#27272A]">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#27272A]">
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>أداء وترتيب فريق المبيعات (Sales Team Performance)</span>
              </div>
              <p className="text-xs text-[#71717A] mt-0.5">
                متابعة المبيعات المحققة، نسبة الإنجاز من التارجت، ومعدل التحويل (Conversion Rate)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-[#71717A] border-b border-[#27272A]">
                  <th className="py-2.5 pr-2 font-medium uppercase tracking-wider">الموظف</th>
                  <th className="py-2.5 px-3 font-medium uppercase tracking-wider">العملاء النشطين</th>
                  <th className="py-2.5 px-3 font-medium uppercase tracking-wider">المبيعات المحققة</th>
                  <th className="py-2.5 px-3 font-medium uppercase tracking-wider">المستهدف الشهري</th>
                  <th className="py-2.5 px-3 font-medium uppercase tracking-wider">نسبة الإنجاز</th>
                  <th className="py-2.5 px-3 font-medium uppercase tracking-wider">معدل التحويل</th>
                  <th className="py-2.5 px-3 font-medium uppercase tracking-wider">التقييم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {agents.map((agent, idx) => {
                  const targetPercent = Math.min(100, Math.round((agent.achievedRevenue / agent.monthlyTarget) * 100));
                  return (
                    <tr key={agent.id} className="hover:bg-[#27272A]/40 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 text-center text-xs font-semibold text-emerald-400">
                            #{idx + 1}
                          </span>
                          <img
                            src={agent.avatar}
                            alt={agent.name}
                            className="w-7 h-7 rounded-full object-cover border border-[#27272A]"
                          />
                          <div>
                            <div className="font-semibold text-white">{agent.name}</div>
                            <div className="text-[10px] text-[#71717A]">
                              {agent.role === 'team_leader' ? 'قائد مبيعات' : 'مستشار عقاري'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-[#A1A1AA]">
                        {agent.activeLeadsCount} عميل
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {formatCurrency(agent.achievedRevenue)}
                      </td>
                      <td className="py-3 px-3 text-[#71717A]">
                        {formatCurrency(agent.monthlyTarget)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-[#27272A] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                targetPercent >= 90 ? 'bg-emerald-500' : targetPercent >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${targetPercent}%` }}
                            />
                          </div>
                          <span className="font-medium text-white">{targetPercent}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-400">
                        {agent.conversionRate}%
                      </td>
                      <td className="py-3 px-3 text-amber-400 font-medium">
                        ★ {agent.rating}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pipeline Stage Distribution (1 Col) */}
        <div className="bg-[#18181B] p-6 rounded-xl border border-[#27272A]">
          <div className="text-sm font-semibold text-white mb-1">
            مراحل تدفق العملاء (Pipeline Stages)
          </div>
          <p className="text-xs text-[#71717A] mb-4">
            توزيع العملاء الفعلي على مسار البيع حتى إغلاق الصفقة
          </p>

          <div className="space-y-3">
            {stageDistribution.map((item) => {
              const pct = totalLeadsCount > 0 ? Math.round((item.count / totalLeadsCount) * 100) : 0;
              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A1A1AA]">{item.stage}</span>
                    <span className="font-medium text-white">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(5, pct)}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onNavigateToLeads}
            className="w-full mt-6 py-2 rounded-md bg-[#27272A] hover:bg-[#3F3F46] text-xs font-semibold text-[#E4E4E7] transition-colors text-center block cursor-pointer"
          >
            فتح لوحة الـ Pipeline التفاعلية (Kanban) ←
          </button>
        </div>
      </div>
    </div>
  );
};
