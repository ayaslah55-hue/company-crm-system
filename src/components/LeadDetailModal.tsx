import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  X, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Building2, 
  DollarSign, 
  Send, 
  Plus, 
  CheckCircle, 
  Star, 
  User, 
  FileText, 
  Tag, 
  ShieldCheck,
  BadgeAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  formatCurrency, 
  formatDateTimeAr, 
  formatDateAr, 
  SOURCE_CONFIG, 
  STAGE_CONFIG, 
  REQUEST_TYPE_LABELS, 
  UNIT_TYPE_LABELS,
  UNIT_STATUS_CONFIG 
} from '../utils/translations';
import { PipelineStage } from '../types/crm';

export const LeadDetailModal: React.FC = () => {
  const { 
    selectedLead, 
    setSelectedLead, 
    activities, 
    addActivity, 
    addFollowUp, 
    units, 
    reserveUnit, 
    updateLeadStage, 
    currentUser,
    setIsNewDealModalOpen 
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'timeline' | 'property_matching' | 'schedule_followup'>('timeline');

  // Form states for adding note/call
  const [logType, setLogType] = useState<'call' | 'whatsapp' | 'meeting' | 'note'>('call');
  const [logTitle, setLogTitle] = useState('');
  const [logDescription, setLogDescription] = useState('');
  const [logOutcome, setLogOutcome] = useState<'interested' | 'not_interested' | 'no_answer' | 'rescheduled'>('interested');
  const [callDuration, setCallDuration] = useState('5');

  // Form states for scheduling follow-up
  const [fuDate, setFuDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [fuTime, setFuTime] = useState('16:00');
  const [fuType, setFuType] = useState<'call' | 'site_visit' | 'contract_signing' | 'send_brochure'>('call');
  const [fuPriority, setFuPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [fuNotes, setFuNotes] = useState('');
  const [fuSavedMsg, setFuSavedMsg] = useState(false);

  if (!selectedLead) return null;

  const leadActivities = activities.filter(a => a.leadId === selectedLead.id);
  const sourceConf = SOURCE_CONFIG[selectedLead.source] || SOURCE_CONFIG.website;
  const stageConf = STAGE_CONFIG[selectedLead.stage];

  // Property matching recommendations
  const matchedUnits = units.filter(u => {
    // Exact project match or general available
    const projectMatch = u.projectId === selectedLead.preferredProjectId;
    const priceFit = u.price <= selectedLead.budget * 1.25;
    return projectMatch && priceFit;
  });

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logDescription.trim()) return;

    addActivity({
      leadId: selectedLead.id,
      agentId: currentUser.id,
      agentName: currentUser.name,
      type: logType,
      title: logTitle || (logType === 'call' ? 'مكالمة هاتفية مع العميل' : logType === 'whatsapp' ? 'محادثة واتساب' : 'ملاحظة متابعة'),
      description: logDescription,
      outcome: logType === 'call' ? logOutcome : undefined,
      durationMinutes: logType === 'call' ? Number(callDuration) : undefined
    });

    setLogDescription('');
    setLogTitle('');
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fuNotes.trim()) return;

    const fullDue = `${fuDate}T${fuTime}:00Z`;

    addFollowUp({
      leadId: selectedLead.id,
      leadName: selectedLead.name,
      leadPhone: selectedLead.phone,
      agentId: selectedLead.assignedAgentId || currentUser.id,
      dueDate: fullDue,
      type: fuType,
      priority: fuPriority,
      notes: fuNotes
    });

    setFuSavedMsg(true);
    setFuNotes('');
    setTimeout(() => {
      setFuSavedMsg(false);
      setActiveTab('timeline');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e1424] border border-slate-700/90 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-150 text-right">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#090d16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-100">{selectedLead.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {selectedLead.code}
                </span>
                {selectedLead.priority === 'high' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    أولوية قصوى
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تاريخ التسجيل: {formatDateTimeAr(selectedLead.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct WhatsApp button */}
            <a
              href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </a>

            {/* Direct Phone button */}
            <a
              href={`tel:${selectedLead.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>اتصال</span>
            </a>

            {/* Close modal */}
            <button
              id="close-lead-detail-btn"
              onClick={() => setSelectedLead(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lead Overview Strip */}
        <div className="p-6 bg-[#0c121e] border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">مرحلة المسار (Stage):</span>
            <div>
              <select
                value={selectedLead.stage}
                onChange={(e) => updateLeadStage(selectedLead.id, e.target.value as PipelineStage)}
                className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold border ${stageConf.bg} ${stageConf.color} ${stageConf.border} focus:outline-none cursor-pointer`}
              >
                {Object.entries(STAGE_CONFIG).map(([key, val]) => (
                  <option key={key} value={key} className="bg-slate-900 text-slate-200">{val.labelAr}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">الميزانية المستهدفة:</span>
            <p className="text-sm font-extrabold text-amber-300">{formatCurrency(selectedLead.budget)}</p>
            <p className="text-[10px] text-slate-400">{REQUEST_TYPE_LABELS[selectedLead.requestType]?.ar}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">المشروع والوحدة:</span>
            <p className="text-xs font-bold text-slate-200 truncate">{selectedLead.preferredProjectName}</p>
            <p className="text-[10px] text-slate-400">{UNIT_TYPE_LABELS[selectedLead.preferredUnitType]?.ar}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">المستشار المعين:</span>
            <p className="text-xs font-bold text-emerald-400">
              {selectedLead.assignedAgentName || 'غير معين حتى الآن'}
            </p>
            <span className={`text-[10px] ${sourceConf.color}`}>{sourceConf.labelAr}</span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 flex gap-4 bg-[#0a0e1a]">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>سجل الأنشطة والملاحظات ({leadActivities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('property_matching')}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'property_matching' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>المطابقة العقارية والوحدات المتاحة ({matchedUnits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule_followup')}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schedule_followup' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>جدولة موعد متابعة قادم</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 max-h-[480px] overflow-y-auto space-y-6">
          {/* TAB 1: Timeline & Log Note */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Add Interaction Log Box */}
              <form onSubmit={handleAddLog} className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">تسجيل تفاعل جديد مع العميل</span>
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setLogType('call')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        logType === 'call' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      مكالمة هاتفية
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogType('whatsapp')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        logType === 'whatsapp' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      واتساب
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogType('meeting')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        logType === 'meeting' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      اجتماع / معاينة
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogType('note')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        logType === 'note' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ملاحظة
                    </button>
                  </div>
                </div>

                {logType === 'call' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">نتيجة المكالمة:</label>
                      <select
                        value={logOutcome}
                        onChange={(e) => setLogOutcome(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                      >
                        <option value="interested">مهتم جداً ومتحمس</option>
                        <option value="rescheduled">طلب إعادة الاتصال لاحقاً</option>
                        <option value="no_answer">لم يرد على الاتصال</option>
                        <option value="not_interested">غير مهتم حالياً</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">مدة المكالمة (بالدقائق):</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={callDuration}
                        onChange={(e) => setCallDuration(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <textarea
                    rows={2}
                    value={logDescription}
                    onChange={(e) => setLogDescription(e.target.value)}
                    placeholder="اكتب تفاصيل المحادثة، الأسعار المعروضة، أو شروط العميل..."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>حفظ الملاحظة في السجل</span>
                  </button>
                </div>
              </form>

              {/* Timeline Feed */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <span>التسلسل الزمني للأنشطة والمتابعات</span>
                </h4>

                {leadActivities.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">لا توجد تفاعلات سابقة مسجلة لهذا العميل بعد.</p>
                ) : (
                  <div className="relative pr-4 border-r-2 border-slate-800 space-y-4">
                    {leadActivities.map((act) => (
                      <div key={act.id} className="relative group">
                        {/* Dot indicator */}
                        <span className="absolute -right-[21px] top-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-[#0e1424]" />
                        
                        <div className="p-3.5 rounded-2xl bg-[#090d16] border border-slate-800/80 hover:border-slate-700 transition-all">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                              {act.type === 'call' && <Phone className="w-3.5 h-3.5 text-blue-400" />}
                              {act.type === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />}
                              {act.type === 'meeting' && <Calendar className="w-3.5 h-3.5 text-purple-400" />}
                              {act.type === 'unit_reserved' && <Building2 className="w-3.5 h-3.5 text-amber-400" />}
                              {act.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{formatDateTimeAr(act.createdAt)}</span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>

                          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                            <span>المسؤول: <strong className="text-slate-300">{act.agentName}</strong></span>
                            {act.durationMinutes && (
                              <span>المدة: {act.durationMinutes} دقيقة</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Property Matching */}
          {activeTab === 'property_matching' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 flex items-center justify-between">
                <span>
                  نظام المطابقة الذكية: تم العثور على <strong>{matchedUnits.length} وحدات</strong> متطابقة مع ميزانية العميل ورغبته.
                </span>
                <span className="text-[11px] font-bold text-teal-400">ميزانية: {formatCurrency(selectedLead.budget)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedUnits.map((unit) => {
                  const statusConf = UNIT_STATUS_CONFIG[unit.status];
                  const isReservedByThisLead = unit.reservedByLeadId === selectedLead.id;

                  return (
                    <div 
                      key={unit.id}
                      className={`p-4 rounded-2xl border transition-all text-right ${
                        isReservedByThisLead 
                          ? 'bg-amber-500/10 border-amber-500/50' 
                          : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-amber-300">{unit.unitCode}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusConf.bg} ${statusConf.color}`}>
                          {statusConf.ar}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-100">{unit.projectName}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        المساحة: {unit.areaSqM} م² • {unit.bedrooms} غرف نوم • الدور {unit.floor}
                      </p>

                      <div className="mt-3 py-2 px-3 rounded-xl bg-slate-900/90 flex items-center justify-between text-xs">
                        <span className="text-slate-400">السعر:</span>
                        <span className="font-extrabold text-slate-100">{formatCurrency(unit.price)}</span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                        {isReservedByThisLead ? (
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            محجوزة لهذا العميل
                          </span>
                        ) : unit.status === 'available' ? (
                          <button
                            onClick={() => reserveUnit(unit.id, selectedLead.id)}
                            className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer text-center"
                          >
                            حجز هذه الوحدة للعميل
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">الوحدة غير متاحة حالياً</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Schedule Follow-Up */}
          {activeTab === 'schedule_followup' && (
            <form onSubmit={handleScheduleFollowUp} className="space-y-4 max-w-lg mx-auto">
              {fuSavedMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 text-center animate-in fade-in">
                  تمت جدولة موعد المتابعة وإرسال التنبيه إلى لوحة التحكم بنجاح!
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">تاريخ المتابعة:</label>
                  <input
                    type="date"
                    value={fuDate}
                    onChange={(e) => setFuDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">الوقت المحدد:</label>
                  <input
                    type="time"
                    value={fuTime}
                    onChange={(e) => setFuTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">نوع المتابعة:</label>
                  <select
                    value={fuType}
                    onChange={(e) => setFuType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="call">اتصال هاتفي</option>
                    <option value="site_visit">معاينة موقع المشروع</option>
                    <option value="send_brochure">إرسال بروشور وعروض أسعار</option>
                    <option value="contract_signing">توقيع العقد واستلام الدفعة</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">مستوى الأولوية:</label>
                  <select
                    value={fuPriority}
                    onChange={(e) => setFuPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="low">عادي</option>
                    <option value="medium">متوسط</option>
                    <option value="high">مرتفع</option>
                    <option value="urgent">عاجل جداً</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ملاحظات وتعليمات المتابعة:</label>
                <textarea
                  rows={3}
                  value={fuNotes}
                  onChange={(e) => setFuNotes(e.target.value)}
                  placeholder="مثال: الاتصال بعد صلاة العصر للتأكيد على مسودة عقد الشقة ST-1002 وإرسال ملحق التشطيبات."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                تأكيد وجدولة الموعد
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#090d16] border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedLead(null);
              setIsNewDealModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
          >
            إنشاء صفقة بيع جديدة لهذا العميل
          </button>

          <button
            onClick={() => setSelectedLead(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
