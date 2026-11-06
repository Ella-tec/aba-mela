import { cn } from '@/lib/utils';
import type { VerificationStatus } from '@/data/mock';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, XCircle, Circle, AlertCircle } from 'lucide-react';

const config: Record<VerificationStatus, { style: string; icon: React.ComponentType<{ className?: string }> }> = {
  notStarted: { style: 'bg-gray-100 text-gray-600', icon: Circle },
  pending: { style: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { style: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { style: 'bg-red-100 text-red-700', icon: XCircle },
  expired: { style: 'bg-orange-100 text-orange-700', icon: AlertCircle },
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const { t } = useTranslation();
  const { style, icon: Icon } = config[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', style)}>
      <Icon className="w-3.5 h-3.5" />
      {t(`verification.status.${status}`)}
    </span>
  );
}
