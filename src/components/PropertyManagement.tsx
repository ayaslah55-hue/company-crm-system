import React, { useState } from 'react';
import { 
  Building, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Lock, 
  MapPin, 
  Maximize2, 
  BedDouble, 
  Bath, 
  DollarSign, 
  UserCheck, 
  Handshake, 
  Calendar,
  Layers,
  X
} from 'lucide-react';
import { Project, Unit, Lead, UnitStatus } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatters';

interface PropertyManagementProps {
  projects: Project[];
  units: Unit[];
  leads: Lead[];
  onReserveUnit: (unitId: string, leadId: string, depositAmount: number, reservedUntil: string) => void;
  onNavigateToDealWithUnit: (unitId: string, leadId: string) => void;
}

export const PropertyManagement: React.FC<PropertyManagementProps> = ({
  projects,
  units,
  leads,
  onReserveUnit,
  onNavigateToDealWithUnit,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reservation modal state
  const [reservingUnit, setReservingUnit] = useState<Unit | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<number>(100000);
  const [reserveDays, setReserveDays] = useState<number>(7);

  // Filtered units
  const filteredUnits = units.filter(unit => {
    if (selectedProjectId !== 'all' && unit.projectId !== selectedProjectId) return false;
    if (statusFilter !== 'all' && unit.status !== statusFilter) return false;
    if (typeFilter !== 'all' && unit.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = unit.unitNumber.toLowerCase().includes(q);
      const matchProject = unit.projectName.toLowerCase().includes(q);
      if (!matchCode && !matchProject) return false;
    }
    return true;
  });

  const availableCount = units.filter(u => u.status === 'available').length;
  const reservedCount = units.filter(u => u.status === 'reserved').length;
  const soldCount = units.filter(u => u.status === 'sold').length;

  const handleConfirmReservation = () => {
    if (!reservingUnit || !selectedLeadId) return;
    const expiryDate = new Date(Date.now() + reserveDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    onReserveUnit(reservingUnit.id, selectedLeadId, depositAmount, expiryDate);
    setReservingUnit(null);
    setSelectedLeadId('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-amber-500/15 via-slate-900 to-[#0c121e] border border-amber-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              إدارة المشاريع والمخزون العقاري (Inventory & Units)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">
            المشاريع العقارية، الوحدات المتاحة، وعمليات الحجز الميداني
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            إجمالي المخزون: <strong className="text-white font-bold">{units.length} وحدة</strong> موزعة على {projects.length} مشاريع كبرى في المملكة ومصر.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">المتاح للبيع</span>
            <span className="text-lg font-extrabold text-emerald-400">{availableCount}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">المحجوز</span>
            <span className="text-lg font-extrabold text-amber-400">{reservedCount}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">المباع</span>
            <span className="text-lg font-extrabold text-slate-400">{soldCount}</span>
          </div>
        </div>
      </div>

      {/* Projects Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => {
          const projectUnits = units.filter(u => u.projectId === project.id);
          const projectAvailable = projectUnits.filter(u => u.status === 'available').length;

          return (
            <div 
              key={project.id}
              onClick={() => setSelectedProjectId(selectedProjectId === project.id ? 'all' : project.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer text-right ${
                selectedProjectId === project.id
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-[#0f1728] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{project.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{project.location}</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                  تسليم {project.deliveryDate}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">المطور العقاري</span>
                  <span className="font-bold text-slate-200">{project.developer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">الوحدات المتاحة</span>
                  <span className="font-bold text-emerald-400">{projectAvailable} وحدة من {projectUnits.length}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">يبدأ من:</span>
                <span className="font-extrabold text-amber-300">{formatCurrency(project.startingPrice)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0f1728] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث برقم الوحدة، المشروع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {/* Status filters */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل ({units.length})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'available' ? 'bg-emerald-500 text-slate-950' : 'text-emerald-400 hover:text-white'
              }`}
            >
              متاح ({availableCount})
            </button>
            <button
              onClick={() => setStatusFilter('reserved')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'reserved' ? 'bg-amber-500 text-slate-950' : 'text-amber-400 hover:text-white'
              }`}
            >
              محجوز ({reservedCount})
            </button>
            <button
              onClick={() => setStatusFilter('sold')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'sold' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              مباع ({soldCount})
            </button>
          </div>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUnits.map((unit) => {
          const isAvailable = unit.status === 'available';
          const isReserved = unit.status === 'reserved';
          const isSold = unit.status === 'sold';

          return (
            <div 
              key={unit.id}
              className="p-5 rounded-2xl bg-[#0f1728] border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all text-right group"
            >
              <div>
                {/* Top Badge and Code */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-extrabold text-white tracking-wide">{unit.unitNumber}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    isAvailable ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                    isReserved ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {isAvailable ? 'متاح للتعاقد' : isReserved ? 'محجوز مؤقتاً' : 'تم البيع'}
                  </span>
                </div>

                <p className="text-xs text-slate-400">{unit.projectName}</p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 my-3 py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{unit.area} م²</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-slate-500" />
                    <span>{unit.bedrooms} غرف</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-slate-500" />
                    <span>{unit.bathrooms} حمام</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-[10px] text-slate-400 block">السعر الإجمالي</span>
                  <span className="text-base font-extrabold text-amber-300">{formatCurrency(unit.price)}</span>
                </div>

                {/* Reserved Info if applicable */}
                {isReserved && unit.reservedByLeadName && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 mb-3 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>حجز لـ: {unit.reservedByLeadName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      مبلغ جدية الحجز: {formatCurrency(unit.depositAmount || 100000)}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800">
                {isAvailable && (
                  <button
                    onClick={() => {
                      setReservingUnit(unit);
                      setSelectedLeadId(leads[0]?.id || '');
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>حجز الوحدة لعميل</span>
                  </button>
                )}

                {isReserved && (
                  <button
                    onClick={() => {
                      if (unit.reservedByLeadId) {
                        onNavigateToDealWithUnit(unit.id, unit.reservedByLeadId);
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    <span>تحويل لصفقة تعاقد ←</span>
                  </button>
                )}

                {isSold && (
                  <div className="py-2 text-center text-xs text-slate-500 font-semibold bg-slate-900 rounded-xl">
                    مكتملة ومغلقة
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unit Reservation Modal */}
      {reservingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f1728] border border-amber-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">حجز وحدة عقارية لعميل</h3>
                <p className="text-xs text-amber-400 mt-0.5">{reservingUnit.unitNumber} • {reservingUnit.projectName}</p>
              </div>
              <button 
                onClick={() => setReservingUnit(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">اختر العميل المحتمل (Lead):</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.name} - ({l.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">مبلغ جدية الحجز (ريال / ج.م):</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">مدة سريان الحجز (أيام):</label>
                <select
                  value={reserveDays}
                  onChange={(e) => setReserveDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={3}>3 أيام عمل</option>
                  <option value={7}>7 أيام (أسبوع)</option>
                  <option value={14}>14 يوم (أسبوعين)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={handleConfirmReservation}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-colors"
              >
                تأكيد الحجز وتوثيقه
              </button>
              <button
                onClick={() => setReservingUnit(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
