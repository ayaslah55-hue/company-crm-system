import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Building, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ExecutionProject, ExecutionMilestone } from '../../types/execution';

interface ManagementTimelineProps {
  projects: ExecutionProject[];
  milestones: ExecutionMilestone[];
  onSelectProject?: (projectId: string) => void;
}

export const ManagementTimeline: React.FC<ManagementTimelineProps> = ({
  projects,
  milestones,
  onSelectProject
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'proj-1');

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>الجدول الزمني العام ومخطط جانت (Gantt Chart)</span>
            </span>
            <span className="text-xs text-slate-400">• المسار الحرج والمحطات التنفيذية</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            مخطط الجدولة الزمنية لمراحل التنفيذ والمحطات الرئيسية
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            رؤية بانورامية لتسلسل وتداخل مراحل التشطيب، كشف الانحرافات والتأخيرات، وتحديد المسار الحرج (Critical Path).
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">المشروع المعروض:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Milestone Summary Strip */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>المحطات الرئيسية الحرجة لمشروع: {currentProject?.name}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {milestones.filter(m => m.projectId === currentProject?.id || m.projectName === currentProject?.name).map((m) => (
            <div key={m.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 line-clamp-1">{m.title}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  m.status === 'due_soon' ? 'bg-amber-100 text-amber-800' :
                  m.status === 'overdue' ? 'bg-rose-100 text-rose-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {m.status === 'due_soon' ? 'خلال أيام' : m.status === 'overdue' ? 'متأخر' : 'منتظم'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">تاريخ الاستحقاق: {m.dueDate}</div>
              <div className="text-[10px] text-slate-400">المسؤول: {m.responsiblePerson}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gantt Chart Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm overflow-hidden space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>تسلسل مراحل التشطيب والمسار الحرج (Gantt Schedule)</span>
          </h3>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> مكتمل</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> جاري</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> متأخر</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-500" /> مسار حرج (Critical)</span>
          </div>
        </div>

        {/* Gantt Timeline View */}
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="min-w-[900px] border border-slate-200 rounded-2xl overflow-hidden">
            {/* Header Months */}
            <div className="grid grid-cols-12 bg-slate-100 border-b border-slate-200 text-center py-2 text-xs font-bold text-slate-600">
              {months.map((m, idx) => (
                <div key={idx} className="border-l border-slate-200 last:border-l-0">
                  {m}
                </div>
              ))}
            </div>

            {/* Stages Rows */}
            <div className="divide-y divide-slate-100 text-xs">
              {currentProject?.stages.map((stage, idx) => {
                // Determine mock bar position and width based on order
                const startMonth = Math.min(11, Math.floor((stage.order - 1) * 0.8));
                const spanMonths = Math.min(3, 12 - startMonth);
                const isCritical = idx === 2 || idx === 6 || idx === 10;
                const isDelayed = stage.status === 'delayed';
                const isCompleted = stage.completionPercent === 100;

                return (
                  <div key={stage.id} className="grid grid-cols-12 items-center hover:bg-slate-50/80 transition-colors p-2.5">
                    {/* Stage Title in first col */}
                    <div className="col-span-3 flex items-center gap-2 pr-2">
                      <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {stage.order}
                      </span>
                      <div className="line-clamp-1">
                        <span className="font-bold text-slate-900 block">{stage.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{stage.startDate} ← {stage.expectedEndDate}</span>
                      </div>
                    </div>

                    {/* Gantt visual bar over 9 cols */}
                    <div className="col-span-9 relative h-7 bg-slate-50/50 rounded-lg flex items-center px-1">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 grid grid-cols-9 pointer-events-none opacity-20">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="border-l border-slate-300 h-full" />
                        ))}
                      </div>

                      {/* The Stage Gantt Bar */}
                      <div
                        className={`h-5 rounded-md shadow-sm relative flex items-center px-2 text-[10px] text-white font-bold transition-all ${
                          isDelayed ? 'bg-rose-500' :
                          isCompleted ? 'bg-emerald-600' :
                          isCritical ? 'bg-purple-600' :
                          'bg-amber-500'
                        }`}
                        style={{
                          marginRight: `${(startMonth / 12) * 100}%`,
                          width: `${Math.max(12, (spanMonths / 12) * 100)}%`
                        }}
                      >
                        <span className="line-clamp-1">{stage.completionPercent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
