import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  HardHat, 
  Calendar, 
  DollarSign, 
  Camera, 
  FileText, 
  MessageSquare, 
  History, 
  Save, 
  Send,
  Sparkles
} from 'lucide-react';
import { ExecutionStage } from '../../types/execution';

interface StageDetailModalProps {
  stage: ExecutionStage | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (updatedStage: ExecutionStage) => void;
}

export const StageDetailModal: React.FC<StageDetailModalProps> = ({
  stage,
  isOpen,
  onClose,
  onUpdateStage
}) => {
  if (!isOpen || !stage) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'checklist' | 'photos' | 'comments' | 'history'>('details');
  const [currentProgress, setCurrentProgress] = useState(stage.completionPercent);
  const [currentStatus, setCurrentStatus] = useState(stage.status);
  const [checklist, setChecklist] = useState(stage.checklist || []);
  const [comments, setComments] = useState(stage.comments || []);
  const [newComment, setNewComment] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const handleToggleChecklist = (chkId: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === chkId) {
        return {
          ...item,
          isCompleted: !item.isCompleted,
          completedAt: !item.isCompleted ? new Date().toISOString().split('T')[0] : undefined,
          completedBy: !item.isCompleted ? 'م. الاستشاري المسؤول' : undefined
        };
      }
      return item;
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newCom = {
      id: `com-${Date.now()}`,
      author: 'مهندس الجودة والاستلام',
      role: 'استشاري الموقع',
      text: newComment.trim(),
      timestamp: 'الآن'
    };
    setComments(prev => [newCom, ...prev]);
    setNewComment('');
  };

  const handleSave = () => {
    const updated: ExecutionStage = {
      ...stage,
      completionPercent: currentProgress,
      status: currentStatus,
      checklist,
      comments,
      changeHistory: [
        {
          id: `log-${Date.now()}`,
          action: 'تحديث بيانات المرحلة والملاحظات',
          user: 'مهندس الموقع',
          timestamp: 'الآن',
          details: `نسبة الإنجاز: ${currentProgress}% - الحالة: ${currentStatus}`
        },
        ...(stage.changeHistory || [])
      ]
    };
    onUpdateStage(updated);
    setFeedbackNotice('تم حفظ تحديثات المرحلة بنجاح');
    setTimeout(() => {
      setFeedbackNotice(null);
      onClose();
    }, 1200);
  };

  const handleMarkCompleted = () => {
    setCurrentProgress(100);
    setCurrentStatus('completed');
    setChecklist(prev => prev.map(c => ({ ...c, isCompleted: true, completedAt: new Date().toISOString().split('T')[0] })));
  };

  const handleReportDelay = () => {
    setCurrentStatus('delayed');
    setFeedbackNotice('تم تسجيل تنبيه التأخير وسيتم إخطار مدير المشروع');
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  const formatEGP = (val: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150 text-right">
        {/* Modal Top Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base ${
              currentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' :
              currentStatus === 'delayed' ? 'bg-rose-100 text-rose-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {stage.order}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{stage.name}</h3>
                <span className="text-xs text-slate-500 font-mono">({stage.nameEn})</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{stage.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alert */}
        {feedbackNotice && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            المعلومات والتكلفة
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'checklist' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>قائمة الفحص والاعتماد</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[11px] text-slate-600">
              {checklist.filter(c => c.isCompleted).length}/{checklist.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'photos' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            صور الموقع ({stage.photos?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'comments' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            الملاحظات والتعليقات ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            سجل التغييرات
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Progress Slider & Status Selector */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">نسبة إنجاز المرحلة الحالية:</span>
                  <span className="text-xl font-black text-emerald-700">{currentProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentProgress}
                  onChange={(e) => setCurrentProgress(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-600">حالة المرحلة:</span>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="not_started">لم تبدأ (Not Started)</option>
                    <option value="in_progress">قيد التنفيذ (In Progress)</option>
                    <option value="waiting_approval">بانتظار الاعتماد (Waiting Approval)</option>
                    <option value="completed">مكتملة ومعتمدة (Completed)</option>
                    <option value="delayed">متأخرة عن الجدول (Delayed)</option>
                  </select>
                </div>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>الفريق أو المقاول المسؤول:</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{stage.contractorName || stage.responsibleTeam}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>الجدول الزمني المستهدف:</span>
                  </div>
                  <p className="font-bold text-slate-900">
                    من <span className="text-slate-600 font-mono">{stage.startDate}</span> إلى <span className="text-slate-600 font-mono">{stage.expectedEndDate}</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>الميزانية التقديرية المعتمدة:</span>
                  </div>
                  <p className="font-extrabold text-slate-900 text-sm">{formatEGP(stage.estimatedCost)}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <span>التكلفة الفعلية المنصرفة حتى الآن:</span>
                  </div>
                  <p className="font-extrabold text-emerald-700 text-sm">{formatEGP(stage.actualCost)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                قائمة الفحص الهندسي والتحقق من الجودة قبل اعتماد المرحلة:
              </div>
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.isCompleted 
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      item.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {item.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs font-semibold ${item.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                      {item.title}
                    </span>
                  </div>

                  {item.completedAt && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      تم {item.completedAt}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">توثيق الصور الميدانية للمرحلة</span>
                <button
                  type="button"
                  onClick={() => alert('تم تفعيل كاميرا الموقع لرفع صورة فحص جديدة')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>إضافة صورة موقع</span>
                </button>
              </div>

              {(!stage.photos || stage.photos.length === 0) ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">لا توجد صور مخصصة لهذه المرحلة بعد.</p>
                  <p className="text-[11px] text-slate-400 mt-1">يمكن لمهندسي الموقع رفع صور المعاينة وقبل/بعد الإنجاز.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {stage.photos.map((ph) => (
                    <div key={ph.id} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <img src={ph.url} alt={ph.caption} className="w-full h-36 object-cover" />
                      <div className="p-2.5 bg-white text-xs">
                        <div className="font-semibold text-slate-800">{ph.caption}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{ph.date} • {ph.uploadedBy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Add comment */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="أضف ملاحظة هندسية أو توجيهاً للمقاول..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800 placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال</span>
                </button>
              </form>

              {/* Comments list */}
              <div className="space-y-2.5">
                {comments.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">لا توجد ملاحظات مسجلة حتى الآن.</div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{c.author} <span className="text-slate-500 font-normal">({c.role})</span></span>
                        <span className="text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {(!stage.changeHistory || stage.changeHistory.length === 0) ? (
                <div className="p-6 text-center text-xs text-slate-400">لا يوجد سجل تعديلات سابق.</div>
              ) : (
                stage.changeHistory.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                    <History className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-xs">
                      <div className="font-bold text-slate-900">{log.action}</div>
                      <p className="text-slate-600 text-[11px]">{log.details}</p>
                      <div className="text-[10px] text-slate-400">{log.user} • {log.timestamp}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Quick Action Buttons */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التحديثات</span>
            </button>

            <button
              type="button"
              onClick={handleMarkCompleted}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>اعتماد اكتمال المرحلة 100%</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReportDelay}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold text-xs cursor-pointer transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>تسجيل تأخير (Report Delay)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 cursor-pointer transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
