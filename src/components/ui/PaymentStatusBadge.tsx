import { cn } from '@/lib/utils';
import type { PaymentStatus, PayoutStatus } from '@/data/mock';
import { useTranslation } from 'react-i18next';

const paymentStyles: Record<PaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
  partially_refunded: 'bg-indigo-100 text-indigo-700',
};

const payoutStyles: Record<PayoutStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { t } = useTranslation();
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', paymentStyles[status])}>
      {t(`payments.status.${status}`)}
    </span>
  );
}

export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  const { t } = useTranslation();
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', payoutStyles[status])}>
      {t(`earnings.status.${status}`)}
    </span>
  );
}
