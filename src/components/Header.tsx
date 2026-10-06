import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  UserCheck, 
  PlusCircle, 
  PhoneCall, 
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Users,
  Briefcase
} from 'lucide-react';
import { Role, SalesAgent, FollowUpReminder } from '../types';

interface HeaderProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  agents: SalesAgent[];
  currentAgentId: string;
  setCurrentAgentId: (id: string) => void;
  followUps: FollowUpReminder[];
  onOpenNewLead: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCustomerDetail?: (leadId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  agents,
  currentAgentId,
  setCurrentAgentId,
  followUps,
  onOpenNewLead,
  searchQuery,
  setSearchQuery,
  onOpenCustomerDetail,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const pendingFollowUps = followUps.filter(f => !f.isCompleted);
  const currentAgent = agents.find(a => a.id === currentAgentId) || agents[1];

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0B] border-b border-[#27272A] px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left / Start: Title & Role Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black text-sm shrink-0">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-white">RE-PRO <span className="text-emerald-500">CRM</span></span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded border border-emerald-500/20">
                  SYSTEM ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#71717A] hidden sm:block">
                دار العقار • إدارة المبيعات والتسويق العقاري
              </p>
            </div>
          </div>

          {/* Quick Role Switcher Pill */}
          <div className="relative mr-4 hidden md:block">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] text-xs text-[#E4E4E7] transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[#71717A]">الدور:</span>
              <span className="font-medium text-white">
                {currentRole === 'admin' && 'المدير التنفيذي (Admin)'}
                {currentRole === 'team_leader' && 'قائد الفريق (TL)'}
                {currentRole === 'sales_agent' && `مستشار مبيعات (${currentAgent.name})`}
              </span>
              <span className="text-[10px] text-[#71717A]">▼</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#18181B] border border-[#27272A] shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] text-[#71717A] font-semibold border-b border-[#27272A]">
                  تبديل الحساب والدور
                </div>
                <button
                  onClick={() => {
                    setCurrentRole('admin');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-right text-xs hover:bg-[#27272A]/50 transition-colors ${currentRole === 'admin' ? 'bg-[#27272A] text-emerald-400 font-semibold' : 'text-[#E4E4E7]'}`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div>المدير العام (Executive Admin)</div>
                    <div className="text-[10px] text-[#71717A]">رؤية كاملة لجميع المشاريع والمبيعات</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('team_leader');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-right text-xs hover:bg-[#27272A]/50 transition-colors ${currentRole === 'team_leader' ? 'bg-[#27272A] text-emerald-400 font-semibold' : 'text-[#E4E4E7]'}`}
                >
                  <Users className="w-4 h-4 text-blue-400" />
                  <div>
                    <div>قائد الفريق (Team Leader)</div>
                    <div className="text-[10px] text-[#71717A]">توزيع الـ Leads ومتابعة أداء الفريق</div>
                  </div>
                </button>
                <div className="border-t border-[#27272A] my-1"></div>
                <div className="px-3 py-1 text-[11px] text-[#71717A]">حسابات موظفي المبيعات:</div>
                {agents.filter(a => a.role === 'sales_agent').map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setCurrentRole('sales_agent');
                      setCurrentAgentId(agent.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-right text-xs hover:bg-[#27272A]/50 transition-colors ${currentRole === 'sales_agent' && currentAgentId === agent.id ? 'bg-[#27272A] text-emerald-400 font-semibold' : 'text-[#E4E4E7]'}`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>{agent.name}</span>
                    <span className="text-[10px] text-[#71717A] mr-auto">({agent.activeLeadsCount} عميل)</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Universal Search */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="البحث عن عميل، مشروع، أو كود وحدة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-1.5 rounded-md bg-[#18181B] border border-[#27272A] focus:border-emerald-500 text-xs text-[#E4E4E7] placeholder-[#71717A] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right / End: Actions */}
        <div className="flex items-center gap-2.5">
          {/* New Lead Button */}
          <button
            onClick={onOpenNewLead}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تسجيل عميل جديد</span>
          </button>

          {/* Follow-up Reminders Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
              title="تنبيهات مواعيد المتابعة"
            >
              <Bell className="w-4 h-4" />
              {pendingFollowUps.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black font-bold text-[10px] flex items-center justify-center">
                  {pendingFollowUps.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-0 mt-2 w-80 rounded-xl bg-[#18181B] border border-[#27272A] shadow-2xl py-3 z-50">
                <div className="px-4 pb-2 border-b border-[#27272A] flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    مواعيد المتابعة اليوم (Follow-ups)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#27272A] text-[#A1A1AA]">
                    {pendingFollowUps.length} متبقي
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#27272A]">
                  {pendingFollowUps.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#71717A]">
                      لا توجد متابعات متأخرة أو قادمة اليوم
                    </div>
                  ) : (
                    pendingFollowUps.map(fup => (
                      <div 
                        key={fup.id} 
                        className="p-3 hover:bg-[#27272A]/40 transition-colors cursor-pointer text-right"
                        onClick={() => {
                          if (onOpenCustomerDetail) onOpenCustomerDetail(fup.leadId);
                          setShowNotifications(false);
                        }}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-white">{fup.leadName}</span>
                          <span className="text-[11px] text-[#71717A] font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#71717A]" />
                            {fup.scheduledTime}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A1A1AA] line-clamp-2">{fup.note}</p>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#27272A]/60 text-[10px]">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <PhoneCall className="w-3 h-3" />
                            {fup.leadPhone}
                          </span>
                          <span className="text-[#A1A1AA] hover:text-white">عرض العميل ←</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile avatar */}
          <div className="flex items-center gap-2.5 border-r border-[#27272A] pr-2.5">
            <img
              src={currentAgent.avatar}
              alt={currentAgent.name}
              className="w-8 h-8 rounded-full object-cover border border-[#27272A]"
            />
            <div className="hidden xl:block text-right">
              <div className="text-xs font-semibold text-white leading-tight">{currentAgent.name}</div>
              <div className="text-[10px] text-[#71717A]">
                {currentRole === 'admin' ? 'مدير تنفيذي' : currentRole === 'team_leader' ? 'قائد مبيعات' : 'مستشار عقاري'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
