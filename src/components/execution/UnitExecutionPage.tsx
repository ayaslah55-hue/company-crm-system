import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Camera, 
  FileText, 
  Plus, 
  DollarSign, 
  User, 
  Calendar, 
  Share2, 
  Edit3, 
  ShieldCheck, 
  Check, 
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { ExecutionUnit, ExecutionStage, SitePhoto } from '../../types/execution';

interface UnitExecutionPageProps {
  unit: ExecutionUnit;
  onBack: () => void;
  onSelectStage: (stage: ExecutionStage) => void;
  onUpdateUnit: (updatedUnit: ExecutionUnit) => void;
}

export const UnitExecutionPage: React.FC<UnitExecutionPageProps> = ({
  unit,
  onBack,
  onSelectStage,
  onUpdateUnit
}) => {
  const [activeUnit, setActiveUnit] = useState<ExecutionUnit>(unit);
  const [modalAction, setModalAction] = useState<
    'none' | 'update_progress' | 'add_photo' | 'add_note' | 'create_task' | 'approve_stage' | 'report_issue'
  >('none');
  
  // Action state inputs
  const [progressInput, setProgressInput] = useState(unit.completionPercent);
  const [noteInput, setNoteInput] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoType, setPhotoType] = useState<'before' | 'after' | 'progress'>('progress');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(unit.responsibleContractor || 'مقاول التشطيبات');
  const [feedback, setFeedback] = useState<string | null>(null);

  const formatEGP = (val: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(val);
  };

  const handleUpdateProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ExecutionUnit = {
      ...activeUnit,
      completionPercent: progressInput,
      status: progressInput === 100 ? 'completed' : activeUnit.status
    };
    setActiveUnit(updated);
    onUpdateUnit(updated);
    setModalAction('none');
    setFeedback(`تم تحديث نسبة إنجاز الوحدة ${activeUnit.unitCode} إلى ${progressInput}%`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const updated: ExecutionUnit = {
      ...activeUnit,
      notes: [...activeUnit.notes, `${noteInput.trim()} (أضيف بواسطة الاستشاري - ${new Date().toLocaleDateString('ar-EG')})`]
    };
    setActiveUnit(updated);
    onUpdateUnit(updated);
    setNoteInput('');
    setModalAction('none');
    setFeedback('تمت إضافة الملاحظة بنجاح');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoCaption.trim()) return;
    const newPh: SitePhoto = {
      id: `p-${Date.now()}`,
      projectId: activeUnit.projectId,
      unitId: activeUnit.id,
      unitCode: activeUnit.unitCode,
      projectName: activeUnit.projectName,
      executionStage: activeUnit.currentStage,
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      caption: photoCaption.trim(),
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'م. الاستشاري بالموقع',
      uploaderRole: 'مهندس الموقع المعماري',
      type: photoType,
      notes: `تم التوثيق لمرحلة ${activeUnit.currentStage}`
    };
    const updated: ExecutionUnit = {
      ...activeUnit,
      sitePhotos: [newPh, ...activeUnit.sitePhotos]
    };
    setActiveUnit(updated);
    onUpdateUnit(updated);
    setPhotoCaption('');
    setModalAction('none');
    setFeedback('تم حفظ وتوثيق الصورة الميدانية للوحدة');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleApproveStageSubmit = () => {
    const updated: ExecutionUnit = {
      ...activeUnit,
      status: 'in_progress',
      completionPercent: Math.min(100, activeUnit.completionPercent + 10)
    };
    setActiveUnit(updated);
    onUpdateUnit(updated);
    setModalAction('none');
    setFeedback(`تم اعتماد واجتياز مرحلة (${activeUnit.currentStage}) بنجاح`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReportIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;
    const updated: ExecutionUnit = {
      ...activeUnit,
      status: 'delayed',
      notes: [`[ملاحظة تأخير/خلل]: ${issueTitle.trim()} - ${issueDesc}`, ...activeUnit.notes]
    };
    setActiveUnit(updated);
    onUpdateUnit(updated);
    setIssueTitle('');
    setIssueDesc('');
    setModalAction('none');
    setFeedback('تم الإبلاغ عن الخلل وتحديث حالة الوحدة إلى متأخرة');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rotate-180 text-emerald-600" />
          <span>العودة لجدول الوحدات</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          معرّف الوحدة: {activeUnit.id}
        </span>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Unit Top Summary Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                {activeUnit.projectName}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {activeUnit.building} • {activeUnit.floor} • {activeUnit.unitType}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                الوحدة {activeUnit.unitCode}
              </h2>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                باقة التشطيب: {activeUnit.finishingPackage}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              المالك: <strong className="text-slate-800">{activeUnit.ownerName}</strong> ({activeUnit.ownerPhone})
            </p>
          </div>

          <div className="flex items-center gap-4 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-right">
              <span className="text-[11px] text-slate-400 block">تاريخ التسليم التعاقدي:</span>
              <span className="font-black text-slate-900 text-base font-mono">{activeUnit.targetDeliveryDate}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-right">
              <span className="text-[11px] text-emerald-700 block">نسبة الإنجاز الكلية:</span>
              <span className="font-black text-emerald-800 text-xl font-mono">{activeUnit.completionPercent}%</span>
            </div>
          </div>
        </div>

        {/* 6 Quick Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setModalAction('update_progress')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-sm transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>تحديث نسبة الإنجاز</span>
          </button>

          <button
            onClick={() => setModalAction('add_photo')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer shadow-sm transition-colors"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>إضافة صورة موقع</span>
          </button>

          <button
            onClick={() => setModalAction('add_note')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer shadow-sm transition-colors"
          >
            <Edit3 className="w-4 h-4 text-emerald-600" />
            <span>إضافة ملاحظة هندسية</span>
          </button>

          <button
            onClick={() => setModalAction('create_task')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>إنشاء مهمة عمل للمقاول</span>
          </button>

          <button
            onClick={() => setModalAction('approve_stage')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>اعتماد المرحلة الحالية</span>
          </button>

          <button
            onClick={() => setModalAction('report_issue')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>الإبلاغ عن خلل أو تأخير</span>
          </button>
        </div>
      </div>

      {/* Visual Finishing Journey / Timeline */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>المسار الزمني لمراحل تشطيب الوحدة (Visual Finishing Journey)</span>
          </h3>
          <span className="text-xs text-slate-500">انقر على أي مرحلة للاطلاع عليها بالتفصيل</span>
        </div>

        {/* Visual Progress Steps */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-[750px]">
            {activeUnit.stages.map((stage, index) => {
              const isDone = stage.completionPercent === 100;
              const isCurrent = stage.name === activeUnit.currentStage;
              const isDelayed = stage.status === 'delayed';

              return (
                <div
                  key={stage.id}
                  onClick={() => onSelectStage(stage)}
                  className={`flex-1 p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                    isDelayed ? 'bg-rose-50 border-rose-300' :
                    isCurrent ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm' :
                    isDone ? 'bg-slate-50 border-emerald-200' :
                    'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isDelayed ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <div className="font-bold text-slate-900 text-xs line-clamp-1">{stage.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{stage.completionPercent}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Current Stage Checklist & Financial / Contractor Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Stage Checklist & Status */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                قائمة فحص المرحلة الحالية: <span className="text-emerald-700 font-black">{activeUnit.currentStage}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">البنود الإلزامية لاستلام واعتماد هذه المرحلة</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              قيد التنفيذ
            </span>
          </div>

          {/* Checklist items */}
          <div className="space-y-2.5">
            {activeUnit.currentStageChecklist.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  item.isCompleted 
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    item.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.isCompleted && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`font-semibold ${item.isCompleted ? 'line-through text-slate-500' : ''}`}>
                    {item.title}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  {item.completedAt ? `تم في ${item.completedAt} (${item.completedBy})` : 'بانتظار المعاينة'}
                </div>
              </div>
            ))}
          </div>

          {/* Unit Engineer & Contractor Assigned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>المهندس المشرف:</span>
              </span>
              <strong className="text-slate-900 block text-sm">{activeUnit.responsibleEngineer}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>المقاول المسؤول:</span>
              </span>
              <strong className="text-slate-900 block text-sm">{activeUnit.responsibleContractor || 'شركة المقاولات الحديثة'}</strong>
            </div>
          </div>

          {/* Unit Notes */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-800">سجل الملاحظات الخاصة بالوحدة ({activeUnit.notes.length}):</h4>
            <div className="space-y-1.5">
              {activeUnit.notes.map((n, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Execution Cost & Financial Tracking for this unit */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>تكاليف تشطيب الوحدة</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">إجمالي الميزانية المعتمدة:</span>
                <span className="font-extrabold text-slate-900 text-sm">{formatEGP(activeUnit.totalCost)}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">المنصرف والمصروف حتى الآن:</span>
                <span className="font-extrabold text-emerald-700 text-sm">{formatEGP(activeUnit.spentCost)}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">المتبقي من الميزانية:</span>
                <span className="font-extrabold text-blue-700 text-sm">{formatEGP(activeUnit.totalCost - activeUnit.spentCost)}</span>
              </div>
            </div>

            {/* Attached Documents */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-800">المستندات والمخططات الملحقة ({activeUnit.attachedDocuments.length}):</h4>
              <div className="space-y-1.5">
                {activeUnit.attachedDocuments.map((doc, idx) => (
                  <div key={idx} className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 line-clamp-1">{doc.title}</span>
                    <button
                      onClick={() => alert(`جاري تنزيل ملف ${doc.title}`)}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      تنزيل
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unit Site Photos */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>صور الوحدة الميدانية</span>
              </h3>
              <span className="text-xs text-slate-400">{activeUnit.sitePhotos.length} صورة</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {activeUnit.sitePhotos.map((p) => (
                <div key={p.id} className="rounded-xl overflow-hidden border border-slate-200 relative group">
                  <img src={p.url} alt={p.caption} className="w-full h-24 object-cover" />
                  <div className="p-1.5 bg-white text-[10px]">
                    <div className="font-bold text-slate-800 line-clamp-1">{p.caption}</div>
                    <div className="text-slate-400">{p.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Modals */}
      {modalAction === 'update_progress' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-right">
            <h3 className="text-base font-bold text-slate-900">تحديث نسبة إنجاز الوحدة {activeUnit.unitCode}</h3>
            <form onSubmit={handleUpdateProgressSubmit} className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span>نسبة الإنجاز:</span>
                  <span className="text-emerald-700 text-sm">{progressInput}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressInput}
                  onChange={(e) => setProgressInput(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAction('none')}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  تأكيد التحديث
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalAction === 'add_note' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-right">
            <h3 className="text-base font-bold text-slate-900">إضافة ملاحظة هندسية للوحدة</h3>
            <form onSubmit={handleAddNoteSubmit} className="space-y-4 text-xs">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="اكتب تفاصيل الملاحظة أو توجيهات الاستلام..."
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAction('none')}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  حفظ الملاحظة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalAction === 'add_photo' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-right">
            <h3 className="text-base font-bold text-slate-900">إضافة صورة توثيق ميداني</h3>
            <form onSubmit={handleAddPhotoSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">وصف الصورة:</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="مثال: فحص تركيب الرخام بالصالون..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">نوع التوثيق:</label>
                <select
                  value={photoType}
                  onChange={(e) => setPhotoType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none bg-white"
                >
                  <option value="progress">أثناء التنفيذ (Progress)</option>
                  <option value="before">قبل بدء الأعمال (Before)</option>
                  <option value="after">بعد الإنجاز والتشطيب (After)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-slate-500">
                <Camera className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                <span>تم تجهيز الصورة النموذجية للمعاينة</span>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAction('none')}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  حفظ الصورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalAction === 'create_task' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-right">
            <h3 className="text-base font-bold text-slate-900">إنشاء مهمة عمل جديدة</h3>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="عنوان المهمة (مثلاً: تركيب عتب الرخام)..."
                className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
              />
              <input
                type="text"
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                placeholder="المقاول أو المسؤول المكلف..."
                className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAction('none')}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalAction('none');
                    setFeedback('تمت إضافة المهمة إلى جدول أعمال الوحدة');
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  إنشاء المهمة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalAction === 'approve_stage' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-right">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">اعتماد مرحلة {activeUnit.currentStage}</h3>
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              هل تؤكد استيفاء شروط الجودة والمواصفات الفنية للوحدة {activeUnit.unitCode} والانتقال للمرحلة التالية؟
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalAction('none')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleApproveStageSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
              >
                تأكيد الاعتماد
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAction === 'report_issue' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-right">
            <h3 className="text-base font-bold text-slate-900">تسجيل ملاحظة تأخير أو خلل</h3>
            <form onSubmit={handleReportIssueSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="عنوان الخلل (مثال: تأخر توريد أطقم الحمامات)..."
                className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
              />
              <textarea
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                placeholder="التفاصيل والإجراء المطلوب..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAction('none')}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-sm"
                >
                  تسجيل الخلل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
