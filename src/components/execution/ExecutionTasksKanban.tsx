import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Filter, 
  User, 
  Calendar, 
  Layers, 
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ExecutionTask } from '../../types/execution';

interface ExecutionTasksKanbanProps {
  tasks: ExecutionTask[];
  onUpdateTask: (task: ExecutionTask) => void;
  onSelectUnit?: (unitId: string) => void;
}

export const ExecutionTasksKanban: React.FC<ExecutionTasksKanbanProps> = ({
  tasks,
  onUpdateTask,
  onSelectUnit
}) => {
  const [taskList, setTaskList] = useState<ExecutionTask[]>(tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newUnitCode, setNewUnitCode] = useState('A-102');
  const [newProject, setNewProject] = useState('كمبوند نيو كايرو');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDeadline, setNewDeadline] = useState('2025-11-20');
  const [newPriority, setNewPriority] = useState<ExecutionTask['priority']>('high');
  const [newStage, setNewStage] = useState('أعمال الدهانات والديكور');

  const filteredTasks = taskList.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedPerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  const columns: { key: ExecutionTask['status']; label: string; countColor: string; bg: string }[] = [
    { key: 'not_started', label: 'لم تبدأ (Not Started)', countColor: 'text-slate-700 bg-slate-100', bg: 'bg-slate-50/60' },
    { key: 'in_progress', label: 'قيد التنفيذ (In Progress)', countColor: 'text-amber-800 bg-amber-100', bg: 'bg-amber-50/20' },
    { key: 'waiting_approval', label: 'بانتظار الاعتماد', countColor: 'text-blue-800 bg-blue-100', bg: 'bg-blue-50/20' },
    { key: 'completed', label: 'مكتملة (Completed)', countColor: 'text-emerald-800 bg-emerald-100', bg: 'bg-emerald-50/20' },
    { key: 'delayed', label: 'متأخرة (Delayed)', countColor: 'text-rose-800 bg-rose-100', bg: 'bg-rose-50/20' },
  ];

  const handleStatusChange = (taskId: string, newStatus: ExecutionTask['status']) => {
    const updated = taskList.map(t => {
      if (t.id === taskId) {
        const progress = newStatus === 'completed' ? 100 : newStatus === 'not_started' ? 0 : t.progress;
        const up = { ...t, status: newStatus, progress };
        onUpdateTask(up);
        return up;
      }
      return t;
    });
    setTaskList(updated);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: ExecutionTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      projectId: 'proj-1',
      projectName: newProject,
      unitId: 'unit-1',
      unitCode: newUnitCode,
      assignedPerson: newAssignee || 'فريق التشطيبات',
      assignedRole: 'مقاول معتمد',
      deadline: newDeadline,
      priority: newPriority,
      status: 'in_progress',
      stageName: newStage,
      stageId: 'stg-1',
      progress: 25
    };

    setTaskList(prev => [newTask, ...prev]);
    onUpdateTask(newTask);
    setIsNewTaskModalOpen(false);
    setNewTitle('');
    setNewAssignee('');
  };

  const getPriorityBadge = (p: ExecutionTask['priority']) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800">عاجل جداً</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">أولوية عالية</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">عادية</span>;
    }
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              لوحة كانبان المهام
            </span>
            <span className="text-xs text-slate-400">• متابعة وتوزيع المهام الميدانية</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            إدارة مهام التنفيذ والتشطيب بالمواقع
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تنظيم وتوزيع أعمال المقاولين والمهندسين وتحديث حالة المهام ونسب إنجازها بسهولة وسلاسة.
          </p>
        </div>

        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مهمة جديدة</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="بحث بالمهمة، الوحدة، المقاول..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500">تصفية حسب الأولوية:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-800 outline-none"
          >
            <option value="ALL">جميع الأولويات</option>
            <option value="urgent">عاجل جداً</option>
            <option value="high">أولوية عالية</option>
            <option value="normal">عادية</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.key);

          return (
            <div
              key={col.key}
              className={`rounded-2xl border border-slate-200/80 p-3.5 ${col.bg} space-y-3 min-h-[500px] flex flex-col`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <span className="text-xs font-bold text-slate-900">{col.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${col.countColor}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    لا توجد مهام
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border border-slate-200/90 hover:border-emerald-400/80 rounded-xl p-3.5 shadow-sm space-y-3 transition-all text-xs"
                    >
                      {/* Top badges */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {task.unitCode}
                        </span>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {/* Title & Stage */}
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-2">{task.title}</h4>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{task.stageName}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">الإنجاز:</span>
                          <span className="font-bold text-slate-700">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              task.status === 'delayed' ? 'bg-rose-500' :
                              task.status === 'completed' ? 'bg-emerald-600' :
                              'bg-amber-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Assignee & Deadline */}
                      <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <strong className="text-slate-700">{task.assignedPerson}</strong>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {task.deadline}
                          </span>
                          <span className="text-[10px] text-slate-400">{task.projectName}</span>
                        </div>
                      </div>

                      {/* Fast Status Switcher Buttons */}
                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">تغيير الحالة:</span>
                        <div className="flex items-center gap-1">
                          {col.key !== 'not_started' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'not_started')}
                              title="إرجاع إلى لم تبدأ"
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                            >
                              لم تبدأ
                            </button>
                          )}
                          {col.key !== 'in_progress' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'in_progress')}
                              title="نقل إلى قيد التنفيذ"
                              className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold"
                            >
                              تنفيذ
                            </button>
                          )}
                          {col.key !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'completed')}
                              title="اعتماد اكتمال المهمة"
                              className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold"
                            >
                              اكتمال
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-right">
            <h3 className="text-base font-bold text-slate-900">إنشاء مهمة تنفيذ جديدة</h3>
            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">عنوان المهمة:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: فحص واختبار تمديدات الغاز الطبيعي..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">المشروع:</label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none bg-white"
                  >
                    <option value="كمبوند نيو كايرو">كمبوند نيو كايرو</option>
                    <option value="فلل الساحل الشمالي">فلل الساحل الشمالي</option>
                    <option value="ريزيدنس الشيخ زايد">ريزيدنس الشيخ زايد</option>
                    <option value="أبراج العاصمة الإدارية">أبراج العاصمة الإدارية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">كود الوحدة:</label>
                  <input
                    type="text"
                    value={newUnitCode}
                    onChange={(e) => setNewUnitCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">المسؤول المكلف:</label>
                  <input
                    type="text"
                    required
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    placeholder="اسم المهندس أو المقاول..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">موعد الإنجاز المستهدف:</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">مرحلة التشطيب:</label>
                  <input
                    type="text"
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">الأولوية:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none bg-white"
                  >
                    <option value="normal">عادية (Normal)</option>
                    <option value="high">عالية (High)</option>
                    <option value="urgent">عاجل جداً (Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  حفظ وإسناد المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
