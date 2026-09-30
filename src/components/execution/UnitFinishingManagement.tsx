import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  Building, 
  ChevronLeft, 
  ArrowUpDown,
  Download,
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ExecutionUnit, ExecutionProject } from '../../types/execution';

interface UnitFinishingManagementProps {
  units: ExecutionUnit[];
  projects: ExecutionProject[];
  onSelectUnit: (unitId: string) => void;
}

export const UnitFinishingManagement: React.FC<UnitFinishingManagementProps> = ({
  units,
  projects,
  onSelectUnit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedPackage, setSelectedPackage] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [sortField, setSortField] = useState<'completionPercent' | 'targetDeliveryDate' | 'unitCode'>('completionPercent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter & Search logic
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      // Search
      const matchesSearch = 
        u.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.projectName.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by project
      const matchesProject = selectedProject === 'ALL' || u.projectId === selectedProject;

      // Filter by package
      const matchesPackage = selectedPackage === 'ALL' || u.finishingPackage === selectedPackage;

      // Filter by status
      const matchesStatus = selectedStatus === 'ALL' || u.status === selectedStatus;

      // Filter by stage
      const matchesStage = selectedStage === 'ALL' || u.currentStage === selectedStage;

      return matchesSearch && matchesProject && matchesPackage && matchesStatus && matchesStage;
    }).sort((a, b) => {
      if (sortField === 'completionPercent') {
        return sortDirection === 'asc' ? a.completionPercent - b.completionPercent : b.completionPercent - a.completionPercent;
      }
      if (sortField === 'targetDeliveryDate') {
        return sortDirection === 'asc' 
          ? a.targetDeliveryDate.localeCompare(b.targetDeliveryDate) 
          : b.targetDeliveryDate.localeCompare(a.targetDeliveryDate);
      }
      return sortDirection === 'asc' ? a.unitCode.localeCompare(b.unitCode) : b.unitCode.localeCompare(a.unitCode);
    });
  }, [units, searchTerm, selectedProject, selectedPackage, selectedStatus, selectedStage, sortField, sortDirection]);

  // Unique list of stages for dropdown
  const uniqueStages = useMemo(() => {
    const set = new Set<string>();
    units.forEach(u => set.add(u.currentStage));
    return Array.from(set);
  }, [units]);

  const getStatusBadge = (status: ExecutionUnit['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>مكتمل</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>قيد التنفيذ</span>
          </span>
        );
      case 'on_track':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>منتظم (On Track)</span>
          </span>
        );
      case 'delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>متأخر</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>لم تبدأ</span>
          </span>
        );
    }
  };

  const getPackageBadge = (pkg: string) => {
    switch (pkg) {
      case 'Ultra Luxury':
      case 'ألترا لوكس':
        return <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">الترا لوكس</span>;
      case 'Luxury':
      case 'سوبر لوكس':
        return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">سوبر لوكس</span>;
      case 'Fully Finished':
      case 'تشطيب كامل':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">تشطيب كامل</span>;
      case 'Semi Finished':
      case 'نصف تشطيب':
        return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">نصف تشطيب</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">{pkg}</span>;
    }
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>متابعة تشطيب الوحدات</span>
            </span>
            <span className="text-xs text-slate-400">• {filteredUnits.length} وحدة معروضة</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            جدول إدارة ومراحل تشطيب الوحدات السكنية
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            متابعة حالة كل وحدة، نسبة الإنجاز، المرحلة الحالية والمرحلة التالية، والمهندس المسؤول، مع إمكانية الفتح السريع.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedProject('ALL');
              setSelectedPackage('ALL');
              setSelectedStatus('ALL');
              setSelectedStage('ALL');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط الفلاتر</span>
          </button>

          <button
            onClick={() => alert('تم تصدير تقرير تشطيب الوحدات بصيغة Excel')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>تصدير كشف الوحدات</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="بحث برقم الوحدة، المالك، المشروع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">جميع المشاريع ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Package Filter */}
          <div>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">جميع باقات التشطيب</option>
              <option value="Ultra Luxury">Ultra Luxury (ألترا لوكس)</option>
              <option value="Luxury">Luxury (سوبر لوكس)</option>
              <option value="Fully Finished">Fully Finished (تشطيب كامل)</option>
              <option value="Semi Finished">Semi Finished (نصف تشطيب)</option>
              <option value="Core & Shell">Core & Shell (طوب أحمر)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="completed">مكتمل (Completed)</option>
              <option value="in_progress">قيد التنفيذ (In Progress)</option>
              <option value="waiting_approval">بانتظار الاعتماد</option>
              <option value="delayed">متأخر (Delayed)</option>
              <option value="not_started">لم تبدأ (Not Started)</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">جميع المراحل الحالية</option>
              {uniqueStages.map((stg, i) => (
                <option key={i} value={stg}>{stg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Sorting bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>يتم عرض <strong>{filteredUnits.length}</strong> وحدة من إجمالي <strong>{units.length}</strong> وحدة</span>
          <div className="flex items-center gap-2">
            <span>ترتيب حسب:</span>
            <button
              onClick={() => {
                if (sortField === 'completionPercent') {
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('completionPercent');
                  setSortDirection('desc');
                }
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                sortField === 'completionPercent' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              نسبة الإنجاز {sortField === 'completionPercent' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                if (sortField === 'targetDeliveryDate') {
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('targetDeliveryDate');
                  setSortDirection('asc');
                }
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                sortField === 'targetDeliveryDate' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              تاريخ التسليم {sortField === 'targetDeliveryDate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* Modern High-End Units Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3.5 px-4">كود الوحدة</th>
                <th className="py-3.5 px-4">المشروع / المبنى</th>
                <th className="py-3.5 px-4">النوع والطابق</th>
                <th className="py-3.5 px-4">اسم المالك</th>
                <th className="py-3.5 px-4">باقة التشطيب</th>
                <th className="py-3.5 px-4">المرحلة الحالية</th>
                <th className="py-3.5 px-4">نسبة الإنجاز</th>
                <th className="py-3.5 px-4">المرحلة التالية</th>
                <th className="py-3.5 px-4">موعد التسليم</th>
                <th className="py-3.5 px-4">المهندس المسؤول</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    لا توجد وحدات تطابق معايير البحث والفلترة.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => onSelectUnit(u.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                        {u.unitCode}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{u.projectName}</div>
                      <div className="text-[11px] text-slate-400">{u.building}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">{u.unitType}</div>
                      <div className="text-[11px] text-slate-400">{u.floor}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{u.ownerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.ownerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getPackageBadge(u.finishingPackage)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 line-clamp-1">{u.currentStage}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700">{u.completionPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              u.status === 'delayed' ? 'bg-rose-500' :
                              u.status === 'completed' ? 'bg-emerald-600' :
                              'bg-amber-500'
                            }`}
                            style={{ width: `${u.completionPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-slate-500 line-clamp-1">{u.nextStage}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      {u.targetDeliveryDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{u.responsibleEngineer}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(u.status)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectUnit(u.id);
                        }}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                        title="فتح بطاقة الوحدة"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
