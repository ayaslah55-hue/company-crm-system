import { PipelineStage, LeadSource, RequestType, UnitStatus, DealStatus } from '../types';

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ar-EG').format(num);
};

export const formatCurrency = (amount: number, currency: string = 'ج.م'): string => {
  if (amount >= 1000000) {
    const millions = (amount / 1000000).toFixed(1).replace(/\.0$/, '');
    return `${millions} مليون ${currency}`;
  }
  return `${new Intl.NumberFormat('ar-EG').format(amount)} ${currency}`;
};

export const formatFullCurrency = (amount: number, currency: string = 'ج.م'): string => {
  return `${new Intl.NumberFormat('ar-EG').format(amount)} ${currency}`;
};

export const STAGE_CONFIG: Record<PipelineStage, { label: string; labelEn: string; color: string; bg: string; border: string }> = {
  new_lead: {
    label: 'عميل جديد',
    labelEn: 'New Lead',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
  },
  contacted: {
    label: 'تم التواصل',
    labelEn: 'Contacted',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  qualified: {
    label: 'مؤهل وجاد',
    labelEn: 'Qualified',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
  interested: {
    label: 'مهتم بالمشروع',
    labelEn: 'Interested',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  viewing_scheduled: {
    label: 'معاينة مجدولة',
    labelEn: 'Viewing Scheduled',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  negotiation: {
    label: 'تفاوض وعرض سعر',
    labelEn: 'Negotiation',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  closed_won: {
    label: 'تم البيع (فوز)',
    labelEn: 'Closed Won',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  closed_lost: {
    label: 'فرصة ملغاة',
    labelEn: 'Closed Lost',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
};

export const SOURCE_CONFIG: Record<LeadSource, { label: string; badgeColor: string }> = {
  facebook_ads: { label: 'إعلانات Facebook', badgeColor: 'bg-blue-600/20 text-blue-400 border-blue-500/30' },
  whatsapp: { label: 'واتساب WhatsApp', badgeColor: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' },
  website: { label: 'الموقع الإلكتروني', badgeColor: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' },
  phone_call: { label: 'اتصال هاتفي مباشر', badgeColor: 'bg-amber-600/20 text-amber-400 border-amber-500/30' },
  referral: { label: 'تزكية وترشيح', badgeColor: 'bg-teal-600/20 text-teal-400 border-teal-500/30' },
  google_ads: { label: 'إعلانات Google', badgeColor: 'bg-red-600/20 text-red-400 border-red-500/30' },
  tiktok_ads: { label: 'إعلانات TikTok', badgeColor: 'bg-pink-600/20 text-pink-400 border-pink-500/30' },
  expo_event: { label: 'معرض عقاري Expo', badgeColor: 'bg-purple-600/20 text-purple-400 border-purple-500/30' },
};

export const REQUEST_TYPE_LABELS: Record<RequestType, { label: string; color: string }> = {
  buy: { label: 'شراء تملك', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  rent: { label: 'إيجار سنوي', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  invest: { label: 'استثمار وعائد', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
};

export const UNIT_STATUS_CONFIG: Record<UnitStatus, { label: string; color: string; bg: string; dot: string }> = {
  available: { label: 'متاح للبيع', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
  reserved: { label: 'محجوز حالياً', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
  sold: { label: 'تم البيع', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', dot: 'bg-rose-400' },
};

export const DEAL_STATUS_CONFIG: Record<DealStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'مسودة عرض', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  under_contract: { label: 'تحت التعاقد والمراجعة', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  payment_pending: { label: 'بانتظار سداد الدفعة', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  closed_won: { label: 'تم البيع بنجاح (فوز)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  closed_lost: { label: 'صفقة ملغاة', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
};
