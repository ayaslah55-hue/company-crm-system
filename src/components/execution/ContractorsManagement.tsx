import React, { useState } from 'react';
import { 
  HardHat, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Star, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building, 
  FileText, 
  DollarSign, 
  Camera, 
  X,
  Plus
} from 'lucide-react';
import { ExecutionContractor } from '../../types/execution';

interface ContractorsManagementProps {
  contractors: ExecutionContractor[];
  onSelectContractor?: (contractor: ExecutionContractor) => void;
}

export const ContractorsManagement: React.FC<ContractorsManagementProps> = ({
  contractors
}) => {
  const [contractorList, setContractorList] = useState<ExecutionContractor[]>(contractors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedContractor, setSelectedContractor] = useState<ExecutionContractor | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'projects' | 'tasks' | 'payments' | 'docs' | 'photos'>('projects');

  const specialties = [
    'Plumbing', 'Electrical', 'Flooring', 'Painting', 'HVAC', 
    'Aluminium', 'Carpentry', 'Smart Home', 'General Contracting'
  ];

  const filtered = contractorList.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'ALL' || c.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const formatEGP = (val: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(val);
  };

  const getPerformanceBadge = (status: ExecutionContractor['performanceStatus'], delayRate: number) => {
    if (status === 'excellent') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          أداء ممتاز (تأخير {delayRate}%)
        </span>
      );
    }
    if (status === 'good') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
          أداء جيد (تأخير {delayRate}%)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
        تحت الملاحظة (تأخير {delayRate}%)
      </span>
    );
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <HardHat className="w-3.5 h-3.5" />
              <span>المقاولون والاستشاريون المعتمدون</span>
            </span>
            <span className="text-xs text-slate-400">• {filtered.length} مقاول وشركة</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            دليل إدارة مقاولي التشطيب والتنفيذ الميداني
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة دقيقة للتخصصات الـ 9، الوحدات المسندة، مؤشرات الالتزام بالجدول، والتقييمات الفنية.
          </p>
        </div>

        <button
          onClick={() => alert('تم فتح نموذج اعتماد مقاول جديد')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>إضافة مقاول جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="بحث باسم المقاول، الشركة، التخصص..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-slate-500 shrink-0">التخصص الهندسي:</span>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-800 outline-none"
          >
            <option value="ALL">جميع التخصصات (All 9 Specialties)</option>
            {specialties.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedContractor(c)}
            className="bg-white border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 text-xs"
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                  <span className="text-slate-500 text-[11px] block">{c.companyName}</span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                    {c.specialization}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-amber-700 font-bold text-xs shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{c.rating}</span>
              </div>
            </div>

            {/* Performance status badge */}
            <div className="pt-1">
              {getPerformanceBadge(c.performanceStatus, c.delayRate)}
            </div>

            {/* Stats matrix */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">المشاريع</span>
                <span className="font-bold text-slate-800 text-xs">{c.activeProjectsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">الوحدات</span>
                <span className="font-bold text-slate-800 text-xs">{c.assignedUnitsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">المنجز</span>
                <span className="font-bold text-emerald-700 text-xs">{c.completedJobsCount}</span>
              </div>
            </div>

            {/* Contact details */}
            <div className="pt-1 space-y-1.5 text-slate-500 text-[11px]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-slate-800">{c.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-slate-600 truncate">{c.email}</span>
              </div>
            </div>

            {/* Card footer */}
            <div className="pt-2 border-t border-slate-100 text-emerald-700 font-bold text-center">
              عرض الملف التعاقدي والصور والمستخلصات ←
            </div>
          </div>
        ))}
      </div>

      {/* Contractor Profile Modal */}
      {selectedContractor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150 text-right">
            {/* Modal Top */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedContractor.avatar}
                  alt={selectedContractor.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{selectedContractor.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {selectedContractor.specialization}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selectedContractor.companyName} • هاتف: <span className="font-mono">{selectedContractor.phone}</span></p>
                </div>
              </div>

              <button
                onClick={() => setSelectedContractor(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-2 text-xs font-semibold overflow-x-auto">
              {[
                { key: 'projects', label: 'المشاريع المسندة' },
                { key: 'tasks', label: 'المهام الحالية' },
                { key: 'payments', label: 'المستخلصات والمدفوعات' },
                { key: 'docs', label: 'العقود والوثائق' },
                { key: 'photos', label: 'صور سابقة الأعمال' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveModalTab(tab.key as any)}
                  className={`pb-3 px-3 border-b-2 cursor-pointer transition-colors ${
                    activeModalTab === tab.key ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
              {activeModalTab === 'projects' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">المشاريع النشطة المسندة:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="font-bold text-slate-900">كمبوند نيو كايرو</div>
                      <p className="text-slate-500 text-[11px] mt-0.5">عدد الوحدات: 24 وحدة • مرحلة التشطيب</p>
                      <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        منتظم حسب الجدول
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="font-bold text-slate-900">ريزيدنس الشيخ زايد</div>
                      <p className="text-slate-500 text-[11px] mt-0.5">عدد الوحدات: 16 وحدة • التأسيس</p>
                      <span className="inline-block mt-2 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        قيد التنفيذ
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'tasks' && (
                <div className="space-y-2.5">
                  <h4 className="font-bold text-slate-800 text-sm">المهام الميدانية المفتوحة:</h4>
                  {[
                    { title: 'استكمال أعمال التركيب واختبار الضغط للوحدات A-102 و A-103', date: '2025-11-20', status: 'جاري' },
                    { title: 'عزل أرضيات الحمامات والمطابخ بالطابق الرابع', date: '2025-11-28', status: 'بانتظار المعاينة' }
                  ].map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{t.title}</span>
                        <span className="text-[10px] text-slate-400">المهلة: {t.date}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeModalTab === 'payments' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-slate-400 text-[11px] block">إجمالي التعاقد:</span>
                      <strong className="text-slate-900 text-sm block mt-1">{formatEGP(selectedContractor.totalContractAmount)}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-slate-400 text-[11px] block">المسدد فعلياً:</span>
                      <strong className="text-emerald-700 text-sm block mt-1">{formatEGP(selectedContractor.paidAmount)}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-slate-400 text-[11px] block">المستخلصات المتبقية:</span>
                      <strong className="text-blue-700 text-sm block mt-1">{formatEGP(selectedContractor.pendingAmount)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'docs' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-sm">العقود والتراخيص المعتمدة:</h4>
                  {selectedContractor.documents.map((d, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-slate-800">{d}</span>
                      </div>
                      <button onClick={() => alert('تم التحميل')} className="text-emerald-700 font-bold hover:underline">
                        معاينة
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeModalTab === 'photos' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">معرض أعمال المقاول الموثقة بالمواقع:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedContractor.workPhotos.map((url, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={url} alt={`عمل ${idx + 1}`} className="w-full h-32 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedContractor(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
