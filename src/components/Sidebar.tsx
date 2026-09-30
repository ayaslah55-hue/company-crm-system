import React from 'react';
import { 
  LayoutDashboard, 
  Users2, 
  Target, 
  KanbanSquare, 
  Building, 
  Handshake, 
  BarChart3, 
  UserCheck, 
  Sparkles,
  Layers,
  PhoneForwarded,
  HelpCircle,
  HardHat
} from 'lucide-react';
import { Role } from '../types';

export type ActiveTab = 
  | 'admin_dashboard' 
  | 'team_leader_dashboard' 
  | 'sales_dashboard' 
  | 'leads' 
  | 'properties' 
  | 'deals' 
  | 'reports'
  | 'execution';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentRole: Role;
  unassignedLeadsCount: number;
  myFollowUpsCount: number;
  availableUnitsCount: number;
  activeDealsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  unassignedLeadsCount,
  myFollowUpsCount,
  availableUnitsCount,
  activeDealsCount,
}) => {
  return (
    <aside className="w-64 bg-[#0A0A0B] border-l border-[#27272A] flex flex-col shrink-0 min-h-[calc(100vh-53px)] select-none">
      {/* Workflow pill banner */}
      <div className="p-4 border-b border-[#27272A]">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>دورة المبيعات العقارية</span>
        </div>
        <p className="text-[11px] text-[#71717A] leading-relaxed">
          التقاط الـ Lead ← توزيع الفريق ← المتابعة والمعاينة ← حجز الوحدة ← إتمام الصفقة
        </p>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Dashboards Category */}
        <div>
          <div className="px-3 text-xs font-semibold text-[#52525B] uppercase tracking-wider mb-2">
            لوحات المتابعة والتحكم
          </div>
          <div className="space-y-1">
            {/* Admin Dashboard */}
            <button
              onClick={() => setActiveTab('admin_dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'admin_dashboard'
                  ? 'bg-[#18181B] text-white border border-[#27272A]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${activeTab === 'admin_dashboard' ? 'bg-emerald-500/20 border border-emerald-500/40' : 'border border-[#3F3F46]'}`}>
                  <LayoutDashboard className={`w-3 h-3 ${activeTab === 'admin_dashboard' ? 'text-emerald-400' : 'text-[#71717A]'}`} />
                </div>
                <span>لوحة الإدارة التنفيذية</span>
              </div>
              {currentRole === 'admin' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  الرئيسية
                </span>
              )}
            </button>

            {/* Team Leader Dashboard */}
            <button
              onClick={() => setActiveTab('team_leader_dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'team_leader_dashboard'
                  ? 'bg-[#18181B] text-white border border-[#27272A]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${activeTab === 'team_leader_dashboard' ? 'bg-emerald-500/20 border border-emerald-500/40' : 'border border-[#3F3F46]'}`}>
                  <Users2 className={`w-3 h-3 ${activeTab === 'team_leader_dashboard' ? 'text-emerald-400' : 'text-[#71717A]'}`} />
                </div>
                <span>لوحة قائد الفريق (TL)</span>
              </div>
              {unassignedLeadsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
                  {unassignedLeadsCount} للتوزيع
                </span>
              )}
            </button>

            {/* Sales Agent Dashboard */}
            <button
              onClick={() => setActiveTab('sales_dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'sales_dashboard'
                  ? 'bg-[#18181B] text-white border border-[#27272A]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${activeTab === 'sales_dashboard' ? 'bg-emerald-500/20 border border-emerald-500/40' : 'border border-[#3F3F46]'}`}>
                  <Target className={`w-3 h-3 ${activeTab === 'sales_dashboard' ? 'text-emerald-400' : 'text-[#71717A]'}`} />
                </div>
                <span>لوحة موظف المبيعات</span>
              </div>
              {myFollowUpsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {myFollowUpsCount} اليوم
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Operational Modules Category */}
        <div>
          <div className="px-3 text-xs font-semibold text-[#52525B] uppercase tracking-wider mb-2">
            العمليات الميدانية
          </div>
          <div className="space-y-1">
            {/* Lead Management & Pipeline */}
            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-[#18181B] text-white border border-[#27272A]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${activeTab === 'leads' ? 'bg-emerald-500/20 border border-emerald-500/40' : 'border border-[#3F3F46]'}`}>
                  <KanbanSquare className={`w-3 h-3 ${activeTab === 'leads' ? 'text-emerald-400' : 'text-[#71717A]'}`} />
                </div>
                <span>إدارة العملاء والـ Pipeline</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#27272A] text-[#A1A1AA]">
                7 مراحل
              </span>
            </button>

            {/* Properties & Projects Management */}
            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'properties'
                  ? 'bg-[#18181B] text-white border border-[#27272A]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${activeTab === 'properties' ? 'bg-emerald-500/20 border border-emerald-500/40' : 'border border-[#3F3F46]'}`}>
                  <Building className={`w-3 h-3 ${activeTab === 'properties' ? 'text-emerald-400' : 'text-[#71717A]'}`} />
                </div>
                <span>المشاريع والوحدات العقارية</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                {availableUnitsCount} متاح
              </span>
            </button>

            {/* Deal Management */}
            <button
              onClick={() => setActiveTab('deals')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'deals'
                  ? 'bg-[#18181B] text-white border border-[#27272A]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${activeTab === 'deals' ? 'bg-emerald-500/20 border border-emerald-500/40' : 'border border-[#3F3F46]'}`}>
                  <Handshake className={`w-3 h-3 ${activeTab === 'deals' ? 'text-emerald-400' : 'text-[#71717A]'}`} />
                </div>
                <span>إدارة الصفقات والحجوزات</span>
              </div>
              {activeDealsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  {activeDealsCount}
                </span>
              )}
            </button>

            {/* Reports & Analytics */}
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#18181B] text-white border border-[#27272A]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${activeTab === 'reports' ? 'bg-emerald-500/20 border border-emerald-500/40' : 'border border-[#3F3F46]'}`}>
                  <BarChart3 className={`w-3 h-3 ${activeTab === 'reports' ? 'text-emerald-400' : 'text-[#71717A]'}`} />
                </div>
                <span>التقارير وتحليلات المبيعات</span>
              </div>
            </button>

            {/* Execution & Property Finishing Module */}
            <button
              onClick={() => setActiveTab('execution')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'execution'
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${activeTab === 'execution' ? 'bg-emerald-500/30 border border-emerald-400' : 'border border-[#3F3F46]'}`}>
                  <HardHat className={`w-3 h-3 ${activeTab === 'execution' ? 'text-emerald-400' : 'text-[#71717A]'}`} />
                </div>
                <span>التشطيب والتنفيذ الإنشائي</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                14 مرحلة
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3.5 m-3 rounded-xl bg-[#18181B] border border-[#27272A]">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>تكامل مصادر الـ Leads</span>
        </div>
        <p className="text-[11px] text-[#71717A] leading-relaxed">
          متصل بـ Facebook Webhook وWhatsApp API والموقع الإلكتروني لتسجيل العملاء آلياً.
        </p>
      </div>
    </aside>
  );
};
