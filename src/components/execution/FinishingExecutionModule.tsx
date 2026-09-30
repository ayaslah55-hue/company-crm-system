import React, { useState } from 'react';
import { 
  Building, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  DollarSign, 
  HardHat, 
  Camera, 
  Bell, 
  FileCheck, 
  ChevronRight,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { 
  mockExecutionProjects, 
  mockExecutionUnits, 
  mockExecutionMilestones, 
  mockExecutionTasks, 
  mockExecutionContractors, 
  mockExecutionCosts, 
  mockSitePhotos, 
  mockExecutionAlerts 
} from '../../data/executionMockData';
import { 
  ExecutionProject, 
  ExecutionUnit, 
  ExecutionStage, 
  ExecutionTask, 
  SitePhoto 
} from '../../types/execution';

import { ExecutionDashboard } from './ExecutionDashboard';
import { ProjectExecutionPage } from './ProjectExecutionPage';
import { UnitFinishingManagement } from './UnitFinishingManagement';
import { UnitExecutionPage } from './UnitExecutionPage';
import { StageDetailModal } from './StageDetailModal';
import { ExecutionTasksKanban } from './ExecutionTasksKanban';
import { ContractorsManagement } from './ContractorsManagement';
import { ExecutionCosts } from './ExecutionCosts';
import { SitePhotosGallery } from './SitePhotosGallery';
import { ManagementTimeline } from './ManagementTimeline';
import { AlertsCenter } from './AlertsCenter';
import { ClientHandoverView } from './ClientHandoverView';

export const FinishingExecutionModule: React.FC = () => {
  // Master state
  const [projects, setProjects] = useState<ExecutionProject[]>(mockExecutionProjects);
  const [units, setUnits] = useState<ExecutionUnit[]>(mockExecutionUnits);
  const [milestones, setMilestones] = useState(mockExecutionMilestones);
  const [tasks, setTasks] = useState(mockExecutionTasks);
  const [contractors, setContractors] = useState(mockExecutionContractors);
  const [costs, setCosts] = useState(mockExecutionCosts);
  const [photos, setPhotos] = useState<SitePhoto[]>(mockSitePhotos);
  const [alerts, setAlerts] = useState(mockExecutionAlerts);

  // Active view
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'projects' | 'units' | 'tasks' | 'contractors' | 'costs' | 'photos' | 'timeline' | 'alerts' | 'handover'
  >('dashboard');

  // Drill-down selected entities
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [activeStageForModal, setActiveStageForModal] = useState<ExecutionStage | null>(null);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);

  // Handlers
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedUnitId(null);
  };

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
  };

  const handleOpenStageModal = (stage: ExecutionStage) => {
    setActiveStageForModal(stage);
    setIsStageModalOpen(true);
  };

  const handleUpdateStage = (updatedStage: ExecutionStage) => {
    // Update stage in projects
    setProjects(prev => prev.map(p => ({
      ...p,
      stages: p.stages.map(s => s.id === updatedStage.id ? updatedStage : s)
    })));

    // Update in units if applicable
    setUnits(prev => prev.map(u => ({
      ...u,
      stages: u.stages.map(s => s.id === updatedStage.id ? updatedStage : s)
    })));

    setActiveStageForModal(updatedStage);
  };

  const handleUpdateUnit = (updatedUnit: ExecutionUnit) => {
    setUnits(prev => prev.map(u => u.id === updatedUnit.id ? updatedUnit : u));
  };

  const handleUpdateTask = (updatedTask: ExecutionTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // Find active project or unit if selected
  const activeProject = projects.find(p => p.id === selectedProjectId) || null;
  const activeUnit = units.find(u => u.id === selectedUnitId) || null;

  // Unread alerts count
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 md:p-8 space-y-6 text-right font-sans">
      {/* Top Module Subheader Navigation */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-sm overflow-x-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { key: 'dashboard', label: 'لوحة المتابعة', icon: LayoutDashboard },
            { key: 'projects', label: 'المشاريع الإنشائية', icon: Building },
            { key: 'units', label: 'تشطيب الوحدات', icon: Layers },
            { key: 'tasks', label: 'كانبان المهام', icon: CheckCircle2 },
            { key: 'contractors', label: 'المقاولون والاستشاريون', icon: HardHat },
            { key: 'costs', label: 'التكاليف والمستخلصات', icon: DollarSign },
            { key: 'photos', label: 'معرض الصور والمقارنات', icon: Camera },
            { key: 'timeline', label: 'مخطط جانت الزمني', icon: Calendar },
            { key: 'alerts', label: 'التنبيهات', icon: Bell, badge: unreadAlertsCount },
            { key: 'handover', label: 'تسليم الوحدات', icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.key && !selectedProjectId && !selectedUnitId;

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveSubTab(tab.key as any);
                  setSelectedProjectId(null);
                  setSelectedUnitId(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Breadcrumb if inside project or unit */}
        {(selectedProjectId || selectedUnitId) && (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shrink-0">
            <span
              onClick={() => {
                setSelectedProjectId(null);
                setSelectedUnitId(null);
              }}
              className="text-emerald-700 hover:underline cursor-pointer"
            >
              الرئيسية
            </span>
            <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
            {activeProject && <span>{activeProject.name}</span>}
            {activeUnit && <span>الوحدة {activeUnit.unitCode}</span>}
          </div>
        )}
      </div>

      {/* Main Dynamic View Content */}
      {activeUnit ? (
        <UnitExecutionPage
          unit={activeUnit}
          onBack={() => setSelectedUnitId(null)}
          onSelectStage={handleOpenStageModal}
          onUpdateUnit={handleUpdateUnit}
        />
      ) : activeProject ? (
        <ProjectExecutionPage
          project={activeProject}
          units={units}
          tasks={tasks}
          contractors={contractors}
          photos={photos}
          onBack={() => setSelectedProjectId(null)}
          onSelectStage={handleOpenStageModal}
          onSelectUnit={handleSelectUnit}
        />
      ) : activeSubTab === 'dashboard' ? (
        <ExecutionDashboard
          projects={projects}
          units={units}
          milestones={milestones}
          tasks={tasks}
          photos={photos}
          onSelectProject={handleSelectProject}
          onSelectUnit={handleSelectUnit}
          onNavigateTab={(tab) => {
            setActiveSubTab(tab as any);
            setSelectedProjectId(null);
            setSelectedUnitId(null);
          }}
          onOpenPhotoViewer={(p) => {
            setActiveSubTab('photos');
          }}
        />
      ) : activeSubTab === 'projects' ? (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">المشاريع قيد التنفيذ والتشطيب</h2>
              <p className="text-xs text-slate-500 mt-1">اختر أي مشروع للاطلاع على كافة مراحله الـ 14 وتكاليفه ووحداته</p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
              {projects.length} مشاريع معتمدة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {projects.map(p => (
              <div
                key={p.id}
                onClick={() => handleSelectProject(p.id)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-500 shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                <img src={p.image} alt={p.name} className="w-full h-44 object-cover" />
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                    <span className="text-slate-400 text-[11px]">{p.location}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">الإنجاز:</span>
                      <strong className="text-emerald-700">{p.overallProgress}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${p.overallProgress}%` }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
                    <span>الوحدات: {p.totalUnits}</span>
                    <span>التسليم: {p.expectedDeliveryDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeSubTab === 'units' ? (
        <UnitFinishingManagement
          units={units}
          projects={projects}
          onSelectUnit={handleSelectUnit}
        />
      ) : activeSubTab === 'tasks' ? (
        <ExecutionTasksKanban
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onSelectUnit={handleSelectUnit}
        />
      ) : activeSubTab === 'contractors' ? (
        <ContractorsManagement
          contractors={contractors}
        />
      ) : activeSubTab === 'costs' ? (
        <ExecutionCosts
          costs={costs}
        />
      ) : activeSubTab === 'photos' ? (
        <SitePhotosGallery
          photos={photos}
        />
      ) : activeSubTab === 'timeline' ? (
        <ManagementTimeline
          projects={projects}
          milestones={milestones}
          onSelectProject={handleSelectProject}
        />
      ) : activeSubTab === 'alerts' ? (
        <AlertsCenter
          alerts={alerts}
          onSelectUnit={handleSelectUnit}
          onSelectProject={handleSelectProject}
        />
      ) : activeSubTab === 'handover' ? (
        <ClientHandoverView
          units={units}
          onSelectUnit={handleSelectUnit}
        />
      ) : null}

      {/* Stage Detail Modal / Side Panel */}
      <StageDetailModal
        stage={activeStageForModal}
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        onUpdateStage={handleUpdateStage}
      />
    </div>
  );
};
