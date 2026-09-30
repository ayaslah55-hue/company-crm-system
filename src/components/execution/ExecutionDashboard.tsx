import React from 'react';
import { 
  Building, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  User, 
  Clock, 
  Camera, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  HardHat,
  Eye,
  FileCheck
} from 'lucide-react';
import { 
  ExecutionProject, 
  ExecutionUnit, 
  ExecutionMilestone, 
  ExecutionTask, 
  SitePhoto 
} from '../../types/execution';

interface ExecutionDashboardProps {
  projects: ExecutionProject[];
  units: ExecutionUnit[];
  milestones: ExecutionMilestone[];
  tasks: ExecutionTask[];
  photos: SitePhoto[];
  onSelectProject: (projectId: string) => void;
  onSelectUnit: (unitId: string) => void;
  onNavigateTab: (tabKey: string) => void;
  onOpenPhotoViewer?: (photo: SitePhoto) => void;
}

export const ExecutionDashboard: React.FC<ExecutionDashboardProps> = ({
  projects,
  units,
  milestones,
  tasks,
  photos,
  onSelectProject,
  onSelectUnit,
  onNavigateTab,
  onOpenPhotoViewer
}) => {
  // Aggregate KPIs
  const activeProjectsCount = projects.length;
  const unitsUnderFinishingCount = units.filter(u => u.status === 'in_progress' || u.status === 'delayed').length;
  const completedUnitsCount = units.filter(u => u.status === 'completed' || u.completionPercent === 100).length;
  const delayedUnitsCount = units.filter(u => u.status === 'delayed').length;
  const avgCompletion = Math.round(
    projects.reduce((acc, p) => acc + p.overallProgress, 0) / (projects.length || 1)
  );
  const currentMonthCost = 8450000; // 8.45M EGP

  const delayedTasks = tasks.filter(t => t.status === 'delayed' || t.priority === 'urgent');

  const formatEGP = (val: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(val);
  };

  const getStatusBadge = (status: ExecutionProject['status']) => {
    switch (status) {
      case 'on_track':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>منتظم (On Track)</span>
          </span>
        );
      case 'at_risk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>تحت المراقبة (At Risk)</span>
          </span>
        );
      case 'delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>متأخر (Delayed)</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>مكتمل بالكامل</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-right">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <HardHat className="w-3.5 h-3.5" />
              <span>منظومة إدارة التشطيبات والتنفيذ الإنشائي</span>
            </span>
            <span className="text-xs text-slate-400">• متابعة حية لمواقع العمل</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            لوحة قيادة ومتابعة تنفيذ المشاريع والتشطيبات
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            متابعة فورية ونسب إنجاز دقيقة لجميع مراحل البناء، التشطيب، المقاولين، التكاليف المعتمدة، وتسليم الوحدات للملاك.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('units')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm cursor-pointer transition-colors"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>جدول تشطيب الوحدات</span>
          </button>

          <button
            onClick={() => onNavigateTab('handover')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs cursor-pointer transition-colors"
          >
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>دورة التسليم للملاك</span>
          </button>
        </div>
      </div>

      {/* 6 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Active Projects */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">المشاريع النشطة</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activeProjectsCount}</span>
            <span className="text-xs text-slate-500">مشاريع كبرى</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">القاهرة، الساحل، زايد، العاصمة</p>
        </div>

        {/* Units Under Finishing */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">وحدات قيد التشطيب</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{unitsUnderFinishingCount}</span>
            <span className="text-xs text-slate-500">وحدة سكنية</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">بين المحارة والأرضيات والدهان</p>
        </div>

        {/* Completed Units */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">الوحدات المكتملة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{completedUnitsCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">جاهزة للتسليم</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">تم إنهاء كافة البنود والملاحظات</p>
        </div>

        {/* Delayed Units */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">وحدات متأخرة</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700">{delayedUnitsCount}</span>
            <span className="text-xs text-rose-600 font-semibold">تحتاج متابعة</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">تأخر في التوريدات أو الاعتمادات</p>
        </div>

        {/* Average Completion % */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">متوسط الإنجاز العام</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">{avgCompletion}%</span>
            <span className="text-xs text-purple-600 font-semibold">إجمالي المحفظة</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${avgCompletion}%` }} />
          </div>
        </div>

        {/* Current Month Execution Cost */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">مصروفات الشهر</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900">8.45M</span>
            <span className="text-xs text-slate-500 font-semibold">ج.م</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">مستخلصات المقاولين والمواد</p>
        </div>
      </div>

      {/* Visual Project Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              <span>المشاريع قيد التنفيذ والتشطيب الميداني</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              انقر على أي مشروع لفتح صفحة التنفيذ الشاملة، المراحل الـ 14، والجدول الزمني
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('projects')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>عرض تفاصيل جميع المشاريع</span>
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* 4 Featured Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="bg-white border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Project Image Banner with status overlay */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="absolute bottom-3 right-3 left-3 text-white">
                    <span className="text-[11px] font-medium text-emerald-300 block">{project.location}</span>
                    <h4 className="text-base font-bold text-white line-clamp-1">{project.name}</h4>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">نسبة الإنجاز الكلية:</span>
                      <span className="font-black text-emerald-700 text-sm">{project.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          project.status === 'delayed' ? 'bg-rose-500' :
                          project.status === 'at_risk' ? 'bg-amber-500' :
                          'bg-emerald-600'
                        }`}
                        style={{ width: `${project.overallProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-400 block">إجمالي الوحدات</span>
                      <span className="font-bold text-slate-800">{project.totalUnits} وحدة</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">قيد التشطيب</span>
                      <span className="font-bold text-amber-700">{project.unitsUnderFinishing} وحدة</span>
                    </div>
                  </div>

                  {/* Current Stage */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400 block mb-0.5">المرحلة الحالية قيد العمل:</span>
                    <span className="font-bold text-slate-900 line-clamp-1">{project.currentStage}</span>
                  </div>

                  {/* PM & Expected Delivery */}
                  <div className="space-y-1 text-xs text-slate-500 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>مدير المشروع:</span>
                      </span>
                      <span className="font-semibold text-slate-800">{project.projectManager}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>التسليم المستهدف:</span>
                      </span>
                      <span className="font-mono text-slate-700 font-semibold">{project.expectedDeliveryDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>فتح ملف المشروع التفصيلي</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Upcoming Milestones & Delayed Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Milestones */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>المحطات الرئيسية القادمة (Upcoming Milestones)</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {milestones.length} محطات
            </span>
          </div>

          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{milestone.title}</span>
                    {milestone.status === 'due_soon' && (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                        خلال أيام
                      </span>
                    )}
                    {milestone.status === 'overdue' && (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 font-bold">
                        متأخر
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{milestone.projectName}</span>
                    <span>•</span>
                    <span>المسؤول: {milestone.responsiblePerson}</span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <div className="font-mono text-xs font-bold text-slate-700">{milestone.dueDate}</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">{milestone.progressPercent}% منجز</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delayed Tasks & Action Required */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>المهام المتأخرة وتتطلب تدخلاً (Delayed Tasks)</span>
            </h3>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              عرض كانبان المهام
            </button>
          </div>

          <div className="space-y-3">
            {delayedTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">لا توجد مهام متأخرة حالياً!</div>
            ) : (
              delayedTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectUnit(t.unitId)}
                  className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50/80 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{t.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-200 text-rose-800 font-bold">
                        {t.unitCode}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {t.projectName} • {t.stageName} • المسؤول: <strong className="text-slate-700">{t.assignedPerson}</strong>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-xs font-mono font-bold text-rose-700 block">{t.deadline}</span>
                    <span className="text-[10px] text-slate-500 font-medium">إنجاز {t.progress}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Latest Uploaded Site Photos Gallery Strip */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>أحدث الصور الميدانية الموثقة من المواقع (Site Progress Gallery)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">توثيق مراحل البورسلين، المطابخ، والسباكة والدهانات قبل وبعد</p>
          </div>

          <button
            onClick={() => onNavigateTab('photos')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>فتح معرض الصور الكامل والمقارنات</span>
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {photos.slice(0, 6).map((ph) => (
            <div
              key={ph.id}
              onClick={() => onOpenPhotoViewer ? onOpenPhotoViewer(ph) : onNavigateTab('photos')}
              className="group relative rounded-xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer"
            >
              <div className="h-28 bg-slate-100 overflow-hidden">
                <img
                  src={ph.url}
                  alt={ph.notes}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-2 bg-white text-right">
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="font-bold text-emerald-700">{ph.unitCode}</span>
                  <span className="text-slate-400">{ph.date}</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-800 line-clamp-1">{ph.executionStage}</p>
              </div>

              {ph.type === 'after' && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                  بعد الإنجاز
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
