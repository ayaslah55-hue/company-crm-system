import React, { useState } from 'react';
import { 
  FileCheck, 
  Key, 
  Zap, 
  Droplet, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  PenTool, 
  User, 
  Building, 
  Calendar,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import { ExecutionUnit } from '../../types/execution';

interface ClientHandoverViewProps {
  units: ExecutionUnit[];
  onSelectUnit?: (unitId: string) => void;
}

export const ClientHandoverView: React.FC<ClientHandoverViewProps> = ({
  units,
  onSelectUnit
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(units[0]?.id || 'unit-1');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSigned, setIsSigned] = useState(false);
  const [isCertificateGenerated, setIsCertificateGenerated] = useState(false);

  // Meter readings state
  const [elecMeter, setElecMeter] = useState('14285.4');
  const [waterMeter, setWaterMeter] = useState('00329.1');
  const [gasMeter, setGasMeter] = useState('01850.0');

  // Snag list state
  const [snags, setSnags] = useState([
    { id: 's-1', title: 'ضبط مقبض باب غرفة الماستر', category: 'نجارة', isFixed: true },
    { id: 's-2', title: 'إعادة دهان زاوية المدخل لوجود خدش طفيف', category: 'دهانات', isFixed: true },
    { id: 's-3', title: 'فحص مأخذ كهرباء جزيرة المطبخ', category: 'كهرباء', isFixed: false }
  ]);
  const [newSnagTitle, setNewSnagTitle] = useState('');

  // Keys checklist state
  const [keysChecklist, setKeysChecklist] = useState([
    { id: 'k-1', item: 'مفاتيح الباب المصفح الرئيسي (5 نسخ أصلية)', checked: true },
    { id: 'k-2', item: 'مفاتيح الأبواب الداخلية والغرف (3 نسخ لكل غرفة)', checked: true },
    { id: 'k-3', item: 'كروت الدخول الذكي للبوابة الإلكترونية (2 كارت)', checked: true },
    { id: 'k-4', item: 'ريموت كنترول جراج السيارات الخاص بالوحدة', checked: true }
  ]);

  const selectedUnit = units.find(u => u.id === selectedUnitId) || units[0];

  const handleToggleSnag = (id: string) => {
    setSnags(prev => prev.map(s => s.id === id ? { ...s, isFixed: !s.isFixed } : s));
  };

  const handleAddSnag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnagTitle.trim()) return;
    setSnags(prev => [
      ...prev,
      { id: `s-${Date.now()}`, title: newSnagTitle.trim(), category: 'تشطيب عام', isFixed: false }
    ]);
    setNewSnagTitle('');
  };

  const handleToggleKey = (id: string) => {
    setKeysChecklist(prev => prev.map(k => k.id === id ? { ...k, checked: !k.checked } : k));
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" />
              <span>دورة الاستلام والتسليم النهائي للعميل</span>
            </span>
            <span className="text-xs text-slate-400">• محاضر التسليم والضمانات</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            إجراءات تسليم الوحدة السكنية للعميل (Handover Workflow)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إدارة قائمة الملاحظات (Snag List)، قراءات العدادات، تسليم المفاتيح، التوقيع الرقمي، وإصدار شهادة التسليم الرسمية.
          </p>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">الوحدة المحددة:</span>
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.unitCode} - {u.ownerName} ({u.projectName})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Handover 5-Step Visual Wizard Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { step: 1, title: 'قائمة الملاحظات (Snag List)', icon: AlertTriangle },
            { step: 2, title: 'قراءة العدادات الرسمية', icon: Zap },
            { step: 3, title: 'تسليم المفاتيح والكروت', icon: Key },
            { step: 4, title: 'شهادات الضمان والكتالوجات', icon: ShieldCheck },
            { step: 5, title: 'التوقيع وإصدار المحضر', icon: PenTool },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                activeStep === s.step 
                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-sm' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <s.icon className={`w-4 h-4 shrink-0 ${activeStep === s.step ? 'text-white' : 'text-slate-500'}`} />
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Snag List / Defect List */}
      {activeStep === 1 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>قائمة ملاحظات العميل والفحص النهائي (Snag List)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تصفية وإصلاح كافة الملاحظات قبل اعتماد محضر الاستلام النهائي
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600">
              تم إصلاح {snags.filter(s => s.isFixed).length} من {snags.length} ملاحظات
            </span>
          </div>

          {/* Add Snag Form */}
          <form onSubmit={handleAddSnag} className="flex gap-2">
            <input
              type="text"
              value={newSnagTitle}
              onChange={(e) => setNewSnagTitle(e.target.value)}
              placeholder="أضف ملاحظة فحص جديدة تم رصدها أثناء المعاينة..."
              className="flex-1 p-3 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              إضافة ملاحظة
            </button>
          </form>

          {/* Snags list */}
          <div className="space-y-2.5">
            {snags.map((snag) => (
              <div
                key={snag.id}
                onClick={() => handleToggleSnag(snag.id)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors text-xs ${
                  snag.isFixed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    snag.isFixed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {snag.isFixed && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className={`font-bold ${snag.isFixed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {snag.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">البند: {snag.category}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  snag.isFixed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {snag.isFixed ? 'تم الإصلاح والمعاينة' : 'قيد المعالجة'}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setActiveStep(2)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              الانتقال إلى قراءات العدادات ←
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Meter Readings */}
      {activeStep === 2 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <span>إثبات قراءات العدادات الرسمية عند التسليم</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              توثيق قراءات عدادات الكهرباء، المياه، والغاز لتبرئة ذمة المطور ونقل الملكية للعميل
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>عداد الكهرباء (ك.و.س)</span>
              </div>
              <input
                type="text"
                value={elecMeter}
                onChange={(e) => setElecMeter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-amber-300 font-mono font-bold text-sm text-slate-900 bg-white"
              />
              <span className="text-[10px] text-slate-500 block">رقم العداد: E-902341 (مسبق الدفع)</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <Droplet className="w-4 h-4 text-blue-600" />
                <span>عداد المياه (متر مكعب)</span>
              </div>
              <input
                type="text"
                value={waterMeter}
                onChange={(e) => setWaterMeter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-blue-300 font-mono font-bold text-sm text-slate-900 bg-white"
              />
              <span className="text-[10px] text-slate-500 block">رقم العداد: W-44821 (رئيسي بالوحدة)</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>عداد الغاز الطبيعي (متر مكعب)</span>
              </div>
              <input
                type="text"
                value={gasMeter}
                onChange={(e) => setGasMeter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-emerald-300 font-mono font-bold text-sm text-slate-900 bg-white"
              />
              <span className="text-[10px] text-slate-500 block">رقم العداد: G-11094</span>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setActiveStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
            >
              → السابق: الملاحظات
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              الانتقال إلى تسليم المفاتيح ←
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Keys & Access Delivery */}
      {activeStep === 3 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-600" />
              <span>إقرار استلام مفاتيح وكروت الدخول الذكي للوحدة</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              التحقق من عدد النسخ المعتمدة وتسليمها يداً بيد للعميل
            </p>
          </div>

          <div className="space-y-3">
            {keysChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleKey(item.id)}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    item.checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="font-bold text-slate-900">{item.item}</span>
                </div>
                <span className="text-emerald-700 font-bold text-[11px]">جاهز للتسليم</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
            >
              → السابق: العدادات
            </button>
            <button
              onClick={() => setActiveStep(4)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              الانتقال إلى شهادات الضمان ←
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Warranty Certificates */}
      {activeStep === 4 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>شهادات الضمان والكتالوجات المسلمة للعميل</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              توثيق الضمانات الإنشائية وبنود العزل والأجهزة والتشطيب
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              { title: 'ضمان الهيكل الإنشائي والخرسانات (10 سنوات)', company: 'المكتب الاستشاري الهندسي المعتمد' },
              { title: 'ضمان أعمال عزل الحمامات والأسطح (5 سنوات)', company: 'شركة العزل الكيميائي الحديث' },
              { title: 'ضمان شبكات وتجهيزات السباكة والكهرباء (3 سنوات)', company: 'تحالف مقاولي الكهروميكانيك' },
              { title: 'كتالوج الصيانة الدورية وتوصيات باقة التشطيب', company: 'إدارة خدمة العملاء والجودة' }
            ].map((w, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{w.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 pr-6">{w.company}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setActiveStep(3)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
            >
              → السابق: المفاتيح
            </button>
            <button
              onClick={() => setActiveStep(5)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              الانتقال إلى التوقيع وإصدار المحضر ←
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Signature & Official Handover Certificate */}
      {activeStep === 5 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-emerald-600" />
              <span>التوقيع الإلكتروني وإصدار محضر الاستلام النهائي (Handover Certificate)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              توقيع العميل ومسؤول التسليم بالموقع لإتمام تسليم الوحدة وإغلاق ملف التنفيذ
            </p>
          </div>

          {/* Signatures Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-slate-800 block">توقيع المالك المستلم: ({selectedUnit.ownerName})</span>
              <div
                onClick={() => setIsSigned(true)}
                className={`h-24 rounded-xl border border-dashed flex items-center justify-center cursor-pointer transition-colors ${
                  isSigned ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-300 hover:border-slate-400'
                }`}
              >
                {isSigned ? (
                  <div className="text-center font-bold text-emerald-800 font-serif italic text-base">
                    ✓ تم التوقيع الرقمي المعتمد ({selectedUnit.ownerName})
                  </div>
                ) : (
                  <span className="text-slate-400 text-xs">انقر هنا لتسجيل توقيع العميل الرقمي</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="font-bold text-slate-800 block">توقيع المهندس الاستشاري المشرف: ({selectedUnit.responsibleEngineer})</span>
              <div className="h-24 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-center text-center font-bold text-emerald-800 font-serif italic text-base">
                ✓ معتمد رسمياً من الإدارة الهندسية
              </div>
            </div>
          </div>

          {/* Generate Official Certificate */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-black text-slate-900 text-sm">شهادة التسليم النهائي للوحدة {selectedUnit.unitCode}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                توليد ملف المحضر الرسمي الرقمي شاملاً بيانات الوحدة، العدادات، والضمانات.
              </p>
            </div>

            <button
              onClick={() => setIsCertificateGenerated(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>إصدار وتحميل محضر التسليم (PDF)</span>
            </button>
          </div>

          {/* Certificate Generated Preview */}
          {isCertificateGenerated && (
            <div className="p-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-md space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">محضر تسليم واستلام وحدة عقارية رسمية</h3>
                  <span className="text-xs text-slate-400 font-mono">رقم الوثيقة: CERT-{selectedUnit.unitCode}-2025</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  ✓
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>المشروع: <strong>{selectedUnit.projectName}</strong></div>
                <div>كود الوحدة: <strong>{selectedUnit.unitCode}</strong></div>
                <div>اسم المالك: <strong>{selectedUnit.ownerName}</strong></div>
                <div>باقة التشطيب: <strong>{selectedUnit.finishingPackage}</strong></div>
                <div>قراءة الكهرباء: <strong className="font-mono">{elecMeter} kWh</strong></div>
                <div>قراءة المياه: <strong className="font-mono">{waterMeter} m³</strong></div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold text-center">
                تم تسليم كافة المفاتيح وشهادات الضمان ولا توجد ملاحظات عالقة. الوحدة جاهزة للسكن الفوري.
              </div>
            </div>
          )}

          <div className="flex justify-start pt-2">
            <button
              onClick={() => setActiveStep(4)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
            >
              → السابق: شهادات الضمان
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
