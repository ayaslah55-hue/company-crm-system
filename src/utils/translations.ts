import { LeadSource, RequestType, UnitType, PipelineStage, UnitStatus, DealStatus } from '../types/crm';

export const STAGE_CONFIG: Record<PipelineStage, { labelAr: string; labelEn: string; color: string; bg: string; border: string }> = {
  new_lead: {
    labelAr: 'عميل جديد',
    labelEn: 'New Lead',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30'
  },
  contacted: {
    labelAr: 'تم التواصل',
    labelEn: 'Contacted',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30'
  },
  qualified: {
    labelAr: 'مؤهل للشراء',
    labelEn: 'Qualified',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30'
  },
  interested: {
    labelAr: 'مهتم بعقار',
    labelEn: 'Interested',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30'
  },
  viewing_scheduled: {
    labelAr: 'معاينة مجدولة',
    labelEn: 'Viewing Scheduled',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30'
  },
  negotiation: {
    labelAr: 'مفاوضات وعروض',
    labelEn: 'Negotiation',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30'
  },
  closed_won: {
    labelAr: 'صفقة رابحة (تم البيع)',
    labelEn: 'Closed Won',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30'
  },
  closed_lost: {
    labelAr: 'صفقة خاسرة',
    labelEn: 'Closed Lost',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30'
  }
};

export const SOURCE_CONFIG: Record<LeadSource, { labelAr: string; labelEn: string; icon: string; color: string }> = {
  facebook_ads: { labelAr: 'إعلانات فيسبوك', labelEn: 'Facebook Ads', icon: 'Share2', color: 'text-blue-400' },
  website: { labelAr: 'الموقع الإلكتروني', labelEn: 'Website', icon: 'Globe', color: 'text-teal-400' },
  whatsapp: { labelAr: 'واتساب مباشر', labelEn: 'WhatsApp', icon: 'MessageCircle', color: 'text-emerald-400' },
  calls: { labelAr: 'اتصال هاتفي', labelEn: 'Direct Call', icon: 'PhoneCall', color: 'text-amber-400' },
  referrals: { labelAr: 'ترشيح وعلاقات', labelEn: 'Referral', icon: 'Users', color: 'text-purple-400' }
};

export const REQUEST_TYPE_LABELS: Record<RequestType, { ar: string; en: string }> = {
  purchase: { ar: 'شراء تملك', en: 'Purchase' },
  rent: { ar: 'إيجار سنوي', en: 'Rent' },
  investment: { ar: 'استثمار عقاري', en: 'Investment' }
};

export const UNIT_TYPE_LABELS: Record<UnitType, { ar: string; en: string }> = {
  villa: { ar: 'فيلا مستقلة', en: 'Villa' },
  apartment: { ar: 'شقة فاخرة', en: 'Apartment' },
  townhouse: { ar: 'تاون هاوس', en: 'Townhouse' },
  penthouse: { ar: 'بنتهاوس', en: 'Penthouse' },
  commercial: { ar: 'تجاري / مكتبي', en: 'Commercial' },
  duplex: { ar: 'دوبلكس', en: 'Duplex' }
};

export const UNIT_STATUS_CONFIG: Record<UnitStatus, { ar: string; en: string; color: string; bg: string }> = {
  available: { ar: 'متاح للبيع', en: 'Available', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  reserved: { ar: 'محجوز مبدئياً', en: 'Reserved', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  sold: { ar: 'تم البيع', en: 'Sold', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' }
};

export const DEAL_STATUS_CONFIG: Record<DealStatus, { ar: string; en: string; color: string; bg: string }> = {
  draft: { ar: 'مسودة اتفاق', en: 'Draft', color: 'text-slate-300', bg: 'bg-slate-700/50 border-slate-600' },
  deposit_received: { ar: 'استلام العربون', en: 'Deposit Received', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/40' },
  contract_review: { ar: 'مراجعة العقود والائتمان', en: 'Contract Review', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/40' },
  contract_signed: { ar: 'تم توقيع العقد', en: 'Contract Signed', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/40' },
  completed: { ar: 'صفقة مكتملة ومسددة', en: 'Completed & Paid', color: 'text-emerald-300', bg: 'bg-emerald-500/20 border-emerald-400' },
  cancelled: { ar: 'صفقة ملغاة', en: 'Cancelled', color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/40' }
};

export function formatCurrency(amount: number, currency: string = 'ريال'): string {
  return new Intl.NumberFormat('ar-SA').format(amount) + ' ' + currency;
}

export function formatCompactNumber(amount: number): string {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + ' مليون';
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(0) + ' ألف';
  }
  return amount.toString();
}

export function formatDateAr(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTimeAr(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}
