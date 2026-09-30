import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  Filter, 
  Search, 
  Calendar, 
  Layers, 
  Building, 
  ArrowLeftRight, 
  X, 
  Maximize2, 
  Download,
  Plus
} from 'lucide-react';
import { SitePhoto } from '../../types/execution';

interface SitePhotosGalleryProps {
  photos: SitePhoto[];
  onUploadNewPhoto?: () => void;
}

export const SitePhotosGallery: React.FC<SitePhotosGalleryProps> = ({
  photos,
  onUploadNewPhoto
}) => {
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Before / After Modal viewer state
  const [activeComparePair, setActiveComparePair] = useState<{ before: SitePhoto; after: SitePhoto } | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [previewPhoto, setPreviewPhoto] = useState<SitePhoto | null>(null);

  // Extract unique stages
  const uniqueStages = useMemo(() => {
    const set = new Set<string>();
    photos.forEach(p => set.add(p.executionStage));
    return Array.from(set);
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      const matchesSearch = 
        p.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.caption.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProject = selectedProject === 'ALL' || p.projectName === selectedProject;
      const matchesStage = selectedStage === 'ALL' || p.executionStage === selectedStage;
      const matchesType = selectedType === 'ALL' || p.type === selectedType;

      return matchesSearch && matchesProject && matchesStage && matchesType;
    });
  }, [photos, searchTerm, selectedProject, selectedStage, selectedType]);

  // Demo before/after trigger
  const handleOpenComparison = (photo: SitePhoto) => {
    const after = photo.type === 'after' ? photo : photos.find(p => p.type === 'after') || photo;
    const before = photo.type === 'before' ? photo : photos.find(p => p.type === 'before') || {
      ...photo,
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80',
      caption: 'حالة الوحدة على الطوب الأحمر قبل بدء التشطيب',
      type: 'before'
    };

    setActiveComparePair({ before, after });
    setSliderPosition(50);
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              <span>معرض الصور والتوثيق الميداني</span>
            </span>
            <span className="text-xs text-slate-400">• {filteredPhotos.length} صورة موثقة</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            معرض صور تقدم الأعمال والمقارنة البصرية (قبل / بعد)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            أرشيف توثيقي كامل لكل مراحل التشطيب والبناء لكل وحدة، مع ميزة المقارنة التفاعلية قبل وبعد الإنجاز.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {photos.length >= 2 && (
            <button
              onClick={() => handleOpenComparison(photos[0])}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-bold text-xs cursor-pointer shadow-sm transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4 text-purple-600" />
              <span>عارض المقارنة (Before / After)</span>
            </button>
          )}

          <button
            onClick={() => onUploadNewPhoto ? onUploadNewPhoto() : alert('تم فتح كاميرا الموقع لرفع صورة جديدة')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>رفع صور جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="بحث بالوحدة، الملاحظات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
          />
        </div>

        <div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 outline-none"
          >
            <option value="ALL">جميع المشاريع</option>
            <option value="كمبوند نيو كايرو">كمبوند نيو كايرو</option>
            <option value="فلل الساحل الشمالي">فلل الساحل الشمالي</option>
            <option value="ريزيدنس الشيخ زايد">ريزيدنس الشيخ زايد</option>
            <option value="أبراج العاصمة الإدارية">أبراج العاصمة الإدارية</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 outline-none"
          >
            <option value="ALL">جميع مراحل التشطيب</option>
            {uniqueStages.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 outline-none"
          >
            <option value="ALL">نوع الصورة (الكل)</option>
            <option value="before">قبل التشطيب (Before)</option>
            <option value="after">بعد التشطيب (After)</option>
            <option value="progress">أثناء التنفيذ (Progress)</option>
          </select>
        </div>
      </div>

      {/* Photos Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              {/* Photo Image with overlay badges */}
              <div 
                onClick={() => setPreviewPhoto(photo)}
                className="relative h-48 bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-2.5 right-2.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm ${
                    photo.type === 'after' ? 'bg-emerald-600 text-white' :
                    photo.type === 'before' ? 'bg-slate-800 text-white' :
                    'bg-amber-600 text-white'
                  }`}>
                    {photo.type === 'after' ? 'بعد الإنجاز' : photo.type === 'before' ? 'قبل البدء' : 'أثناء العمل'}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                    {photo.unitCode}
                  </span>
                </div>
              </div>

              {/* Photo Metadata */}
              <div className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-700">{photo.projectName}</span>
                  <span className="font-mono">{photo.date}</span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{photo.caption}</h4>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">{photo.executionStage}</span>
                </div>

                <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                  {photo.notes}
                </p>

                <div className="text-[10px] text-slate-400 pt-1">
                  الموثق: <strong>{photo.uploadedBy}</strong>
                </div>
              </div>
            </div>

            {/* Quick action footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleOpenComparison(photo)}
                className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>مقارنة تفاعلية</span>
              </button>

              <button
                onClick={() => setPreviewPhoto(photo)}
                className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>تكبير</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Before / After Comparison Viewer Modal */}
      {activeComparePair && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl space-y-4 text-right animate-in zoom-in-95">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-purple-600" />
                  <span>عارض المقارنة البصري التفاعلي (Before vs After)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  حرك الشريط الأفقي بالأسفل لمشاهدة التحول المعماري بين مرحلة الطوب الأحمر والتشطيب النهائي
                </p>
              </div>

              <button
                onClick={() => setActiveComparePair(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Image Split Slider */}
            <div className="px-6 py-2">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-slate-300 select-none">
                {/* Background image: After */}
                <img
                  src={activeComparePair.after.url}
                  alt="بعد التشطيب"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-emerald-600/90 text-white text-xs font-bold shadow">
                  بعد التشطيب النهائي (After)
                </span>

                {/* Foreground image: Before (clipped by slider) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={activeComparePair.before.url}
                    alt="قبل التشطيب"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-bold shadow">
                    قبل التشطيب (Before)
                  </span>
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white shadow-lg border border-slate-300 flex items-center justify-center text-slate-700">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Slider Control */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">قبل</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg cursor-pointer accent-purple-600"
                />
                <span className="text-xs font-bold text-slate-700">بعد</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <div className="text-slate-500">
                الوحدة: <strong>{activeComparePair.after.unitCode}</strong> • {activeComparePair.after.projectName}
              </div>
              <button
                onClick={() => setActiveComparePair(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
              >
                إغلاق العارض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Photo Zoom Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-right animate-in zoom-in-95">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{previewPhoto.caption}</h4>
                <p className="text-xs text-slate-500">{previewPhoto.projectName} • {previewPhoto.unitCode}</p>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
              <img src={previewPhoto.url} alt={previewPhoto.caption} className="max-h-[65vh] w-auto object-contain" />
            </div>

            <div className="p-4 bg-white text-xs space-y-2">
              <p className="text-slate-700">{previewPhoto.notes}</p>
              <div className="flex items-center justify-between text-slate-400 text-[11px] pt-2 border-t border-slate-100">
                <span>تاريخ التوثيق: {previewPhoto.date}</span>
                <span>الموثق: {previewPhoto.uploadedBy}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
