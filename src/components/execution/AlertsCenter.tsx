import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileCheck, 
  Check, 
  Trash2,
  Calendar,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { ExecutionAlert } from '../../types/execution';

interface AlertsCenterProps {
  alerts: ExecutionAlert[];
  onSelectUnit?: (unitId: string) => void;
  onSelectProject?: (projectId: string) => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({
  alerts: initialAlerts,
  onSelectUnit,
  onSelectProject
}) => {
  const [alerts, setAlerts] = useState<ExecutionAlert[]>(initialAlerts);
  const [activeFilter, setActiveFilter] = useState<'ALL' | ExecutionAlert['type']>('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = alerts.filter(a => activeFilter === 'ALL' || a.type === activeFilter);

  const handleMarkAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const handleActionClick = (alertItem: ExecutionAlert) => {
    handleMarkAsRead(alertItem.id);
    if (alertItem.unitId && onSelectUnit) {
      onSelectUnit(alertItem.unitId);
    } else if (alertItem.projectId && onSelectProject) {
      onSelectProject(alertItem.projectId);
    } else {
      setFeedback(`تمت معالجة التنبيه: ${alertItem.title}`);
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  const getTypeIcon = (type: ExecutionAlert['type']) => {
    switch (type) {
      case 'delay':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'approval':
        return <FileCheck className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-amber-600" />;
      case 'inspection':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'milestone':
        return <Clock className="w-5 h-5 text-purple-600" />;
      case 'handover':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getTypeBadge = (type: ExecutionAlert['type']) => {
    switch (type) {
      case 'delay':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">تأخير في المرحلة</span>;
      case 'approval':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">اعتماد مطلوب</span>;
      case 'payment':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">مستحق دفع</span>;
      case 'inspection':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">ملاحظة فحص واستلام</span>;
      case 'milestone':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">محطة رئيسية</span>;
      case 'handover':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">موعد تسليم عميل</span>;
    }
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" />
              <span>مركز الإشعارات والتنبيهات الذكية</span>
            </span>
            <span className="text-xs text-slate-400">
              • {alerts.filter(a => !a.isRead).length} تنبيهات غير مقروءة
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            تنبيهات التأخيرات، طلبات الاعتماد، ومواعيد التسليم
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            نظام رصد مبكر لأي تأخير في التوريدات، بنود تحتاج توقيع الاستشاري، فواتير مستحقة، واختبارات الجودة.
          </p>
        </div>

        <button
          onClick={() => setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <Check className="w-4 h-4 text-emerald-600" />
          <span>تحديد الكل كمقروء</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-bold">
        {[
          { key: 'ALL', label: `الكل (${alerts.length})` },
          { key: 'delay', label: 'المتأخرات (Delays)' },
          { key: 'approval', label: 'الاعتمادات المطلوبة (Approvals)' },
          { key: 'payment', label: 'المستحقات المالية (Payments)' },
          { key: 'inspection', label: 'ملاحظات الفحص (Inspections)' },
          { key: 'handover', label: 'مواعيد التسليم (Handovers)' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === tab.key ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            لا توجد تنبيهات نشطة في هذا القسم حالياً.
          </div>
        ) : (
          filtered.map((alertItem) => (
            <div
              key={alertItem.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !alertItem.isRead 
                  ? 'bg-white border-slate-300 shadow-sm ring-1 ring-emerald-500/20' 
                  : 'bg-slate-50/70 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getTypeIcon(alertItem.type)}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{alertItem.title}</h4>
                    {getTypeBadge(alertItem.type)}
                    {!alertItem.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">
                    {alertItem.message || alertItem.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    {alertItem.projectName && <span>المشروع: <strong className="text-slate-700">{alertItem.projectName}</strong></span>}
                    {alertItem.unitCode && <span>الوحدة: <strong className="text-emerald-700">{alertItem.unitCode}</strong></span>}
                    <span>• {alertItem.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleActionClick(alertItem)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer shadow-sm"
                >
                  <span>{alertItem.actionLabel}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                {!alertItem.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(alertItem.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="تحديد كمقروء"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
