import React, { useState } from 'react';
import { 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  User, 
  MapPin, 
  ArrowLeft, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Camera, 
  FileText, 
  HardHat, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Search,
  Users
} from 'lucide-react';
import { 
  ExecutionProject, 
  ExecutionStage, 
  ExecutionUnit, 
  ExecutionTask, 
  ExecutionContractor, 
  SitePhoto 
} from '../../types/execution';

interface ProjectExecutionPageProps {
  project: ExecutionProject;
  units: ExecutionUnit[];
  tasks: ExecutionTask[];
  contractors: ExecutionContractor[];
  photos: SitePhoto[];
  onBack: () => void;
  onSelectStage: (stage: ExecutionStage) => void;
  onSelectUnit: (unitId: string) => void;
}

export const ProjectExecutionPage: React.FC<ProjectExecutionPageProps> = ({
  project,
  units,
  tasks,
  contractors,
  photos,
  onBack,
  onSelectStage,
  onSelectUnit
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'units' | 'stages' | 'tasks' | 'contractors' | 'costs' | 'photos' | 'documents'
  >('overview');

  const projectUnits = units.filter(u => u.projectId === project.id);
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectPhotos = photos.filter(p => p.projectId === project.id);

  const formatEGP = (val: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(val);
  };

  const getStageStatusColor = (status: ExecutionStage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 text-white border-emerald-600';
      case 'in_progress':
        return 'bg-amber-500 text-white border-amber-600';
      case 'delayed':
        return 'bg-rose-500 text-white border-rose-600';
      case 'waiting_approval':
        return 'bg-blue-500 text-white border-blue-600';
      default:
        return 'bg-slate-200 text-slate-600 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      {/* Back button & Title Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rotate-180 text-emerald-600" />
          <span>الرجوع إلى لوحة التنفيذ</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          معرّف المشروع: {project.id}
        </span>
      </div>

      {/* Top Project Summary Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>مشروع قيد التنفيذ المباشر</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                المطور: <strong className="text-slate-800">{project.developer}</strong>
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {project.name}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{project.location} • {project.city}</span>
              </p>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[11px] block">مدير المشروع:</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{project.projectManager}</span>
                <span className="text-[10px] text-slate-500 font-mono">{project.projectManagerPhone}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[11px] block">تاريخ البدء:</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">{project.startDate}</span>
                <span className="text-[10px] text-slate-500">التسليم: {project.expectedDeliveryDate}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[11px] block">الميزانية الإجمالية:</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{formatEGP(project.totalBudget)}</span>
                <span className="text-[10px] text-slate-500">تم صرف: {formatEGP(project.currentSpending)}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                <span className="text-emerald-700 text-[11px] block">نسبة الإنجاز الكلية:</span>
                <span className="font-black text-emerald-800 text-xl mt-0.5 block">{project.overallProgress}%</span>
                <span className="text-[10px] text-emerald-600 font-medium">المرحلة: {project.currentStage.slice(0, 20)}...</span>
              </div>
            </div>
          </div>

          {/* Project Image & Overall Gauge */}
          <div className="relative rounded-2xl overflow-hidden h-52 bg-slate-100 border border-slate-200">
            <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <div className="w-full text-white">
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <span>تقدم الأعمال الإنشائية</span>
                  <span>{project.overallProgress}%</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${project.overallProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Tabs Navigation */}
        <div className="flex items-center gap-1 mt-6 pt-4 border-t border-slate-200 overflow-x-auto text-xs font-bold text-slate-600">
          {[
            { key: 'overview', label: 'نظرة عامة (Overview)' },
            { key: 'units', label: `الوحدات السكنية (${projectUnits.length})` },
            { key: 'stages', label: `مراحل التنفيذ الـ 14 (${project.stages.length})` },
            { key: 'tasks', label: `مهام التنفيذ (${projectTasks.length})` },
            { key: 'contractors', label: 'المقاولون والاستشاريون' },
            { key: 'costs', label: 'التكاليف والميزانية' },
            { key: 'photos', label: `معرض الموقع (${projectPhotos.length})` },
            { key: 'documents', label: `الوثائق والمخططات (${project.documentsCount})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.key 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal 14 Construction & Finishing Stages Timeline */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>المخطط الزمني الأفقي لمراحل التنفيذ الـ 14 (Execution Stages Timeline)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              انقر على أي مرحلة لعرض التفاصيل الهندسية وقوائم الفحص والصور وتحديث الحالة
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> مكتمل</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> جاري</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> متأخر</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> لم يبدأ</span>
          </div>
        </div>

        {/* Scrollable Horizontal Stage Cards */}
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="flex items-stretch gap-3 min-w-[1400px]">
            {project.stages.map((stage) => {
              const isCompleted = stage.completionPercent === 100;
              const isInProgress = stage.status === 'in_progress';
              const isDelayed = stage.status === 'delayed';

              return (
                <div
                  key={stage.id}
                  onClick={() => onSelectStage(stage)}
                  className={`w-52 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                    isDelayed ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400' :
                    isInProgress ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400' :
                    isCompleted ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400' :
                    'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${getStageStatusColor(stage.status)}`}>
                        {stage.order}
                      </div>
                      <span className="text-[11px] font-black text-slate-800">{stage.completionPercent}%</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{stage.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block">{stage.nameEn}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          isDelayed ? 'bg-rose-500' : isInProgress ? 'bg-amber-500' : 'bg-emerald-600'
                        }`} 
                        style={{ width: `${stage.completionPercent}%` }} 
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-[11px] text-slate-500">
                    <div className="line-clamp-1">
                      <strong className="text-slate-700">{stage.contractorName || stage.responsibleTeam}</strong>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {stage.startDate} ← {stage.expectedEndDate}
                    </div>
                    <div className="font-semibold text-emerald-700">
                      {formatEGP(stage.actualCost || stage.estimatedCost)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Units Finishing Status Breakdown */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>توزيع وحدات المشروع حسب مرحلة التشطيب</span>
            </h3>

            <div className="space-y-3">
              {[
                { stage: 'التسليم النهائي وضبط الجودة', count: 72, percent: 51, color: 'bg-emerald-500' },
                { stage: 'الأرضيات والدهانات والديكور', count: 32, percent: 23, color: 'bg-amber-500' },
                { stage: 'تأسيس الكهرباء والسباكة والمحارة', count: 26, percent: 18, color: 'bg-blue-500' },
                { stage: 'الهيكل الخرساني والمباني', count: 10, percent: 8, color: 'bg-purple-500' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.stage}</span>
                    <span className="font-bold text-slate-900">{item.count} وحدة ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column: Active Contractors in this project */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-emerald-600" />
              <span>المقاولون والفرق العاملة بالموقع</span>
            </h3>

            <div className="space-y-3">
              {contractors.slice(0, 4).map((c) => (
                <div key={c.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{c.name}</span>
                      <span className="text-[10px] text-slate-500">{c.companyName}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ★ {c.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recent Site Photos */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>صور التنفيذ الأخيرة للمشروع</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {projectPhotos.slice(0, 4).map((p) => (
                <div key={p.id} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
                  <img src={p.url} alt={p.notes} className="w-full h-24 object-cover" />
                  <div className="p-2 bg-white text-[11px]">
                    <div className="font-bold text-slate-800 line-clamp-1">{p.unitCode}</div>
                    <div className="text-[10px] text-slate-400">{p.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Units Tab */}
      {activeTab === 'units' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              الوحدات التابعة للمشروع ({projectUnits.length})
            </h3>
            <span className="text-xs text-slate-500">انقر على أي وحدة لفتح بطاقة التنفيذ الكاملة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projectUnits.map(unit => (
              <div
                key={unit.id}
                onClick={() => onSelectUnit(unit.id)}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-base text-slate-900">{unit.unitCode}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    unit.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    unit.status === 'delayed' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {unit.status === 'completed' ? 'مكتمل' : unit.status === 'delayed' ? 'متأخر' : 'قيد التشطيب'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>المالك: <strong className="text-slate-900">{unit.ownerName}</strong></div>
                  <div>باقة التشطيب: <strong className="text-emerald-700">{unit.finishingPackage}</strong></div>
                  <div>المرحلة الحالية: <span className="text-slate-700 font-semibold">{unit.currentStage}</span></div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">الإنجاز:</span>
                    <span className="font-bold text-emerald-700">{unit.completionPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${unit.completionPercent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Stages Detailed List Tab */}
      {activeTab === 'stages' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900">
              جدول تفصيلي لمراحل التنفيذ الـ 14
            </h3>
            <span className="text-xs text-slate-500">انقر على أي مرحلة للاعتماد أو التعديل</span>
          </div>

          <div className="space-y-3">
            {project.stages.map((stage) => (
              <div
                key={stage.id}
                onClick={() => onSelectStage(stage)}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${getStageStatusColor(stage.status)}`}>
                    {stage.order}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{stage.name}</h4>
                    <p className="text-[11px] text-slate-500">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-600 shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-400 block">المسؤول:</span>
                    <strong className="text-slate-800">{stage.contractorName || stage.responsibleTeam}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">التكلفة:</span>
                    <strong className="text-emerald-700">{formatEGP(stage.actualCost)}</strong>
                  </div>
                  <div className="w-24">
                    <span className="text-[10px] text-slate-400 block mb-0.5">الإنجاز: {stage.completionPercent}%</span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${stage.completionPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            المهام المجدولة لمشروع {project.name}
          </h3>
          <div className="space-y-3">
            {projectTasks.map(t => (
              <div key={t.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{t.title}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 font-mono text-[10px]">{t.unitCode}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{t.stageName} • المسؤول: {t.assignedPerson}</p>
                </div>
                <div className="text-left">
                  <span className="font-mono text-slate-700 font-bold">{t.deadline}</span>
                  <span className="block text-[10px] text-emerald-600">{t.progress}% منجز</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contractors Tab */}
      {activeTab === 'contractors' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            المقاولون المعتمدون في هذا المشروع
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractors.slice(0, 6).map(c => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{c.name}</span>
                    <span className="text-[11px] text-slate-500">{c.companyName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.phone}</span>
                  </div>
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold text-emerald-700 block">★ {c.rating}</span>
                  <span className="text-[10px] text-slate-500">{c.completedJobsCount} عمل مكتمل</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Costs Tab */}
      {activeTab === 'costs' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 block">الميزانية المرصودة:</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{formatEGP(project.totalBudget)}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 block">المنصرف الفعلي:</span>
              <span className="text-xl font-black text-emerald-700 mt-1 block">{formatEGP(project.currentSpending)}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 block">المتبقي بالميزانية:</span>
              <span className="text-xl font-black text-blue-700 mt-1 block">{formatEGP(project.totalBudget - project.currentSpending)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            معرض صور الموقع لمشروع {project.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {projectPhotos.map(p => (
              <div key={p.id} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <img src={p.url} alt={p.notes} className="w-full h-36 object-cover" />
                <div className="p-2.5 bg-white text-xs">
                  <div className="font-bold text-slate-800">{p.unitCode}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{p.executionStage}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{p.date} • {p.uploadedBy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            المخططات والوثائق الهندسية المعتمدة
          </h3>
          <div className="space-y-3">
            {[
              { title: 'المخططات المعمارية التنفيذية (As-Built Drawings)', type: 'AutoCAD / PDF', size: '18.4 MB', date: '2025-10-12' },
              { title: 'تقرير الجسات واختبارات التربة والأساسات', type: 'Geotechnical Report', size: '6.2 MB', date: '2024-07-20' },
              { title: 'مخططات شبكة الإطفاء ومكافحة الحريق المعتمدة من الدفاع المدني', type: 'NFPA Safety PDF', size: '8.7 MB', date: '2025-01-15' },
              { title: 'كراسة الشروط والمواصفات الفنية لبنود التشطيب الفاخر', type: 'Specification Book', size: '4.5 MB', date: '2025-03-01' }
            ].map((doc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">{doc.title}</span>
                    <span className="text-[11px] text-slate-500">{doc.type} • {doc.size}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 text-[11px]">{doc.date}</span>
                  <button
                    onClick={() => alert(`جاري تحميل ${doc.title}`)}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    تحميل
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
