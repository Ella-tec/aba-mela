import { useTranslation } from 'react-i18next';
import { MOCK_VERIFICATION } from '@/data/mock';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { Upload, ShieldCheck } from 'lucide-react';

export function ProfessionalVerification() {
  const { t } = useTranslation();
  const approved = MOCK_VERIFICATION.filter((v) => v.status === 'approved').length;
  const total = MOCK_VERIFICATION.length;
  const pending = MOCK_VERIFICATION.some((v) => v.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t('verification.title')}</h2>
        <p className="text-gray-500 mt-1">{t('verification.subtitle')}</p>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary-600" />
            <span className="font-semibold text-gray-900">{t('verification.overall')}</span>
          </div>
          <span className="text-sm font-medium text-gray-600">
            {approved}/{total} approved
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all"
            style={{ width: `${(approved / total) * 100}%` }}
          />
        </div>
        {pending && (
          <p className="text-sm text-amber-600 mt-3">
            Some documents are currently under review. This usually takes 1–3 business days.
          </p>
        )}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {MOCK_VERIFICATION.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="font-medium text-gray-900">{item.label}</div>
              {item.submittedAt && (
                <div className="text-sm text-gray-500 mt-0.5">
                  Submitted {new Date(item.submittedAt).toLocaleDateString()}
                </div>
              )}
              {item.notes && <div className="text-sm text-gray-400 mt-1">{item.notes}</div>}
            </div>
            <div className="flex items-center gap-3">
              <VerificationBadge status={item.status} />
              {(item.status === 'notStarted' || item.status === 'rejected') && (
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
                  <Upload className="w-4 h-4" />
                  {item.status === 'rejected' ? t('verification.resubmit') : t('verification.upload')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
